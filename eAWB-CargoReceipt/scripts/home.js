(function (global) {
    var HomeViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare HomeViewModel
    */
    HomeViewModel = kendo.data.ObservableObject.extend({
        
    });
    
    /*
    	//Declare homeService
    */
    app.homeService = {
        
        /*
        	init(): set up the view at the first time loaded
        */        
        init: function(){
            console.log("================= home.js,init()");
            /* 
            	Set advertisement
            
            var appToken = window.localStorage.getItem("appToken");
            var url = "http://ccnutilitydev.ccnhub.com/advertisement/GetImages/?f=23042014&t=20052014&r=1024x768&o=Portrait&tokenId=";
            url += appToken; 
            //console.log("=== home page, url=" + url);
        	$.ajax({
                type: "GET",
                url: url,
                data: "{}",
                contentType: "application/json; charset=utf-8",
                dataType: "text",
                success: function(response) {
                    //console.log("=== home page, get the ads success");
                    var responseJSON = $.parseJSON(response);
            		var advertiseIMG = responseJSON[0].Url;
                    var advertiseURL = responseJSON[0].Redirect;
                    $('#imgHome').attr('src', advertiseIMG);
                    $('#imgHome').click(function(e) {
                        window.location.href = advertiseURL;
					});
                    
                    var arrAdsImg = [], arrAdsURL = [], strArrAdsImg = "", strArrAdsURL = "";
                    var length = responseJSON.length;
                    $.each(responseJSON, function(index,value) {
                    	arrAdsImg.push(value.Url);
                        strArrAdsImg += "\"" + value.Url + "\",";
                        arrAdsURL.push(value.Redirect);
                        strArrAdsURL += "\"" + value.Redirect + "\",";
                    });
                    strArrAdsImg = strArrAdsImg.substring(0,strArrAdsImg.length - 1);
                    strArrAdsImg = "[" + strArrAdsImg + "]";
                    strArrAdsURL = strArrAdsURL.substring(0,strArrAdsURL.length - 1);
                    strArrAdsURL = "[" + strArrAdsURL + "]";
                                            
                    //Set to local storage
                    //window.localStorage.setItem("advertiseURL", advertiseURL);
                    window.localStorage.setItem("advertiseIMG", advertiseIMG);
                    window.localStorage.setItem("advertiseURL", advertiseURL);
                    window.localStorage.setItem("strArrAdsImg", strArrAdsImg);
                    window.localStorage.setItem("strArrAdsURL", strArrAdsURL);
                    
                    //Show footer info: href & show the ads for each 5 seconds
                    //$('#link').attr('href', advertiseURL);
                    var index = 0, temp, imgSrc;                    
                    setInterval(function() {
                    	index += 1;
                        temp = index % length;
                        imgSrc = arrAdsImg[temp];
                        $('#imgHome').attr('src', imgSrc);
                        $('#imgHome').click(function(e) {
                            window.location.href = arrAdsURL[temp];
						});
                    }, 5000);
                }
            });
			*/
        }, 
        
        /*
        	show() function
        */        
        show: function () {
            console.log("================= home.js,show()"); 
		},
        
        viewModel: new HomeViewModel()        
        
    };
    
})(window);
