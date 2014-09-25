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
        var width, height, temp;
        width = $(window).width();
        height = $(window).height();
        if (width > height){
            temp = width;
            width = height;
            height = temp;
        }
        window.localStorage.setItem("oriWidth", width);
        window.localStorage.setItem("oriHeight", height);
        window.localStorage.setItem("deviceHeight", height);
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
        	Parse the xml and store the ws link
        */
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
                window.localStorage.setItem("getAdvertisementWS", response[11].Url);
                
                /*
                	Get token of device
                */                    
                var appToken;
                appToken = window.localStorage.getItem("appToken");
                //console.log("===ad.js, appToken=" + appToken);
                //var url = "http://apidev.ccnhub.com/api/activation/v1/productCode=cargoreceipt/operatingsys=" + deviceOs + "/deviceid=" + deviceId;
                var url = response[0].Url;
                url = url.replace("{environment}", window.localStorage.getItem("environment"));
                url = url.replace("{deviceOs}", deviceOs);
                url = url.replace("{deviceId}", deviceId);                
                //console.log("ad.js, url=" + url);
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
                
            }
        });
        
        
    }, false);

    
        
})(window);
