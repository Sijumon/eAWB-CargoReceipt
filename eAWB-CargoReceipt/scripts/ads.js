(function (global) {
    var app = global.app = global.app || {};
    
    /*
    	Get the device information
    */
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
        
        /*
        	//Get device info
        */
        //var deviceName = device.name;
        var deviceId = device.uuid;
        var deviceOs = device.platform;
        //var deviceOsVersion = device.version;
        window.localStorage.setItem("deviceId", deviceId);
        window.localStorage.setItem("deviceOs", deviceOs);
        
        
        /*
        	//Get token of device
        */                    
        //console.log("deviceId=" + deviceId + ", deviceOs=" + deviceOs);
        var appToken;
        appToken = window.localStorage.getItem("appToken");
        //console.log("appToken=" + appToken);
        var url = "http://apidev.ccnhub.com/api/activation/v1/productCode=flightschedule/operatingsys=" + deviceOs + "/deviceid=" + deviceId;
        //console.log("url=" + url);
        if (appToken == null || appToken.toString() == "null") { 
            //console.log("Call ws to get the token");
                        
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
                    //console.log("GetDeviceId success");
            		appToken = response.Token;	
            		//console.log("appToken=" + appToken);
                    //appToken = "831a1d33-1c54-4af6-b713-6c3b2c219221"; //TODO: TEST WHEN WS FAIL
                    //console.log("appToken=" + appToken);
            		window.localStorage.setItem("appToken", appToken);
                }
            });
        } 
        
        
    }, false);

    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    
})(window);
