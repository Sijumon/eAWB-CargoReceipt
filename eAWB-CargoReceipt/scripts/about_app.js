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
            var height = window.localStorage.getItem("oriHeight");
            var width = window.localStorage.getItem("oriWidth") * 0.8;
            if (height > 700){
                height = 270;
            } else {
                height = 230;
            }
            var dialog;
            if (userLoggedIn === 'false'){
                dialog = $("#settingDialog").dialog({
                    width: width, height: height, modal: true, resizable: false
                    ,open: function(event, ui) { $('.ui-widget-overlay').bind('click', function(){ $("#settingDialog").dialog('close'); }); }
                });
                window.localStorage.setItem("openSettingDialog", true);
            } else {
                dialog = $("#settingSignOutDialog").dialog({
                    width: width, height: height, modal: true, resizable: false
                    ,open: function(event, ui) { $('.ui-widget-overlay').bind('click', function(){ $("#settingSignOutDialog").dialog('close'); }); }
                });
        		window.localStorage.setItem("openSettingSignoutDialog", true);
            }            
            dialog.prev(".ui-dialog-titlebar").css("background","#5E5E5E");
            dialog.prev(".ui-widget-header").css("font-weight","normal");
        }       
    });
    
    /*
    	Declare aboutAppService
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
                var win = window.open(advertiseURL, '_blank');
                win.focus();
                e.preventDefault();
                e.stopPropagation();
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
                $('#imgAboutApp').attr('src', imgSrc);
                $('#imgAboutApp').click(function(e) {
                    var win = window.open(arrAdsURL[temp], '_blank');
                    win.focus();
                    e.preventDefault();
                    e.stopPropagation();
				});
            }, (arrAdsDuration[temp] * 1000));
            
            /*
            	Do the action of setting & setting signout dialog
            */
            $("#helpBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                var height = parseFloat(window.localStorage.getItem("deviceHeight"));
                if (height > 700)
                	app.application.navigate('#help_tablet'); 
                else
                	app.application.navigate('#help');
            });
            $("#aboutAppBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                app.application.navigate('#about_app');
            });
            $("#aboutCCNBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                app.application.navigate('#about_ccn');
            });
            $("#termConditionBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                app.application.navigate('#term_condition');
            });
            $("#helpBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#help');
            });
            $("#aboutAppBtn_signout").on("click", function(){ 
                $('#settingDialog').dialog('close');
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_app');
            });
            $("#aboutCCNBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_ccn');
            });
            $("#termConditionBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                var height = parseFloat(window.localStorage.getItem("deviceHeight"));
                if (height > 700)
                	app.application.navigate('#term_condition_tablet'); 
                else
                	app.application.navigate('#term_condition');
            });
            $("#signinBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                app.application.navigate('#login');
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
        	showAboutApp() function: show the About App information
        */        
        showAboutApp: function () {
            //console.log("================= showAboutApp");
            app.aboutAppService.closeDialog();
            
            /*
            	Call ws to get the strAboutApp
            */
            var appToken = window.localStorage.getItem("appToken");
            var url = app.aboutAppService.getURL(appToken);
            var strAboutApp = "";
            $.ajax({
                type: "GET",
                url: url,
                headers: {'Accept': 'application/json'},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(response) {
                    var responseJSON = response;
                    strAboutApp = "<div class='label_header'>" + responseJSON.Name + " </div>";
                    strAboutApp += "<div class='label_content'>" + responseJSON.Details + " </div>";
            		$("#aboutAppDiv").html(strAboutApp);
                }
              });
            
		},
                
        /*
        	closeDialog(): close the current dialog
        */
        closeDialog: function(){
        	if (window.localStorage.getItem("openSettingDialog") === 'true'){ 
            	window.localStorage.setItem("openSettingDialog", false);
                $('#settingDialog').dialog('close');
            } 
            if(window.localStorage.getItem("openSettingSignoutDialog") === 'true'){
                window.localStorage.setItem("openSettingSignoutDialog", false);
                $('#settingSignOutDialog').dialog('close');
            }
        },
        
        
        /*
        	get WS url 
        */
        getURL: function(appToken){
            var url = window.localStorage.getItem("aboutAppWS");
            url = url.replace("{environment}", window.localStorage.getItem("environment"));
            url = url.replace("{token}", appToken);
            return url;
        },
        
        viewModel: new AboutAppViewModel()        
        
    };
    
})(window);
