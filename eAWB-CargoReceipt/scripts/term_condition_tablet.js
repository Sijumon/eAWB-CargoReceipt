(function (global) {
    var TermConditionTabletViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare TermConditionTabletViewModel
    */
    TermConditionTabletViewModel = kendo.data.ObservableObject.extend({
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
            var height = $(window).height();
            var width = $(window).width() * 0.8
            if (height > 700){
                height = 270;
            } else {
                height = 244;
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
    	Declare termConditionTabletService
    */
    app.termConditionTabletService = {
        
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
            $('#imgTermConditionTablet').attr('src', advertiseIMG);
            $('#imgTermConditionTablet').click(function(e) {
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
                $('#imgTermConditionTablet').attr('src', imgSrc);
                $('#imgTermConditionTablet').click(function(e) {
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
                var height = parseFloat(window.localStorage.getItem("deviceHeight"));
                if (height > 700)
                	app.application.navigate('#term_condition_tablet'); 
                else
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
        	showTermCondition() function: show the Term&Condition information
        */
        showTermCondition: function () {
            //console.log("================= showTermCondition");
            app.termConditionTabletService.closeDialog();
            
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
                    
                    var index = strTermCondition.length/3;
                    var strTermsConditions_part1 = strTermCondition.substring(0, index + 428).trim();
                    var strTermsConditions_part2 = strTermCondition.substring(index + 429, 3 * index - 1155).trim();
                    var strTermsConditions_part3 = strTermCondition.substring(3 * index - 1154);
                    $("#termConditionDiv_part1").html(strTermsConditions_part1);
                    $("#termConditionDiv_part2").html(strTermsConditions_part2);
                    $("#termConditionDiv_part3").html(strTermsConditions_part3);
                    
                    $('.swiper-container-termCondition_tablet').swiper({
                        pagination: '.pagination_termCondition_tablet',
            			paginationClickable: true,
                        mode: 'horizontal'
                    });
                    
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
        
        viewModel: new TermConditionTabletViewModel()        
        
    };
    
})(window);
