class ToolbarControl implements IAgaveControl {
    public isVisible: boolean;
    public isEnable: boolean;
    public $control = $("#toolbar");
    public horizontalToggleOptions: HorizontalToggleOptions = {
        hideLeft: this.$control.parent().outerWidth(),
        // 26 = 24 + 2: margin + border
        showLeft: this.$control.parent().outerWidth() - (this.$control.outerWidth() + 26)
    };    

    private $chartTypeBtn = $("#toolbarChartType");
    private $dataBtn = $("#toolbarData");
    private $settingsBtn = $("#toolbarSettings");

    constructor() {
        if (OfficeUtil.Util.isRtlLanguage()) {
            this.horizontalToggleOptions = {
                hideLeft: - this.$control.outerWidth(),
                showLeft: 0
            };            
        }

        // hide the toolbar
        this.isVisible = true;
        this.isEnable = true;
        ControlHelper.hideControl(this);

        $(window).on("resize", () => {
            if (OfficeUtil.Util.isRtlLanguage()) {
                this.horizontalToggleOptions = {
                    hideLeft: - this.$control.outerWidth(),
                    showLeft: 0
                };
            } else {
                this.horizontalToggleOptions = {
                    hideLeft: $(window).outerWidth(),
                    showLeft: $(window).outerWidth() - (this.$control.outerWidth() + 26)
                };
            }     
                   
            ControlHelper.hideControl(this);
        });

        this.enable();
        OfficeLocalization.Resources.apply("#toolbar");
    }

    /**
    * Hide toolbar control and remove click and keypress events.
    */
    public disable() {
        ControlHelper.hideControl(this);
        ChartAgave.$content.off("click");   
        this.$chartTypeBtn.off("click");   
        this.$dataBtn.off("click");
        this.$settingsBtn.off("click");

        ChartAgave.$content.off("keypress");
        this.$chartTypeBtn.off("keypress");
        this.$dataBtn.off("keypress");
        this.$settingsBtn.off("keypress");
        this.isEnable = false;
    }

    /**
    * Add click and keypress events.
    */
    public enable() {
        this.isEnable = true;

        // Set button icons.
        AgaveHelper.initSettingsBtn();
        AgaveHelper.initChartTypeBtn();
        AgaveHelper.initDataBtn();

        // bind the click handler for showing toolbar
        ChartAgave.$content.click(() => {
            ControlHelper.toggleControl(this, () => {
                if (ChartAgave.toolbarControl.isVisible) {
                    ChartAgave.toolbarControl.$chartTypeBtn.focus();
                }
            });
        });

        // bind the click handler for the inner buttons
        this.$chartTypeBtn.click(() => {
            PageHelper.navigateToPage(ChartAgave.chartTypePage);
        });
        this.$dataBtn.click(() => {
            PageHelper.navigateToPage(ChartAgave.dataPage);
        });
        this.$settingsBtn.click(() => {
            ControlHelper.showControl(ChartAgave.settingsControl,
                SettingsControl.initSettings,
                ChartSettings.settings);
            ControlHelper.hideControl(this, null, false);
        });

        // Add click event on toolbar.       
        ChartAgave.$content.on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter ||
                e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                ControlHelper.toggleControl(this, () => {
                    if (ChartAgave.toolbarControl.isVisible) {
                        ChartAgave.toolbarControl.$chartTypeBtn.focus();
                    } 
                });
            }
        });

        // Add keyboard accessibility.       
        this.$chartTypeBtn.on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter ||
                e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                PageHelper.navigateToPage(ChartAgave.chartTypePage);
                return false;
            }
        });
        this.$dataBtn.on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter ||
                e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                PageHelper.navigateToPage(ChartAgave.dataPage);
                return false;
            }
        });
        this.$settingsBtn.on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter ||
                e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                ControlHelper.showControl(ChartAgave.settingsControl,
                    SettingsControl.initSettings,
                    ChartSettings.settings);
                ControlHelper.hideControl(this, null, false);
                return false;
            }
        });
    }
} 