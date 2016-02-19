class ChartSettings {
    // Setting key used to save and restore setting from Office.context.document.settings.
    private static settingKey = "chartSettings";
    private static peopleSettingKey = "chartPeopleSettings";

    // IChartOptions object, which defined all chart settings.
    private static chartOptions: IChartOptions;
    private static peopleChartOptions: IPeopleChartOptions;

    // Property, defined current chart settings.
    public static get settings() {
        // If setting is null, try to restore from Office.context.document.settings.
        if (this.chartOptions == null) {
            this.restoreSettings();
        }

        // If don't find setting from Office.context.document.settings.
        // then set default settings.
        if (this.chartOptions == null) {
            this.chartOptions = this.buildDefaultSettings();
        }

        return this.chartOptions;
    }

    // Property, defined current chart settings.
    public static get peopleSettings() {
        // If setting is null, try to restore from Office.context.document.settings.
        if (this.peopleChartOptions == null) {
            this.restorePeopleSettings();
        }

        // If don't find setting from Office.context.document.settings.
        // then set default settings.
        if (this.peopleChartOptions == null) {
            this.peopleChartOptions = this.buildDefaultPeopleSettings();
        }

        return this.peopleChartOptions;
    }

    /**
    * Build default people chart settings.
    */
    private static buildDefaultPeopleSettings(): IPeopleChartOptions {
        return {
            title: OfficeLocalization.Resources.getResourceString("chart_title"),
            shape: "muscle-people",
            theme: "giant-redwhiteblack",
            sku: "peoplebar-giant"
        };
    }

    /**
    * Build default chart settings.
    */
    private static buildDefaultSettings() {
        // Init a ChartHelper instance.
        var helper = new ChartHelper();

        // Init a Chart instance.
        var chart = new Chart();

        // Create a BuildSettingOptions instance.
        var settings = helper.buildSettingOptions(null, false, true);

        // Create a BuildChartOptions instance.
        var chartOptions = helper.buildChartOptions(settings, "#myChart");

        return chartOptions;
    }

    /**
    * Update chart setting by param. and save latest settings.
    *
    * @param {SettingOptions} settingOptions The object of setting options.
    */
    public static updateChartSettings(settingOptions: ISettingOptions) {
        this.chartOptions.settings = settingOptions;
        this.saveSettings(this.chartOptions.settings, this.settingKey);
    }

    /**
   * Update people chart setting by param. and save latest settings.
   *
   * @param {IPeopleChartOptions} options The object of people setting options.
   */
    public static updatePeopleChartSettings(options: IPeopleChartOptions) {
        this.peopleChartOptions = options;
        this.saveSettings(options, this.peopleSettingKey);
    }

    /**    
    * Save settings to Office.context.document.settings.    
    */
    private static saveSettings(settings: any, key: string) {
        if (settings != null) {
            var json = JSON.stringify(settings);
            Office.context.document.settings.set(key, json);

            // Save settings, and will restore next time.
            Office.context.document.settings.saveAsync();
        }
    }

    /**
    * Restore settings from Office.context.document.settings.
    */
    private static restoreSettings() {
        var mySettings = Office.context.document.settings.get(this.settingKey);
        if (mySettings != null) {
            if (this.chartOptions == null) {
                this.chartOptions = this.buildDefaultSettings();
            }
            this.chartOptions.settings = JSON.parse(mySettings);
        }
    }

    /**
    * Restore people settings from Office.context.document.settings.
    */
    private static restorePeopleSettings() {
        var mySettings = Office.context.document.settings.get(this.peopleSettingKey);
        
        if (mySettings == null) {           
                this.peopleChartOptions = this.buildDefaultPeopleSettings();
        } else {
            var settingsArr = JSON.parse(mySettings);
            this.peopleChartOptions = {
                title: settingsArr["title"],
                shape: settingsArr["shape"],
                theme: settingsArr["theme"],
                sku: settingsArr["sku"]
            };
        }
    }
}