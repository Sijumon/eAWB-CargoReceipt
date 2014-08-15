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
                   width: 230, height: 255, modal: true, resizable: false
                });     
            dialog.prev(".ui-dialog-titlebar").css("background","#5E5E5E");
            dialog.prev(".ui-widget-header").css("font-weight","normal");
        },
        
        
        /*
        	validate the air waybill number
        */
        validateInput: function(){            
            if($("#firstLetter").val().length === 3 && $("#secondLetter").val().length === 8){
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
            if (validate){
            	app.application.navigate('#query_result', 'slide:right');
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
            var length = arrAdsImg.length;
            
            var index = 0, temp, imgSrc;                    
            setInterval(function() {
            	index += 1;
                temp = index % length;
                imgSrc = arrAdsImg[temp];
                $('#imgQuery').attr('src', imgSrc);
                $('#imgQuery').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, 5000);		
            
            /*
            	Do the action of setting dialog
            */
            $("#helpBtn").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#help');
            });
            $("#aboutAppBtn").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_app');
            });
            $("#aboutCCNBtn").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_ccn');
            });
            $("#termConditionBtn").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#term_condition');
            });
            $("#signinBtn").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#login');
            });
            $("#signoutBtn").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                window.localStorage.setItem("userLoggedIn", false);
                app.application.navigate('#login');
            });
            
            /*
            	automatically switch to the 2nd textfield once user inputs 3 digits in the first textfield
            */
            $("#firstLetter").keyup(function() {
                if ($("#firstLetter").val().length === 3)
                	$("#secondLetter").focus();
            });
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
