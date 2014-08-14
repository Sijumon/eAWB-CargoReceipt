(function (global) {
    var AboutAppViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	//Declare AboutAppViewModel
    */
    AboutAppViewModel = kendo.data.ObservableObject.extend({
               
    });
    
    /*
    	//Declare aboutAppService
    */
    app.aboutAppService = {
     	
        /*
        	//init(): set up the view at the first time loaded
        */        
        init: function(){
            //console.log("================= init");
            
            /*
            	//Set advertisement
            */            
            var advertiseIMG = window.localStorage.getItem("advertiseIMG");
            var advertiseURL = window.localStorage.getItem("advertiseURL");
            $('#imgAboutApp').attr('src', advertiseIMG);
            $('#imgAboutApp').click(function(e) {
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
                $('#imgAboutApp').attr('src', imgSrc);
                $('#imgAboutApp').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, 5000);
            
        }, 
        
        /*
        	showAboutApp() function: show the About App information
        */        
        showAboutApp: function () {
            //console.log("================= showAboutApp");
            
            /*
            	Call ws to get the strAboutApp
            */
            var appToken = window.localStorage.getItem("appToken");
            var url = "http://apidev.ccnhub.com/api/product/v1/token=" + appToken;
            var strAboutApp;
            $.ajax({
                type: "GET",
                url: url,
                headers: {'Accept': 'application/json'},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(response) {
                    var responseJSON = response;
                    strAboutApp = "<div class='title'>" + responseJSON.Name + " </div>";
                    strAboutApp += "<div class='content_body'>" + responseJSON.Details + " </div>";
            		//console.log("strAboutApp=" + strAboutApp);    
                    $("#aboutAppDiv").html(strAboutApp);
                }
              });
            
		},
        
        viewModel: new AboutAppViewModel()        
        
    };
    
})(window);
