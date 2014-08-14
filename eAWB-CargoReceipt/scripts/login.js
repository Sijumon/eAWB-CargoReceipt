(function (global) {
    var LoginViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare LoginViewModel
    */
    LoginViewModel = kendo.data.ObservableObject.extend({
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
        	move to the forgot_password page
        */
        onForgotPasswordAction: function(e){
            app.application.navigate('#forgot_password', 'slide:right');
        },
        
        
        /*
        	move to the term_condition page
        */
        onTermConditionAction: function(e){
            app.application.navigate('#term_condition', 'slide:right');
        },
        
        
        /*
        	do the signin action
        */
        onSignIn: function(){
        	//console.log("================= onSignIn()");
            
            //Do validation
            
            app.application.navigate('#query', 'slide:right');
        },
        
        
        /*
        	do the click action of linc user type
        */
        onLincDivAction: function(){
            //console.log("================= onLincDivAction()");
            $('#linc').attr("style", 'cursor: pointer; float: left; line-height:200%; margin-left: 10%; background-image: url(styles/images/bg_checked.png); width: 120px;');
            $('#lincCheckbox').attr("src", "styles/images/checked.png");
            $('#user').attr("style", "cursor: pointer; float: right; margin-right: 10%; line-height:200%; background-image: url(styles/images/bg_uncheck.png); width: 120px;");
            $('#userCheckbox').attr("src", "styles/images/uncheck.png");
            app.loginService.viewModel.set("displayUser", false);
            $('#txtCompanyId').css('display', 'none');
            $('#txtDummy').css("display","inline");
            $('#txtDummy').css("visibility","hidden");
        },
        
        
        /*
        	do the click action of user type
        */
        onUserDivAction: function(){
            //console.log("================= onUserDivAction()");   
            $('#linc').attr("style", "cursor: pointer; float: left; line-height:200%; margin-left: 10%; background-image: url(styles/images/bg_uncheck.png); width: 120px;");
            $('#lincCheckbox').attr("src", "styles/images/uncheck.png");
            $('#user').attr("style", 'cursor: pointer; float: right; margin-right: 10%; line-height:200%; background-image: url(styles/images/bg_checked.png); width: 120px;');
            $('#userCheckbox').attr("src", "styles/images/checked.png");
            app.loginService.viewModel.set("displayUser", true);
            $('#txtCompanyId').attr("style", "display: inline-block; margin-top: 1.5%;");
            $('#txtDummy').css("display","none");
            
        }
    });
    
    /*
    	//Declare queryService
    */
    app.loginService = {
        
        /*
        	init(): set up the view at the first time loaded
        */        
        init: function(){
            //console.log("================= query.js,init()");
            
            app.loginService.viewModel.set("displayUser", true); 
            
            /* 
            	Set advertisement
            
			*/
            var appToken = window.localStorage.getItem("appToken");
            var url = "http://ccnutilitydev.ccnhub.com/advertisement/GetImages/?f=23042014&t=20052014&r=1024x768&o=Portrait&tokenId=";
            url += appToken; 
            //console.log("=== home page, url=" + url);
        	$.ajax({
                type: "GET",
                url: url,
                data: "{}",
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function(response) {
                    //console.log("=== home page, get the ads success");
                    var responseJSON = $.parseJSON(response);
            		var advertiseIMG = responseJSON[0].Url;
                    var advertiseURL = responseJSON[0].Redirect;
                    $('#imgHome').attr('src', advertiseIMG);
                    $('#imgHome').click(function(e) {
                        window.location.href = advertiseURL;
					});
                    
                    var arrAdsImg = [], arrAdsURL = [], strArrAdsImg = "", strArrAdsURL = "";
                    var length = responseJSON.length;
                    $.each(responseJSON, function(index,value) {
                    	arrAdsImg.push(value.Url);
                        strArrAdsImg += "\"" + value.Url + "\",";
                        arrAdsURL.push(value.Redirect);
                        strArrAdsURL += "\"" + value.Redirect + "\",";
                    });
                    strArrAdsImg = strArrAdsImg.substring(0,strArrAdsImg.length - 1);
                    strArrAdsImg = "[" + strArrAdsImg + "]";
                    strArrAdsURL = strArrAdsURL.substring(0,strArrAdsURL.length - 1);
                    strArrAdsURL = "[" + strArrAdsURL + "]";
                                            
                    //Set to local storage
                    //window.localStorage.setItem("advertiseURL", advertiseURL);
                    window.localStorage.setItem("advertiseIMG", advertiseIMG);
                    window.localStorage.setItem("advertiseURL", advertiseURL);
                    window.localStorage.setItem("strArrAdsImg", strArrAdsImg);
                    window.localStorage.setItem("strArrAdsURL", strArrAdsURL);
                    
                    //Show footer info: href & show the ads for each 5 seconds
                    //$('#link').attr('href', advertiseURL);
                    var index = 0, temp, imgSrc;                    
                    setInterval(function() {
                    	index += 1;
                        temp = index % length;
                        imgSrc = arrAdsImg[temp];
                        $('#imgHome').attr('src', imgSrc);
                        $('#imgHome').click(function(e) {
                            window.location.href = arrAdsURL[temp];
						});
                    }, 5000);
                }
            });
            
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
        
        viewModel: new LoginViewModel()        
        
    };
    
})(window);
