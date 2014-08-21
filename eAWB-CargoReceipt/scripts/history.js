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
            
        }
    });
    
    /*
    	Declare historyService
    */
    app.historyService = {
     	
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
            }, 5000);
             
            
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
                $('#settingSignOutDialog').dialog('close');
                window.localStorage.setItem("userLoggedIn", false);
                app.application.navigate('#login');
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
            var url = "data/history_data.json";
            $("#historyList").kendoMobileListView({
                dataSource: new kendo.data.DataSource({
                  schema: {
                    data: function(response) {
                    	//Parse response data
                        var responseJSON = $.parseJSON(response);
                        if (responseJSON === null)
                        	return [];
                        
                        var arrHistoryList = app.historyService.parseJSONdata();
                        arrHistoryList = responseJSON;
                        
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
                    	the UI action: swipe & delete the current row
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
                    	Call the ws to delete each row of listview
                    */
                    
                }
            });
		},
        
        
        /*
        	parseJSONdata() function: parse string to json array string
        */
        parseJSONdata: function(){
        	var arrHistoryList = "";
            
            return arrHistoryList;
        },
        
        
        viewModel: new HistoryViewModel()        
        
    };
    
})(window);
