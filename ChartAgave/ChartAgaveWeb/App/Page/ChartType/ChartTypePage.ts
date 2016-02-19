interface IThumbnail {
    src: string;
    id: string;
    title: string;
}

class ChartTypePage implements IAgavePage {
    // To identity whether chart is bound data.
    public isChartBound = false;

    // Back button.
    private $backBtn = $("#chartType_backBtn");

    // navigate list in ChartType page.
    private $navChart = $(".chartType-nav>ul>li");

    // thumbnail image in ChartType page.
    private $thumbnails = $(".chartType-thumbnail>ul>li>img");

    // Select chart type button.
    private $selectChartTypeBtn = $("#selectChartTypeBtn");

    public page = Page.ChartTypePage;

    private currentChartTypeInstance: JQuery;
    private currentDetailedChartTypeInstance: JQuery;

    // Constructor for ChartTypePage
    constructor() {
        // Added click event for back button.
        this.$backBtn.click({ handler: PageHelper.backBtnHandler });

        // Added click event for nav list.
        this.$navChart.click(ChartTypePage.navChartHandler);

        // Added click event for thumbnail images.
        this.$thumbnails.on("click", function (e) {
            ChartTypePage.thumbnailsHandler($(this));
            $(this).focus();
            // Prevent default event.
            return false;
        });

        // Added click event for select button.
        this.$selectChartTypeBtn.on("click", function (e) {
            ChartTypePage.selectHandler($(this));

            // Prevent default event.
            return false;
        });

        // Set selection style for frist nav item.
        var first = this.$navChart.first();
        ChartTypePage.updateSelction(first.closest("ul"), first);

        // Set selection style for first thumbnail item.
        var firstThumbnail = this.$thumbnails.first();
        ChartTypePage.updateSelction(firstThumbnail.closest("ul"), firstThumbnail.closest("li"));

        this.currentChartTypeInstance = $(".chartType-column");
        this.currentDetailedChartTypeInstance = $("#RegularColumn");   

        // Add keyboard accessibility.
        this.$backBtn.on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter ||
                e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                PageHelper.backBtnHandler();
                return false;
            }
        });

        // Add keyboard accessibility.
        this.$selectChartTypeBtn.on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter ||
                e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                ChartTypePage.selectHandler($(this));
                return false;
            }
        });    
    }

    /**
    * Loaded function will be called after page loaded at first time.
    */
    public afterLoaded() {
        AgaveHelper.initBackbtn();

        // Hide settings command in tool bar in current page.
        $("#toolbarSettings").hide();
        ControlHelper.hideControl(ChartAgave.settingsControl);       

        // Bound data to chart with column type.        
        ChartTypePage.buildSampleChart();

        // Set this variable to true for identitying chart is bound.
        // No need to build chart again even if enter this page next time.
        this.isChartBound = true;

        // Enable keyboard accessibility.
        AccessibilityHelper.enableChartTypeAccessibility();

        $(document).keydown(this.keyPressHandler);
    }

    /**
    * Unbind keydown event.
    */
    public beforeLeave() {
        $(document).unbind("keydown");
    }

    /**
    * Key press handler for down narrow, up narrow, left narrow and right narrow.
    */
    private keyPressHandler(e) { 
        switch (e.keyCode) {
            case OfficeUtil.Strings.keyCodes.down: {
                ChartAgave.chartTypePage.keyDownNarrow();
                break;
            }
            case OfficeUtil.Strings.keyCodes.up: {
                ChartAgave.chartTypePage.keyUpNarrow();
                break;
            }
            case OfficeUtil.Strings.keyCodes.left: {
                ChartAgave.chartTypePage.keyLeftNarrow();
                break;
            }
            case OfficeUtil.Strings.keyCodes.right: {
                ChartAgave.chartTypePage.keyRightNarrow();
                break;
            }
            //case Strings.keyCodes.enter:
            //case Strings.keyCodes.space: {
            //    this.currentChartTypeInstance = $(e.target);
            //    ChartTypePage.navChartHandler.call($(e.target));
            //    break;
            //}
            default: {
                break;
            }
        }
    }

    /**
    * Handler for down narrow key.
    */
    private keyDownNarrow() {
        if (this.currentChartTypeInstance == null) {
            this.currentChartTypeInstance = $(".chartType-column");
        }

        var next = this.currentChartTypeInstance.next("li");

        if (next.length === 0) {
            next = $(".chartType-column");
        } 
        this.currentChartTypeInstance = next;
        this.currentChartTypeInstance.focus();
        ChartTypePage.navChartHandler.call(next);
        this.currentDetailedChartTypeInstance = null;
    }

    /**
    * Handler for up narrow key.
    */
    private keyUpNarrow() {
        if (this.currentChartTypeInstance == null) {
            this.currentChartTypeInstance = $(".chartType-column");
        }

        var prev = this.currentChartTypeInstance.prev("li");

        if (prev.length === 0) {
            prev = $(".chartType-people");
        } 
        this.currentChartTypeInstance = prev;
        this.currentChartTypeInstance.focus();
        ChartTypePage.navChartHandler.call(prev);
        this.currentDetailedChartTypeInstance = null;
    }

    /**
    * Handler for left narrow key.
    */
    private keyLeftNarrow() {
        if (this.currentDetailedChartTypeInstance == null) {
            this.currentDetailedChartTypeInstance = $("#thumbnail1>img");
        }
        var left = this.currentDetailedChartTypeInstance.closest("li").prev("li");

        if (left && left.length != 0) {
            var img = left.find("img");
            ChartTypePage.thumbnailsHandler(img);
            this.currentDetailedChartTypeInstance = img;
            this.currentDetailedChartTypeInstance.focus();
            return false;
        } else {
            left = this.currentDetailedChartTypeInstance.closest("li").next("li");
            if (left && left.length != 0) {
                var img = left.find("img");
                ChartTypePage.thumbnailsHandler(img);
                this.currentDetailedChartTypeInstance = img;
                this.currentDetailedChartTypeInstance.focus();
                return false;
            }
        }
    }

    /**
    * Handler for right narrow key.
    */
    private keyRightNarrow() {
        if (this.currentDetailedChartTypeInstance == null) {
            this.currentDetailedChartTypeInstance = $("#thumbnail1>img");
        }
        var right = this.currentDetailedChartTypeInstance.closest("li").next("li");

        if (right && right.length != 0) {
            var img = right.find("img");
            ChartTypePage.thumbnailsHandler(img);
            this.currentDetailedChartTypeInstance = img;
            this.currentDetailedChartTypeInstance.focus();
            return false;
        } else {
            right = this.currentDetailedChartTypeInstance.closest("li").prev("li");
            if (right && right.length != 0) {
                var img = right.find("img");
                ChartTypePage.thumbnailsHandler(img);
                this.currentDetailedChartTypeInstance = img;
                this.currentDetailedChartTypeInstance.focus();
                return false;
            }
        }
    }

    /**
    * Handler for navigate list in ChartType page.
    */
    private static navChartHandler() {
        var $type = $(this);

        // Update thumbnail item style, set first one as selection by default.
        var firstThumbnail = $(".chartType-thumbnail>ul>li").first();
        ChartTypePage.updateSelction(firstThumbnail.closest("ul"), firstThumbnail);

        // Check which type is clicked and updated thumbnail image based on selected target.
        switch ($type[0].className) {
            case Strings.chartTypeGroups.column: {
                var th1: IThumbnail = {
                    src: Strings.chartTypeImages.regularColumn,
                    id: ChartTypes[ChartTypes.RegularColumn],
                    title: OfficeLocalization.Resources.getResourceString("regular_column")
                };
                var th2: IThumbnail = {
                    src: Strings.chartTypeImages.stackedColumn,
                    id: ChartTypes[ChartTypes.StackedColumn],
                    title: OfficeLocalization.Resources.getResourceString("stacked_column")
                };
                ChartTypePage.updateThumbnailImage(th1, th2);
                ChartAgave.chartType = ChartTypes.RegularColumn;

                // Bound data to chart with column type.
                ChartTypePage.buildSampleChart();
                break;
            }
            case Strings.chartTypeGroups.bar: {
                var th1: IThumbnail = {
                    src: Strings.chartTypeImages.regularBar,
                    id: ChartTypes[ChartTypes.RegularBar],
                    title: OfficeLocalization.Resources.getResourceString("regular_bar")
                };
                var th2: IThumbnail = {
                    src: Strings.chartTypeImages.stackedBar,
                    id: ChartTypes[ChartTypes.StackedBar],
                    title: OfficeLocalization.Resources.getResourceString("stacked_bar")
                };
                ChartTypePage.updateThumbnailImage(th1, th2);
                ChartAgave.chartType = ChartTypes.RegularBar;

                // Bound data to chart with bar type.               
                ChartTypePage.buildSampleChart();
                break;
            }
            case Strings.chartTypeGroups.line: {
                var th1: IThumbnail = {
                    src: Strings.chartTypeImages.line,
                    id: ChartTypes[ChartTypes.Line],
                    title: OfficeLocalization.Resources.getResourceString("line")
                };
                ChartTypePage.updateThumbnailImage(th1);
                ChartAgave.chartType = ChartTypes.Line;

                // Bound data to chart with line type.
                ChartTypePage.buildSampleChart();
                break;
            }
            case Strings.chartTypeGroups.pie: {
                var th1: IThumbnail = {
                    src: Strings.chartTypeImages.regularPie,
                    id: ChartTypes[ChartTypes.RegularPie],
                    title: OfficeLocalization.Resources.getResourceString("regular_pie")
                };
                var th2: IThumbnail = {
                    src: Strings.chartTypeImages.innerRaduisPie,
                    id: ChartTypes[ChartTypes.InnerRaduisPie],
                    title: OfficeLocalization.Resources.getResourceString("donut_pie")
                };
                ChartTypePage.updateThumbnailImage(th1, th2);
                ChartAgave.chartType = ChartTypes.RegularPie;

                // Bound data to chart with pie type.              
                ChartTypePage.buildSampleChart();
                break;
            }
            case Strings.chartTypeGroups.area: {
                var th1: IThumbnail = {
                    src: Strings.chartTypeImages.regularArea,
                    id: ChartTypes[ChartTypes.RegularArea],
                    title: OfficeLocalization.Resources.getResourceString("regular_area")
                };
                var th2: IThumbnail = {
                    src: Strings.chartTypeImages.stackedArea,
                    id: ChartTypes[ChartTypes.StackedArea],
                    title: OfficeLocalization.Resources.getResourceString("stacked_area")
                };
                ChartTypePage.updateThumbnailImage(th1, th2);
                ChartAgave.chartType = ChartTypes.RegularArea;

                // Bound data to chart with area type. 
                ChartTypePage.buildSampleChart();
                break;
            }
            case Strings.chartTypeGroups.people: {
                var th1: IThumbnail = {
                    src: Strings.chartTypeImages.people,
                    id: ChartTypes[ChartTypes.People],
                    title: OfficeLocalization.Resources.getResourceString("people")
                };                
                ChartTypePage.updateThumbnailImage(th1);
                ChartAgave.chartType = ChartTypes.People; 

                // No need show separator in this page.
                $(".title-separator").hide();
                // Bound data to chart with people type.                    
                ChartTypePage.buildPeopleSampleChart();                         
                break;
            }
            default:
                break;
        }

        // Updated selection style for selected element.
        ChartTypePage.updateSelction($type.closest("ul"), $type);
        return false;
    }

    /**
    * Update css style for selected control.
    *
    * @param {JQuery} parent The object.
    * @param {JQuery} currentSelection The object.
    */
    private static updateSelction(parent: JQuery, currentSelection: JQuery) {
        // Remove selection css style.
        if (parent != null) {
            parent.find("li").removeClass("actived");
        }

        // Apply selection style for selected element.
        if (currentSelection != null) {
            currentSelection.addClass("actived");
        }
    }

    /**
    * Update images by param.
    *
    * @param {string} thumbnail1 First image url.
    * @param {string} value1 To mark thumbnail1 element.
    * @param {string?} thumbnail2 Second image url, it is optional.
    * @param {string?} value2 To mark thumbnail2 element.   
    */
    private static updateThumbnailImage(thumbnail1: IThumbnail, thumbnail2?: IThumbnail) {
        // Remove img frist before creating new image.
        $("#thumbnail1>img").remove();
        $("#thumbnail2>img").remove();

        // thumbnail1 is required.
        if (thumbnail1 != null) {
            var $img = $("<img src=" + thumbnail1.src + " id=" + thumbnail1.id + " />"); 
            $img.attr("title", thumbnail1.title);
            $img.attr("tabindex", "2");
            $("#thumbnail1").append($img);          
            if (thumbnail1.id === ChartTypes[ChartTypes.People]) {
                $img.addClass("people");
            }
            $img.focus();
        }

        // Update thumbnail name in label.
        $(".chartType-thumbnail-name").text(thumbnail1.title);

        // thumbnail2 is optional.    
        if (thumbnail2 != null) {
            var $img = $("<img src=" + thumbnail2.src + " id=" + thumbnail2.id + " />");
            $img.attr("tabindex", "2");
            $img.attr("title", thumbnail2.title);
            $("#thumbnail2").append($img);
            $("#thumbnail2").show();
        } else {
            $("#thumbnail2").hide();
        }  
        
        $(".chartType-thumbnail>ul>li>img").on("click", function (e) {
            ChartTypePage.thumbnailsHandler($(this));            
            return false;
        }); 
        
        $(document).unbind("keydown");
        $(document).keydown(ChartAgave.chartTypePage.keyPressHandler);     
    }

    /**
    * Handler for thumbnail in ChartType page.
    *
    * @param {JQuery} target The object.
    */
    private static thumbnailsHandler(target: JQuery) {
        // Update selction style.
        ChartTypePage.updateSelction(target.closest("ul"), target.closest("li"));

        // Update thumbnail name in label.
        $(".chartType-thumbnail-name").text(target.attr("title"));

        // Check data-value of $thumbnail element, and build related chart.
        var value = target.attr("id");
        switch (value) {
            case ChartTypes[ChartTypes.RegularColumn]: {
                ChartAgave.chartType = ChartTypes.RegularColumn;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[ChartTypes.StackedColumn]: {
                ChartAgave.chartType = ChartTypes.StackedColumn;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[ChartTypes.RegularBar]: {
                ChartAgave.chartType = ChartTypes.RegularBar;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[ChartTypes.StackedBar]: {
                ChartAgave.chartType = ChartTypes.StackedBar;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[ChartTypes.Line]: {
                ChartAgave.chartType = ChartTypes.Line;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[ChartTypes.RegularPie]: {
                ChartAgave.chartType = ChartTypes.RegularPie;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[ChartTypes.InnerRaduisPie]: {
                ChartAgave.chartType = ChartTypes.InnerRaduisPie;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[ChartTypes.RegularArea]: {
                ChartAgave.chartType = ChartTypes.RegularArea;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[ChartTypes.StackedArea]: {
                ChartAgave.chartType = ChartTypes.StackedArea;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[ChartTypes.People]: {
                ChartAgave.chartType = ChartTypes.People;   
                ChartTypePage.buildSampleChart();            
                break;
            }           
            default: {
                break;
            }
        }

        // Block default click events.
        return false;
    }

    /** 
    * Select change event handler.
    *
    * @param {JQuery} target The object.
    */
    private static selectHandler(target: JQuery) {
        PageHelper.navigateToPage(ChartAgave.chartPage);
    }

    /** 
    * Build sample chart.   
    */
    private static buildSampleChart() {
        // Init a ChartHelper instance.
        var helper = new ChartHelper();

        // Init a Chart instance.
        var chart = new Chart();

        // Create a BuildChartOptions instance.
        var chartOptions = helper.buildChartOptions(ChartSettings.settings.settings, "#chartSample", 250, 620);
        if (ChartAgave.chartType === ChartTypes.InnerRaduisPie) {
            chartOptions.innerRadius = 70;
        }

        // Build chart with BuildChartOptions.
        if (ChartAgave.chartType === ChartTypes.People) {
            this.buildPeopleSampleChart();
        } else {
            $("#chartTypeCanvasRoot").fadeOut("fast", () => {    
                Chart.isChartTypeResize = true;            
                Chart.buildChart(chartOptions);
            });            
        }       
    }

    /** 
    * Build people chart by data.   
    */
    private static buildPeopleSampleChart() {
        $("#chartSample").fadeOut("fast", () => {
            $(DataViz.Chart.defaultSVGRootId).empty();
            DataViz.Chart.isWindowBand = false;
            DataViz.Chart.defaultSVGRootId = "#chartTypeCanvasRoot";
            Chart.resizePeopleChartContainer(DataViz.Chart.defaultSVGRootId);
            var pc = new PeopleChart(DataViz.Chart.defaultSVGRootId);
        });
    }
}

