class Strings {
    // Images url for charts
    public static chartTypeImages = {
        regularColumn: "../Icons/column_regular_type.png",
        stackedColumn: "../Icons/column_stacked_type.png",
        regularBar: "../Icons/bar_regular_type.png",
        stackedBar: "../Icons/bar_stacked_type.png",
        line: "../Icons/line_type.png",
        regularPie: "../Icons/pie_regular_type.png",
        innerRaduisPie: "../Icons/pie_innerradius_type.png",
        regularArea: "../Icons/area_regular_type.png",
        stackedArea: "../Icons/area_stacked_type.png",
        people: "../Icons/people_type.png"
    };

    // Chart stacked types 
    public static chartStackTypes = {
        stack: "stack",
        dodge: "dodge",
        identity: "identity",
        empty: ""
    };

    // Chart types groups
    public static chartTypeGroups = {
        column: "chartType-column",
        bar: "chartType-bar",
        line: "chartType-line",
        pie: "chartType-pie",
        area: "chartType-area",
        people: "chartType-people"
    };

    // Default line colors.
    public static defaultBarColors = {
        name: "chartAccent1Color",
        values: ["#4A72B8", "#ED7D31", "#8AB25F", "#846A52", "#B26DAA", "#89C6C0", "#EC4424"]
    };

    // Default category name.
    public static seriesName = "Series";

    // Table css strings.
    public static tableCSS = {
        table: "data-table",
        td: "data-td",
        solidTd: "solid-data-td",
        cellNoBorder: "cell-no-border",
        cellNumber: "cell-number",
        cellSeries: "cell-series",
        cellFirstSeries: "cell-first-series",
        cellLastSeries: "cell-last-series",
        cellCategory: "cell-category",
        cellFirstCategory: "cell-first-category",
        cellLastCategory: "cell-last-category",
        cellRightBoundary: "cell-right-boundary",
        cellBottomBoundary: "cell-bottom-boundary",
        cellCurrent: "cell-current",
        selectAllSelected: "select-all-selected",
        toolbarIconActive: "toolbar-icon-active"
    };

    // Configure keys for people charts.
    public static configureKeys = {
        theme: "theme",
        shape: "shape",
        sku: "sku"
    };

    // Strings for people tabs.
    public static peopleTabs = {
        basic: "Basic",
        type: "Type",
        theme: "Theme"
    };

    // Icon urls for data page.
    public static tableIcons = {
        insertColumnLeftButtonActive: "../Icons/insert_column_left_active.png",
        insertColumnLeftButtonRest: "../Icons/insert_column_left_rest.png",
        insertColumnRightButtonActive: "../Icons/insert_column_right_active.png",
        insertColumnRightButtonRest: "../Icons/insert_column_right_rest.png",
        insertRowAboveButtonActive: "../Icons/insert_row_above_active.png",
        insertRowAboveButtonRest: "../Icons/insert_row_above_rest.png",
        insertRowBelowButtonActive: "../Icons/insert_row_below_active.png",
        insertRowBelowButtonRest: "../Icons/insert_row_below_rest.png",
        selectAllActive: "../Icons/select_all_active.png",
        selectAllRest: "../Icons/select_all_rest.png",
    };

    // Office content accent class name.
    public static officeContentAccent = {
        color: "office-contentAccent2-color",
        bgColor: "office-contentAccent3-bgColor",
        borderColor: "office-contentAccent1-borderColor"
    };

    // VuePlot chart part names.
    public static chartPartNames = {
        title: "chartFrame.title",
        margins: "chartFrame.margins",
        plotBg: "chartFrame.plotBg",
        gridLines: "chartFrame.gridLines",
        xaxisLabel: "xaxis.label",
        xaxisTitle: "xaxis.title",
        yaxisLabel: "yaxis.label",
        yaxisTitle: "yaxis.title",
        yaxisLine: "yaxis.axisLine",
        yaxisTick:"yaxis.tick",
        legendTitle: "legend.title",
        legendLabel: "legendAxis.label",
        legendBox: "legend.box",
        axisLine: "legendAxis.axisLine",
        layerText: "layerText"
    };

    // Icons for button
    public static buttonIcons = {
        back: "../Icons/Back.svg",
        backHover: "../Icons/Back_hover.svg",
        backPress: "../Icons/Back_press.svg",
        backPPT: "../Icons/Back_ppt.svg",
        backHoverPPT: "../Icons/Back_hover_ppt.svg",
        backPressPPT: "../Icons/Back_press_ppt.svg",
        backRTL: "../Icons/rtl/back_excel.svg",
        backHoverRTL: "../Icons/rtl/back_hover_excel.svg",
        backPressRTL: "../Icons/rtl/back_press_excel.svg",
        backRTLPPT: "../Icons/rtl/back_ppt.svg",
        backHoverRTLPPT: "../Icons/rtl/back_hover_ppt.svg",
        backPressRTLPPT: "../Icons/rtl/back_press_ppt.svg",
        setting: "../Icons/Setting.svg",
        settingHover: "../Icons/Setting_hover.svg",
        settingPress: "../Icons/Setting_press.svg",
        data: "../Icons/Data.svg",
        dataHover: "../Icons/Data_hover.svg",
        dataPress: "../Icons/Data_press.svg",
        chartType: "../Icons/graph_normal.svg",
        chartTypeHover: "../Icons/graph_hover.svg",
        chartTypePress: "../Icons/graph_press.svg"        
    };

    // Font families.
    public static fontFamilies = {
        segoeUISemilight: "Segoe UI Semilight",
        segoeUI : "Segoe UI"
    };

    // Welcome box options.
    public static welcomeBoxSizeOptions = {
        minWidth: 450,
        minHeight: 300,
        scale: 0.8,
        marginTopScale: 0.1
    };

    // Chart size options
    public static chartSizeOptions = {
        heightRatio: 0.75,
        widthRatio: 0.95,
        minHeight: 245,
        minWidth: 500
    };

    // People chart size options.
    public static peopleChartSizeOptions = {
        heightRatio: 1.27,       
        minHeight: 200     
    };

    // Custome chart size options, this will be used on chart type page.
    public static customChartSizeOptions = {
        heightRatio: 1.4,
        widthRatio: 1.06,
        minHeight: 195,
        minWidth: 400
    };

    // Pie chart size options.
    public static pieSizeOptions = {
        defaultValue: 100,
        innerRadiusRatio: 0.15
    };

    // Custom legend class names.
    public static legendBoxClassNames = {
        customLegend: "custom-Legend",
        legendEntry: "legend-Entry",
        colorSquare: "color-Square",
        seriesName: "series-Name",
        legendEntryFocus: "legend-Entry-focus"
    };
}