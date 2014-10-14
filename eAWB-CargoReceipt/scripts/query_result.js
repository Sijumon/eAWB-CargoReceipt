(function (global) {
    var QueryResultViewModel, app = global.app = global.app || {};
    
    app.application = new kendo.mobile.Application(document.body, {platform: "ios7"});
    
    /*
    	Declare QueryResultViewModel
    */
    QueryResultViewModel = kendo.data.ObservableObject.extend({
        visibleArrow: true,
        awbNumber: "",
        showPdf: true,
        currentStatus: "",
        portraitMode: true,
        headerHeight: 0,
        displayDivHeight: 0,
        
        /*
        	Move to query view
        */
        onHome: function(e){
        	$("#ext-viewport").hide();
            Ext.Viewport.remove(Ext.Viewport.getActiveItem(), true);
            $("#homeBtn").attr('href', '#query');
        },
        
        /*
        	showSettingDialog(): show the setting signout dialog
        */
        showSettingDialog: function(){
            var height = $(window).height();
            var width = $(window).width() * 0.8;
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
            var height = window.localStorage.getItem("oriHeight");
            var headerHeight = app.queryResultService.viewModel.get("headerHeight");
            var displayDivHeight = app.queryResultService.viewModel.get("displayDivHeight");
            //console.log("=== onArrowAction(), headerHeight=" + headerHeight);
            //console.log("==== onArrowAction(), displayDivHeight=" + displayDivHeight);
            if (app.queryResultService.viewModel.get("portraitMode")){
                if (window.localStorage.getItem("oriHeight") > 700){
                   if (window.localStorage.getItem("deviceOs") === 'Android')
                    	headerHeight = headerHeight - 120;
                   else
                    	headerHeight = headerHeight - 40;
                }
                else {
                    if (window.localStorage.getItem("deviceOs") === 'Android')
                        headerHeight = headerHeight - 50;
                    else{
                        if (window.localStorage.getItem("oriHeight") > 500)
                            headerHeight = headerHeight - 70;
                        else
                            headerHeight = headerHeight - 30;
                    }    
                }                        
            } else {
                if (window.localStorage.getItem("oriHeight") < 700){
                    if (window.localStorage.getItem("deviceOs") === 'iOS'){
                        headerHeight = headerHeight - 20;
                    }
                } else {
                    if (window.localStorage.getItem("deviceOs") === 'Android')
                        headerHeight = headerHeight - 120;
                }
            }
            if (src === 'images/up.png'){
                item.attr("src", 'images/down.png');
                
                var headerHeightTemp = parseInt(headerHeight) - parseInt(displayDivHeight);
                headerHeightTemp = headerHeightTemp + "px !important";
                var style = "width: 100% !important; height: " + height + "px !important; margin-top: " + headerHeightTemp;
                //console.log("=== click up arrow, style=" + style);
                $('#ext-viewport').attr("style", style);
                      
                $("#displayDiv").hide();
                $("#imgArrow").removeClass("img_arrow");
                $("#imgArrow").addClass("img_arrow_down");
            } else {
                item.attr("src", 'images/up.png');
                
                headerHeightTemp = parseInt(headerHeight);
                headerHeightTemp = headerHeightTemp + "px !important";
                style = "width: 100% !important; height: " + height + "px !important; margin-top: " + headerHeightTemp;
                //console.log("====== click down arrow, style=" + style);
                $('#ext-viewport').attr("style", style);
                                
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
                var win = window.open(advertiseURL, '_blank');
                win.focus();
                e.preventDefault();
                e.stopPropagation();
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
                    var win = window.open(arrAdsURL[temp], '_blank');
                    win.focus();
                    e.preventDefault();
                    e.stopPropagation();
				});
            }, (arrAdsDuration[temp] * 1000));
            
            /*
            	Do the action of setting signout dialog
            */
            $("#helpBtn_signout").on("click", function(){ 
                $("#ext-viewport").hide();
                Ext.Viewport.remove(Ext.Viewport.getActiveItem(), true);
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#help');
            });
            $("#aboutAppBtn_signout").on("click", function(){ 
                $("#ext-viewport").hide();
                Ext.Viewport.remove(Ext.Viewport.getActiveItem(), true);
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_app');
            });
            $("#aboutCCNBtn_signout").on("click", function(){ 
                $("#ext-viewport").hide();
                Ext.Viewport.remove(Ext.Viewport.getActiveItem(), true);
                $('#settingSignOutDialog').dialog('close');
                app.application.navigate('#about_ccn');
            });
            $("#termConditionBtn_signout").on("click", function(){ 
                $("#ext-viewport").hide();
                Ext.Viewport.remove(Ext.Viewport.getActiveItem(), true);
                $('#settingSignOutDialog').dialog('close');
                	app.application.navigate('#term_condition');
            });
            $("#signoutBtn").on("click", function(){ 
                $("#ext-viewport").hide();
                Ext.Viewport.remove(Ext.Viewport.getActiveItem(), true);
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
            
            $("#awbNumber").on("click", function(e){ 
                e.preventDefault();
                e.stopPropagation();
            });
            
            var headerHeight = $("#headerDiv").height();
            var displayDivHeight = $("#displayDiv").height();
            app.queryResultService.viewModel.set("headerHeight", headerHeight);
            app.queryResultService.viewModel.set("displayDivHeight", displayDivHeight);
                        
            /*
            	Apply the orientation change: portrait & landscape mode
            */
            $(window).bind('orientationchange', function(e){
                var height = window.localStorage.getItem("oriHeight");
                if (app.queryResultService.viewModel.get("showPdf")){
                    //console.log("orientation=" + window.orientation);
                                
                    headerHeight = parseInt(headerHeight);
                    if (Math.abs(window.orientation) !== 90){
                    	//console.log("============== portrait");
                        $("#displayDiv").show();
                        $("#imgArrow").removeClass("img_arrow_down");
                        $("#imgArrow").addClass("img_arrow");
                        $("#imgArrow").attr("src", 'images/up.png');
                        headerHeight = $("#headerDiv").height();
                        displayDivHeight = $("#displayDiv").height();
                        app.queryResultService.viewModel.set("displayDivHeight", displayDivHeight);
                        app.queryResultService.viewModel.set("headerHeight", headerHeight);
                    
                        if (window.localStorage.getItem("oriHeight") > 700){
                            if (window.localStorage.getItem("deviceOs") === 'Android')
                            	headerHeight = headerHeight - 120;
                            else
                            	headerHeight = headerHeight - 40;
                        }
                        else {
                            if (window.localStorage.getItem("deviceOs") === 'iOS' && window.localStorage.getItem("oriHeight") < 500)
                                headerHeight = headerHeight - 30;
                            else
                                headerHeight = headerHeight - 50;
                        }
                        app.queryResultService.viewModel.set("portraitMode", true);
                        $("#queryResultFooter").show();
                    } 
                    else { //landscape mode
                        //console.log("=============== landscape"); 
                        $("#displayDiv").hide();
                        $("#imgArrow").removeClass("img_arrow"); 
                        $("#imgArrow").addClass("img_arrow_down");
                        $("#imgArrow").attr("src", 'images/down.png');
                        headerHeight = $("#headerDiv").height();
                        //app.queryResultService.viewModel.set("displayDivHeight", 0);
                        //app.queryResultService.viewModel.set("headerHeight", headerHeight);
                        
                        if (window.localStorage.getItem("oriHeight") < 700){
                            if (window.localStorage.getItem("deviceOs") === 'iOS'){
                                if (window.localStorage.getItem("oriHeight") > 500)
                                    headerHeight = headerHeight - 120;
                                else
                                    headerHeight = headerHeight - 30;    
                            }                                
                        } else {
                            if (window.localStorage.getItem("deviceOs") === 'Android')
                            	headerHeight = headerHeight - 100;
                        }
                        app.queryResultService.viewModel.set("portraitMode", false);
                        $("#queryResultFooter").hide();                                               
                    }
                    headerHeight = headerHeight + "px !important";
                    var style = "width: 100% !important; height: " + height + "px !important; margin-top: " + headerHeight;
                    //console.log("style=" + style);
                    $('#ext-viewport').attr("style", style);                     
                }
                        
            });    
        }, 
        
        /*
        	showQueryResult() function: show the About App information
        */        
        showQueryResult: function (e) {
            //console.log("================= showQueryResult()");
            app.queryResultService.closeDialog();            
            
            /*
                Check orientation mode at the page load
            */
            var viewportWidth = window.innerWidth;
            var viewportHeight = window.innerHeight;
            if (viewportWidth > viewportHeight)
                $("#queryResultFooter").hide(); 
            else
                $("#queryResultFooter").show(); 
            
            var view = e.view;
            var awbPrefix = view.params.awbPrefix;
            var awbSuffix = view.params.awbSuffix;
            app.queryResultService.viewModel.set("awbNumber", awbPrefix + "-" + awbSuffix);
            app.queryResultService.viewModel.set("currentStatus", "Ready for carriage");
                        
            $('#errorDiv').hide();
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
                timeout : '40000', //timeout = 40 seconds
                beforeSend : function() {
                	$("#loader").show(); //show loader            
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("============ showQueryResult(): ERROR");
                    $("#loader").hide(); //hide loader 
                    $('#errorDiv').show();
                },
                success: function(response) {
                    //console.log("============ showQueryResult(): SUCCESS");
                    var url = response.ReportUrl;
                    //console.log("query_result, url=" + url);
                    if (url !== null && url !== ''){ // the rcs case
                        app.queryResultService.viewModel.set("showPdf", true);
                        
                        /*
                            Show the pdf div & arrow button
                        */
                        $('#pdfDiv').show();
                        $('#imgArrow').attr("src", 'images/up.png');
                        $("#imgArrow").removeClass("img_arrow_down");
                        $("#imgArrow").addClass("img_arrow");
                        $('#imgArrow').show();
                        $("#displayDiv").show();
                        
                        window.localStorage.setItem("reportUrl", url);
                        
                        /* 
                        	Render pdf url file supports pinch to zoom action
                        */
                        Ext.Viewport.add({
                            xtype     : 'pdfpanel',
                            fullscreen: false,
                            layout    : 'fit',
                            src       : url, // URL to the PDF - Same Domain or Server with CORS Support
                            hidePagingtoolbar: true
                        }); 
                        
                        //console.log("=== headerHeight=" + app.queryResultService.viewModel.get("headerHeight"));
                        //console.log("==== displayDivHeight=" + app.queryResultService.viewModel.get("displayDivHeight"));
                        var headerHeight = $("#headerDiv").height();
                        if (window.localStorage.getItem("oriHeight") > 700){
                            if (window.localStorage.getItem("deviceOs") === 'Android')
                            	headerHeight = headerHeight - 120;
                            else
                            	headerHeight = headerHeight - 40;
                        }
                        else {
                            if (window.localStorage.getItem("deviceOs") === 'Android')
                                headerHeight = headerHeight - 50;
                            else{
                                if (window.localStorage.getItem("oriHeight") > 500)
                                    headerHeight = headerHeight - 70;
                                else
                                    headerHeight = headerHeight - 30;
                            }    
                        }
                        var style = "width: 100% !important; height: 100% !important; margin-top: " + headerHeight + "px !important";
                        //console.log("===== style=" + style);
                        $('#ext-viewport').attr("style", style);
                                                      
                        $("#ext-viewport").show();
                        
                        $("#loader").hide(); //hide loader 
                    } else {
                        app.queryResultService.viewModel.set("showPdf", false);
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
