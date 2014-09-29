(function (global) {
    var HistoryViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare HistoryViewModel
    */
    HistoryViewModel = kendo.data.ObservableObject.extend({
        strNumOfRecord: 0,

        onHistoryListClickAction: function(e){
        	//console.log("================= onHistoryListClickAction()");            
            var index = $(e.item).index();  
            var dataItem = $('#historyList').data('kendoMobileListView').dataSource.view()[index];
            var awbPrefix = dataItem.AWBPrefix;
            var awbSuffix = dataItem.AWBSuffix;
            //console.log("id=" + id);
            var url = "#query_result?awbPrefix=" + awbPrefix + "&awbSuffix=" + awbSuffix;
            //console.log("url=" + url);
            //app.application.navigate(url, 'slide:right');
            $("#dummyBtn").attr('href', url);
            $("#dummyBtn").trigger('click');            
        },
        
        /*
        	showSettingDialog(): show the setting dialog
        */
        showSettingDialog: function(){
            var height = window.localStorage.getItem("oriHeight");
            var width = window.localStorage.getItem("oriWidth") * 0.8;
            if (height > 700){
                height = 270;
            } else {
                height = 230;
            }
            var dialog = $("#settingSignOutDialog").dialog({
                width: width, height: height, modal: true, resizable: false
                ,open: function(event, ui) { $('.ui-widget-overlay').bind('click', function(){ $("#settingSignOutDialog").dialog('close'); }); }
            });
            window.localStorage.setItem("openSettingSignoutDialog", true);
        	dialog.prev(".ui-dialog-titlebar").css("background","#5E5E5E");
            dialog.prev(".ui-widget-header").css("font-weight","normal");
        },
        
        /*
        	onClearHistoryAction(): clear all history action
        */
        onClearHistoryAction: function(e){
            //console.log("================= onClearHistoryAction()");            
            $("#delAllDialog").dialog({
                modal: true, resizable: false,
                buttons: {
                    "Delete all": function() {
                    	$( this ).dialog( "close" );
                        var url = app.historyService.getDeleteAllRowsURL(window.localStorage.getItem("appToken"));
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
                                app.historyService.viewModel.set("strNumOfRecord", 0);
                                app.historyService.removeAllHistoryList(); 
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                               console.log("============ onClearHistoryAction(): ERROR=" + errorThrown);
                            }
                        });        
                    },
                    Cancel: function() {
                      $( this ).dialog( "close" );
                    }
                }
            });
            
                
        }
        
    });
    
    /*
    	Declare historyService
    */
    app.historyService = {
        /*
        	Remove all the historyList 
        */        
        removeAllHistoryList: function(){
            //console.log("================= removeAllHistoryList()");
            var list = $('#historyList').data('kendoMobileListView');
            list.dataSource.data([]);
            list.refresh();
        },
        
        
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
            var arrAdsDuration = $.parseJSON(window.localStorage.getItem("strArrAdsDuration"));
            var length = arrAdsImg.length;
            
            var index = 0, temp = 0, imgSrc;                    
            setInterval(function() {
            	index += 1;
                temp = index % length;
                imgSrc = arrAdsImg[temp];
                $('#imgHistory').attr('src', imgSrc);
                $('#imgHistory').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, (arrAdsDuration[temp] * 1000));
             
            
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
                var url = window.localStorage.getItem("logoutWS");
                url = url.replace("{environment}", window.localStorage.getItem("environment"));
                url = url.replace("{token}", window.localStorage.getItem("appToken"));
                url = url.replace("{authenticationCode}", authenticationCode);
                //console.log("signoutBtn, url=" + url);
                $.ajax({
                    type: "GET",
                    url: url,
                    data: "{}",
                    headers: {'Accept': 'application/json'},
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
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
            app.historyService.closeDialog();
            app.historyService.closeViewport();
            $('#errorHistoryDiv').hide();
            
            /*
            	Show the historyList            
            */
            var appToken = window.localStorage.getItem("appToken");
            var url = app.historyService.getURL(appToken);
            //console.log("url=" + url);
                        
            app.events = {
                dragging: function(e) {
                    //console.log("=============== dragging()");
                    var left = e.sender.element.position().left;
                    if (left <= 0) {
                        e.sender.element.css("left", "0");
                    } 
                    var right = e.sender.element.position().right;
                    if (right <= 0) {
                        e.sender.element.css("right", "0");
                    }  
                },
                dragend: function(e) {
                    //console.log("==================== dragend()");
                    var el = e.sender.element;
                    // get the listview width 
                    var width = $("ul").width();
                    // set a threshold of 75% of the width
                    var threshold = (width * .25);          
                    // if the item is less than 75% of the way across, slide it out
                    if (Math.abs(el.position().left) > threshold) {
                        kendo.fx(el).slideIn("right").duration(500).reverse();
                    } else {
                        kendo.fx(el).slideIn("left").duration(500).reverse();  
                        //el.animate({ left: 0 });
                    }
                },
                swipe: function(e) {
                    //console.log("============== swipe()");  
                    var del = e.sender.element;
                    if (e.direction === "left") {
                        kendo.fx(del).slideIn("right").duration(500).reverse();
                    } else {
                        kendo.fx(del).slideIn("left").duration(500).reverse();  
                    }
                },
                tap: function(e) {
                    console.log("========== tap()");  
                    // make sure the initial touch wasn't on the archive button
                    var initial = e.touch.initialTouch;
                    var target = e.touch.currentTarget;
                    var strInitial = initial.toString();
                    
                    // if we are tapping outside the archive area, cancel the action
                    if (initial === target || (strInitial.indexOf("Label") > -1)) {
                        // get the closest item and slide it back in
                        var item = e.sender.element.siblings();
                        item.css({ left: 0 });
                        kendo.fx(item).slideIn("left").duration(500).play();
                    } else {
                        /*
                        	Call the ws to delete the current index record
                        */
                        var index = e.sender.element.closest("li").index();
                        //console.log("index=" + index);
                        var id = $('#historyList').data('kendoMobileListView').dataSource.view()[index].Id;
                        //console.log("id=" + id);
                        var url = app.historyService.getDeleteOneRowURL(appToken, id);
                        var numOfRecord = app.historyService.viewModel.get("strNumOfRecord");
                        numOfRecord -= 1;
                        app.historyService.viewModel.set("strNumOfRecord", numOfRecord);
                        
                        $.ajax({
                            type: "DELETE",
                            url: url,
                            data: "{}",
                            headers: {'Accept': 'application/json'},
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function(response) {
                                console.log("============ deleteOneRow(): SUCCESS"); 
                                e.sender.element.closest("li").addClass("collapsed");
                                //app.historyService.refreshHistoryList();
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                console.log("============ deleteOneRow(): ERROR");
                            }
                        });
                        
                        
                    }
                    e.event.preventDefault();
                    e.event.stopPropagation();
                }
            };
            
            
            /*
            	Call & parse the web service
            */
            $.ajax({
                type: "GET",
                url: url,
                data: "{}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                timeout : '30000', //timeout = 30 seconds
                beforeSend : function() {
                	$("#loader_history").show(); //show loader            
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("============ showQueryResult(): ERROR");
                    $("#loader_history").hide(); //hide loader 
                    $('#errorHistoryDiv').show();
                },
                success: function(response) {
                	//console.log("============ showQueryResult(): SUCCESS");
                    
                    responseJSON = response;
                    var arrHistoryList = "[]";
                	//Parse response data
                    if (responseJSON === null)
                    	arrHistoryList = "[]";
                    var cargoReceiptReportRequests = responseJSON.CargoReceiptReportRequests;
                    if (cargoReceiptReportRequests === null || cargoReceiptReportRequests === '[]' || cargoReceiptReportRequests.length === 0)
                        arrHistoryList = "[]";
                    
                    arrHistoryList = app.historyService.parseJSONdata(cargoReceiptReportRequests);
                    //console.log("arrHistoryList=" + arrHistoryList);
                    arrHistoryList = $.parseJSON(arrHistoryList);
                    
                	$("#historyList").kendoMobileListView({
                        dataSource: arrHistoryList,
                        template: $("#history-lw-template").html(),
                        fixedHeaders: true                
                    });
                    
                    $("#loader_history").hide(); //hide loader                     
                }
            });
            
		},
          
        /*
        	closeViewport(): close the current viewport
        */
        closeViewport: function(){
            $("#ext-viewport").hide();
            if (typeof(Ext.Viewport) !== "undefined" && Ext.Viewport !== null &&
            	    typeof(Ext.Viewport.getActiveItem()) !== "undefined" && Ext.Viewport.getActiveItem() !== null){
            	Ext.Viewport.remove(Ext.Viewport.getActiveItem(), true);                 
            }     
        },
        
        /*
        	closeDialog(): close the current dialog
        */
        closeDialog: function(){
            if(window.localStorage.getItem("openSettingSignoutDialog") === 'true'){
                window.localStorage.setItem("openSettingSignoutDialog", false);
                $('#settingSignOutDialog').dialog('close');
            }
        },
        
        /*
        	get WS url 
        */
        getURL: function(appToken){
            var url = window.localStorage.getItem("historyListWS");
            url = url.replace("{environment}", window.localStorage.getItem("environment"));
            url = url.replace("{token}", appToken);
            return url;
        },
        
        
        /*
        	get WS delete one row url 
        */
        getDeleteOneRowURL: function(appToken, id){
            var url = window.localStorage.getItem("deleteOneRowWS");
            url = url.replace("{environment}", window.localStorage.getItem("environment"));
            url = url.replace("{token}", appToken);
            url = url.replace("{id}", id);
            return url;
        },
        
        
        /*
        	get WS url 
        */
        getDeleteAllRowsURL: function(appToken){
            var url = window.localStorage.getItem("deleteAllRowsWS");
            url = url.replace("{environment}", window.localStorage.getItem("environment"));
            url = url.replace("{token}", appToken);
            return url;
        },
        
        
        /*
        	parseJSONdata() function: parse string to json array string
        */
        parseJSONdata: function(cargoReceiptReportRequests){
            app.historyService.viewModel.set("strNumOfRecord", cargoReceiptReportRequests.length);
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
