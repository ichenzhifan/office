class DataPage implements IAgavePage {
    private $toolbar = $("#tableToolbar");
    private $tableFrame = $("#tableFrame");
    private $backBtn = $("#dataBackBtn");
    private $selectDataBtn = $("#selectDataBtn");

    private horizontalMarginToWindow = 105;
    private verticalMarginToWindow = 180;
    private keyBoard: KeyboardHelper;
    public page = Page.DataPage;
    public chartTable: ChartTable;
    public dataSelection: DataSelection;
    public static SelectionData: any[][] = [];

    constructor() {
        this.chartTable = ChartTable.getInstance();
        this.chartTable.initializeTableToolbar();

        DataSelection.getInstance().hideExternalButtonsOfShowHeaders();

        this.keyBoard = new KeyboardHelper();
        this.$tableFrame.css("width", $(window).outerWidth() - this.horizontalMarginToWindow)
            .css("height", $(window).outerHeight() - this.verticalMarginToWindow);

        // Bind listeners
        this.$backBtn.click({ handler: PageHelper.backBtnHandler });

        this.$tableFrame.click(() => {
            ControlHelper.hideControl(ChartAgave.toolbarControl);
            // To avoid trigger toolbar
            return false;
        });

        if (OfficeUtil.Util.isPresentationView()) {
            this.$selectDataBtn.remove();
            $("#firstSeparator").remove();
        }
        else {
            this.$selectDataBtn.click(() => {
                ControlHelper.hideControl(ChartAgave.toolbarControl);
                // To dismiss the toolbar buttons
                ChartTableHelper.selectCell(ChartTableHelper.getCellByCoords({ row: 1, col: 1 }));
                this.dataSelection = DataSelection.getInstance();
                this.dataSelection.showDialog();
                return false;
            });
        }

        $(window).on("resize", () => {
            this.$tableFrame.css("width", $(window).outerWidth() - this.horizontalMarginToWindow)
                .css("height", $(window).outerHeight() - this.verticalMarginToWindow);
        });

        // Add keyboard accessibility.
        this.keyBoard.addKeyEvent(
            "#dataBackBtn",
            [OfficeUtil.Strings.keyCodes.enter],
            PageHelper.backBtnHandler);

        this.keyBoard.addKeyEvent(
            "#selectDataBtn",
            [OfficeUtil.Strings.keyCodes.enter],
            () => {
                ControlHelper.hideControl(ChartAgave.toolbarControl);
                // To dismiss the toolbar buttons
                ChartTableHelper.selectCell(ChartTableHelper.getCellByCoords({ row: 1, col: 1 }));
                this.dataSelection = DataSelection.getInstance();
                this.dataSelection.showDialog();
                return false;
            });

        // ctrl + F6
        //this.keyBoard.addCtrlKeyEvent(
        //    "#contentDataPage",
        //    [Strings.keyCodes.f6],
        //    (e) => {
        //        $("#selectDataBtn").focus();
        //        return false;
        //    });
    }

    /** 
    * This method will be invoked after page is loaded.
    */
    public afterLoaded() {
        AgaveHelper.initBackbtn();

        // Hide settings command in toolbar in current page.
        $("#toolbarSettings").hide();
        ControlHelper.hideControl(ChartAgave.settingsControl);

        AccessibilityHelper.enableDataPageAccessibility();
        this.chartTable.drawTable();
    }

    /** 
    * This method will be invoked before leaving this page.
    */
    public beforeLeave() {
        if (ChartData.isDataBound === undefined || !ChartData.isDataBound) {
            //if (!this.chartTable.settings.showColumnHeader || !this.chartTable.settings.showRowHeader) {
            //    var tableData = this.chartTable.tableData.slice(0);

            //    if (!this.chartTable.settings.showColumnHeader) {
            //        ChartTableHelper.applyColumnHeaders(false);
            //    }
            //    if (!this.chartTable.settings.showRowHeader) {
            //        ChartTableHelper.applyRowHeaders(false);
            //    }

            //    ChartData.setChartData(this.chartTable.tableData);

            //    this.chartTable.tableData = tableData.slice(0);
            //}
            //else {
            //    ChartData.setChartData(this.chartTable.tableData);
            //}

            ChartData.setChartData(this.chartTable.tableData);
        }

        this.chartTable.destroyTable();

    }
}