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
        	showSettingDialog(): show the setting signout dialog
        */
        showSettingDialog: function(){
            var height = $(window).height();
            var width = $(window).width() * 0.8
            if (height > 700){
                height = 270;
            } else {
                height = 230;
            }
            var dialog = $("#settingSignOutDialog").dialog({
                width: width, height: height, modal: true, resizable: false
                ,open: function(event, ui) { $('.ui-widget-overlay').bind('click', function(){ $("#settingSignOutDialog").dialog('close'); }); }
            });    
            window.localStorage.setItem("openSettingSignoutDialog", true);
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
            var arrAdsDuration = $.parseJSON(window.localStorage.getItem("strArrAdsDuration"));
            var length = arrAdsImg.length;
            
            var index = 0, temp = 0, imgSrc;                    
            setInterval(function() {
            	index += 1;
                temp = index % length;
                imgSrc = arrAdsImg[temp];
                $('#imgQueryResult').attr('src', imgSrc);
                $('#imgQueryResult').click(function(e) {
                    window.location.href = arrAdsURL[temp];
				});
            }, (arrAdsDuration[temp] * 1000));
            
            /*
            	Do the action of setting signout dialog
            */
            $("#helpBtn_signout").on("click", function(){ 
                $('#settingSignOutDialog').dialog('close');
                var height = parseFloat(window.localStorage.getItem("deviceHeight"));
                if (height > 700)
                	app.application.navigate('#help_tablet'); 
                else
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
                var height = parseFloat(window.localStorage.getItem("deviceHeight"));
                if (height > 700)
                	app.application.navigate('#term_condition_tablet'); 
                else
                	app.application.navigate('#term_condition');
            });
            $("#signoutBtn").on("click", function(){ 
                var authenticationCode = window.localStorage.getItem("authenticationCode");
                var url = window.localStorage.getItem("logoutWS");
                url = url.replace("{environment}", window.localStorage.getItem("environment"));
                url = url.replace("{token}", window.localStorage.getItem("appToken"));
                url = url.replace("{authenticationCode}", authenticationCode);
                //console.log("signoutBtn, url=" + url);
                $.ajax({
                    type: "GET",
                    url: url,
                    data: "{}",
                    headers: {'Accept': 'application/json'},
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(response) {
                        console.log("============ validateUserCredential(): SUCCCESS"); 
                        if (response.IsSuccess){
                        	$('#settingSignOutDialog').dialog('close');
                            window.localStorage.setItem("userLoggedIn", false);
                            app.application.navigate('#login');       
                        }      
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                       console.log("============ validateUserCredential(): ERROR");
                       //$('#settingSignOutDialog').dialog('close'); 
                    }
                });
            });            
        }, 
        
        /*
        	showQueryResult() function: show the About App information
        */        
        showQueryResult: function (e) {
            //console.log("================= showQueryResult()");
            app.queryResultService.closeDialog();
            
            var view = e.view;
            var awbPrefix = view.params.awbPrefix;
            var awbSuffix = view.params.awbSuffix;
            app.queryResultService.viewModel.set("awbNumber", awbPrefix + "-" + awbSuffix);
            app.queryResultService.viewModel.set("currentStatus", "Ready for carriage");
                        
            
            $('#pdfDiv').hide();
            $('#fohDiv').hide();
            $('#noResultDiv').hide();
            $('#imgArrow').hide();
            var url = app.queryResultService.getURL(window.localStorage.getItem("appToken"), awbPrefix, awbSuffix);
            //console.log("============ showQueryResult(), url=" + url);
            /*
            	Call & parse the web service
            */
            $.ajax({
                type: "GET",
                url: url,
                data: "{}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend : function() {
                	$("#loader").show(); //show loader            
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("============ showQueryResult(): ERROR");
                    $("#loader").hide(); //hide loader 
                },
                success: function(response) {
                    //console.log("============ showQueryResult(): SUCCESS");
                    if (response.ReportUrl !== null && response.ReportUrl !== ''){ // the rcs case
                        $('#pdfDiv').show();
                        $('#imgArrow').show();
            			url = response.ReportUrl; 
                        var iframe = app.queryResultService.makeIframeDiv(url);
                        $("#pdfDiv").html(iframe);
                        
                        //$("#pdfIframe").panzoom();
                        //$("#pdfDiv").panzoom();
                        
                        //var mc = new Hammer.Manager(document.getElementById('pdfDiv'));
                        //var pinch = new Hammer.Pinch();
                        //mc.add([pinch]);
                        /*
                        Ext.onReady(function(){
                            Ext.tip.QuickTipManager.init();
                            
                            Ext.create('Ext.ux.panel.PDF', {
                                title    : 'PDF Panel',
                                width    : 489,
                                height   : 633,
                                pageScale: 0.75,                                           // Initial scaling of the PDF. 1 = 100%
                                src      : url, // URL to the PDF - Same Domain or Server with CORS Support
                                renderTo : Ext.getBody()
                            });
                        });	
                        */
                        
                        /*
                        Ext.application({
                            views : [
                                'Ext.ux.panel.PDF'
                            ],
                            launch: function() {
                                Ext.Viewport.add({
                                    xtype     : 'pdfpanel',
                                    fullscreen: true,
                                    layout    : 'fit',
                                    src       : 'http://cdn.mozilla.net/pdfjs/tracemonkey.pdf', // URL to the PDF - Same Domain or Server with CORS Support
                                });
                            }
                        });
                        */
                        
                        $("#loader").hide(); //hide loader 
                    } else {
                        if (response.StatusCode === 'FOH'){ //foh case
                            $('#fohDiv').show();
                            app.queryResultService.viewModel.set("currentStatus", "Freight on Hand");    
                        } else { // noresult case
                            $('#noResultDiv').show();
                            app.queryResultService.viewModel.set("currentStatus", "Unknown");
                        }
                        $("#loader").hide(); //hide loader 
                    }
                }
            });
            
            
		},
        
        /*
        	closeDialog(): close the current dialog
        */
        closeDialog: function(){
            if(window.localStorage.getItem("openSettingSignoutDialog") === 'true'){
                window.localStorage.setItem("openSettingSignoutDialog", false);
                $('#settingSignOutDialog').dialog('close');
            }
        },
        
        /*
        	makeIframeDiv() function: make the iframe div with url input 
        */
        makeIframeDiv: function(url){
        	var urlEncodedFile = encodeURIComponent(url);
            //TODO: for testing
            //urlEncodedFile = "http%3A%2F%2Fasync5.org%2Fmoz%2Fpdfjs.pdf";
            var iframe = "<iframe id=\"pdfIframe\" src=\"http://mozilla.github.com/pdf.js/web/viewer.html?file=" + urlEncodedFile + 
            	"\"" + " frameborder=\"0\" style=\"height: 100%; width: 100%\"></iframe>";
            return iframe;
        },
        
        
        /*
        	get WS url 
        */
        getURL: function(appToken, awbPrefix, awbSuffix){
            var url = window.localStorage.getItem("getCargoReportWS");
            url = url.replace("{environment}", window.localStorage.getItem("environment"));
            url = url.replace("{token}", appToken);
            url = url.replace("{awbPrefix}", awbPrefix);
            url = url.replace("{awbSuffix}", awbSuffix);
            return url;
        },
        
        viewModel: new QueryResultViewModel()        
        
    };
    
})(window);
