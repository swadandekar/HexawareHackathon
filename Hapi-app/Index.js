'use strict';

const Hapi = require('hapi');
const simpleChain = require('./simpleChain.js');
const UserRequest = require('./UserRequest.js');
const Star = require('./Star.js');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

let blockChain = new simpleChain.Blockchain();
let objUserRequest = new UserRequest.UserRequest();

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8000
});


// Add the route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function(request, h) {

        return 'hello world';
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {

        return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
    }
});

server.route({
    method: 'GET',
    path: '/block/{blockHeight}',
    handler: async (request, h) => {

        //    let blockData = await blockChain.getBlock(request.params.blockHeight);
        let blockData = await blockChain.getBlock(request.params.blockHeight);
 console.log("getblockbyheight");
 console.log(blockData);
console.log(blockData.body);
        let objClientBody = JSON.parse(blockData.body);
console.log("objClientBody " +JSON.stringify(objClientBody));
console.log("objClientBodycomment " +JSON.stringify(objClientBody.client));
        let objClient = JSON.parse(JSON.stringify(objClientBody.client));
console.log(objClient);
        let decoded = new Buffer(objClient.comment.toString(), 'hex');

        objClient.storyDecoded = decoded.toString();
        objClientBody.client = objClient;
        blockData.body = objClientBody;

        return JSON.stringify(blockData);
    }
});

server.route({
    method: 'GET',
    path: '/clients/hash:{hash}',
    handler: async (request, h) => {

        let blockArray = await blockChain.getBlockByHash(request.params.hash);
        let updatedBlockArray = [];

        for (var i = 0; i < blockArray.length; i++) {
            let objBlock = JSON.parse(blockArray[i]);
            updatedBlockArray.push(updateBlock(objBlock));
        }

        return JSON.stringify(updatedBlockArray);
    }
});

server.route({
    method: 'GET',
    path: '/clients/address:{address}',
    handler: async (request, h) => {

        let blockArray = await blockChain.getBlockByAddress(request.params.address);
        let updatedBlockArray = [];

        for (var i = 0; i < blockArray.length; i++) {
            let objBlock = JSON.parse(blockArray[i]);
            updatedBlockArray.push(updateBlock(objBlock));
        }

        return JSON.stringify(updatedBlockArray);
    }
});

function updateBlock(block) {
    console.log(block.body);
    let objClientBody = JSON.parse(block.body);

    let objClient = JSON.parse(JSON.stringify(objClientBody.client));

    let decoded = new Buffer(objClient.comment.toString(), 'hex');

    objClient.commentDecoded = decoded.toString();
    objClientBody.client = objClient;
    block.body = objClientBody;

    return block;

}
// deterministic RNG for testing only
function rng() {
    return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
}
server.route({
    method: 'GET',
    path: '/generateAddress',
    handler: async (request, h) => {
        //const hash = bitcoin.crypto.sha256(Buffer.from('hi starRegistry'))
        //const keyPair = bitcoin.ECPair.fromPrivateKey(hash);
        //const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
        //const rng = Buffer.from('correct horse battery staple');
        const testnet = bitcoin.networks.testnet;
        const keyPair = bitcoin.ECPair.makeRandom({
            network: testnet,
            rng: rng
        });
        const wif = keyPair.toWIF();
        const {
            address
        } = bitcoin.payments.p2pkh({
            pubkey: keyPair.publicKey,
            network: testnet
        });
        return JSON.stringify(address);
    }
});
server.route({
    method: 'POST',
    path: '/block',
    handler: async (request, response) => {
console.log("block called");
        let currentTimeStamp = Math.round(new Date().getTime() / 1000);
        //new Date().getTime().toString().slice(0, -3);
        console.log(request.payload.address);
  console.log(request.payload.TIN);
    console.log(request.payload.DisplayName);
      console.log(request.payload.Comment);


        let dbTimeStamp = await blockChain.getValueFromDB(request.payload.address + '_timeStamp');
        let status = await blockChain.getValueFromDB(request.payload.address + '_validationStatus');

        let blockAddedStatus = await blockChain.getValueFromDB(objUserRequest.address + '_blockAdded');
        if (blockAddedStatus === "NotFound") {
            blockAddedStatus = false;
        }
        if (status === "NotFound") {
            status = false;
        }
        console.log(blockAddedStatus+ ' '+ status);
        // if (blockAddedStatus && currentTimeStamp - dbTimeStamp < 300) {
        //     return "Last block was added sometime before. Next block can be posted only after 5 mins of adding previous block";
        // } else if (!blockAddedStatus && currentTimeStamp - dbTimeStamp < 300 && status) {

            let walletAddress = request.payload.address.toString();
            //console.log(JSON.stringify(request.payload.client));
            // let objClient = JSON.parse(JSON.stringify(request.payload.client));
            // console.log(objClient.comment);
            let objClient  = new Star.Client(request.payload.Comment);
            objClient.TIN =request.payload.TIN;
            objClient.DisplayName =request.payload.DisplayName;
            objClient.comment =request.payload.Comment;
            console.log(objClient);
            if (Buffer.byteLength(objClient.comment) > 250) {
                return ("Story text should not be more than 250 characters. Block can not be added");
            } else {
                console.log("adding client");

                objClient.comment = new Buffer(objClient.comment.toString()).toString('hex');

                let objClientBody = new Star.ClientBody(request.payload.address, objClient);

                let stringObjClientBody = JSON.stringify(objClientBody);
                stringObjClientBody = stringObjClientBody.replace("'", "\'");
                //await blockChain.addBlock(new simpleChain.Block(JSON.stringify(objStarBody)));
                await blockChain.addBlock(new simpleChain.Block(stringObjClientBody));

                await blockChain.addValueToDB(walletAddress + '_blockAdded', true);
                await delay(2000);

                let blockHeight = await blockChain.getBlockHeight();

                let block = await blockChain.getBlock(blockHeight - 1);

                //console.log(JSON.stringify(block));
                return JSON.stringify(block);
            }
        // } else {
        //     if (currentTimeStamp - dbTimeStamp > 300) {
        //         await blockChain.deleteValueFromDB(request.payload.address + '_timeStamp');
        //         await blockChain.deleteValueFromDB(request.payload.address + '_message');
        //         await blockChain.deleteValueFromDB(request.payload.address + '_validationStatus');
        //         await blockChain.deleteValueFromDB(request.payload.address + '_blockAdded');
        //         return "Validation is expired. Please proceed with validation.";
        //     } else {
        //         return "Before adding the client, the request should be validated. Please proceed with validation.";
        //     }
        // }
    }
});

server.route({
    method: 'POST',
    path: '/requestValidation',
    handler: async (request, response) => {

      await blockChain.deleteValueFromDB(request.payload.address + '_timeStamp');
      await blockChain.deleteValueFromDB(request.payload.address + '_message');
      await blockChain.deleteValueFromDB(request.payload.address + '_validationStatus');
      await blockChain.deleteValueFromDB(request.payload.address + '_blockAdded');

        let currentTimeStamp = Math.round(new Date().getTime() / 1000);
        //new Date().getTime().toString().slice(0, -3);
        // await blockChain.deleteValueFromDB(request.payload.address + '_timeStamp');
        // await blockChain.deleteValueFromDB(request.payload.address + '_message');
        // await blockChain.deleteValueFromDB(request.payload.address + '_validationStatus');
        // await blockChain.deleteValueFromDB(request.payload.address + '_blockAdded');
        console.log(currentTimeStamp);
        objUserRequest.address = request.payload.address.toString();
        let dbTimeStamp = await blockChain.getValueFromDB(request.payload.address + '_timeStamp');

        if (dbTimeStamp === "NotFound") {
            objUserRequest.validationWindow = "300";
            objUserRequest.requestTimeStamp = currentTimeStamp;
            objUserRequest.message = objUserRequest.address + ":" + objUserRequest.requestTimeStamp + ":ClientAdd";

            await blockChain.addValueToDB(objUserRequest.address + '_timeStamp', objUserRequest.requestTimeStamp);
            await blockChain.addValueToDB(objUserRequest.address + '_message', objUserRequest.message);
            return JSON.stringify(objUserRequest);
        } else if (currentTimeStamp - dbTimeStamp < 300) {
            objUserRequest.validationWindow = currentTimeStamp - dbTimeStamp;
            return JSON.stringify(objUserRequest);
        } else {

            await blockChain.deleteValueFromDB(request.payload.address + '_timeStamp');
            await blockChain.deleteValueFromDB(request.payload.address + '_message');
            await blockChain.deleteValueFromDB(request.payload.address + '_validationStatus');
            return "Validation is expired. Please start the process all over again.";
        }
    }
});


server.route({
    method: 'POST',
    path: '/message-signature/validate',
    handler: async (request, response) => {

        let currentTimeStamp = Math.round(new Date().getTime() / 1000);
        //new Date().getTime().toString().slice(0, -3);
        let dbTimeStamp = await blockChain.getValueFromDB(request.payload.address + '_timeStamp');

        let address = request.payload.address.toString();
        let signature = request.payload.signature.toString();
        let message = await blockChain.getValueFromDB(request.payload.address + '_message');


        if (dbTimeStamp != "NotFound" || currentTimeStamp - dbTimeStamp < 300) {
            let status = bitcoinMessage.verify(message, address, signature);;
            if (status) {
                await blockChain.addValueToDB(objUserRequest.address + '_validationStatus', status);
                return ("Validation Succeeded");
            } else {
                return ("Validation Failed");
            }
        } else {
            if (currentTimeStamp - dbTimeStamp > 300) {
                await blockChain.deleteValueFromDB(request.payload.address + '_timeStamp');
                await blockChain.deleteValueFromDB(request.payload.address + '_message');
                await blockChain.deleteValueFromDB(request.payload.address + '_validationStatus');
            }
            return ("Please start with request validation.");
        }
    }
});


// Start the server
async function start() {

    try {
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};



function delay(t, val) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve(val);
        }, t);
    });
}
start();
