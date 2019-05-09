$(document).ready(function () {






});

function quickActionItemClicked(sender){

	changeDefaultMenuCSS();

 	$(sender).removeClass("quickActionItemDefault");
  	$(sender).addClass("quickActionItemSelected");

	gridToggle(sender);

	/* if(sender.id == "requestValidation" ) {
		var address = document.getElementById("inputAddress").value;
		//callRequestValidation("1PbcYuPS1w53g1PwuzHLafh2zo7HhypDWn");
		//callRequestValidation(address);
	} */

}



function changeDefaultMenuCSS()
{
  	$('#requestValidation').removeClass("quickActionItemSelected");
  	$('#requestValidation').addClass("quickActionItemDefault");

  	$('#signValidation').removeClass("quickActionItemSelected");
  	$('#signValidation').addClass("quickActionItemDefault");

  	$('#createClient').removeClass("quickActionItemSelected");
  	$('#createClient').addClass("quickActionItemDefault");

  	$('#searchByAddress').removeClass("quickActionItemSelected");
  	$('#searchByAddress').addClass("quickActionItemDefault");

  	$('#searchByHash').removeClass("quickActionItemSelected");
  	$('#searchByHash').addClass("quickActionItemDefault");
}

function gridToggle(sender){


if(sender.id == "requestValidation" ) {
   		$("#RequestValidationGrid").show();
       		$("#SignValidationGrid").hide();
       		$("#CreateClientGrid").hide();
       		$("#SearchByAddressGrid").hide();
       		$("#SearchByHashGrid").hide();

   		$("#RequestValidationGridHeader").show();
       		$("#SignValidationGridHeader").hide();
       		$("#CreateClientGridHeader").hide();
       		$("#SearchByAddressGridHeader").hide();
       		$("#SearchByHashGridHeader").hide();
	}
	else if(sender.id == "signValidation" ) {
   		$("#RequestValidationGrid").hide();
       		$("#SignValidationGrid").show();
       		$("#CreateClientGrid").hide();
       		$("#SearchByAddressGrid").hide();
       		$("#SearchByHashGrid").hide();

   		$("#RequestValidationGridHeader").hide();
       		$("#SignValidationGridHeader").show();
       		$("#CreateClientGridHeader").hide();
       		$("#SearchByAddressGridHeader").hide();
       		$("#SearchByHashGridHeader").hide();
	}
	else if(sender.id == "createClient" ) {
   		$("#RequestValidationGrid").hide();
       		$("#SignValidationGrid").hide();
       		$("#CreateClientGrid").show();
       		$("#SearchByAddressGrid").hide();
       		$("#SearchByHashGrid").hide();

   		$("#RequestValidationGridHeader").hide();
       		$("#SignValidationGridHeader").hide();
       		$("#CreateClientGridHeader").show();
       		$("#SearchByAddressGridHeader").hide();
       		$("#SearchByHashGridHeader").hide();
	}
	else if(sender.id == "searchByAddress" ) {
   		$("#RequestValidationGrid").hide();
       		$("#SignValidationGrid").hide();
       		$("#CreateClientGrid").hide();
       		$("#SearchByAddressGrid").show();
       		$("#SearchByHashGrid").hide();

   		$("#RequestValidationGridHeader").hide();
       		$("#SignValidationGridHeader").hide();
       		$("#CreateClientGridHeader").hide();
       		$("#SearchByAddressGridHeader").show();
       		$("#SearchByHashGridHeader").hide();
	}
	else if(sender.id == "searchByHash" ) {
   		$("#RequestValidationGrid").hide();
       		$("#SignValidationGrid").hide();
       		$("#CreateClientGrid").hide();
       		$("#SearchByAddressGrid").hide();
       		$("#SearchByHashGrid").show();

   		$("#RequestValidationGridHeader").hide();
       		$("#SignValidationGridHeader").hide();
       		$("#CreateClientGridHeader").hide();
       		$("#SearchByAddressGridHeader").hide();
       		$("#SearchByHashGridHeader").show();
	}

}
