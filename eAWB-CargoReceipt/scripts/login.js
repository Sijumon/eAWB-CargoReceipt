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
               dialogClass: 'setting_dialog', modal: true, resizable: false
            });
            dialog.prev(".ui-dialog-titlebar").css("background","#5E5E5E");
            dialog.prev(".ui-widget-header").css("font-weight","normal");            
        },
        
        
        /*
        	move to the term_condition page
        */
        onTermConditionAction: function(e){
            app.application.navigate('#term_condition', 'slide:right');
        },
        
        
        /*
        	validate the input form
        */
        validateInput: function(userType){
            if (userType){
                if ($("#txtCompanyId").val().trim() === '' || $("#txtEmail").val().trim() === '' || $("#txtPassword").val().trim() === ''){
                	$('#errorMsg').show();
            		$('#textMsg').hide();
                    return false;
                }
            } else {
                if ($("#txtEmail").val().trim() === '' || $("#txtPassword").val().trim() === '' ){
                	$('#errorMsg').show();
            		$('#textMsg').hide();
                    return false;
                }
            }            
            $('#errorMsg').hide();
            $('#textMsg').show();
            return true;
        },
        
        
        /*
        	validate the user login
        */
        validateUserCredential: function(userType){
            var appToken = window.localStorage.getItem("appToken");
            var url = "http://apidev.ccnhub.com/api/session/v1/login/token=" + appToken;
            if (userType){
            	url += "/companyID=" + $("#txtCompanyId").val().trim() + "/email=" + $("#txtEmail").val().trim() + "/password=" + $("#txtPassword").val().trim();
            } else {
                url += "/email=" + $("#txtEmail").val().trim() + "/password=" + $("#txtPassword").val().trim();
            }
            //console.log("url=" + url);
            /*
            	call the ws to validate user
            */
            $.ajax({
                type: "GET",
                url: url,
                data: "{}",
                headers: {'Accept': 'application/json'},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(response) {
                    if (response.AuthenticationCode !== null && response.AuthenticationCode !== '' && 
                    		response.AuthenticationCode.length > 0){
                        $('#errorMsg').hide();
                        $('#textMsg').show();
                        window.localStorage.setItem("userLoggedIn", true);
                		app.application.navigate('#query', 'slide:right');   
                    } else {
                        $('#errorMsg').show();
                		$('#textMsg').hide();
                    }	     
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                   console.log("============ validateUserCredential(): ERROR");
                }
            });
		},
        
        
        /*
        	do the signin action
        */
        onSignIn: function(){
        	//console.log("================= onSignIn()");
            
            //Do validation
            var userType = app.loginService.viewModel.get("displayUser");
            var validate = app.loginService.viewModel.validateInput(userType);    
            if (validate){
                app.loginService.viewModel.validateUserCredential(userType);                    
            }
        },
        
        
        /*
        	do the click action of linc user type
        */
        onLincDivAction: function(){
            //console.log("================= onLincDivAction()");
            $('#linc').attr('class', 'div_linc_active');
            $('#lincCheckbox').attr("src", "images/checked.png");
            $('#user').attr('class', 'div_user');
            $('#userCheckbox').attr("src", "images/uncheck.png");
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
            $('#linc').attr('class', 'div_linc');
            $('#lincCheckbox').attr("src", "images/uncheck.png");
            $('#user').attr('class', 'div_user_active');
            $('#userCheckbox').attr("src", "images/checked.png");
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
            
            window.localStorage.setItem("userLoggedIn", false);
            app.loginService.viewModel.set("displayUser", true);   
            $('#textMsg').show();
            $('#errorMsg').hide();
            
            /* 
            	Set advertisement            
			*/
            var currentdate = new Date();
            var currentmonth = currentdate.getMonth() + 1;
            if (currentmonth < 10)
            	currentmonth = "0" + currentmonth;
            var datetime = currentdate.getDate().toString() + currentmonth.toString() + currentdate.getFullYear().toString();
            //TODO: for testing
            //datetime = "23042014";
            var param = "?f=" + datetime + "&t=" + datetime + "&r=1024x768&o=Portrait&tokenId=";
            var appToken = window.localStorage.getItem("appToken");
            var url = "http://apidev.ccnhub.com/v1/advertisement/GetImages/" + param + appToken;
            //console.log("=== login.js, url=" + url);
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
            
            /*
            	Set height of the loginForm div
            */
            var deviceHeight = window.localStorage.getItem("deviceHeight");
            deviceHeight = deviceHeight + "px";
            //console.log("deviceHeight=" + deviceHeight);
            $("#loginForm").css("height", deviceHeight);
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
