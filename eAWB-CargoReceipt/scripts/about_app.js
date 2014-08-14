(function (global) {
    var AboutAppViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	//Declare AboutAppViewModel
    */
    AboutAppViewModel = kendo.data.ObservableObject.extend({
        /*
        	goHome(): go to home view of the application
        */
        goHome: function(){
            var userLoggedIn = window.localStorage.getItem("userLoggedIn");
            if (userLoggedIn === 'false')
            	app.application.navigate('#login', 'slide:right');
            else 
            	app.application.navigate('#query', 'slide:right'); 
        },
        
        /*
        	showSettingDialog(): show the setting dialog
        */
        showSettingDialog: function(){
            var userLoggedIn = window.localStorage.getItem("userLoggedIn");
            var dialog;
            if (userLoggedIn){
                dialog = $("#settingDialog").dialog({
                   width: 230, height: 255, modal: true, resizable: false
                });
            } else {
                dialog = $("#settingSignOutDialog").dialog({
                   width: 230, height: 255, modal: true, resizable: false
                });
            }            
            dialog.prev(".ui-dialog-titlebar").css("background","#5E5E5E");
            dialog.prev(".ui-widget-header").css("font-weight","normal");
        }       
    });
    
    /*
    	//Declare aboutAppService
    */
    app.aboutAppService = {
     	
        /*
        	//init(): set up the view at the first time loaded
        */        
        init: function(){
            //console.log("================= init");
            
            /*
            	//Set advertisement
            */            
            var advertiseIMG = window.localStorage.getItem("advertiseIMG");
            var advertiseURL = window.localStorage.getItem("advertiseURL");
            $('#imgAboutApp').attr('src', advertiseIMG);
            $('#imgAboutApp').click(function(e) {
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
                $('#imgAboutApp').attr('src', imgSrc);
                $('#imgAboutApp').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, 5000);
            
            /*
            	Do the action of setting dialog
            */
            $("#helpBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#help');
            });
            $("#aboutAppBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_app');
            });
            $("#aboutCCNBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_ccn');
            });
            $("#termConditionBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#term_condition');
            });
            $("#signinBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#login');
            });
            $("#signoutBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#login');
            });
        }, 
        
        /*
        	showAboutApp() function: show the About App information
        */        
        showAboutApp: function () {
            //console.log("================= showAboutApp");
            
            /*
            	Call ws to get the strAboutApp
            */
            var appToken = window.localStorage.getItem("appToken");
            var url = "http://apidev.ccnhub.com/api/product/v1/token=" + appToken;
            var strAboutApp;
            $.ajax({
                type: "GET",
                url: url,
                headers: {'Accept': 'application/json'},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(response) {
                    var responseJSON = response;
                    strAboutApp = "<div class='title'>" + responseJSON.Name + " </div>";
                    strAboutApp += "<div class='content_body'>" + responseJSON.Details + " </div>";
            		//console.log("strAboutApp=" + strAboutApp);    
                    $("#aboutAppDiv").html(strAboutApp);
                }
              });
            
		},
        
        viewModel: new AboutAppViewModel()        
        
    };
    
})(window);
