(function (global) {
    var QueryViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare QueryViewModel
    */
    QueryViewModel = kendo.data.ObservableObject.extend({
    	showSettingDialog: function(){
        	//console.log("================= showSettingDialog()");   
                        
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
