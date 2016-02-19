/**
* Define the sample data format
*/
interface SampleDataFormat {
    title: string;
    data: string[][];
}

class PeopleChart {
    private static mainUX: DataViz.UX.MainUX;
    private static currentSKU: DataViz.SKUs.SKUInstance;
    private static configuration: DataViz.Config.Configuration;
    private static layoutInstance: DataViz.Chart.LayoutInstance;
    private static bindingPane: DataViz.UX.BindingPaneSpecific;

    public static configurationKey: string;
    public static currentIconId: string;
    public static icons: any[] = [];
    public static iconHostSelector: string;

    constructor(canvasId: string) {
        DataViz.mainApp = new DataViz.App();

        // Set default value.
        PeopleChart.configurationKey = Strings.configureKeys.shape;
        PeopleChart.currentIconId = "muscle-people";
        PeopleChart.iconHostSelector = ".sharp-list";

        PeopleChart.currentSKU && PeopleChart.currentSKU.reset();
        DataViz.mainApp.onConfigurationChangedCallback = this.onConfigurationChanged;

        DataViz.mainApp.init("", (sku) => {
            PeopleChart.currentSKU = sku;
            PeopleChart.configuration = DataViz.mainApp.Configuration;
            PeopleChart.layoutInstance = DataViz.mainApp.LayoutInstance;
            PeopleChart.icons = DataViz.Decoration.ShapeProvider.Instance.Shapes;

            PeopleChart.bindingPane = DataViz.UX.BindingPaneSpecific.getInstance();
            var bindData = ChartData.DataRecords.peopleChartData; //new ChartHelper().buildPeopleDataRecords();
            PeopleChart.bindingPane.bindingData = bindData;
            PeopleChart.rebindData(bindData);

            var peopleSettings = ChartSettings.peopleSettings;
            PeopleChart.setTitle(peopleSettings.title);
            PeopleChart.updateShape(peopleSettings.shape);
            PeopleChart.updateSku(peopleSettings.sku);
            PeopleChart.updateTheme(peopleSettings.theme);

            $(canvasId).fadeIn();
        });
    }

    /**
    * People setting pane configuration changed event. included shape, theme
    * sku changed. 
    */
    private onConfigurationChanged(key: string, value: any) {
        var settings = ChartSettings.peopleSettings;
        switch (key) {
            case DataViz.Config.wellKnownKeys.sku: {
                settings.sku = value;
                ChartSettings.updatePeopleChartSettings(settings);
                $("#peopleTabs").off("keydown");
                $("#peopleTabs").keydown(SettingsControl.typeKeydownHandler);
                break;
            }
            case DataViz.Config.wellKnownKeys.shape: {
                settings.shape = value;
                ChartSettings.updatePeopleChartSettings(settings);               
                break;
            }
            case DataViz.Config.wellKnownKeys.theme: {
                settings.theme = value;
                ChartSettings.updatePeopleChartSettings(settings);
                break;
            }
            default: {
                break;
            }
        }
    }

    /**
    * Set people chart title.
    */
    public static setTitle(title: string) {
        //DataViz.mainApp.LayoutInstance.setValue("title", title);
        $("#peopleChartTitle").text(title);
    }

    /**
    * Rebind data to current sku.
    */
    public static rebindData(rawData: string[][]) {
        if (this.currentSKU == null) {
            this.currentSKU = DataViz.mainApp.CurrentSKU;
        }

        if (this.currentSKU.DataBinder.isBound()) {
            return;
        }

        var renderData: DataViz.Data.RawData = new DataViz.Data.RawData();
        renderData.formatted = rawData;
        renderData.unformatted = rawData;

        this.currentSKU.Controller.visualizeData(renderData);
    }

    /**
    * Update chart theme.
    */
    public static updateTheme(theme: string) {
        this.apply(Strings.configureKeys.theme, theme);
    }

    /**
    * Update chart shape.
    */
    public static updateShape(shape: string) {
        this.apply(Strings.configureKeys.shape, shape);
    }

    /**
    * Update chart sku.
    */
    public static updateSku(sku: string) {
        this.apply(Strings.configureKeys.sku, sku);
    }

    /**
    * Update configuration.
    */
    private static apply(key: string, iconId: string) {
        if (this.configuration == null) {
            this.configuration = DataViz.mainApp.Configuration;
        }

        this.configuration.set(key, iconId);
        this.configuration = DataViz.mainApp.Configuration;
    }

    /**
    * Init people chart setting pane.
    */
    public static populate(iconNames: string[]) {
        var currentWidth = 0;
        $(this.iconHostSelector + "> img").remove();

        for (var index = 0; index < this.icons.length; index++) {
            $(this.iconHostSelector).append("<img id=" + this.icons[index].id + " src=" + this.icons[index].thumbnail
                + " cursor: pointer; position:absolute'; class ='gallery-item';"
                + "alt='" + iconNames[index] + "' title='" + iconNames[index] + "' tabindex='1';/>");
            this.setIconClickListener(this.icons[index].id, index);
        }

        this.updatePaneBorder(this.currentIconId);
    }

    /**
    * Add icon click handler.
    */
    private static setIconClickListener(iconId: string, index: number) {
        $("#" + iconId).off("click");
        $("#" + iconId)
            .data("iconIndex", index)
            .click((event: any) => {
                this.iconClickAction(event, index);
            })
            .keydown((event: any) => {
                if (event.which === OfficeUtil.Strings.keyCodes.enter) {
                    this.iconClickAction(event, index);
                }
            });
    }

    /**
    * Icon click handler.
    */
    private static iconClickAction(event: any, index: number) {
        var iconIndex: string = $(event.target).data("iconIndex");
        var iconId = this.icons[iconIndex].id;
        this.updatePaneBorder(iconId);
        this.apply(this.configurationKey, iconId);
    }

    /**
    * Updated selected style.
    */
    private static updatePaneBorder(iconId: string) {
        for (var index = 0; index < this.icons.length; index++) {
            if (this.icons[index].id === iconId) {
                $("#" + this.icons[index].id).removeClass("gallery-item");
                $("#" + this.icons[index].id).addClass("gallery-item-click");
            }
            else {
                $("#" + this.icons[index].id).removeClass("gallery-item-click");
                $("#" + this.icons[index].id).addClass("gallery-item");
            }
        }
    }
} 