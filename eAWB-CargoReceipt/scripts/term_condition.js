(function (global) {
    var TermConditionViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	//Declare TermConditionViewModel
    */
    TermConditionViewModel = kendo.data.ObservableObject.extend({
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
            if (userLoggedIn === 'false'){
                dialog = $("#settingDialog").dialog({
                   dialogClass: 'setting_dialog', modal: true, resizable: false
                });
            } else {
                dialog = $("#settingSignOutDialog").dialog({
                   dialogClass: 'setting_signout_dialog', modal: true, resizable: false
                });
            }            
            dialog.prev(".ui-dialog-titlebar").css("background","#5E5E5E");
            dialog.prev(".ui-widget-header").css("font-weight","normal");
        } 
    });
    
    /*
    	//Declare termConditionService
    */
    app.termConditionService = {
        
        /*
        	init(): set up the view at the first time loaded
        */
        init: function(){
            //console.log("================= init");
            
            /*	  
            	Set advertisement
            */
            var advertiseIMG = window.localStorage.getItem("advertiseIMG");
            var advertiseURL = window.localStorage.getItem("advertiseURL");
            $('#imgTermCondition').attr('src', advertiseIMG);
            $('#imgTermCondition').click(function(e) {
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
                $('#imgTermCondition').attr('src', imgSrc);
                $('#imgTermCondition').click(function(e) {
                    window.location.href = arrAdsURL[temp];
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
        	showTermCondition() function: show the Term&Condition information
        */
        showTermCondition: function () {
            //console.log("================= showTermCondition");
            /*
            	Call ws to get the strTermCondition            
            */
            var appToken = window.localStorage.getItem("appToken"); 
            var url = app.termConditionService.getURL(appToken);
            //console.log("showTermCondition(), url=" + url);
            $.ajax({
                type: "GET",
                url: url,
                headers: {'Accept': 'application/json'},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(response) {
                    //console.log("success");
            		var responseJSON = response;
                    var strTermCondition = "";
                    $.each(responseJSON.TermsAndConditions, function(index,value) {
                        strTermCondition += "<div class='label_header'>" + value.Sequence + " " + value.Title + " </div>";
                        if (value.Details != null)
                            strTermCondition += "<div class='label_content'>" + value.Details + " </div>";  
                        strTermCondition += "<br>";
                    });
                    //console.log("strTermCondition=" + strTermCondition);         
                    $("#termConditionDiv").html(strTermCondition);
                }
              });
        	    
		},
        
        /*
        	get WS url 
        */
        getURL: function(appToken){
            var url = window.localStorage.getItem("termConditionWS");
            url = url.replace("{environment}", window.localStorage.getItem("environment"));
            url = url.replace("{token}", appToken);
            return url;
        },
        
        viewModel: new TermConditionViewModel()        
        
    };
    
})(window);
