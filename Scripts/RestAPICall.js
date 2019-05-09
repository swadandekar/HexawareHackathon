restAPIURL="";
_requestValidationGridId= "requestValidationGrid";

var selectedAddress;
function callRequestValidation()
{
	var walletAddress = $('#inputAddress').val();
	$.ajax({
	 type: "POST",
             dataType: "json",
			 data: {"address" :walletAddress},
             url: "http://localhost:8000/requestValidation",
             success: function(data){        
                //alert(data);
				//var obj = JSON.parse(data);
				 InitializeRequestValidationGrid(data);
             }  
   });

}

function InitializeRequestValidationGrid(response) {
var jarray =[];  
jarray.push(JSON.parse(JSON.stringify(response)));
   var ds = new kendo.data.DataSource({
     data:  jarray,
     		schema: {
			model: {
				address: { type: 'string' },
				message: { type: 'string' },
				requestTimeStamp:{ type: 'number' },
				validationWindow: { type: 'string' }
				}
		} 
});
        $("#RequestValidationGrid").kendoGrid({
			columns: [
				{  template: "<div class='kendoCell'>#: address #</div>", title: 'Wallet Address', width: '120px'},
				{ template: "<div class='kendoCell'>#: message #</div>" , title: 'Message', width: '120px' },
				{ template: "<div class='kendoCell'>#: requestTimeStamp #</div>" , title: 'Time', width: '120px' },
				{ template: "<div class='kendoCell'>#: validationWindow #</div>" , title: 'Validation Window', width: '120px' },
				
			],
			dataSource: ds,
			selectable: "row",
			groupable: false,
			sortable: false,
			pageable:false,
			scrollable: false,
			change: function() {
				//alert("Address: " + this.dataItem(this.select()).address);
    			selectedAddress= this.dataItem(this.select()).address;
				$("#SignValidationGrid").show();
			}
		});

}

 function signValidation()
{
	alert(selectedAddress);
	
	var sign = $('#inputSign').val();
	
	$.ajax({
	 type: "POST",
             dataType: "text",
			 data: {"address" :selectedAddress,
					"signature" : sign},
             url: "http://localhost:8000/message-signature/validate",
             success: function(data){        
                alert(data);
				  validateShow();
             }  
   });

 validateShow();
}
function validateShow(){
	$("#SignValidationGrid").show();
   	$("#RequestValidationGrid").show();
}

function saveClient(){
	var clientAddress = $('#inputClientAddress').val();
	var clientTIN = $('#inputClientTIN').val();
	var clientName = $('#inputClientName').val();
	var clientComment = $('#inputClientComment').val();
	
	$.ajax({
	 type: "POST",
             dataType: "text",
			 data:{
					"address": clientAddress,
				  	"TIN":  clientTIN,
					"DisplayName": clientName,
					"Comment": clientComment			  
				},
             url: "http://localhost:8000/block",
             success: function(data){        
                alert(data);
				 InitializeClientGrid(data);
             }  
   });
}



function InitializeClientGrid(response) {
var jarray =[];  

var block = JSON.parse(response);
var blockBody = JSON.parse(block.body);
var blockClient = blockBody.client;
block.body =blockBody;
jarray.push(block);

    var ds = new kendo.data.DataSource({
     data:  jarray,
     		schema: {
			model: {
				hash: { type: 'string' },
				height: { type: 'string' },
				fields :{
					address_new: {from: "body.address"},
					client_TIN: {from: "body.client.TIN"},
					client_DisplayName: {from: "body.client.DisplayName"},
					client_comment: {from: "body.client.comment"},
					body: { defaultValue: {} },
				},					
				
				time: { type: 'string' },
				previousBlockHash: { type: 'string' }
				}
		} 
});
       $("#CreateClientGrid").kendoGrid({
			 columns: [
				{  template: "<div class='kendoCell breakWord20'>#: hash #</div>", title: 'Block Hash', width: '15%'},
				{ template: "<div class='kendoCell'>#: height #</div>" , title: 'Height', width: '5%' },
				{ template: "<div class='kendoCell'>#: time #</div>" , title: 'Time', width: '5%' },
				{  template: "<div class='kendoCell breakWord20'>#: address_new #</div>", title: 'Wallet Address', width: '15%'},				
				{ template: "<div class='kendoCell'>#: client_TIN #</div>" , title: 'TIN', width: '5%' },
				{ template: "<div class='kendoCell'>#: client_DisplayName #</div>" , title: 'Display Name', width: '10%' },
				{ template: "<div class='kendoCell breakWord20'>#: client_comment #</div>" , title: 'Comment', width: '15%' } ,				
				{ template: "<div class='kendoCell'>#: time #</div>" , title: 'Time', width: '5%' },
				{ template: "<div class='kendoCell breakWord20'>#: previousBlockHash #</div> " , title: 'Previous Block Hash', width: '15%' } 
				
			],
			dataSource: ds,
			selectable: false,
			groupable: false,
			sortable: false,
			pageable:false,
			scrollable: false
		});
 
}



function searchByAddress(){
	var clientAddress = $('#inputSearchAddress').val();
	
	$.ajax({
	 type: "GET",
             dataType: "text",
			 // data: {
				 // address: clientAddress
			 // },
             url: "http://localhost:8000/clients/address:"+clientAddress,
             success: function(data){        
                alert(data);
				 InitializeSearchByAddressGrid(data);
             }  
   });
}


function InitializeSearchByAddressGrid(response) {
var jarray =[];  
var objResponse = JSON.parse(response);
for(i = 0; i < objResponse.length; i += 1) {
    if(objResponse[i]["body"]) {
        var block = objResponse[i];
		var blockBody = JSON.parse(JSON.stringify(block.body));
		var blockClient = blockBody.client;
		block.body =blockBody;
		jarray.push(block);
    }
}


    var ds = new kendo.data.DataSource({
     data:  jarray,
     		schema: {
			model: {
				hash: { type: 'string' },
				height: { type: 'string' },
				fields :{
					address_new: {from: "body.address"},
					client_TIN: {from: "body.client.TIN"},
					client_DisplayName: {from: "body.client.DisplayName"},
					client_comment: {from: "body.client.comment"},
					client_commentDecoded: {from: "body.client.commentDecoded"},
					body: { defaultValue: {} },
				},					
				
				time: { type: 'string' },
				previousBlockHash: { type: 'string' }
				}
		} 
});
       $("#SearchByAddressGrid").kendoGrid({
			 columns: [
				{  template: "<div class='kendoCell breakWord20'>#: hash #</div>", title: 'Block Hash', width: '15%'},
				{ template: "<div class='kendoCell'>#: height #</div>" , title: 'Height', width: '5%' },
				{  template: "<div class='kendoCell breakWord20'>#: address_new #</div>", title: 'Wallet Address', width: '15%'},				
				{ template: "<div class='kendoCell'>#: client_TIN #</div>" , title: 'TIN', width: '5%' },
				{ template: "<div class='kendoCell'>#: client_DisplayName #</div>" , title: 'Display Name', width: '10%' },
				{ template: "<div class='kendoCell breakWord20'>#: client_comment #</div>" , title: 'Comment Encoded', width: '15%' } ,	
				{ template: "<div class='kendoCell breakWord20'>#: client_commentDecoded #</div>" , title: 'Comment Decoded', width: '15%' } ,				
				{ template: "<div class='kendoCell'>#: time #</div>" , title: 'Block Posted Time', width: '5%' },
				{ template: "<div class='kendoCell breakWord20'>#: previousBlockHash #</div> " , title: 'Previous Block Hash', width: '15%' } 
				
			],
			dataSource: ds,
			selectable: false,
			groupable: false,
			sortable: false,
			pageable:false,
			scrollable: false
		});
 
}


function searchByHash(){
	var clientHash = $('#inputSearchHash').val();
	
	$.ajax({
	 type: "GET",
             dataType: "text",
             url: "http://localhost:8000/clients/hash:"+clientHash,
             success: function(data){        
                alert(data);
				 InitializeSearchByHashGrid(data);
             }  
   });
}
//SearchByHashGrid

function InitializeSearchByHashGrid(response) {
var jarray =[];  
var objResponse = JSON.parse(response);
for(i = 0; i < objResponse.length; i += 1) {
    if(objResponse[i]["body"]) {
        var block = objResponse[i];
		var blockBody = JSON.parse(JSON.stringify(block.body));
		var blockClient = blockBody.client;
		block.body =blockBody;
		jarray.push(block);
    }
}


    var ds = new kendo.data.DataSource({
     data:  jarray,
     		schema: {
			model: {
				hash: { type: 'string' },
				height: { type: 'string' },
				fields :{
					address_new: {from: "body.address"},
					client_TIN: {from: "body.client.TIN"},
					client_DisplayName: {from: "body.client.DisplayName"},
					client_comment: {from: "body.client.comment"},
					client_commentDecoded: {from: "body.client.commentDecoded"},
					body: { defaultValue: {} },
				},					
				
				time: { type: 'string' },
				previousBlockHash: { type: 'string' }
				}
		} 
});
       $("#SearchByHashGrid").kendoGrid({
			 columns: [
				{  template: "<div class='kendoCell breakWord20'>#: hash #</div>", title: 'Block Hash', width: '15%'},
				{ template: "<div class='kendoCell'>#: height #</div>" , title: 'Height', width: '5%' },
				{  template: "<div class='kendoCell breakWord20'>#: address_new #</div>", title: 'Wallet Address', width: '15%'},				
				{ template: "<div class='kendoCell'>#: client_TIN #</div>" , title: 'TIN', width: '5%' },
				{ template: "<div class='kendoCell'>#: client_DisplayName #</div>" , title: 'Display Name', width: '10%' },
				{ template: "<div class='kendoCell breakWord20'>#: client_comment #</div>" , title: 'Comment Encoded', width: '15%' } ,	
				{ template: "<div class='kendoCell breakWord20'>#: client_commentDecoded #</div>" , title: 'Comment Decoded', width: '15%' } ,				
				{ template: "<div class='kendoCell'>#: time #</div>" , title: 'Block Posted Time', width: '5%' },
				{ template: "<div class='kendoCell breakWord20'>#: previousBlockHash #</div> " , title: 'Previous Block Hash', width: '15%' } 
				
			],
			dataSource: ds,
			selectable: false,
			groupable: false,
			sortable: false,
			pageable:false,
			scrollable: false
		});
 
}

