//default setting needed by MyE grids with server paging and sorting
function GetDataSource(svcUrl, params) {
    var ds = GetBasicDataSource(svcUrl, params);
     
    ds.serverSorting = true;
    ds.serverPaging = true;
    ds.serverFiltering = true;
    ds.pageSize = 10;
    return ds;
}

function GetDataSourceWithServerFiltering(svcUrl, params) {
    var ds = GetDataSource(svcUrl, params);
    ds.serverFiltering = true;
    return ds;
}

//least default setting needed by  grids
function GetBasicDataSource(svcUrl, params) {
    return {
        transport: {
            read: {
                url: svcUrl,
                datatype: "json",
                type: "POST",
                contentType: 'application/json; charset=utf-8',
                complete: function (data, status) {
                   // RemoveAjaxRequestFromRequestsPool(data);
                   // RefreshAsOfDateHeaderFilterControl(data.responseJSON.IsAsOfDateRefreshed);
                    if (data != null && data.responseJSON != null)
                        AlertError(data.responseJSON.ErrorId);
                }
            },
            parameterMap: function (options) {
                
                return JSON.stringify(options);
            }
        },
        schema: {
            data: "Items", // records are returned in the "data" field of the response
            total: "ItemsCount" // total number of records is in the "total" field of the response
        }
    };
}


function DataSourceParameter() {
this.Name = "";
this.Value = "";
}

function CreateDataSourceParameter(name, value){
    var param = new DataSourceParameter();
    param.Name = name;
    param.Value = value;
    return param;
}


function DisplayNoRecordsLabel(gridId, parentElement) {
    var grid = parentElement == undefined ? $("#" + gridId) : $("#" + gridId, parentElement);

    if ($(".k-grid-content-locked", grid).length > 0) {
        $(".k-grid-content-locked", grid).append("<div class='no_records_message'>" + _noRecordsToDisplayMessage + "</div>");
    }
    else if ($(".k-grid-content-locked", grid).length > 0) {
        $(".k-grid-content", grid).append("<div class='no_records_message'>" + _noRecordsToDisplayMessage + "</div>");
    }
    else {
        $("tbody", grid).append("<div class='no_records_message'>" + _noRecordsToDisplayMessage + "</div>");
    }
}