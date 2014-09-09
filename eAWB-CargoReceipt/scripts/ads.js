(function (global) {
    var app = global.app = global.app || {};
    
    /*
    	Get the device information
    */
    document.addEventListener('deviceready', function () {
        app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
        navigator.splashscreen.hide();
        
        //console.log("==ads.js, deviceready()");
        //console.log("window.localStorage.getItem(\"userLoggedIn\")=" + window.localStorage.getItem("userLoggedIn"));
        /*
        	Get device info
        */
        var deviceId = device.uuid;
        var deviceOs = device.platform;
        window.localStorage.setItem("deviceId", deviceId);
        window.localStorage.setItem("deviceOs", deviceOs);
        window.localStorage.setItem("oriWidth", $(window).width());
        window.localStorage.setItem("oriHeight", $(window).height());
        window.localStorage.setItem("deviceHeight", $(window).height());
        window.localStorage.setItem("environment", "apidev"); 
        window.localStorage.setItem("openSettingDialog", false);
        window.localStorage.setItem("openSettingSignoutDialog", false);
        
        /*
        	Setup the Sencha touch application
        */
        Ext.application({
            //Do nothing
        });    
        
        /*
        	Get token of device
        */                    
        var appToken;
        appToken = window.localStorage.getItem("appToken");
        //console.log("===ad.js, appToken=" + appToken);
        var url = "http://apidev.ccnhub.com/api/activation/v1/productCode=cargoreceipt/operatingsys=" + deviceOs + "/deviceid=" + deviceId;
        //console.log("url=" + url);
        if (appToken === null || appToken.toString() === "null") { 
        	$.ajax({
                type: "GET",
                url: url,
                contentType: "application/json;",                
                headers: {'Accept': 'application/json'},
                timeout : '60000', //timeout = 60 seconds
                dataType: "json",
                error: function(xhr, ajaxOptions, thrownError) {
                   console.log("error status: " + xhr.status);
                },
                success: function(response) {
            		appToken = response.Token;	
            		window.localStorage.setItem("appToken", appToken);
                    //console.log("===ad.js, after call ws, appToken=" + appToken);
                    app.application.navigate('#login', 'slide:right'); 
                }
            });
        } else {
            if (window.localStorage.getItem("userLoggedIn") === 'true')
            	app.application.navigate('#query', 'slide:right');  
            else
            	app.application.navigate('#login', 'slide:right');  
        }
        
        
    }, false);

    
        
})(window);
