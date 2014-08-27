(function (global) {
    var QueryViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare QueryViewModel
    */
    QueryViewModel = kendo.data.ObservableObject.extend({
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
        	validate the air waybill number
        */
        validateInput: function(){  
            var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
            if($("#awbPrefix").val().length === 3 && $("#awbSuffix").val().length === 8 && 
            	numberRegex.test($('#awbPrefix').val()) && numberRegex.test($('#awbSuffix').val())){
                $('#enterMsg').show();
            	$('#errorAWBMsg').hide();
                return true;
            } else {
                $('#enterMsg').hide();
            	$('#errorAWBMsg').show();
                return false;
            }
        },
        
        
        /*
        	onQueryAction(): do the query action
        */
        onQueryAction: function(){
        	//console.log("================= onQueryAction()");   
            
            var validate = app.queryService.viewModel.validateInput(); 
            var param = "?awbPrefix=" +  $('#awbPrefix').val() + "&awbSuffix=" + $('#awbSuffix').val();
            if (validate){
            	app.application.navigate('#query_result' + param, 'slide:right');
            }
        }
    });
    
    /*
    	Declare queryService
    */
    app.queryService = {
        
        /*
        	init(): set up the view at the first time loaded
        */        
        init: function(){
            //console.log("================= query.js,init()");
            
            $('#enterMsg').show();
            $('#errorAWBMsg').hide();
            
            /*
            	Set advertisement
            */    
            var advertiseIMG = window.localStorage.getItem("advertiseIMG");
            var advertiseURL = window.localStorage.getItem("advertiseURL");
            $('#imgQuery').attr('src', advertiseIMG);
            $('#imgQuery').click(function(e) {
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
                $('#imgQuery').attr('src', imgSrc);
                $('#imgQuery').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, (arrAdsDuration[temp] * 1000));		
            
            /*
            	Do the action of setting signout dialog
            */
            $("#helpBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                var height = parseFloat(window.localStorage.getItem("deviceHeight"));
                if (height > 500)
                	app.application.navigate('#help_tablet'); 
                else
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
            
            /*
            	automatically switch to the 2nd textfield once user inputs 3 digits in the first textfield
            */
            $("#awbPrefix").keyup(function() {
                if ($("#awbPrefix").val().length === 3)
                	$("#awbSuffix").focus();
            });  
            
            /*
            	Hide the error message when the awbPrefix or the awbSuffix get focus
            */
            $("#awbPrefix").focusin(function() {
                $('#enterMsg').show();
            	$('#errorAWBMsg').hide();
            });
            $("#awbSuffix").focusin(function() {
                $('#enterMsg').show();
            	$('#errorAWBMsg').hide();
            });
            
            var height = window.localStorage.getItem("deviceHeight") + "px";
            $("#queryForm").css("height", height);
        }, 
        
        /*
        	show() function
        */        
        show: function () {
            //console.log("================= query.js,show()"); 
		},
        
        viewModel: new QueryViewModel()        
        
    };
    
})(window);
