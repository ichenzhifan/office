class AccessibilityHelper {  
    /**
    * Disable tab accessibity.
    */
    public static disableSettingPaneAccessibility() {
        $("#settingsPanel").find("[tabindex]").attr("tabindex", "-1");
    }

    /**
    * Added tab accessibility for back button.
    */
    public static enableBackButtonAccessibility(selector?: string, tabIndex?: string) {
        tabIndex = tabIndex ? tabIndex : "10";
        if (selector) {
            $(selector).find(".backBtn>img").attr("tabindex", tabIndex);
        } else {
            $(".backBtn>img").attr("tabindex", tabIndex);
        } 
    }

    /**
    * Added tab accessibility for toolbar buttons.
    */
    public static enableToolbarAccessibility() {
        $("#toolbarChartType>img").attr("tabindex", "5");
        $("#toolbarData>img").attr("tabindex", "6");
        $("#toolbarSettings>img").attr("tabindex", "7");
    }

    /**
    * Enable tab accessibility for setting pane(except people setting pane).
    */
    public static enableSettingPaneAccessibility() { 
        // Setting pane for chart exception people chart.
        var $container = $("#tabs");
        var options : OfficeAgave.Shared.Utility.IAccessibilityOption[] = [
            { selector: ".settings-title-text", tabIndex: "1" },
            { selector: ".keyboard-switch-container", tabIndex: "1" },
            { selector: ".text-box", tabIndex: "1" }
        ];
        OfficeUtil.Accessibility.addKeyboardTabAccess("#settingsPanel", options);
        this.enableBackButtonAccessibility("#settingsPanel", "2");
    }

    /**
    * Enable tab accessibility for basic tab in people setting pane.
    */
    public static enableBasicTabForPeopleSettingpane() {     
        var options: OfficeAgave.Shared.Utility.IAccessibilityOption[] = [
                { selector: ".people-title-area", tabIndex: "1" },
                { selector: ".sharp-list>img", tabIndex: "1" },
                { selector: ".sub-title", tabIndex: "1" }
            ];

        OfficeUtil.Accessibility.addKeyboardTabAccess("#peopleTabs", options);     
        this.enableBackButtonAccessibility("#settingsPanel", "2");
    }

    /**
    * Enable tab accessibility for type tab in people setting pane.
    */
    public static enableTypeTabForPeopleSettingpane() {
        var options: OfficeAgave.Shared.Utility.IAccessibilityOption[] = [         
            { selector: ".people-types>img", tabIndex: "1" },
            { selector: ".sub-title", tabIndex: "1" }
        ];

        OfficeUtil.Accessibility.addKeyboardTabAccess("#peopleTabs", options); 
        this.enableBackButtonAccessibility("#settingsPanel", "2");
    }

    /**
    * Enable tab accessibility for theme tab in people setting pane.
    */
    public static enableThemeTabForPeopleSettingpane() {
        var options: OfficeAgave.Shared.Utility.IAccessibilityOption[] = [
            { selector: ".people-theme>img", tabIndex: "1" },
            { selector: ".sub-title", tabIndex: "1" }
        ];

        OfficeUtil.Accessibility.addKeyboardTabAccess("#peopleTabs", options); 
        this.enableBackButtonAccessibility("#settingsPanel", "2");
    }

    /**
    * Add keyboard accessibility for chart page.
    */
    public static enableChartPageAccessibility() {
        OfficeUtil.Accessibility.addKeyboardTabAccess("#contentChartPage",
            [{ selector: "#welcomePopup", tabIndex: "1" },
             { selector: ".legend-Entry", tabIndex: "8" }]);
        this.enableToolbarAccessibility();
    }

    /**
    * Add keyboard accessibility for chart type page.
    */
    public static enableChartTypeAccessibility() {
        OfficeUtil.Accessibility.addKeyboardTabAccess(".charttype-container",
            [{ selector: ".chartType-nav-ul>li", tabIndex: "1" },
            { selector: ".chartType-thumbnail-ul img", tabIndex: "2" },
            { selector: "#selectChartTypeBtn", tabIndex: "3" }
            ]);
        this.enableToolbarAccessibility();
        this.enableBackButtonAccessibility();
    }

    /**
    * Add keyboard accessibility for chart type page.
    */
    public static enableDataPageAccessibility() {
        OfficeUtil.Accessibility.addKeyboardTabAccess("#contentDataPage",
            [{ selector: "#selectDataBtn", tabIndex: "1" },
                { selector: ".toolbar-icon", tabIndex: "1" },
                { selector: ".insert-colomn-icon", tabIndex: "1" },
                { selector: ".insert-row-icon", tabIndex: "1" }
            ]);
        this.enableToolbarAccessibility();
        this.enableBackButtonAccessibility();
    }

    /**
    * Add keyboard accessibility for Data selection page.
    */
    public static enableDataSelectionAccessibility() {
        OfficeUtil.Accessibility.addKeyboardTabAccess("#selectdatadiv_bottom", [{ selector: ".blueBtn", tabIndex: "1"}]);
    }


} 