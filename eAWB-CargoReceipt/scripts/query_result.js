(function (global) {
    var QueryResultViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare QueryResultViewModel
    */
    QueryResultViewModel = kendo.data.ObservableObject.extend({
        visibleArrow: true,
        awbNumber: "",
        currentStatus: "",
        
        /*
        	goHome(): go to home view of the application
        */
        goHome: function(e){
            //app.application.navigate('#query', 'slide:right'); 
        	$("#homeURL").attr('href', '#query');
        },
        
        /*
        	showSettingDialog(): show the setting signout dialog
        */
        showSettingDialog: function(){
            var dialog = $("#settingSignOutDialog").dialog({
               dialogClass: 'setting_signout_dialog', modal: true, resizable: false
            });    
            dialog.prev(".ui-dialog-titlebar").css("background","#5E5E5E");
            dialog.prev(".ui-widget-header").css("font-weight","normal");
        },
        
        /*
        	onArrowAction(): do the action for up & down arrow button
        */
        onArrowAction: function(e){
        	//console.log("================= onArrowAction()");   
            var item = $(e.target);
            var src = item.attr("src");
            if (src === 'images/up.png'){
                item.attr("src", 'images/down.png');
                $("#displayDiv").hide();
                $("#imgArrow").removeClass("img_arrow");
                $("#imgArrow").addClass("img_arrow_down");
            } else {
                item.attr("src", 'images/up.png');
                $("#displayDiv").show();
                $("#imgArrow").removeClass("img_arrow_down");
                $("#imgArrow").addClass("img_arrow");
            }
        }
    });
    
    /*
    	Declare queryResultService
    */
    app.queryResultService = {
     	
        /*
        	init(): set up the view at the first time loaded
        */        
        init: function(e){
            //console.log("================= init");
            
            /*
            	Set advertisement
            */            
            var advertiseIMG = window.localStorage.getItem("advertiseIMG");
            var advertiseURL = window.localStorage.getItem("advertiseURL");
            $('#imgQueryResult').attr('src', advertiseIMG);
            $('#imgQueryResult').click(function(e) {
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
                $('#imgQueryResult').attr('src', imgSrc);
                $('#imgQueryResult').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, 2500);
            
            /*
            	Do the action of setting signout dialog
            */
            $("#helpBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#help');
            });
            $("#aboutAppBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_app');
            });
            $("#aboutCCNBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_ccn');
            });
            $("#termConditionBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#term_condition');
            });
            $("#signoutBtn").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                window.localStorage.setItem("userLoggedIn", false);
                app.application.navigate('#login');
            });
            
        }, 
        
        /*
        	showQueryResult() function: show the About App information
        */        
        showQueryResult: function (e) {
            //console.log("================= showQueryResult()");
            var view = e.view;
            var awbPrefix = view.params.awbPrefix;
            var awbSuffix = view.params.awbSuffix;
            app.queryResultService.viewModel.set("awbNumber", awbPrefix + "-" + awbSuffix);
            app.queryResultService.viewModel.set("currentStatus", "Ready for carriage");
                        
            /*
            	Call & parse the web service
            */
            $('#pdfDiv').hide();
            $('#fohDiv').hide();
            $('#noResultDiv').hide();
            $('#imgArrow').hide();
            var url = "http://apidev.ccnhub.com/v1/CargoReceipt.WebAPI/cargoreceiptreport/?token=" +
            			window.localStorage.getItem("appToken") + 
            			"&awbPrefix=" + awbPrefix + "&awbSuffix=" + awbSuffix;
            //console.log("============ showQueryResult(), url=" + url);
            $.ajax({
                type: "GET",
                url: url,
                data: "{}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(response) {
                    console.log("============ showQueryResult(): SUCCESS");
                    if (response.ReportUrl !== null && response.ReportUrl !== ''){ // the rcs case
                    	$('#pdfDiv').show();
                        $('#imgArrow').show();
            			url = response.ReportUrl; 
                        //TODO: get the pdf url 
                        //url = "http://apidev.ccnhub.com/v1/CargoReceipt.WebAPI/Reports/176_58528750.pdf";
                        var iframe = app.queryResultService.makeIframeDiv(url);
                        $("#pdfDiv").html(iframe);
                    } else {
                        if (response.StatusCode === 'FOH'){ //foh case
                            $('#fohDiv').show();
                            app.queryResultService.viewModel.set("currentStatus", "Freight on Hand");    
                        } else { // noresult case
                            $('#fohDiv').hide();
                            app.queryResultService.viewModel.set("currentStatus", "Unknown");
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                   console.log("============ showQueryResult(): ERROR");
                }
            });
		},
        
        
        /*
        	makeIframeDiv() function: make the iframe div with url input 
        */
        makeIframeDiv: function(url){
        	var urlEncodedFile = encodeURIComponent(url);
            //TODO: for testing
            //urlEncodedFile = "http%3A%2F%2Fasync5.org%2Fmoz%2Fpdfjs.pdf";
            var iframe = "<iframe src=\"http://mozilla.github.com/pdf.js/web/viewer.html?file=" + urlEncodedFile + 
            	"\"" + " frameborder=\"0\" style=\"height: 100%; width: 100%\"></iframe>";
            return iframe;
        },
        
        viewModel: new QueryResultViewModel()        
        
    };
    
})(window);
