(function (global) {
    var LoginViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare LoginViewModel
    */
    LoginViewModel = kendo.data.ObservableObject.extend({
        displayUser: false,
        
        /*
        	show the setting dialog
        */
    	showSettingDialog: function(){
        	//console.log("================= showSettingDialog()");   
            var height = $(window).height();
            var width = $(window).width() * 0.8
            if (height > 700){
                height = 270;
            } else {
                height = 244;
            }
            var dialog = $("#settingDialog").dialog({
               width: width, height: height, modal: true, resizable: false
            });
            window.localStorage.setItem("openSettingDialog", true);
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
            var url = app.loginService.getURL(appToken, userType);
            //console.log("validateUserCredential(), url=" + url);
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
                    var authenticationCode = response.AuthenticationCode;
                    if (authenticationCode !== null && authenticationCode !== '' && 
                    		authenticationCode.length > 0){
                        $('#errorMsg').hide();
                        $('#textMsg').show();
                        window.localStorage.setItem("userLoggedIn", true);
                        window.localStorage.setItem("authenticationCode", authenticationCode);        
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
    	Declare loginService
    */
    app.loginService = {
        
        /*
        	get WS url 
        */
        getURL: function(appToken, userType){
            var url;
            //TODO: use the same method to login
            //if (userType){
            //    url = window.localStorage.getItem("lincUserLoginWS");
            //    url = url.replace("{environment}", window.localStorage.getItem("environment"));
            //    url = url.replace("{token}", appToken);
            //    url = url.replace("{companyID}", $("#txtCompanyId").val().trim());
            //    url = url.replace("{email}", $("#txtEmail").val().trim());
            //    url = url.replace("{token}", $("#txtPassword").val().trim());
            //} else {
                url = window.localStorage.getItem("lincLoginWS");
            	url = url.replace("{environment}", window.localStorage.getItem("environment"));
                url = url.replace("{token}", appToken);
                url = url.replace("{email}", $("#txtEmail").val().trim());
            //    url = url.replace("{token}", $("#txtPassword").val().trim());
            //}
            
            return url;
        },
        
        /*
        	init(): set up the view at the first time loaded
        */        
        init: function(){
            //console.log("================= query.js,init()");
            
            window.localStorage.setItem("userLoggedIn", false);
            app.loginService.viewModel.set("displayUser", false);   
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
            var param = "?f=" + datetime + "&t=" + datetime + "&r=1024x768&o=Portrait&token=";
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
                    var advertiseDuration = responseJSON[0].Duration;
                    $('#imgHome').attr('src', advertiseIMG);
                    $('#imgHome').click(function(e) {
                        window.location.href = advertiseURL;
					});
                    
                    var arrAdsImg = [], arrAdsURL = [], strArrAdsImg = "", strArrAdsURL = "",
                    	arrAdsDuration = [], strArrAdsDuration = "";
                    var length = responseJSON.length;
                    $.each(responseJSON, function(index,value) {
                    	arrAdsImg.push(value.Url);
                        strArrAdsImg += "\"" + value.Url + "\",";
                        arrAdsURL.push(value.Redirect);
                        strArrAdsURL += "\"" + value.Redirect + "\",";
                        arrAdsDuration.push(value.Duration);
                        strArrAdsDuration += "\"" + value.Duration + "\",";
                    });
                    strArrAdsImg = strArrAdsImg.substring(0,strArrAdsImg.length - 1);
                    strArrAdsImg = "[" + strArrAdsImg + "]";
                    strArrAdsURL = strArrAdsURL.substring(0,strArrAdsURL.length - 1);
                    strArrAdsURL = "[" + strArrAdsURL + "]";
                    strArrAdsDuration = strArrAdsDuration.substring(0,strArrAdsDuration.length - 1);
                    strArrAdsDuration = "[" + strArrAdsDuration + "]";
                                            
                    //Set to local storage
                    //window.localStorage.setItem("advertiseURL", advertiseURL);
                    window.localStorage.setItem("advertiseIMG", advertiseIMG);
                    window.localStorage.setItem("advertiseURL", advertiseURL);
                    window.localStorage.setItem("advertiseDuration", advertiseDuration);
                    window.localStorage.setItem("strArrAdsDuration", strArrAdsDuration);
                    window.localStorage.setItem("strArrAdsImg", strArrAdsImg);
                    window.localStorage.setItem("strArrAdsURL", strArrAdsURL);
                    
                    
                    //Show footer info: href & show the ads for each 5 seconds
                    //$('#link').attr('href', advertiseURL);
                    var index = 0, temp = 0, imgSrc                    
                    setInterval(function() {
                    	index += 1;
                        temp = index % length;
                        imgSrc = arrAdsImg[temp];
                        $('#imgHome').attr('src', imgSrc);
                        $('#imgHome').click(function(e) {
                            window.location.href = arrAdsURL[temp];
						});
                    }, (arrAdsDuration[temp] * 1000));
                }
            });
            
            /*
            	Do the action of setting dialog
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
            
            /*
            	Set height of the loginForm div
            */
            var deviceHeight = window.localStorage.getItem("deviceHeight");
            deviceHeight = (deviceHeight) * 0.9;
            //console.log("deviceHeight=" + deviceHeight);
            window.localStorage.setItem("deviceHeight", deviceHeight);
            $("#loginForm").css("height", deviceHeight + "px");
                        
            /*
            	Parse the xml and store the ws link
            */
            app.loginService.parseXMLtoURL();
        }, 
        
        /*
        	show() function
        */        
        show: function () {
            //console.log("================= login.js,show()");
            app.loginService.closeDialog();
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
        	parseXMLtoURL() function: parse XML file and store the ws url link
        */        
        parseXMLtoURL: function () {
            //console.log("================= login.js,parseXMLtoURL()");    
            $.ajax({
                type: "GET",
                url: "config/web_services.json",
                contentType: "application/json;",                
                headers: {'Accept': 'application/json'},
                dataType: "json",
                success: function(response)
                {
                    window.localStorage.setItem("advertisementWS", response[0].Url);
                    window.localStorage.setItem("lincLoginWS", response[1].Url);
                    window.localStorage.setItem("lincUserLoginWS", response[2].Url); 
                    window.localStorage.setItem("logoutWS", response[3].Url);
                    window.localStorage.setItem("historyListWS", response[4].Url);
                    window.localStorage.setItem("deleteOneRowWS", response[5].Url);
                    window.localStorage.setItem("deleteAllRowsWS", response[6].Url);
                    window.localStorage.setItem("getCargoReportWS", response[7].Url);
                    window.localStorage.setItem("aboutAppWS", response[8].Url);
                    window.localStorage.setItem("aboutCCNWS", response[9].Url);
                    window.localStorage.setItem("termConditionWS", response[10].Url);
                }
            });
            
		},
        
        viewModel: new LoginViewModel()        
        
    };
    
})(window);
