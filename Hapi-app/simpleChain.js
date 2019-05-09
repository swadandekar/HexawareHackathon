/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
const resolve = require('resolve');
const reject = require('reject');
module.exports = this.getBlock;
module.exports = this.addBlock;
module.exports = this.getBlockHeight;
module.exports = this.getBlockByAddress;
module.exports = this.getBlockByHash;
module.exports = this.getValueFromDB;
module.exports = this.addValueToDB;
module.exports = this.deleteValueFromDB;

/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const SHA256 = require('crypto-js/sha256');
const async = require('async');
const await = require('await');
const heightKey = 'height';
const Star = require('./Star.js');

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
    constructor(data) {
        this.hash = "",
            this.height = 0,
            this.body = data,
            this.time = 0,
            this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/
let globalBlockHeight;

class Blockchain {
    constructor() {
        this.chain = [];
        this.getBlockHeight().then(height => {
                globalBlockHeight = height;
                if (height > 0) {
                    console.log("block chain exists. would not add genesis block");
                } else {
                    globalBlockHeight = 0;

                    let comment = new Buffer("First block in the chain - Genesis block".toString()).toString('hex');
                    let objClient = new Star.Client(comment);
                    objClient.TIN ="ABC-AHDT";
                    objClient.DisplayName ="Genesis Client";
                    let objClientBody = new Star.ClientBody("1PbcYuPS1w53g1PwuzHLafh2zo7HhypDWn", objClient);
                    //objStarBody

                    this.addBlock(new Block(JSON.stringify(objClientBody)));
                    globalBlockHeight = 1;
                    console.log("Genesis block added");
                }
            })
            .catch(error => {
                console.log("error at constr" + error);
            })

    }

    // Add new block
    addBlock(newBlock) {
        // Block height

        newBlock.height = globalBlockHeight;

        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        // previous block hash
        if (this.chain.length > 0) {
            newBlock.previousBlockHash = this.chain[this.chain.length - 1].hash;
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        // Adding block object to chain
        this.chain.push(newBlock);
        //add block in level db
        this.addLevelDBData("block_" + newBlock.height,
            (JSON.stringify(newBlock)).toString());
        globalBlockHeight = globalBlockHeight + 1;
    }


    // Get block height
    getBlockHeight() {
        return new Promise(function(resolve, reject) {
            let i = 0;

            db.createReadStream()
                .on('data', function(data) {
                    if (data.key.indexOf("block_") > -1) {
                        i++;
                    }
                })
                .on('error', function() {
                    reject("Could not retrieve chain length");
                })
                .on('close', function() {
                    //  console.log('getblockheight' + i);
                    resolve(i);
                });
        })
    }

    // Get block by address
    getBlockByAddress(address) {
        return new Promise(function(resolve, reject) {
            //  let i = 0;
            let blockArray = [];
            db.createReadStream()
                .on('data', function(data) {
                    if (data.key.indexOf("block_") > -1) {
                        //console.log(data.value);
                        let block = JSON.parse(data.value);
                        let objStarBody = JSON.parse(block.body);
                        let blockAddress = JSON.parse(JSON.stringify(objStarBody.address));
                        if (address === blockAddress) {
                            //  blockArray.push(block);
                            blockArray.push(data.value);
                        }
                    }
                })
                .on('error', function() {
                    reject("Could not retrieve chain length");
                })
                .on('close', function() {
                    //  console.log('getblockheight' + i);
                    resolve(blockArray);
                });
        })
    }
    // Get block by address
    getBlockByHash(hash) {
        return new Promise(function(resolve, reject) {
            //  let i = 0;
            let blockArray = [];
            db.createReadStream()
                .on('data', function(data) {
                    if (data.key.indexOf("block_") > -1) {
                        //console.log(data.value);
                        let block = JSON.parse(data.value);

                        if (hash === block.hash) {
                            //  blockArray.push(block);
                            blockArray.push(data.value);
                        }
                    }

                })
                .on('error', function() {
                    reject("Could not retrieve chain length");
                })
                .on('close', function() {
                    //  console.log('getblockheight' + i);
                    resolve(blockArray);
                });
        })
    }
    //get block from Level DB
    async getBlock(blockHeight) {
        let temp = await this.getLevelDBData("block_" + blockHeight);
        return JSON.parse(temp);
    }

    async getValueFromDB(key) {
        let temp = await this.getLevelDBData(key);
        return temp;
    }
    async addValueToDB(key, value) {
        await this.addLevelDBData(key, value);
    }

    //deleteLevelDBData
    async deleteValueFromDB(key) {
        await this.deleteLevelDBData(key);
    }

    // validate block
    async validateBlock(blockHeight) {

        // get block object
        let block = await this.getBlock(blockHeight);
        console.log(JSON.stringify(block));

        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';

        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash === validBlockHash) {
            console.log('validateBlock succeed');
            return true;
        } else {
            console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
            return false;
        }
    }

    // Validate blockchain
    async validateChain() {
        let errorLog = [];
        let i = 0;
        for (i = 0; i < this.chain.length; i++) {
            // validate blocks
            let flag = false;
            console.log("processing" + i + " th block");

            flag = await this.validateBlock(i);
            if (flag) {
                // compare blocks hash link
                if (i != 0) {
                    let blockHash = this.chain[i].previousBlockHash;
                    let previousHash = this.chain[i - 1].hash;
                    if (blockHash !== previousHash) {
                        errorLog.push(i);
                    } else {
                        console.log('succeed');
                    }
                }
            } else {
                errorLog.push(i);
            }
        }
        if (errorLog.length > 0) {
            return false;
        } else {
            return true;
        }

    }

    //validate chain check final status
    validateBlockChain() {
        this.validateChain()
            .then(flag => {
                if (flag) {

                    console.log('No errors detected');
                } else {
                    console.log('Block errors = ' + errorLog.length);
                    console.log('Blocks: ' + errorLog)
                }
            })
            .catch(error => {
                console.log('errors detected while validating chain');
            })
    }

    //add data in level db
    addLevelDBData(key, value) {
        return new Promise((resolve, reject) => {
            db.put(key, value)
                .then(() => resolve(key))
                .catch(err => reject(err));

        });
    }

    // Get data from levelDB with key
    getLevelDBData(key) {
        return new Promise((resolve, reject) => {
            db.get(key, function(err, value) {
                if (err) {
                    if (err.notFound) {
                        console.log("Not found!", err);
                        resolve("NotFound");
                    } else {
                        console.log("Error occured!", err);
                        reject(err);
                    }
                } else {
                    resolve(value);
                }
            });
        });
    }

    // delete data from levelDB with key
    deleteLevelDBData(key) {
        return new Promise((resolve, reject) => {
            db.del(key, function(err) {
                if (err) {
                    console.log("Not found!", err);
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
};


module.exports = {
    Blockchain: Blockchain,
    Block: Block,
    globalBlockHeight: this.globalBlockHeight
}
