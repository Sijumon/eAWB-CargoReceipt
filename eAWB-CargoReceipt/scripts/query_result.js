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
               dialogClass: 'setting_signout_dialog'
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
            }, 5000);
            
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
        	
            /*
            	Show the pdf file
            
            //http://www.lob.de/pdf/helloworld.pdf
            $('#pdfFile').show();
            $('#fohDiv').hide();
            $('#noResultDiv').hide();
            $('#imgArrow').show();
            */
            /*
            	Show the pdf use pdf.js
            */
            /*
            var url = "http://www.lob.de/pdf/helloworld.pdf";
            PDFJS.getDocument(url).then(function(pdf) {
              // Using promise to fetch the page
              pdf.getPage(1).then(function(page) {
                alert("1");  
                var scale = 1.5;
                var viewport = page.getViewport(scale);

                //
                // Prepare canvas using PDF page dimensions
                //
                var canvas = document.getElementById('pdfCanvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                //
                // Render PDF page into canvas context
                //
                var renderContext = {
                  canvasContext: context,
                  viewport: viewport
                };
                page.render(renderContext);
                alert("2");    
              });
            });
            */
            
            /*
            	Show the foh information
            
            $('#pdfFile').hide();
            $('#fohDiv').show();
            $('#noResultDiv').hide();
            $('#imgArrow').hide();
            app.queryResultService.viewModel.set("currentStatus", "Freight on Hand");
            */
            
            /*
            	Show the noResult information
            
            $('#pdfFile').hide();
            $('#fohDiv').hide();
            $('#noResultDiv').show();
            $('#imgArrow').hide();
            app.queryResultService.viewModel.set("currentStatus", "Unknown");
            */
            
            //$('a.media').media();
		},
       
        
        afterShowQueryResult: function(e){
            //console.log("================= afterShowQueryResult()");
            //$('#embedURL').gdocsViewer({width: 600, height: 750});
            //$('#embedURL').gdocsViewer();
            
            /*
            var myPDF = new PDFObject({ 		
    			url: "http://www.lob.de/pdf/helloworld.pdf",
    			pdfOpenParams: {
    				navpanes: 1,
    				view: "FitV",
    				pagemode: "thumbs"
    			}    		
    		}).embed("pdf");
            */
            
            //$("#divQueryResult").niceScroll("#pdfIframe",{autohidemode:false});
            //$("#divQueryResult").niceScroll({cursorcolor:"#00F"});
			
            //$("#divQueryResult").niceScroll("#pdfFile");
            //$("#divQueryResult").niceScroll();
            
            //$("#divQueryResult").niceScroll({cursorcolor:"#FF0000", horizrailenabled: true});
        },
        
        
        viewModel: new QueryResultViewModel()        
        
    };
    
})(window);
