interface ILayoutParam {
    grid: any;
    chartOptions: IChartOptions;
    isResizeCustomizedContainer?: boolean;
    isResizePeopleContainer?: boolean;
    customizedContainerId?: string;
    peopleContainerId?: string;
}

interface ILegend {
    parent: JQuery;
    bgColor: string;
    text: string;
}

class Chart {
    // Define a private variable for storing Chart Plot.
    private static plot: any;

    // Define a private variable for storing Chart layer.
    private static plotLayer: any;

    // Define a private variable for store text layer.    
    private static valueLayer: any;

    // Grid container to hold chart.
    private static grid: any;

    // Chart options
    private static options: IChartOptions;

    private static seriesSettings = {};

    // Define a property for Chart Plot.
    public static get chartPlot() {
        return this.plot;
    }

    // Define a property for Chart layer.
    public static get chartLayer() {
        return this.plotLayer;
    }

     // Define a property for Chart text layer.
    public static get chartTextLayer() {
        return this.valueLayer;
    }

    // Define a variable to control layout resize.
    public static reSize = true;

    public static isChartTypeResize = false;

    /**
    * Reset vuePlot object.
    */
    public static empty() {
        this.plot = null;
        this.plotLayer = null;
        this.chartPlot = null;       
    }

    /**
    * Build Chart by according IChartOptions param. this param include all
    * Chart settings like title, width, height, data, etc.
    *
    * @param {IChartOptions} chartOptions Chart options object.
    * @param {boolean?} ignoreResize ture ingore resize chart layout, otherwise resize.
    */
    public static buildChart(chartOptions: IChartOptions) {    
        this.options = chartOptions;     
        var $wrap = $(chartOptions.containerId);
        vp.events.attach(window, "resize", () => {
            var param: ILayoutParam = {
                grid: this.grid,
                chartOptions: chartOptions,
                peopleContainerId: "#chartTypeCanvasRoot"
            }; 

            if (this.isChartTypeResize) {
                param.isResizeCustomizedContainer = true;
            }

            this.layout(param);
        });

        if (ChartAgave.chartType === ChartTypes.People) {
            $wrap.closest(".chart-container").fadeOut();

            $(DataViz.Chart.defaultSVGRootId).empty();
            DataViz.Chart.defaultSVGRootId = "#chartCanvasRoot";
            DataViz.Chart.isWindowBand = true;
            var pc = new PeopleChart(DataViz.Chart.defaultSVGRootId);
            return;
        }
        this.build(chartOptions);
        this.setGridVisibility(ChartSettings.settings.settings.gridVisibility);
        this.setValueVisibility(ChartSettings.settings.settings.valueVisibility);
        $wrap.fadeIn();
    }

    /**
    * Build Chart by according IChartOptions param. this param include all
    * Chart settings like title, width, height, data, etc.
    *
    * @param {IChartOptions} chartOptions Chart options object.
    */
    private static build(chartOptions: IChartOptions) {      
        var seriesNames = chartOptions.seriesNames;
        this.seriesSettings = {};    
        for (var i = 0; i < seriesNames.length ; i++) {
            this.seriesSettings[seriesNames[i]] = true;
        }   
       
        // Get chart host container.
        var root = vp.select(chartOptions.containerId);

        // Clear element under root.    
        root.clear();

        // Create grid container to hold our chart.
        this.grid = vp.select(chartOptions.containerId).append(vp.visuals.createGridContainer());

        // Create a plot object and append it to the div:
        this.plot = this.grid.append(vp.visuals.createPlot())
            .isSelectionEnabled(false)
            .isLegendVisible(false);

        // To improve performance by disable animation for large data.
        var rawData = ChartData.data;
        if (rawData.categories.data.length >= 20 || rawData.series.length >= 20) {
            this.plot
                .isAnimEnabled(false)
                .isUiEnabled(false);
        }

        // Set plot title if it is not null.
        chartOptions.settings.title && this.updateTitle(chartOptions.settings.title);

        //chartOptions.settings.title && this.plot.title(chartOptions.settings.title);
        //(<any>(this.plot)).titleSize(28);

        // Set the size of the plot.  
        var width = chartOptions.width != null ? chartOptions.width : 500;
        var height = chartOptions.height != null ? chartOptions.height : 250;
        this.grid
            .width(width)
            .height(height);

        // Create a plot layer object and append it to the plot object.      
        this.plotLayer = this.plot.append(chartOptions.layer);            
        
        // Map your data records to the plot.
        this.plotLayer.data(chartOptions.dataRecords);

        // Set stack type.
        chartOptions.stackType && this.plotLayer.stackType(chartOptions.stackType);

        // Set X and Y series.
        this.plotLayer.x({ colName: chartOptions.x, addHeadRoom: true, formatter: this.formatterToLocaleNumber });
        this.plotLayer.y({ colName: chartOptions.y, addHeadRoom: true, formatter: this.formatterToLocaleNumber });
        this.plotLayer.toolTipFormatter(this.formatterToLocaleNumber);

        // Set linesize.
        chartOptions.lineSize >= 0 && this.plotLayer.lineSize(chartOptions.lineSize);

        // Disable hover handler.
        this.plot.isHoverEnabled(false);        

        // Set raduis.
        chartOptions.innerRadius && $(this.plotLayer).prop("_innerRadius", chartOptions.innerRadius);

        // Set X and Y Axis label.
        if (chartOptions.settings.xAxisLabel != null) {
            this.chartLayer.x({
                colName: chartOptions.x,
                title: chartOptions.settings.xAxisLabel
            });
        }

        if (chartOptions.settings.yAxisLabel != null) {
            this.chartLayer.y({
                colName: chartOptions.y,
                title: chartOptions.settings.yAxisLabel
            });
        }

        // Set whether show grid view.
        if (chartOptions.settings.gridVisibility != null) {
            if (ChartAgave.chartType === ChartTypes.RegularBar || ChartAgave.chartType === ChartTypes.StackedBar) {
                this.plot.isYGridVisible(false);
                this.plot.isXGridVisible(chartOptions.settings.gridVisibility);  
            } else {
                this.plot.isXGridVisible(false);
                this.plot.isYGridVisible(chartOptions.settings.gridVisibility);  
            }
        }                     

        // Set line colors.
        //chartOptions.settings.colors && chartOptions.settings.colors.values.length != 0 && this.plotLayer.fill({ palette: chartOptions.settings.colors.values });

        // Set chart outerMargin.
        chartOptions.outerMargin && this.plotLayer.outerMargin(chartOptions.outerMargin);

        // Call Func method.
        chartOptions.func && chartOptions.func(this.plotLayer);
        var param: ILayoutParam = {
            grid: this.grid,
            chartOptions: chartOptions,
            peopleContainerId: "#chartTypeCanvasRoot"
        };
        if (this.isChartTypeResize) {
            param.isResizeCustomizedContainer = true;
        }
       
        this.layout(param);

        // Create text layers.        
        this.createTextLayer(ChartHelper.buildTextLayerOptions(chartOptions));              
              
        // Add animation.  
        this.plotLayer.dataAnimMgr()
            .enterAnim(vp.animation.makeEffects("fade"))
            .exitAnim(vp.animation.makeEffects("fade"));

        this.addCustomeLegend(chartOptions);

        if (ChartAgave.chartType === ChartTypes.People) {
            $(chartOptions.containerId).fadeIn();
        } else {
            $(chartOptions.containerId).closest(".chart-container").fadeIn();
        }       
    }

    /**
    * Format number to locale number.
    */
    private static formatterToLocaleNumber(value) {
        var formatValue = value; 
        try {
            if (!isNaN(value)) {
                var nf = new Intl.NumberFormat(ChartAgave.language);
                formatValue = (<any>nf).format(value);
            }           
        } catch (ex) {

        } finally {
            return formatValue;
        }       
    }

    /**
    * Create chart legend to replace default one.
    */
    private static addCustomeLegend(chartOptions: IChartOptions) {
        var $legendContainer = $(chartOptions.containerId).prev("div." + Strings.legendBoxClassNames.customLegend);
        $legendContainer.empty();      

        if (chartOptions.seriesNames && chartOptions.seriesNames.length > 0) {
            if (chartOptions.seriesNames.length <= Strings.defaultBarColors.values.length) {
                $.each(chartOptions.seriesNames, (index, name) => {
                    var option: ILegend = {
                        parent: $legendContainer,
                        bgColor: Strings.defaultBarColors.values[index],
                        text: name
                    };

                    this.addLegendEntry(option);
                });
            } else {
                var colorIndex = 0;
                var iteration = 1;
                $.each(chartOptions.seriesNames, (index, name) => {
                    if (index < Strings.defaultBarColors.values.length) {
                        colorIndex = index;
                    } else if (index === Strings.defaultBarColors.values.length * iteration) {
                        colorIndex = 0;
                        iteration++;
                    } else {
                        colorIndex++;
                    }

                    var option: ILegend = {
                        parent: $legendContainer,
                        bgColor: Strings.defaultBarColors.values[colorIndex],
                        text: name
                    };

                    this.addLegendEntry(option);
                });
            }
        }
    }  

    /**
    * Create legend entry and append to custome legend container.
    */
    private static addLegendEntry(option: ILegend) {
        var $legendEntry = $("<span class=" + Strings.legendBoxClassNames.legendEntry + "></span>");
        var $colorSquare = $("<span class=" + Strings.legendBoxClassNames.colorSquare + "></span>");
        $colorSquare.css("background", option.bgColor);
        var $seriesName = $("<span class= " + Strings.legendBoxClassNames.seriesName + " accent-color " +">" + option.text + "</span>");

        $legendEntry.append($colorSquare);
        $legendEntry.append($seriesName);

        $legendEntry.on("click", () => {
            this.toggleSeries($legendEntry);
            $legendEntry.hasClass("legend-Entry-focus") && $legendEntry.removeClass(Strings.legendBoxClassNames.legendEntryFocus);
            return false;
        });

        // Key "press" to toggle chart series.       
        $legendEntry.on("keypress", (e) => {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                this.toggleSeries($legendEntry);    
                return false;           
            }           
        });

        // Monitor focusin and focusout event.
        $legendEntry.focusin((e) => {
            $legendEntry.addClass(Strings.legendBoxClassNames.legendEntryFocus);
        }).focusout((e) => {
            $legendEntry.removeClass(Strings.legendBoxClassNames.legendEntryFocus);
        });

        option.parent.append($legendEntry);
    }

    /**
    * Toggle series off/on handler.
    */
    public static toggleSeries($target: JQuery) {
        var name = $target.find("span." + Strings.legendBoxClassNames.seriesName).text();
        var value = this.seriesSettings[name];
        // toggle it.
        value = (!value);
        this.seriesSettings[name] = value;
        $target.toggleClass("inactive");

        //---- build colNames ----
        var colNames = [];

        for (var key in this.seriesSettings) {
            if (this.seriesSettings[key]) {
                colNames.push(key);
            }
        }

        // Get active series color schema. and apply to chart bar.
        var colors = this.getActiveSeriesColor();
        if (ChartAgave.chartType === ChartTypes.Line) {
            this.plotLayer.stroke().palette(colors);
        } else if (ChartAgave.chartType !== ChartTypes.InnerRaduisPie &&
            ChartAgave.chartType !== ChartTypes.RegularPie) {
            this.plotLayer.fill().palette(colors);
        }

        if (ChartAgave.chartType === ChartTypes.RegularBar ||
            ChartAgave.chartType === ChartTypes.StackedBar) {
            this.plotLayer.x().isScaleLocked(true);
            this.plotLayer.x(colNames);
            this.valueLayer.x().isScaleLocked(true);
            this.valueLayer.x(colNames);    
            this.valueLayer.label(colNames);   
        } else {
            this.plotLayer.y().isScaleLocked(true);
            this.plotLayer.y(colNames);
            this.valueLayer.y().isScaleLocked(true);
            this.valueLayer.y(colNames);  
            this.valueLayer.label(colNames);       
        }
    }

    /**
    * Retrieve all active legend series and pass back color schema.
    */
    private static getActiveSeriesColor(): string[]{
        var squares = $(".legend-Entry:not(.inactive) .color-Square");
        var colors = [];
        squares.each((index, ele) => {
            colors.push($(ele).css("background-color"));
        });       

        return colors;
    }

    /**
    * Update chart title.
    *
    * @param {string} title Chart title text.
    */
    public static updateTitle(title: string) {
        if (title != null) {
            // Update chart title.
            //this.chartPlot.title(title);
            $(".vp-chart-title1").text(title);

            // Update title in settings object.
            var settings = ChartSettings.settings.settings;
            settings.title = title;
            ChartSettings.updateChartSettings(settings);
        }
    }

    /**
    * Set Chart value visible.
    * 
    * @param {boolean} visibility true visible, false hide.
    */
    public static setValueVisibility(visibility: boolean) {
        var chartOptions = ChartSettings.settings;
        chartOptions.settings.valueVisibility = visibility;

        if (visibility) {
            this.valueLayer.opacity(1);           
        } else {
            this.valueLayer.opacity(0);
        }
    }

    /**
    * Set Chart grid visible.
    * 
    * @param {boolean} visibility true visible, false hide.
    */
    public static setGridVisibility(visibility: boolean) {
        // Set grid visible for chart.
        //this.chartPlot.isXGridVisible(visibility);       
        if (ChartAgave.chartType === ChartTypes.RegularBar ||
            ChartAgave.chartType === ChartTypes.StackedBar) {
            this.plot.isYGridVisible(false);
            this.plot.isXGridVisible(visibility);
        } else {
            this.plot.isXGridVisible(false);
            this.plot.isYGridVisible(visibility);
        }         

        // Update grid visible status in settings object.
        var settings = ChartSettings.settings.settings;
        settings.gridVisibility = visibility;
        ChartSettings.updateChartSettings(settings);
    }

    /**
    * Update x axis lable for chart.
    *
    * @param {string} text x axis label.
    */
    public static updateXaxisLabel(text: string) {
        if (text != null) {
            // Update x axis label for chart.
            this.plotLayer.x({
                title: text
            });
          
            // Update x axis label in settings object.
            var settings = ChartSettings.settings.settings;
            settings.xAxisLabel = text;
            ChartSettings.updateChartSettings(settings);
        }
    }

    /**
    * Update y axis lable for chart.
    *
    * @param {string} text Y axis label.
    */
    public static updateYaxisLabel(text: string) {
        if (text != null) {
            // Update y axis label for chart.
            this.plotLayer.y({               
                title: text
            });           

            // Update y axis label in settings object.
            var settings = ChartSettings.settings.settings;
            settings.yAxisLabel = text;
            ChartSettings.updateChartSettings(settings);
        }
    }

    /**
    * Update chart color.
    *
    * @param {string} name Color schema name.
    */
    public static updateChartColor(colors: string[]) {
        // Define function to update chart color.
        var func: () => void;
                       
        // Set func body by different chart type.
        if (ChartAgave.chartType === ChartTypes.Line) {
            func = () => {
                if (this.chartLayer && colors && colors.length != 0) {
                    this.chartLayer.stroke({ palette: colors, isDiscrete: true });
                }
            };
        }
        else {
            func = () => {
                if (this.chartLayer && colors && colors.length != 0) {
                    this.chartLayer.fill({ palette: colors, isDiscrete: true });
                }
            };
        }

        // Invoke func to update chart color.
        func && func();

        // Update chart colors in settings object.
        if (colors && colors.length != 0) {
            var settings = ChartSettings.settings.settings;
            settings.colors = { name: name, values: colors };
            ChartSettings.updateChartSettings(settings);
        }
    }

    /**
    * Refresh chart data.
    */
    public static refreshData() {
        var helper = new ChartHelper();
        var data = ChartData.DataRecords.chartData; //helper.buildDataRecords();

        this.chartLayer.data(data);
        this.valueLayer.data(data);
    }

    /**
    * Update people chart container size.
    */
    public static resizePeopleChartContainer(id: string) {
        // Get window height and width after resizing.        
        var windowHeight = vp.dom.height(window);
        var windowWidth = vp.dom.width(window);

        // Resizing people container.
        var containerHeight = windowHeight / Strings.peopleChartSizeOptions.heightRatio - 60;
        containerHeight = containerHeight < Strings.peopleChartSizeOptions.minHeight ? Strings.peopleChartSizeOptions.minHeight : containerHeight;
        $(id).height(containerHeight);   
    }

    /**
    * Chart layout.
    *
    * @param {IChartOptions} chartOptions Chart options.
    */
    private static layout(param: ILayoutParam) {
        if (this.reSize) {
            // Get window height and width after resizing.        
            var windowHeight = vp.dom.height(window); 
            var windowWidth = vp.dom.width(window); 

            // Resizing people container.
            this.resizePeopleChartContainer(param.peopleContainerId);

            // Calc expected grid height and width by ratio.                   
            var gridHeigth = windowHeight - 160; //(offset.top + 48); 
            var gridWidth = windowWidth - (26 * 2 + 30);        

            if (param.isResizeCustomizedContainer) {
                var containerHeight = vp.dom.height(window) / Strings.customChartSizeOptions.heightRatio - 48;
                var containerWidth = (vp.dom.width(window) - 20) / Strings.customChartSizeOptions.widthRatio - 40; 

                gridHeigth = containerHeight * Strings.chartSizeOptions.heightRatio;  
                gridWidth = containerWidth * Strings.chartSizeOptions.widthRatio;  

                // If expected grid width greater than window width.
                // asign window width to to grid width and using calc grid height.
                if (gridWidth > containerWidth) {
                    gridWidth = containerWidth;
                }
                // If expected grid less than(or equals) window width.
                // using calc grid width and asign window height to grid height.
                else {
                    gridHeigth = containerHeight;
                }

                if (gridHeigth < Strings.customChartSizeOptions.minHeight || gridWidth < Strings.customChartSizeOptions.minWidth) {
                    gridHeigth = Strings.customChartSizeOptions.minHeight;
                    gridWidth = Strings.customChartSizeOptions.minWidth ;
                }  
            } else {
                // If expected grid width greater than window width.
                // asign window width to to grid width and using calc grid height.
                if (gridWidth > windowWidth) {
                    gridWidth = windowWidth;
                }

                if (gridHeigth > windowHeight) {
                    gridHeigth = windowHeight;
                }                

                // Box size shouldn't less than min size.
                var minHeight = Strings.chartSizeOptions.minHeight;
                var minWidth = Strings.chartSizeOptions.minWidth;
                if (gridWidth < minWidth || gridHeigth < minHeight) {
                    gridWidth = minWidth;
                    gridHeigth = minHeight;
                }
            }           

            // Resizing chart.
            param.grid
                .width(gridWidth)
                .height(gridHeigth);  

            if (ChartAgave.chartType === ChartTypes.InnerRaduisPie &&
                this.chartLayer) {
                $(this.chartLayer).prop("_innerRadius", gridHeigth * Strings.pieSizeOptions.innerRadiusRatio);
            }                        
        }
    }

    /**
    * Create text layer.
    *
    * @param {ITextLayerOption} textLayerOption Textlayer option.
    */
    private static createTextLayer(textLayerOption: ITextLayerOption) {  
        if (textLayerOption != null) {
            this.valueLayer = this.plot.append(vp.layers.createText());            

            // Set data.
            textLayerOption.dataRecords && textLayerOption.dataRecords.length != 0 && this.valueLayer.data(textLayerOption.dataRecords);

            // Set stack type.
            textLayerOption.stackType && this.valueLayer.stackType(textLayerOption.stackType);           

            // Set text size.
            this.valueLayer.textSize(12);  

            // Set y and x.
            textLayerOption.y && this.valueLayer.y({ colName: textLayerOption.y, formatter: this.formatterToLocaleNumber });
            textLayerOption.x && this.valueLayer.x({ colName: textLayerOption.x, formatter: this.formatterToLocaleNumber });
            
            // Set label.
            textLayerOption.label && this.valueLayer.label(textLayerOption.label);
            this.valueLayer.label().formatter(this.formatterToLocaleNumber);

            // Set vAlign.
            textLayerOption.vAlign && this.valueLayer.vAlign(textLayerOption.vAlign);

            // Set vAlign.
            textLayerOption.hAlign && this.valueLayer.hAlign(textLayerOption.hAlign);

            // Set opacity to 0 to hide text by default.
            this.valueLayer.opacity(0);  

            // Set dodgeAxis.
            textLayerOption.dodgeAxis && (<any>this.valueLayer).dodgeAxis(textLayerOption.dodgeAxis);

            // Set seriesAxis.
            textLayerOption.seriesAxis && (<any>this.valueLayer).seriesAxis(textLayerOption.seriesAxis);
            
            // Update text shapes for pie chart.
            if (ChartAgave.chartType === ChartTypes.InnerRaduisPie ||
                ChartAgave.chartType === ChartTypes.RegularPie) {
                this.postUpdateShapes(textLayerOption);
            }

            this.valueLayer.dataAnimMgr()
                .enterAnim(vp.animation.makeEffects("fade"))
                .exitAnim(vp.animation.makeEffects("fade"));
        }   
    }

    /**
    * Update text shapes for pie chart.
    */
    private static postUpdateShapes(textLayerOption: ITextLayerOption) {    
        var that = this;    
        that.chartTextLayer.postUpdateShapes((layInfo, elements) => {
            var palette = that.chartLayer.fill().scale().palette();
            var outerMargin = that.chartLayer.outerMargin();
            var labelMargin = 10;

            var sliceInfo = vp.layouts.pieLabelHelper(layInfo.width, layInfo.height, outerMargin, labelMargin, palette, textLayerOption.dataRecords, textLayerOption.y[0]);

            elements.map((element, index) => {
                var info = sliceInfo[index];
                var data = textLayerOption.dataRecords[index];

                vp.select(element)
                    .attr("x", info.xText)
                    .attr("y", info.yText);                   

                var adjust = vp.internal.calculateTextAdjust(element, info.hTextAlign, info.vTextAlign);
                vp.select(element)
                    .attr("dx", adjust.x)
                    .attr("dy", adjust.y);
            });
        });
    }
}