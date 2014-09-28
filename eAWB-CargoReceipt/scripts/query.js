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
            var height = window.localStorage.getItem("oriHeight");
            var width = window.localStorage.getItem("oriWidth") * 0.8;
            if (height > 700){
                height = 270;
            } else {
                height = 230;
            }
            var dialog = $("#settingSignOutDialog").dialog({
                width: width, height: height, modal: true, resizable: false
                ,open: function(event, ui) { $('.ui-widget-overlay').bind('click', function(){ $("#settingSignOutDialog").dialog('close'); }); }
            });     
            window.localStorage.setItem("openSettingSignoutDialog", true);
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
        onQueryAction: function(e){
        	//console.log("================= onQueryAction()");   
            
            var validate = app.queryService.viewModel.validateInput(); 
            var param = "?awbPrefix=" +  $('#awbPrefix').val() + "&awbSuffix=" + $('#awbSuffix').val();
            if (validate){
                /*
                    close the keyboard 
                */
                $('awbPrefix').blur();
                $('awbSuffix').blur();
                var field = document.createElement('input');
                field.setAttribute('type', 'text');
                document.body.appendChild(field);
                setTimeout(function() {
                    field.focus();
                    setTimeout(function() {
                        field.setAttribute('style', 'display:none;');
                    }, 50);
                }, 50);
                
                //app.queryService.hideKeyboard();
            	
                /*
                    Move to query result view
                */
                $(e.target).attr('href', '#query_result' + param);
            }
        }
    });
    
    /*
    	Declare queryService
    */
    app.queryService = {
        
        /*
            hideKeyboard(): hide the keyboard
        */
        hideKeyboard: function(){
            setTimeout(function() {
                //creating temp field
                var field = document.createElement('input');
                field.setAttribute('type', 'text');
                //hiding temp field from peoples eyes
                //-webkit-user-modify is nessesary for Android 4.x
                field.setAttribute('style', 'position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;');
                document.body.appendChild(field);

                //adding onfocus event handler for out temp field
                field.onfocus = function(){
                  //this timeout of 200ms is nessasary for Android 2.3.x
                  setTimeout(function() {

                    field.setAttribute('style', 'display:none;');
                    setTimeout(function() {
                      document.body.removeChild(field);
                      document.body.focus();
                    }, 14);

                  }, 200);
                };
                //focusing it
                field.focus();

            }, 50);    
        },
        
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
                        //console.log("response=" + JSON.stringify(response));
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
            $("#awbPrefix").keyup(function(e) {
                if ($("#awbPrefix").val().length === 3){ 
                    if (window.localStorage.getItem("deviceOs") === 'iOS'){
                        //Do nothing
                    } else {
                        $("#awbPrefix").blur();
                    	$("#awbSuffix").focus();     
                    }                    
                }    
            });  
            $("#awbSuffix").keyup(function(e) {
                if ($("#awbSuffix").val().length === 8){
                    $("#awbSuffix").blur();
                    $("#queryBtn").focus(); 
                }    
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
            app.queryService.closeDialog();
            app.queryService.closeViewport();
		},
               
        /*
        	closeViewport(): close the current viewport
        */
        closeViewport: function(){
            $("#ext-viewport").hide();
            Ext.Viewport.remove(Ext.Viewport.getActiveItem(), true);    
        },
        
        /*
        	closeDialog(): close the current dialog
        */
        closeDialog: function(){
            if(window.localStorage.getItem("openSettingSignoutDialog") === 'true'){
                window.localStorage.setItem("openSettingSignoutDialog", false);
                $('#settingSignOutDialog').dialog('close');
            }
        },
        
        viewModel: new QueryViewModel()        
        
    };
    
})(window);
