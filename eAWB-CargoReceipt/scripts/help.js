(function (global) {
    var HelpViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare HelpViewModel
    */
    HelpViewModel = kendo.data.ObservableObject.extend({
               
    });
    
    /*
    	Declare helpViewModel
    */
    app.helpViewModel = {
     	
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
            $('#imgHelp').attr('src', advertiseIMG);
            $('#imgHelp').click(function(e) {
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
                $('#imgHelp').attr('src', imgSrc);
                $('#imgHelp').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, 5000);
            
        }, 
        
        /*
        	showHelp() function: show the About App information
        */        
        showHelp: function () {
            //console.log("================= showHelp");
            
            /*
            	//Call ws to get the strAboutApp
            
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
            */
		},
        
        viewModel: new HelpViewModel()        
        
    };
    
})(window);
