class SettingsControl implements IAgaveControl {
    // Define this variable to mark settings control is visiable or not.
    public isVisible: boolean;

    // Settings panel JQuery object.
    public $control = $("#settingsPanel");

    // Init setting panel options.
    public horizontalToggleOptions: HorizontalToggleOptions = {       
        hideLeft: $(window).outerWidth(),
        showLeft: $(window).outerWidth() - this.$control.outerWidth()          
    };

    // Back button.
    private $backBtn = $("#settingsBackButton");

    // Swith of "show value" in setting panel.
    private static valueSwitch: Switch;

    // Swith of "show grid" in setting panel.
    private static gridSwitch: Switch;

    // Tabs
    private static tabs : Tabs;
    private static peopleTabs: Tabs;
    private static currentIcon: JQuery;

    constructor() {
        if (OfficeUtil.Util.isRtlLanguage()) {
            this.horizontalToggleOptions = {
                hideLeft: - (this.$control.outerWidth() + 30),
                showLeft: 0
            };
            this.$control.css("left", this.horizontalToggleOptions.hideLeft);
        } else {
            this.$control.css("left", this.$control.parent().outerWidth());
        }

        // Hide setting by default.       
        this.isVisible = false;        
        ControlHelper.hideControl(this);

        // Init switch.
        SettingsControl.valueSwitch = new Switch("#showValueSwitch");
        SettingsControl.gridSwitch = new Switch("#showGridSwitch");

        // Turn off valueSwitch by default.
        SettingsControl.valueSwitch.switchOff();

        // Init tabs for setting panel.
        SettingsControl.tabs = new Tabs("#tabs");
        SettingsControl.peopleTabs = new Tabs("#peopleTabs");
       
        // Bound color item in setting panel.
        //this.bindColors();
        
        // Add controls events in setting panel.
        this.addEvents();
    }

    /**
    * This function will be invoked when setting pane was loaded.
    */
    public loaded() {
        if (ChartAgave.chartType !== ChartTypes.People) {        
            AccessibilityHelper.enableSettingPaneAccessibility();
            $(".settings-title-text").focus();
        }
    }

    /**
    * This function will be invoked when setting pane was hidden.
    */
    public leave() {
        $("#peopleTabs").off("keydown");
        AccessibilityHelper.disableSettingPaneAccessibility();

        // Enable keyboard accessibility for chart page.
        AccessibilityHelper.enableChartPageAccessibility(); 
        $(".legend-Entry").first().focus();
    }

    /**
    * Create color item and append to specified control.
    *
    * @param {JQuery} parent The variable.
    * @param {string} id The variable.
    * @param {string[]} colors The array.
    */
    private appendColorItem(parent: JQuery, id: string, colors: string[]) {
        var $li = $("<li id=" + id + "></li>");

        $.each(colors, function (index, color) {
            var $span = $("<div class=\"color-item\"></div>");
            $span.css("background-color", color);
            $li.append($span);
        });

        parent.append($li);
    }

    /**
    * Add setting control events.
    */
    private addEvents() {    
        // Add window resize event to adjust setting pane position in hide and show.
        $(window).on("resize", () => {
            if (OfficeUtil.Util.isRtlLanguage()) {
                this.horizontalToggleOptions = {
                    hideLeft: - (this.$control.outerWidth() + 30),
                    showLeft: 0
                };
               
            } else {
                this.horizontalToggleOptions = {
                    hideLeft: $(window).outerWidth(),
                    showLeft: $(window).outerWidth() - this.$control.outerWidth()
                };              
            } 
           
            ControlHelper.hideControl(this);   
        });
         
        // Bind the click handler for showing toolbar
        ChartAgave.$content.click(() => {
            ControlHelper.hideControl(this, () => {
                $('[id^="tabs"]').fadeOut();                
            });
            this.isVisible = false;
        });
           
        // Add back button click event.
        this.$backBtn.click(() => {
            ControlHelper.hideControl(this);
            this.isVisible = false;
        });

        // Add title text change event, as long as text changed, it will
        // hit setTitle method to set new title to chart.
        $(".settings-title-text").change((event) => {
            Chart.updateTitle($(event.target).val());            
            return false;
        });

        // Add change event to gridswitch.
        SettingsControl.gridSwitch.change = (value) => {
            Chart.setGridVisibility(value === SettingsControl.gridSwitch.values.on);            
            return false;
        };

        // Add change event to valueswitch.
        SettingsControl.valueSwitch.change = (value) => {
            Chart.setValueVisibility(value === SettingsControl.valueSwitch.values.on);
            return false;
        };

        // Add change event to x axis label.
        $(".x-axis").change((event) => {
            Chart.updateXaxisLabel($(event.target).val());
            return false;
        });

        // Add change event to y axis label.
        $(".y-axis").change((event) => {
            Chart.updateYaxisLabel($(event.target).val());
            return false;
        }); 

        // Add click event for color series, as long as mouse click
        // color series, will select current color schema and apply to chart.
        $("#tabs-2 li").click((event) => {
            var $target = $(event.target);

            if ($target.hasClass("color-item")) {
                $target = $target.closest("li");
            }

            var id = $target.attr("id");
            if (id != null) {
                //Chart.updateChartColor(id);

                // Remove all selection firstly.
                $(".color-selection").removeClass("color-selection");

                // Add selecton style for target contrl.                
                $("#" + id).addClass("color-selection");
            }

            return false;
        });

        // People chart events.
        $(".people-title-area").change((event) => {
            var text = $(event.target).text()
            PeopleChart.setTitle(text);

            var settings = ChartSettings.peopleSettings;
            settings.title = text;
            ChartSettings.updatePeopleChartSettings(settings);
        });  

        // Add keyboard accessibility.
        this.$control.on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.esc) {
                ControlHelper.hideControl(this);
            }
        });
        this.$backBtn.on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter) {
                ControlHelper.hideControl(this);
            }
        });
        $(".x-axis").on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter) {
                Chart.updateXaxisLabel($(e.target).val());
                return false;
            }           
        });       
        $(".y-axis").on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter) {
                Chart.updateYaxisLabel($(e.target).val());
                return false;
            }
        }); 
        
        // Update tab index for people tab in setting pane.
        SettingsControl.peopleTabs.tabClick = (text) => {            
            SettingsControl.addPeopleSettingpaneAccessibility(text);  
        }; 
    } 

    /**
    * Keyboard accessibily handler.
    */
    private static addPeopleSettingpaneAccessibility(tab: string) {
        switch (tab) {
            case Strings.peopleTabs.basic: {
                AccessibilityHelper.enableBasicTabForPeopleSettingpane();
                this.currentIcon = null;
                $("#peopleTabs").off("keydown");
                $("#peopleTabs").keydown(this.basicKeydownHandler);
                break;
            }
            case Strings.peopleTabs.type: {
                AccessibilityHelper.enableTypeTabForPeopleSettingpane();
                this.currentIcon = null;
                $("#peopleTabs").off("keydown");
                $("#peopleTabs").keydown(this.typeKeydownHandler);
                break;
            }
            case Strings.peopleTabs.theme: {
                AccessibilityHelper.enableThemeTabForPeopleSettingpane();
                this.currentIcon = null;
                $("#peopleTabs").off("keydown");
                $("#peopleTabs").keydown(this.themeKeydownHandler);
                break;
            }
            default: {
                break;
            }
        }     
    } 

    /**
    * Restore last selected tab before launch setting pane.
    */
    private static setSelectedTab(lastSelectedTabId?: string) {
        var $tabs = $("#tabs");
        var $peopleTabs = $("#peopleTabs");

        if (lastSelectedTabId) {
            $("a[href='" + lastSelectedTabId + "']").addClass("active-color");
            $(lastSelectedTabId).show();

            var parent = $(lastSelectedTabId).closest("#peopleTabs");
            if (parent && parent.length != 0) {
                SettingsControl.addPeopleSettingpaneAccessibility($(lastSelectedTabId).text());  
            } else {
                AccessibilityHelper.enableSettingPaneAccessibility();
            }

            return;
        }

        if (ChartAgave.chartType == ChartTypes.People) {
            $peopleTabs.find("div").first().show();
            $peopleTabs.find("li>a").first().addClass("active-color");
            AccessibilityHelper.enableBasicTabForPeopleSettingpane();
            $("#peopleTabs").off("keydown");
            $("#peopleTabs").keydown(this.basicKeydownHandler);
        } else {
            $tabs.find("div").first().show();
            $tabs.find("li>a").first().addClass("active-color");
            AccessibilityHelper.enableSettingPaneAccessibility();
        }
    }

    /**
    * Init setting panel settings by ChartOption param.
    *
    * @param {IChartOptions} chartOptions The object contains all settings of chart.
    */
    public static initSettings(chartOptions: IChartOptions) {
        var $tabs = $("#tabs");
        var $peopleTabs = $("#peopleTabs");
        
        if (chartOptions != null) {      
            var that = this;      
            $(".active-color").removeClass("active-color");           
            if (ChartAgave.chartType == ChartTypes.People) { 
                $tabs.fadeOut("fast", () => {                               
                    SettingsControl.setSelectedTab(SettingsControl.peopleTabs.currentTab);       

                    // Restore people settings.
                    var settings = ChartSettings.peopleSettings;
                    PeopleChart.setTitle(settings.title);
                    PeopleChart.updateShape(settings.shape);
                    PeopleChart.updateSku(settings.sku);
                    PeopleChart.updateTheme(settings.theme);
                   
                    $(".people-title-area").text(settings.title);
                    var options = {
                        type: ".people-types",
                        theme: ".people-theme",
                        shape: ".shape-list"
                    };
                    
                    // Popup setting pane
                    DataViz.UX.SettingPane.Instance.populate(options);
                    $peopleTabs.fadeIn();
                });
                
                return;
            }

            $peopleTabs.fadeOut("fast", () => {                
                SettingsControl.setSelectedTab(SettingsControl.tabs.currentTab);
                $tabs.fadeIn();            
            });

            // Init title textbox.          
            if (chartOptions.settings && chartOptions.settings.title) {
                var $title = $(".settings-title-text");
                //$title.removeAttr("placeholder");
                $title.val(chartOptions.settings.title);
            }

            // Init "Show values" switch.
            if (chartOptions.settings && chartOptions.settings.gridVisibility != null) {
                if (chartOptions.settings.valueVisibility) {
                    SettingsControl.valueSwitch.switchOn();
                } else {
                    SettingsControl.valueSwitch.switchOff();
                }
            }

            // Init "Show grid" switch.
            if (chartOptions.settings && chartOptions.settings.gridVisibility != null) {
                if (chartOptions.settings.gridVisibility) {
                    SettingsControl.gridSwitch.switchOn();
                } else {
                    SettingsControl.gridSwitch.switchOff();
                }
            }

            // Init X and Y axis.
            chartOptions.settings && chartOptions.settings.xAxisLabel && $(".x-axis").val(chartOptions.settings.xAxisLabel);
            chartOptions.settings && chartOptions.settings.yAxisLabel && $(".y-axis").val(chartOptions.settings.yAxisLabel);

            // Init label contrl.
            chartOptions.settings && chartOptions.settings.peopleLable && $(".chart-label").text(chartOptions.settings.peopleLable);

            // Init color selection in color tab.
            if (chartOptions.settings &&
                chartOptions.settings.colors &&
                chartOptions.settings.colors.name != null) {
                // Remove all selection firstly.
                $(".color-selection").removeClass("color-selection");

                // Add selecton style for target contrl.
                var id = "#" + chartOptions.settings.colors.name;
                $(id).addClass("color-selection");
            }

            // Set people label visible, hide if current chart is not people chart.
            if (ChartAgave.chartType !== ChartTypes.People) {
                $(".chart-label").closest("li").hide();
            }
        }
    }

    /**
    * Basic tab handler for keyboard
    */
    private static basicKeydownHandler(e:any) {
        SettingsControl.KeydownHandler(".sharp-list", e, (id) => {
            PeopleChart.updateShape(id);
        });
    }

    /**
    * Type tab handler for keyboard
    */
    public static typeKeydownHandler(e: any) {
        SettingsControl.KeydownHandler(".people-types", e, (id) => {
            PeopleChart.updateSku(id);
            $(id).focus();
        });
    }

    /**
    * Theme tab handler for keyboard
    */
    private static themeKeydownHandler(e: any) {
        SettingsControl.KeydownHandler(".people-theme", e, (id) => {
            PeopleChart.updateTheme(id);
        });
    }

    /**
    * Keyboard handler for people tabs.
    */
    private static KeydownHandler(selector: string,
        e: any,
        func: (id: string) => void) {
        switch (e.keyCode) {
            case OfficeUtil.Strings.keyCodes.left:
            case OfficeUtil.Strings.keyCodes.up: {               
                this.currentIcon = $(selector).find(".gallery-item-click");               
                var left = this.currentIcon.prev("img");
                if (left && left.length == 0) {
                    left = $(selector + ">img").last();                            
                } 
                this.currentIcon = left;          
                func && func(left.attr("id"));    
                SettingsControl.updateIconBorder(selector, "#" + left.attr("id"));
                return false;
                break;
            }
            case OfficeUtil.Strings.keyCodes.down:
            case OfficeUtil.Strings.keyCodes.right: {               
                this.currentIcon = $(selector).find(".gallery-item-click");               
                var right = this.currentIcon.next("img");
                if (right && right.length == 0) {
                    right = $(selector + ">img").first();                
                } 
                this.currentIcon = right;    
                func && func(right.attr("id"));    
                SettingsControl.updateIconBorder(selector, "#" + right.attr("id"));
                return false;
            }
            default: {
                break;
            }
        } 
    }

    /**
    * Update people icon style by selection.
    */
    private static updateIconBorder(selector: string, iconId: string) {
        var icons = $(selector).find("img");
        icons.each((index, ele) => {
            $(ele).removeClass("gallery-item-click");           
        });
       
        $(selector).find(iconId).addClass("gallery-item-click");
    }
} 