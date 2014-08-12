(function (global) {
    var TermConditionViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	//Declare TermConditionViewModel
    */
    TermConditionViewModel = kendo.data.ObservableObject.extend({
        
    });
    
    /*
    	//Declare termConditionService
    */
    app.termConditionService = {
        
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
            $('#imgTermCondition').attr('src', advertiseIMG);
            $('#imgTermCondition').click(function(e) {
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
                $('#imgTermCondition').attr('src', imgSrc);
                $('#imgTermCondition').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, 5000);
        }, 
        
        /*
        //showTermCondition() function: show the Term&Condition information
        */
        showTermCondition: function () {
            //console.log("================= showTermCondition");
            //Call ws to get the strTermCondition            
            var appToken = window.localStorage.getItem("appToken");
            var url = "http://apidev.ccnhub.com/api/tandc/v1/token=" + appToken;
            //console.log("showTermCondition(), url=" + url);
            $.ajax({
                type: "GET",
                url: url,
                headers: {'Accept': 'application/json'},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(response) {
                    //console.log("success");
            		var responseJSON = response;
                    var strTermCondition = "";
                    $.each(responseJSON.TermsAndConditions, function(index,value) {
                        strTermCondition += "<br><div class='title'>" + value.Sequence + " " + value.Title + " </div>";
                        if (value.Details != null)
                            strTermCondition += "<div class='content_body'>" + value.Details + " </div>";  
                    });
                    //console.log("strTermCondition=" + strTermCondition);         
                    $("#termConditionDiv").html(strTermCondition);
                }
              });
            
		},
        
        viewModel: new TermConditionViewModel()        
        
    };
    
})(window);
