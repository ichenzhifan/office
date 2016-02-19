interface IOfficeTheme {   
    primaryFontColor: string;
    primaryBackgroundColor: string;
    accent1: string;
    accent2: string;
    accent3: string;
    hyperlink: string;
    followedHyperlink: string;
    headerFont: string;
    bodyFont: string;
}

interface ISpace {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

interface Iline {
    size: string;
    color: string;
}

interface IAgaveTheme {
    fontFamily?: string;
    fontSize?: string;
    fontColor?: string;
    frameOutline?: Iline;
    axisline?: Iline;
    space?: ISpace;
}

class AgaveTheme {    
    // Store current office theme.
    private static currentTheme: IOfficeTheme;

    constructor() {        
        var themeManager = new OfficeThemeManager();
        themeManager.onThemeChange(this.themeChangeHandler);
    }

    /**
    * Theme change handler, will hit when theme change on ppt host.
    */
    private themeChangeHandler(e) {
        AgaveTheme.currentTheme = {
            primaryFontColor: e.theme.primaryFontColor,
            primaryBackgroundColor: e.theme.primaryBackgroundColor,
            accent1: e.theme.accent1,
            accent2: e.theme.accent2,
            accent3: e.theme.accent3,
            hyperlink: e.theme.hyperlink,
            followedHyperlink: e.theme.followedHyperlink,
            headerFont: e.theme.headerLocalizedFont,
            bodyFont: e.theme.bodyLocalizedFont
        }; 

        // Update default bar colors by using accent colors.
        var colors = [e.theme.accent1, e.theme.accent2, e.theme.accent3, e.theme.accent4, e.theme.accent1, e.theme.accent5, e.theme.accent6];  
        Strings.defaultBarColors.values = colors;  

        // Apply current host theme to chart.
        ChartAgave.theme && ChartAgave.theme.syncTheme();   
        ChartAgave.theme && ChartAgave.theme.customizeTheme(); 

        if (ChartAgave.chartType === ChartTypes.People) {
            ChartAgave.theme && ChartAgave.theme.updatePeopleTheme();   
        }
    }      

    /**
    * Set customize chart theme.
    */
    public customizeTheme() {
        var instance = this;

        // Workaround vuePlot issue about set titleSize in setCallback failed.
        var titleTheme = instance.titleTheme;
        if (Chart.chartPlot && titleTheme.fontSize) {
            (<any>(Chart.chartPlot)).titleSize(titleTheme.fontSize);
        }

        // Update chart colors by accent colors.
        Chart.updateChartColor(Strings.defaultBarColors.values);

        // Update chart theme in this callback.
        vp.session.currentTheme().setCallback(function (partName: string, seriesIndex: number, ab: any) {
            switch (partName) {
                case Strings.chartPartNames.title: {
                    var options = instance.titleTheme;
                    ab.fontFamily = options.fontFamily;
                    ab.textFill = options.fontColor;
                    break;
                }
                case Strings.chartPartNames.plotBg: {
                    ab.fill = "none";
                    break;
                }
                case Strings.chartPartNames.legendTitle: {
                    var options = instance.legendFont;
                    ab.fontFamily = options.fontFamily;
                    ab.textSize = options.fontSize;
                    ab.textFill = options.fontColor;
                    break;
                }
                case Strings.chartPartNames.xaxisLabel: {
                    var options = instance.chartText;
                    ab.fontFamily = options.fontFamily;
                    ab.textSize = options.fontSize;
                    ab.textFill = options.fontColor;
                    break;
                }
                case Strings.chartPartNames.axisLine: {
                    var options = instance.axisLine;
                    ab.stroke = options.axisline.color;
                    ab.lineSize = options.axisline.size;
                    break;
                }
                case Strings.chartPartNames.yaxisLine:
                case Strings.chartPartNames.yaxisTick:{
                    ab.lineSize = 0;
                    break;
                }
                case Strings.chartPartNames.layerText:
                case Strings.chartPartNames.xaxisLabel:
                case Strings.chartPartNames.xaxisTitle:
                case Strings.chartPartNames.yaxisLabel:
                case Strings.chartPartNames.yaxisTitle:
                case Strings.chartPartNames.legendLabel: {
                    var options = instance.chartText;
                    ab.fontFamily = options.fontFamily;
                    ab.textSize = options.fontSize;
                    ab.textFill = options.fontColor;
                    break;
                }                
                default: {
                    break;
                }
            }
        });
    }

    /**
   * Setup default theme for agave. it will be called in excel host.
   */
    public static setupHighContrastTheme() {
        // Update chart theme in this callback.
        vp.session.currentTheme().setCallback(function (partName: string, seriesIndex: number, ab: any) {
            switch (partName) {
                case Strings.chartPartNames.title: {
                    ab.fontFamily = Strings.fontFamilies.segoeUISemilight,
                    ab.textFill = "#767676";
                    break;
                }
                case Strings.chartPartNames.plotBg: {
                    ab.fill = "#000";
                    break;
                }
                case Strings.chartPartNames.xaxisLabel:
                case Strings.chartPartNames.legendTitle:
                case Strings.chartPartNames.xaxisLabel:
                case Strings.chartPartNames.xaxisTitle:
                case Strings.chartPartNames.yaxisLabel:
                case Strings.chartPartNames.yaxisTitle:
                case Strings.chartPartNames.legendLabel: {
                    ab.fontFamily = Strings.fontFamilies.segoeUI,
                    ab.textSize = "12";
                    ab.textFill = "#767676";
                    break;
                }
                case Strings.chartPartNames.layerText: {
                    ab.fontFamily = Strings.fontFamilies.segoeUI,
                    ab.textSize = "12";
                    ab.textFill = "#767676";
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }  

    /**
    * Setup default theme for agave. it will be called in excel host.
    */
    public static setupDefaultTheme() {  
        // Update chart theme in this callback.
        vp.session.currentTheme().setCallback(function (partName: string, seriesIndex: number, ab: any) {
            switch (partName) {
                case Strings.chartPartNames.title: {                    
                    ab.fontFamily = Strings.fontFamilies.segoeUISemilight,
                    ab.textFill = "#767676";
                    break;
                } 
                case Strings.chartPartNames.xaxisLabel:
                case Strings.chartPartNames.legendTitle:
                case Strings.chartPartNames.xaxisLabel:
                case Strings.chartPartNames.xaxisTitle:
                case Strings.chartPartNames.yaxisLabel:
                case Strings.chartPartNames.yaxisTitle:
                case Strings.chartPartNames.legendLabel: {                   
                    ab.fontFamily = Strings.fontFamilies.segoeUI,
                    ab.textSize = "12";
                    ab.textFill = "#767676";
                    break;
                }
                case Strings.chartPartNames.layerText: {
                    ab.fontFamily = Strings.fontFamilies.segoeUI,
                    ab.textSize = "12";
                    ab.textFill = "#767676";
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }   

    /**
    * Add accent color class name to support theme in ppt host.
    */
    public syncTheme() {
        if (OfficeUtil.Util.isPresentationView()) {
            // Update font-color and bg-color for chart page.
            var $contentChartPage = $("#contentChartPage");
            $contentChartPage.css("color", AgaveTheme.currentTheme.primaryFontColor);
            $contentChartPage.css("background-color", AgaveTheme.currentTheme.primaryBackgroundColor);

            // Update font-color and bg-color for chart type page.
            var $contentChartTypePage = $("#contentChartTypePage");
            $contentChartTypePage.css("color", AgaveTheme.currentTheme.primaryFontColor);
            $contentChartTypePage.css("background-color", AgaveTheme.currentTheme.primaryBackgroundColor);

            // Update chart title style.
            var $chartTitle = $(".vp-chart-title1");
            $chartTitle.css("color", AgaveTheme.currentTheme.primaryFontColor);
            $chartTitle.css("font-family", AgaveTheme.currentTheme.headerFont);

            // Update series name style.
            var $seriesNames = $("." + Strings.legendBoxClassNames.seriesName);
            $seriesNames.each((index, name) => {
                $(name).css("color", AgaveTheme.currentTheme.primaryFontColor);
                $(name).css("font-family", AgaveTheme.currentTheme.bodyFont);
            });

            // Update color square.
            var colorSquares = $("." + Strings.legendBoxClassNames.colorSquare);
            var colorSchemas = Strings.defaultBarColors.values;

            if (colorSchemas.length < colorSquares.length) {
                var schemas = [];
                var colorIndex = 0;
                var iteration = 1;
                $.each(colorSquares, (index, square) => {
                    if (index < colorSchemas.length) {
                        colorIndex = index;
                    } else if (index === colorSchemas.length * iteration) {
                        colorIndex = 0;
                        iteration++;
                    } else {
                        colorIndex++;
                    }

                    //schemas.push(colorSchemas[colorIndex]);
                    $(square).css("background-color", colorSchemas[colorIndex]);
                });
            } else {
                $.each(colorSquares, (index, square) => {
                    $(square).css("background-color", colorSchemas[index]);
                });
            }

            var $accentColorCtrls = $(".accent-color");
            $accentColorCtrls.css("color", AgaveTheme.currentTheme.primaryFontColor);
            $accentColorCtrls.css("font-family", AgaveTheme.currentTheme.bodyFont);

            // Add presentation agave style to app.
            $("#chartAgaveTheme").attr("href", "../Content/PresentationChartAgave.css");
        }
    }   

    /**
    * Update people theme by user choose.
    */
    public updatePeopleTheme() {
        var $chartTitle = $(".chart-title");
        var $chartValueLabel = $(".chart-value-label");
        var $chartLabel = $(".chart-label");
        var $chartShape = $(".chart-shape");
        var $chartShapePercentage = $(".chart-shape-percentage");

        $chartTitle.css("fill", AgaveTheme.currentTheme.primaryFontColor);
        $chartTitle.css("font-family", AgaveTheme.currentTheme.headerFont);

        $chartValueLabel.css("fill", AgaveTheme.currentTheme.primaryFontColor);
        $chartValueLabel.css("font-family", AgaveTheme.currentTheme.bodyFont);

        $chartLabel.css("fill", AgaveTheme.currentTheme.primaryFontColor);
        $chartLabel.css("font-family", AgaveTheme.currentTheme.bodyFont);

        $chartShape.css("fill", AgaveTheme.currentTheme.accent2);
        $chartShape.css("font-family", AgaveTheme.currentTheme.bodyFont);

        $chartShapePercentage.css("fill", AgaveTheme.currentTheme.accent2);
    }

    /**
    * Title theme.
    */
    public get titleTheme(): IAgaveTheme {
        return {
            fontFamily: AgaveTheme.currentTheme.headerFont,
            fontSize: "28",
            fontColor: AgaveTheme.currentTheme.primaryFontColor          
        };
    }

    /**
    * Legned font theme.
    */
    public get legendFont(): IAgaveTheme {
        return {
            fontFamily: AgaveTheme.currentTheme.bodyFont,
            fontSize: "12",
            fontColor: AgaveTheme.currentTheme.primaryFontColor            
        };
    }

    /**
    * Axis label theme.
    */
    public get chartText(): IAgaveTheme {
        return {
            fontFamily: AgaveTheme.currentTheme.bodyFont,
            fontSize: "12",
            fontColor: AgaveTheme.currentTheme.primaryFontColor           
        };
    }

    /**
    * Axis line theme.
    */
    public get axisLine(): IAgaveTheme {
        var axisline: Iline = {
            size: "1",
            color: "#D8D8D8"
        };
        return {
            axisline: axisline
        };
    }

    /**
    * Chart frame outline theme.
    */
    public get frameOutline(): IAgaveTheme {
        var outline: Iline = {
            size: "2px",
            color: "#D8D8D8"
        };
        return {
            frameOutline: outline
        };
    }
}