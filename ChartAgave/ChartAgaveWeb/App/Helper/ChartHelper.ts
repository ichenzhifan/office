class ChartHelper {
    // Declare private variable to store current selected data, which used
    // to build chart.
    private data: IData;
    private dataRecords: IDataRecords;
    constructor() {
        this.data = ChartData.getChartData();
        this.dataRecords = ChartData.DataRecords;
    }

    /**
    * Build setting options instance and set title and colors with default value 
    * if don't provided.
    *
    * @param {string?} title Chart title.
    * @param {boolean?} isShowValue Whether set chart value visible.
    * @param {boolean?} isShowGrid Whether set chart grid visible.
    * @param {string?} xAxisLabel Chart x axis label.
    * @param {string?} yAxisLabel Chart y axis label.
    * @param {IColors?} colors Chart color schema.
    * @param {string?} peopleLable People chart lable.
    */
    buildSettingOptions(title?: string,
        valueVisibility?: boolean,
        gridVisibility?: boolean,
        xAxisLabel?: string,
        yAxisLabel?: string,
        colors?: IColors,
        peopleLable?: string) {

        title = title != null && title.trim() !== "" ? title : OfficeLocalization.Resources.getResourceString("chart_title");
        colors = colors != null ? colors : Strings.defaultBarColors;

        return <ISettingOptions>{
            title: title,
            gridVisibility: gridVisibility,
            valueVisibility: valueVisibility,
            xAxisLabel: xAxisLabel,
            yAxisLabel: yAxisLabel,
            colors: colors,
            peopleLable: peopleLable
        };
    }

    /**
    * Build chart options instance based on currentType(private variable), which defined in current
    * page and data(private variable) which defined in current page.
    *
    * @param {SettingOptions} settings The object.
    * @param {string} containerId Container id.
    * @param {number?} height Chart height.
    * @param {number?} width Chart width.
    * @param {number?} lineSize Chart line size.
    * @param {number?} innerRadius Chart inner radius.
    * @param {((layer: IBaseLayer) => void)?} func The fuc.
    */
    buildChartOptions(settings: ISettingOptions,
        containerId: string,
        height?: number,
        width?: number,
        lineSize?: number,
        textSize?: number,
        opacity?: number,
        innerRadius?: number,
        func?: (layer: vp.layers.baseLayer) => void
        ): IChartOptions {

        // Create vuePlot layer by chart type.
        var layer = this.createLayerByType(ChartAgave.chartType);

        // Get chart stack.
        var stack = this.getStackByType(ChartAgave.chartType);

        // Get data to build chart.
        var categoryName = this.data.categories.name;
        var data = this.dataRecords.chartData; //this.buildDataRecords();

        // Set chart height and width.
        height = height != null ? height : 350;
        width = width != null ? width : 650;

        // Set linesize height.        
        lineSize = lineSize != null ? lineSize : 0;
        if (lineSize === 0 && ChartAgave.chartType === ChartTypes.Line) {
            lineSize = 2;
        }

        // Set linesize height.        
        textSize = textSize != null ? textSize : 0;       

        // Set chart opcity
        opacity = opacity != null ? opacity : 1;
        innerRadius = innerRadius != null ? innerRadius : 0;
        if (innerRadius === 0 && ChartAgave.chartType === ChartTypes.InnerRaduisPie) {
            innerRadius = Strings.pieSizeOptions.defaultValue;
        }

        // Get chart x and y axis.
        var xy = this.getXYaxis(ChartAgave.chartType);

        var outerMargin = 0;

        // Set func param
        if (ChartAgave.chartType === ChartTypes.Line) {
            func = (plotLayer) => {
                layer.stroke({ colName: ["_seriesIndex"], palette: Strings.defaultBarColors.values, isDiscrete: true});
            };
        } else if (ChartAgave.chartType === ChartTypes.InnerRaduisPie ||
            ChartAgave.chartType === ChartTypes.RegularPie) {
            outerMargin = 50;
            func = (plotLayer) => {  
                layer.fill({ colName: categoryName, palette: Strings.defaultBarColors.values, isDiscrete: true});
            };
        }
        else {
            func = (plotLayer) => {
                layer.fill({ colName: "_seriesIndex", palette: Strings.defaultBarColors.values, isDiscrete: true});
            };
        }

        // Get series names.
        var names = this.getSeriesName();
        if (ChartAgave.chartType === ChartTypes.InnerRaduisPie ||
            ChartAgave.chartType === ChartTypes.RegularPie) {
            if (names && names.length != 0) {
                names = [names[0]];
            }            
        }

        // Create ChartOptions instance.
        return <IChartOptions>{
            settings: settings,
            containerId: containerId,
            layer: layer,
            dataRecords: data,
            x: xy.x,
            y: xy.y,
            seriesNames: names,
            height: height,
            width: width,
            stackType: stack,
            lineSize: lineSize,
            textSize: textSize,
            opacity: opacity,
            innerRadius: innerRadius,
            outerMargin: outerMargin,
            func: func
        }
    }

    /**
    * Build text layer options, used to create text layer.
    *
    * @param {IChartOptions} chartOptions To provide basic chart info.
    */
    public static buildTextLayerOptions(chartOptions: IChartOptions): ITextLayerOption {       
        var textLayerOption: ITextLayerOption;
        if (chartOptions) {
            switch (ChartAgave.chartType) {
                case ChartTypes.RegularColumn: {
                    if (chartOptions.x && chartOptions.x.length != 0) {  
                        textLayerOption = {
                                dataRecords: chartOptions.dataRecords,
                                y: chartOptions.y,
                                x: chartOptions.x,
                                label: chartOptions.y,
                                stackType: Strings.chartStackTypes.dodge,
                                textSize: chartOptions.textSize,
                                vAlign: 1.5                              
                            };
                    }
                    break;
                }
                case ChartTypes.StackedColumn: {
                    if (chartOptions.x && chartOptions.x.length != 0) {
                        textLayerOption = {
                            dataRecords: chartOptions.dataRecords,
                            y: chartOptions.y,
                            x: chartOptions.x,
                            label: chartOptions.y,
                            stackType: Strings.chartStackTypes.stack,
                            textSize: chartOptions.textSize,
                            vAlign: 1.5
                        };
                    }
                    break;
                }
                case ChartTypes.Line:
                {
                    if (chartOptions.x && chartOptions.x.length != 0) {
                        textLayerOption = {
                            dataRecords: chartOptions.dataRecords,
                            y: chartOptions.y,
                            x: chartOptions.x,
                            label: chartOptions.y,                            
                            textSize: chartOptions.textSize,
                            vAlign: 0.1                                               
                        };
                    }
                    break;
                    }

                case ChartTypes.StackedArea:
                    {
                        if (chartOptions.x && chartOptions.x.length != 0) {
                            textLayerOption = {
                                dataRecords: chartOptions.dataRecords,
                                y: chartOptions.y,
                                x: chartOptions.x,
                                label: chartOptions.y,
                                stackType: Strings.chartStackTypes.stack,
                                textSize: chartOptions.textSize,                               
                                vAlign: -0.1
                            };
                        }
                        break;
                    }
                case ChartTypes.RegularArea:
                    {
                        if (chartOptions.x && chartOptions.x.length != 0) {
                            textLayerOption = {
                                dataRecords: chartOptions.dataRecords,
                                y: chartOptions.y,
                                x: chartOptions.x,
                                label: chartOptions.y,
                                stackType: Strings.chartStackTypes.identity,
                                textSize: chartOptions.textSize,                               
                                vAlign: -0.1
                            };
                        }
                        break;
                    }
                case ChartTypes.RegularBar: {
                    if (chartOptions.x && chartOptions.x.length != 0) {  
                        textLayerOption = {
                            dataRecords: chartOptions.dataRecords,
                            y: [chartOptions.y],
                            x: chartOptions.x,
                            label: chartOptions.x,
                            stackType: Strings.chartStackTypes.dodge,
                            textSize: chartOptions.textSize,
                            vAlign: -0.1,
                            hAlign: -1.5,
                            seriesAxis: "x"
                        };                       
                    }
                    break;
                }
                case ChartTypes.StackedBar: {
                    if (chartOptions.x && chartOptions.x.length != 0) {  
                        textLayerOption = {
                            dataRecords: chartOptions.dataRecords,
                            y: [chartOptions.y],
                            x: chartOptions.x,
                            label: chartOptions.x,
                            stackType: Strings.chartStackTypes.stack,
                            textSize: chartOptions.textSize,
                            vAlign: -0.1,
                            hAlign: -1.5,
                            seriesAxis: "x"
                        };
                    }
                    break;
                }
                case ChartTypes.InnerRaduisPie:
                case ChartTypes.RegularPie:
                    {
                        if (chartOptions.y && chartOptions.y.length != 0) {
                            textLayerOption  = {
                                dataRecords: chartOptions.dataRecords,
                                y: chartOptions.y,
                                label: chartOptions.y,
                                textSize: chartOptions.textSize                               
                            };
                        }
                        break;
                    }
                default: {
                    break;
                }
            }
        }

        return textLayerOption;
    }

    /**
    * Get vuePlot layer by chartType.
    *
    * @param {ChartTypes} chartType Chart type object.
    */
    private createLayerByType(chartType: ChartTypes) {
        var layer: any;
        switch (chartType) {
            case ChartTypes.RegularBar:
            case ChartTypes.StackedBar: {
                layer = vp.layers.createBar();
                break;
            }
            case ChartTypes.RegularPie:
            case ChartTypes.InnerRaduisPie: {
                layer = vp.layers.createPieSlice();
                break;
            }
            case ChartTypes.RegularArea:
            case ChartTypes.StackedArea: {
                layer = vp.layers.createArea();
                break;
            }
            case ChartTypes.Line: {
                layer = vp.layers.createLine();
                break;
            }
            case ChartTypes.RegularColumn:
            case ChartTypes.StackedColumn: {
                layer = vp.layers.createColumn();
                break;
            }
            default: {
                layer = null;
                break;
            }
        }

        return layer;
    }   

    /**
    * Get vuePlot layer stack type.
    *
    * @param {ChartTypes} chartType Chart type object.
    */
    private getStackByType(chartType: ChartTypes) {
        var stack = Strings.chartStackTypes.dodge;

        switch (chartType) {
            case ChartTypes.StackedColumn:
            case ChartTypes.StackedArea:
            case ChartTypes.StackedBar: {
                stack = Strings.chartStackTypes.stack;
                break;
            }
            case ChartTypes.RegularArea: {
                stack = Strings.chartStackTypes.identity;
                break;
            }
            case ChartTypes.Line: {
                stack = Strings.chartStackTypes.dodge;
                break;
            }
            default: {
                break;
            }
        }

        return stack;
    }

    /**
    * Get x and y axis series name.
    *
    * @param {ChartTypes} chartType Chart type object.
    */
    private getXYaxis(chartType: ChartTypes) {
        var result: any;
        var categoryName = [this.data.categories.name];
        var seriesName = this.getSeriesName();

        result = {
            x: categoryName,
            y: seriesName
        };

        switch (chartType) {
            case ChartTypes.RegularBar:
            case ChartTypes.StackedBar: {
                result = {
                    x: seriesName,
                    y: categoryName
                };
                break;
            }
            case ChartTypes.InnerRaduisPie:
            case ChartTypes.RegularPie: {
                result = {
                    x: [],
                    y: seriesName && seriesName.length != 0 ? [seriesName[0]] : []
                    //y: this.Data.categories && this.Data.categories.length != 0 ? this.Data.categories : []
                };
                break;
            }
            default: {
                break;
            }
        }

        return result;
    }

    /**
    * Get all series names from data.    
    */
    private getSeriesName() {
        var names = [];
        if (this.data.series.length != 0) {
            this.data.series.forEach((item, index) => {
                names.push(item.name);
            });
        }

        return names;
    }
}