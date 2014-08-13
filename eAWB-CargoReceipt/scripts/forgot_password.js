(function (global) {
    var ForgotPasswordViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare ForgotPasswordViewModel
    */
    ForgotPasswordViewModel = kendo.data.ObservableObject.extend({
        displayUser: true,
        
        /*
        	show the setting dialog
        */
    	showSettingDialog: function(){
        	//console.log("================= showSettingDialog()");   
            var dialog = $("#settingDialog").dialog({
               width: 230, height: 255, modal: true, resizable: false
            });
            dialog.prev(".ui-dialog-titlebar").css("background","#5E5E5E");
            dialog.prev(".ui-widget-header").css("font-weight","normal");            
        },
        
        
        /*
        	do the signin action
        */
        onSignInAction: function(){
        	//console.log("================= onSignInAction()");	
            app.application.navigate('#login');
        },
        
        
        /*
        	do the click action of linc user type
        */
        onLincDivAction_Forgot: function(){
            //console.log("================= onLincDivAction()");
            $('#linc_Forgot').attr("style", 'cursor: pointer; float: left; line-height:200%; margin-left: 10%; background-image: url(styles/images/bg_checked.png); width: 120px;');
            $('#lincCheckbox_Forgot').attr("src", "styles/images/checked.png");
            $('#user_Forgot').attr("style", "cursor: pointer; float: right; margin-right: 10%; line-height:200%; background-image: url(styles/images/bg_uncheck.png); width: 120px;");
            $('#userCheckbox_Forgot').attr("src", "styles/images/uncheck.png");
            app.loginService.viewModel.set("displayUser", false);
            $('#txtCompanyId_Forgot').css('display', 'none');
            $('#txtDummy_Forgot').css("display","inline");
            $('#txtDummy_Forgot').css("visibility","hidden");
        },
        
        
        /*
        	do the click action of user type
        */
        onUserDivAction_Forgot: function(){
            //console.log("================= onUserDivAction()");   
            $('#linc_Forgot').attr("style", "cursor: pointer; float: left; line-height:200%; margin-left: 10%; background-image: url(styles/images/bg_uncheck.png); width: 120px;");
            $('#lincCheckbox_Forgot').attr("src", "styles/images/uncheck.png");
            $('#user_Forgot').attr("style", 'cursor: pointer; float: right; margin-right: 10%; line-height:200%; background-image: url(styles/images/bg_checked.png); width: 120px;');
            $('#userCheckbox_Forgot').attr("src", "styles/images/checked.png");
            app.loginService.viewModel.set("displayUser", true);
            $('#txtCompanyId_Forgot').attr("style", "display: inline-block; margin-top: 1.5%;");
            $('#txtDummy_Forgot').css("display","none");
            
        }
    });
    
    /*
    	Declare forgotPasswordViewModel
    */
    app.forgotPasswordViewModel = {
        
        /*
        	init(): set up the view at the first time loaded
        */        
        init: function(){
            //console.log("================= query.js,init()");
            
            app.loginService.viewModel.set("displayUser", true); 
            
            /*
            	Set advertisement
            */            
            var advertiseIMG = window.localStorage.getItem("advertiseIMG");
            var advertiseURL = window.localStorage.getItem("advertiseURL");
            $('#imgForgotPassword').attr('src', advertiseIMG);
            $('#imgForgotPassword').click(function(e) {
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
                $('#imgForgotPassword').attr('src', imgSrc);
                $('#imgForgotPassword').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, 5000);
			
            
            /*
            	Do the action of setting dialog
            */
            $("#helpBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
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
            $("#signinBtn").on("click", function(){ 
                $('#settingDialog').dialog('close');
                app.application.navigate('#login');
            });
            
            
        }, 
        
        /*
        	show() function
        */        
        show: function () {
            //console.log("================= query.js,show()"); 
		},
        
        viewModel: new ForgotPasswordViewModel()        
        
    };
    
})(window);
