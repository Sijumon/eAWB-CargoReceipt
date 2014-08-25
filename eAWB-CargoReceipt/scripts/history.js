(function (global) {
    var HistoryViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare HistoryViewModel
    */
    HistoryViewModel = kendo.data.ObservableObject.extend({
        /*
        	goHome(): go to query view of the application
        */
        goHome: function(){
            //app.application.navigate('#query', 'slide:right'); 
            $("#queryURL").attr('href', '#query');
        },
        
        /*
        	showSettingDialog(): show the setting dialog
        */
        showSettingDialog: function(){
            var dialog = $("#settingSignOutDialog").dialog({
               dialogClass: 'setting_signout_dialog', modal: true, resizable: false
            });
        	dialog.prev(".ui-dialog-titlebar").css("background","#5E5E5E");
            dialog.prev(".ui-widget-header").css("font-weight","normal");
        },
        
        /*
        	onClearHistoryAction(): clear all history action
        */
        onClearHistoryAction: function(e){
            //console.log("================= onClearHistoryAction");            
            /*
            	call the ws to clear all history data
            */
            var url = "http://apidev.ccnhub.com/v1/CargoReceipt.WebAPI/cargoreceiptreporthistory/" +
            			window.localStorage.getItem("appToken") + "/";
            //TODO:
            //url = "http://apidev.ccnhub.com/v1/CargoReceipt.WebAPI/cargoreceiptreporthistory/aaa/";
            //console.log("===== onClearHistoryAction(), url=" + url);
            $.ajax({
                type: "DELETE",
                url: url,
                data: "{}",
                headers: {'Accept': 'application/json'},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(response) {
                    console.log("DELETE success");
                    app.historyService.refreshHistoryList(); 
                    var delAllDialog = $("#delAllDialog").dialog({
                       width: 250, height: 60, modal: true, resizable: false
                    });
                    delAllDialog.prev(".ui-dialog")('class', 'ui-dialog-history');
                    delAllDialog.prev(".ui-dialog-content")('class', 'ui-dialog-content-history');
                    setInterval(function(){ $("#delAllDialog").dialog("close"); },2000);         
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                   console.log("============ onClearHistoryAction(): ERROR=" + errorThrown);
                }
            });
            
        }
    });
    
    /*
    	Declare historyService
    */
    app.historyService = {
        /*
        	Refresh the historyList
        */        
        refreshHistoryList: function(){
            //console.log("================= refreshHistoryList()");
            var list = $('#historyList').data('kendoMobileListView');
            list.dataSource.read();   
            list.refresh();
        },
        
        
        /*
        	listViewHistoryInit(): set up the view at the first time loaded
        */        
        listViewHistoryInit: function(){
            //console.log("================= listViewHistoryInit()");
            
            /*
            	Set advertisement
            */           
            var advertiseIMG = window.localStorage.getItem("advertiseIMG");
            var advertiseURL = window.localStorage.getItem("advertiseURL");
            $('#imgHistory').attr('src', advertiseIMG);
            $('#imgHistory').click(function(e) {
                window.location.href = advertiseURL;
			});
            
            var arrAdsImg = $.parseJSON(window.localStorage.getItem("strArrAdsImg"));
            var arrAdsURL = $.parseJSON(window.localStorage.getItem("strArrAdsURL"));
            var length = arrAdsImg.length;
            
            var index = 0, temp, imgSrc;                    
            setInterval(function() {
            	index += 1;
                temp = index % length;
                imgSrc = arrAdsImg[temp];
                $('#imgHistory').attr('src', imgSrc);
                $('#imgHistory').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, 2500);
             
            
            /*
            	Do the action of setting signout dialog
            */
            $("#helpBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#help');
            });
            $("#aboutAppBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_app');
            });
            $("#aboutCCNBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_ccn');
            });
            $("#termConditionBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#term_condition');
            });
            $("#signoutBtn").on("click", function(){ 
                var authenticationCode = window.localStorage.getItem("authenticationCode");
                var url = "http://apidev.ccnhub.com/api/session/v1/logout/token=" + window.localStorage.getItem("appToken")
                			+ "/authenticationCode=" + authenticationCode;
                //console.log("signoutBtn, url=" + url);
                $.ajax({
                    type: "GET",
                    url: url,
                    data: "{}",
                    headers: {'Accept': 'application/json'},
                    contentType: "application/json; charset=utf-8",
                    dataType: "text",
                    success: function(response) {
                        console.log("============ validateUserCredential(): SUCCCESS"); 
                        if (response.IsSuccess){
                        	$('#settingSignOutDialog').dialog('close');
                            window.localStorage.setItem("userLoggedIn", false);
                            app.application.navigate('#login');       
                        }      
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                       console.log("============ validateUserCredential(): ERROR");
                       //$('#settingSignOutDialog').dialog('close'); 
                    }
                });
            });
        }, 
        
        /*
        	listViewHistoryShow() function: show the About App information
        */        
        listViewHistoryShow: function (e) {
            //console.log("================= listViewHistoryShow");
            
            /*
            	Show the historyList            
            */
            var appToken = window.localStorage.getItem("appToken");
            var url = "http://apidev.ccnhub.com/v1/CargoReceipt.WebAPI/cargoreceiptreporthistory/?token=" + appToken;
            //var url = "http://apidev.ccnhub.com/v1/CargoReceipt.WebAPI/cargoreceiptreporthistory/?token=aaa";
            //var url = "data/history_data.json";
            //console.log("url=" + url);
            
            $("#historyList").kendoMobileListView({
                dataSource: new kendo.data.DataSource({
                  schema: {
                    data: function(response) {
                        //console.log("response=" + response);
                        
                        responseJSON = $.parseJSON(response);
                    	//Parse response data
                        if (responseJSON === null)
                        	return [];
                        var cargoReceiptReportRequests = responseJSON.CargoReceiptReportRequests;
                        if (cargoReceiptReportRequests === null|| cargoReceiptReportRequests.length === 0)
                            return [];
                        
                        var arrHistoryList = app.historyService.parseJSONdata(cargoReceiptReportRequests);
                        //console.log("arrHistoryList=" + arrHistoryList);
                        arrHistoryList = $.parseJSON(arrHistoryList);
                        
                        return arrHistoryList;
                    }
                  },
                  transport: {
                    read: {
                      url: url,
                      dataType: "text"
                    }
                  }
                }),
                template: $("#history-lw-template").html(),
                fixedHeaders: true                
            });
            
            
            /*
            	Enable wipe action for historyList
            */
        	$("#historyList").kendoTouch({
                filter: ">li",
                enableSwipe: true,
                swipe: function (e) {
                    //console.log("============ onHistorySwipe");
                	/*
                    	the UI action: swipe & collapse the current row
                    */                    
                    var curRow = e.touch.currentTarget;
                    $(curRow).addClass("swipe_selected_row");
                    if (e.direction === "left") 
                        kendo.fx(curRow).slideIn("right").duration(500).reverse();
                    else
                        kendo.fx(curRow).slideIn("left").duration(500).reverse();
                    setInterval(function(){ 
                        $(curRow).addClass("collapsed");
                    }, 600);
                    
                    /*
                    	Get the index & value id
                    */
                    var index = $(e.touch.currentTarget).index();
                    //console.log("index=" + index);
                    var id = $('#historyList').data('kendoMobileListView').dataSource.view()[index].Id;
                    //console.log("id=" + id);
                    
                    /*
                    	Call the ws to delete each row of listview
                    */ 
                    var url = "http://apidev.ccnhub.com/v1/CargoReceipt.WebAPI/cargoreceiptreporthistory/"  +
                    			appToken + "/" + id;
                    $.ajax({
                        type: "DELETE",
                        url: url,
                        data: "{}",
                        headers: {'Accept': 'application/json'},
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function(response) {
                            //console.log("============ deleteOneRow(): SUCCESS"); 
                            app.historyService.refreshHistoryList();
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log("============ deleteOneRow(): ERROR");
                        }
                    });
                           
                }
            });
            
		},
        
        
        /*
        	parseJSONdata() function: parse string to json array string
        */
        parseJSONdata: function(cargoReceiptReportRequests){
            $.each(cargoReceiptReportRequests, function(index,value) {
            	value.RequestedDate = app.historyService.showDateTime(value.RequestedDate);                
            });            
        	var arrHistoryList = JSON.stringify(cargoReceiptReportRequests);
            return arrHistoryList;
        },
        
        
        /*
        	convert UnixTimeStamp to dd MMM yyyy hh:mm
        */
        showDateTime: function(timestamp){
            var dt = new Date(timestamp * 1000);
            var mmToMonth = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");	
        	var mm = mmToMonth[dt.getMonth()];
            return (dt.getDate() + " " + mm + " " + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes());
        },
        
        viewModel: new HistoryViewModel()        
        
    };
    
})(window);
