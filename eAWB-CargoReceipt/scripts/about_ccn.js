(function (global) {
    var AboutCCNViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	//Declare AboutCCNViewModel
    */     
    AboutCCNViewModel = kendo.data.ObservableObject.extend({
        
    });
    
    /*
    	//Declare aboutCCNService
    */    
    app.aboutCCNService = {
        
        /*
        	//init(): set up the view at the first time loaded
        */
        init: function(){
            //console.log("================= init");
            
            /*
            	//Set advertisement
            
            var advertiseIMG = window.localStorage.getItem("advertiseIMG");
            var advertiseURL = window.localStorage.getItem("advertiseURL");
            $('#imgAboutCCN').attr('src', advertiseIMG);
            $('#imgAboutCCN').click(function(e) {
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
                $('#imgAboutCCN').attr('src', imgSrc);
                $('#imgAboutCCN').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, 5000);
            */
        }, 
        
        /*
        	//showAboutCCN() function: show the About App information
        */
        showAboutCCN: function () {
            //console.log("================= showAboutCCN");
            /*
            	//Set advertisement
             
            //Call ws to get the strAboutCCN
            var appToken = window.localStorage.getItem("appToken");
            var url = "http://apidev.ccnhub.com/api/aboutccn/v1/token=" + appToken;
            //console.log("showAboutCCN(), url=" + url);
            
            $.ajax({
                type: "GET",
                url: url,
                headers: {'Accept': 'application/json'},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(response) {
                    //console.log("success");
            		var responseJSON = response;
                    var strAboutCCN = "";
                    $.each(responseJSON.AboutCcnDetails, function(index,value) {
                        if (value.Details != null)
                            strAboutCCN += "<div class='content_body'>" + value.Details + " </div>";
                    });
                    //console.log("strAboutCCN=" + strAboutCCN); 
                    strAboutCCN += "<img src='styles/images/ccn.png' style='display: inline-block; width: 35%; float: right; margin-bottom: 0%; margin-top: 3%; margin-right: 0%;' /> <br><br>";
                    $("#aboutCCNDiv").html(strAboutCCN);
                }
            });
            */  
		},

        viewModel: new AboutCCNViewModel()        
        
    };
    
})(window);
