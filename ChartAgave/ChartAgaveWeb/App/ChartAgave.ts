var Office = Microsoft.Office.WebExtension;
var OfficeThemeManager: any;
var OfficeLocalization = OfficeAgave.Shared.Localization;
var OfficeUtil = OfficeAgave.Shared.Utility;

class ChartAgave {
    public static toolbarControl: ToolbarControl;
    public static settingsControl: SettingsControl;

    public static chartPage: ChartPage;
    public static dataPage: DataPage;
    public static chartTypePage: ChartTypePage;

    public static $content: JQuery;
    public static $chartPage: JQuery;
    public static $chartTypePage: JQuery;
    public static $dataPage: JQuery;

    public static chartType: ChartTypes;
    public static currentPage: IAgavePage;
    public static theme: AgaveTheme;
    public static isFirstRun: boolean = true;
    public static isHighContrast: boolean = false;
    public static language: string;
    /**
    * Initialize the app 
    */
    public static initialize() { 
        ChartAgave.language = Office.context.displayLanguage;
        ChartAgave.chartType = ChartTypes.RegularColumn;
        ChartAgave.isHighContrast = OfficeUtil.Util.isHighContrast();
        ChartAgave.$content = $("#content");

        if (ChartAgave.isHighContrast) {
            AgaveTheme.setupHighContrastTheme();
            var $hc = $("<link href=\"../Content/HighContrast.css\" rel=\"stylesheet\" />");
            $("#chartAgaveTheme").parent().append($hc);      
        } else {
            if (OfficeUtil.Util.isPresentationView()) {
                if (ChartAgave.theme == null) {
                    ChartAgave.theme = new AgaveTheme();
                }
                ChartAgave.theme.syncTheme();
                ChartAgave.theme.customizeTheme();
            } else {
                AgaveTheme.setupDefaultTheme();
            }
        }            
       
        // If current html is rtl, add rtl style file. 
        if (OfficeUtil.Util.isRtlLanguage()) {
            $("#chartAgaveDocument").css("direction", "rtl");
            var $rtl = $("<link href=\"../Content/RTL.css\" rel=\"stylesheet\" />");
           
            $("#chartAgaveTheme").parent().append($rtl);           
        }

        // Init chart page.
        ChartAgave.$chartPage = $("#contentChartPage")
            .load("Page/Chart/ChartPage.html", null, () => {
                ChartAgave.chartPage = new ChartPage();
                OfficeLocalization.Resources.apply("#contentChartPage");
                PageHelper.navigateToPage(ChartAgave.chartPage);

            });

        // Load correct modes based on current document view.
        if (OfficeUtil.Util.isPresentationView()) {
            OfficeUtil.Util.isPresentationConsumerMode(null, () => {
                ChartAgave.loadAuthoringModePart();
            });          
        }
        else {
            ChartAgave.loadAuthoringModePart();
        }

        AgaveHelper.initBackbtn();

        // Localized application text.
        OfficeLocalization.Resources.apply();

        // Attach window resize event, to check whether current view is consumer mode.
        $(window).on("resize", (event) => {
            OfficeUtil.Util.isPresentationConsumerMode(ChartAgave.consumerModeHandle, ChartAgave.authoringModeHandle);
        });
    }

    /**
    * The handle will be called when presetation view is consumer mode.
    */
    private static consumerModeHandle() {
        PageHelper.navigateToPage(ChartAgave.chartPage);

        ChartAgave.toolbarControl &&
        ChartAgave.toolbarControl.disable &&
        ChartAgave.toolbarControl.disable();
    }

    /**
    * The handle will be called when document view is authoring mode.
    */
    private static authoringModeHandle() {
        if (ChartAgave.toolbarControl &&
            !ChartAgave.toolbarControl.isEnable) {
            ChartAgave.toolbarControl.enable && ChartAgave.toolbarControl.enable();
        }
    }

    /**
    * Enable behaviors which only support on authoring mode.
    */
    private static loadAuthoringModePart() {
        ChartAgave.$chartTypePage = $("#contentChartTypePage")
            .load("Page/ChartType/ChartTypePage.html", null, () => {
                ChartAgave.chartTypePage = new ChartTypePage();
                OfficeLocalization.Resources.apply("#contentChartTypePage");
            });

        ChartAgave.$dataPage = $("#contentDataPage")
            .load("Page/Data/DataPage.html", null, () => {
                ChartAgave.dataPage = new DataPage();
                OfficeLocalization.Resources.apply("#contentDataPage");
            });

        ChartAgave.toolbarControl = new ToolbarControl();
        ChartAgave.settingsControl = new SettingsControl();
    }   
}

(() => {
    Office.initialize = (reason) => {
        $(document).ready(() => {
            setTimeout(() => {
                // Setup localization options.
                var option: OfficeAgave.Shared.Localization.IOptions = {
                    rootFolder: "../Resources",
                    resourceFileName: "resources.json",
                    success: ChartAgave.initialize
                }; 
                // Init localization to load resource data.
                OfficeLocalization.Resources.initialize(option);
            }, 150);
        })
}
})();