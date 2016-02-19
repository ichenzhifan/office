class ChartPage implements IAgavePage {
    // ChartHelper instance.
    private helper: ChartHelper;

    // Chart instance.
    private chart: Chart;

    public page = Page.ChartPage;
    public $welcome = $("#welcomePopup");

    constructor() {
        // Add click event on welcome box.
        this.$welcome.on("click", () => {
            this.$welcome.fadeOut();
        });
    }

    /**
    * This method will be invoked after page loaded.
    */
    public afterLoaded() {
        // Hide settings command in tool bar in current page.
        $("#toolbarSettings").show();        
        
        // Init a ChartHelper instance.
        this.helper = new ChartHelper();

        // Init a Chart instance.
        this.chart = new Chart();

        // Create a BuildChartOptions instance.       
        var chartOptions = this.helper.buildChartOptions(
            ChartSettings.settings.settings, "#myChart");

        // Build chart with BuildChartOptions.
        Chart.isChartTypeResize = false;            
        Chart.buildChart(chartOptions);     
        
        // Add click event on welcome box.
        this.$welcome.on("click", () => {
            this.$welcome.fadeOut();
        });

        // Enable keyboard accessibility.
        AccessibilityHelper.enableChartPageAccessibility();       

        // Add click event on welcome box.       
        this.$welcome.on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter ||
                e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                this.$welcome.fadeOut();             
            }          
        });

        if (ChartAgave.isFirstRun && !ChartData.isCustomizedDataDefined()) {
            ChartAgave.isFirstRun = false;
            this.$welcome.fadeIn();
        } 
        
        // Adjust welcome box size by current window size.
        this.resizeWelcomeLayout();
        this.resizeChartContainer();  
    }

    /**
    * This method will be invoked before page loaded.
    */
    public beforeLoaded() {
        this.layout();
        if (ChartData.isCustomizedDataDefined()) {
            this.$welcome.hide();
        }
    }

    /**
    * This method will be invoked before leave this page.
    */
    public beforeLeave() {
        this.$welcome.off("click");
        this.$welcome.off("keypress");
    }

    /**
    * Resize welcome screen layout by window resize.
    */
    private layout() {
        $(window).on("resize", (event) => {
            this.resizeWelcomeLayout();
            this.resizeChartContainer();
        });
    }

    /**
    * Calc window size, to adjust welcome dialog size.
    */
    private resizeWelcomeLayout() {       
        var width = $(window).outerWidth();
        var height = $(window).outerHeight();      

        var $textContainer = $(".message-container");

        if (width >= Strings.welcomeBoxSizeOptions.minWidth &&
            height >= Strings.welcomeBoxSizeOptions.minHeight) {
            $textContainer.width(width * Strings.welcomeBoxSizeOptions.scale);
            $textContainer.height(height * Strings.welcomeBoxSizeOptions.scale);
            $textContainer.css("margin-top", height * Strings.welcomeBoxSizeOptions.marginTopScale);
        } else {
            $textContainer.width(width);
            $textContainer.height(height);
            $textContainer.css("margin-top", 0);
        }

        // Welcome box size is always same as agave size. this is by design.
        // Set welcome box size.
        this.$welcome.width(width);
        this.$welcome.height(height);      
    }

    /**
    * Calc window size, to adjust chart container dialog size.
    */
    private resizeChartContainer() {
        var width = $(window).outerWidth();
        var height = $(window).outerHeight();      
        var $container = $(".chart-sub-container");


        //var w = width - ($container.offset().left) * 2;
        // var h = height - ($container.offset().top) * 2;
        var w = width - 24 * 2;
        var h = height - 24 * 2;

        w = w < Strings.chartSizeOptions.minWidth ? Strings.chartSizeOptions.minWidth : w;
        h = h < Strings.chartSizeOptions.minHeight ? Strings.chartSizeOptions.minHeight : h;

        $container.width(w);
        $container.height(h);     
        $container.css("overflow", "auto");   
    }
} 