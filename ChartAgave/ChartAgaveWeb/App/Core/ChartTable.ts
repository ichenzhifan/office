interface ITableSettings {
    maxColumn?: number;
    maxRow?: number;
    minCountOfColumnWithBorder?: number;
    minCountOfRowWithBorder?: number;
    showColumnIndex?: boolean;
    showRowIndex?: boolean;
    showColumnHeader?: boolean;
    showRowHeader?: boolean;
}

class ChartTable {
    public $firstSeparator: JQuery;
    public $showColumnHeader: JQuery;
    public $showRowHeader: JQuery;
    public $secondSeparator: JQuery;
    public $insertColumnLeftToolbar: JQuery;
    public $insertColumnRightToolbar: JQuery;
    public $deleteColumnToolbar: JQuery;
    public $insertRowAboveToolbar: JQuery;
    public $insertRowBelowToolbar: JQuery;
    public $deleteRowToolbar: JQuery;
    public $insertColumnLeftButton: JQuery;
    public $insertColumnRightButton: JQuery;
    public $insertRowAboveButton: JQuery;
    public $insertRowBelowButton: JQuery;
    public $horizontalSelectedGrip: JQuery;
    public $verticalSelectedGrip: JQuery;
    public $selectAll: JQuery;

    public selectionRange: { start: Coords; end: Coords };

    public settings: ITableSettings;

    public tableData: any[][];

    public cachedRowHeaders: any[];

    public cachedColumnHeaders: any[];

    private static instance: ChartTable;

    public static getInstance(): ChartTable {
        if (!ChartTable.instance) {
            ChartTable.instance = new ChartTable();
        }

        return ChartTable.instance;
    }

    private keyBoard: KeyboardHelper;

    constructor() {
        this.settings = {
            maxColumn: 30,
            maxRow: 100,
            minCountOfColumnWithBorder: 1,
            minCountOfRowWithBorder: 3,
            showColumnIndex: false,
            showRowIndex: false,
            showColumnHeader: true,
            showRowHeader: true
        };
        this.keyBoard = new KeyboardHelper();
    }

    /** 
    * Initialize the table toolbar
    */
    public initializeTableToolbar() {
        this.$firstSeparator = $("#firstSeparator");
        this.$showColumnHeader = $("#showColumnHeader").click(() => {
            ChartTableHelper.toggleColumnHeaderVisibility();
            return false;
        });

        this.$showRowHeader = $("#showRowHeader").click(() => {
            ChartTableHelper.toggleRowHeaderVisibility();
            return false;
        });

        // Keyboard accessibility.
        this.keyBoard.addKeyEvent(
            "#showColumnHeader",
            [OfficeUtil.Strings.keyCodes.enter],
            () => {
                ChartTableHelper.toggleColumnHeaderVisibility();
                return false;
            });

        this.keyBoard.addKeyEvent(
            "#showRowHeader",
            [OfficeUtil.Strings.keyCodes.enter],
            () => {
                ChartTableHelper.toggleRowHeaderVisibility();
                return false;
            });

        this.$secondSeparator = $("#secondSeparator");
        this.$horizontalSelectedGrip = $("#horizontalSelectedGrip");
        this.$verticalSelectedGrip = $("#verticalSelectedGrip");

        var insertLeftHandler = () => {
            var index = TableSelection.selectedColumnIndex();
            ChartTableHelper.insertColumnLeft(index);
            this.updateData();
            this.drawTable();
            TableSelection.selectColumn(index + 1);

            return false;
        };

        var insertRightHandler = () => {
            var index = TableSelection.selectedColumnIndex();
            ChartTableHelper.insertColumnRight(index);
            this.updateData();
            this.drawTable();
            TableSelection.selectColumn(index);

            return false;
        };

        var insertAboveHandler = () => {
            var index = TableSelection.selectedRowIndex();
            ChartTableHelper.insertRowAbove(index);
            this.updateData();
            this.drawTable();
            TableSelection.selectRow(index + 1);

            return false;
        };

        var insertBelowHandler = () => {
            var index = TableSelection.selectedRowIndex();
            ChartTableHelper.insertRowBelow(index);
            this.updateData();
            this.drawTable();
            TableSelection.selectRow(index);

            return false;
        };

        if (OfficeUtil.Util.isRtlLanguage()) {
            this.$insertColumnLeftToolbar = $("#addColumnLeft").click(insertRightHandler);
            this.$insertColumnRightToolbar = $("#addColumnRight").click(insertLeftHandler);

            // Keyboard accessibility.
            this.keyBoard.addKeyEvent(
                "#addColumnLeft",
                [OfficeUtil.Strings.keyCodes.enter],
                insertRightHandler);

            this.keyBoard.addKeyEvent(
                "#addColumnRight",
                [OfficeUtil.Strings.keyCodes.enter],
                insertLeftHandler);
        }
        else {
            this.$insertColumnLeftToolbar = $("#addColumnLeft").click(insertLeftHandler);
            this.$insertColumnRightToolbar = $("#addColumnRight").click(insertRightHandler);

            // Keyboard accessibility.
            this.keyBoard.addKeyEvent(
                "#addColumnLeft",
                [OfficeUtil.Strings.keyCodes.enter],
                insertLeftHandler);

            this.keyBoard.addKeyEvent(
                "#addColumnRight",
                [OfficeUtil.Strings.keyCodes.enter],
                insertRightHandler);
        }

        this.$deleteColumnToolbar = $("#deleteColumn")
            .click(() => {
                ChartTableHelper.deleteColumn(TableSelection.selectedColumnIndex());
                this.updateData();
                this.drawTable();

                return false;
            });
        this.$insertRowAboveToolbar = $("#addRowAbove").click(insertAboveHandler);
        this.$insertRowBelowToolbar = $("#addRowBelow").click(insertBelowHandler);
            
        this.$deleteRowToolbar = $("#deleteRow")
            .click(() => {
                ChartTableHelper.deleteRow(TableSelection.selectedRowIndex());
                this.updateData();
                this.drawTable();

                return false;
            });

        // Keyboard accessibility.
        this.keyBoard.addKeyEvent(
            "#deleteColumn",
            [OfficeUtil.Strings.keyCodes.enter],
            () => {
                ChartTableHelper.deleteColumn(TableSelection.selectedColumnIndex());
                this.updateData();
                this.drawTable();
                return false;
            });

        this.keyBoard.addKeyEvent(
            "#addRowAbove",
            [OfficeUtil.Strings.keyCodes.enter],
            insertAboveHandler);

        this.keyBoard.addKeyEvent(
            "#addRowBelow",
            [OfficeUtil.Strings.keyCodes.enter],
            insertBelowHandler);

        this.keyBoard.addKeyEvent(
            "#deleteRow",
            [OfficeUtil.Strings.keyCodes.enter],
            () => {
                ChartTableHelper.deleteRow(TableSelection.selectedRowIndex());
                this.updateData();
                this.drawTable();
                return false;
            });

        this.$insertColumnLeftButton = $("#insertColumnLeft")
            .mouseleave(() => { this.$insertColumnLeftButton.attr("src", Strings.tableIcons.insertColumnLeftButtonRest); })
            .mouseenter(() => { this.$insertColumnLeftButton.attr("src", Strings.tableIcons.insertColumnLeftButtonActive); });
        this.$insertColumnRightButton = $("#insertColumnRight")
            .mouseleave(() => { this.$insertColumnRightButton.attr("src", Strings.tableIcons.insertColumnRightButtonRest); })
            .mouseenter(() => { this.$insertColumnRightButton.attr("src", Strings.tableIcons.insertColumnRightButtonActive); });

        if (OfficeUtil.Util.isRtlLanguage()) {
            this.$insertColumnLeftButton.click(insertRightHandler);
            this.$insertColumnRightButton.click(insertLeftHandler);
        }
        else {
            this.$insertColumnLeftButton.click(insertLeftHandler);
            this.$insertColumnRightButton.click(insertRightHandler);
        }

        this.$insertRowAboveButton = $("#insertRowAbove")
            .mouseleave(() => { this.$insertRowAboveButton.attr("src", Strings.tableIcons.insertRowAboveButtonRest); })
            .mouseenter(() => { this.$insertRowAboveButton.attr("src", Strings.tableIcons.insertRowAboveButtonActive); })
            .click(insertAboveHandler);
        this.$insertRowBelowButton = $("#insertRowBelow")
            .mouseleave(() => { this.$insertRowBelowButton.attr("src", Strings.tableIcons.insertRowBelowButtonRest); })
            .mouseenter(() => { this.$insertRowBelowButton.attr("src", Strings.tableIcons.insertRowBelowButtonActive); })
            .click(insertBelowHandler);

        this.$selectAll = $("#selectAll")
            .hover(() => { this.$selectAll.addClass(Strings.tableCSS.selectAllSelected); },
            () => { this.$selectAll.removeClass(Strings.tableCSS.selectAllSelected); })
            .click(() => {
                TableSelection.selectAll();
            });

        // keyboard accessibility
        this.keyBoard.addKeyEvent(
            "#selectAll",
            [OfficeUtil.Strings.keyCodes.enter],
            () => {
                TableSelection.selectAll();
            });

        $(".toolbar-icon")
            .focusin(e=> {
                $(this).addClass("toolbar-icon-focus");
            })
            .focusout((e) => {
                $(this).removeClass("toolbar-icon-focus");
            });

        ChartTableHelper.setColumnHeaderVisibility();
        ChartTableHelper.setRowHeaderVisibility();
        // Above two functions invoked drawTable function, and add keypress listener in document.
        // Don't want to hit this event when this page don't be loaded. here remove the event listener
        // for workaround.
        ChartTableHelper.removeKeyDownListener();
    }

    /** 
    * Update the table data
    */
    public updateData() {
        this.tableData = ChartTableHelper.getTableData();
    }

    /**
     * Draw the editable table
     * the table is always one row and one column larger than data, and the minimal data size is 5x5
     * compared to data, two external rows/columns will be added:
     *   the first row shows the alphabet index of column (A, B, C and etc)
     *   the first column shows the number index of row (1, 2, 3 and etc)
    */
    public drawTable() {
        var chartData = this.tableData;

        var rowCountOfTable = ChartTableHelper.rowCountOfRenderTable();
        var columnCountOfTable = ChartTableHelper.columnCountOfRenderTable();
        var rowCountOfData = ChartTableHelper.rowCountOfData();
        var columnCountOfData = ChartTableHelper.columnCountOfData();

        var needMinCountOfColumnWithBorder = columnCountOfData < this.settings.minCountOfColumnWithBorder;
        var needMinCountOfRowWithBorder = rowCountOfData < this.settings.minCountOfRowWithBorder;

        var $tr: JQuery;
        var $td: JQuery;

        var $table = $("<table></table>").addClass(Strings.tableCSS.table);
        $table.attr("tabindex", "2");
        var $tbody = $("<tbody></tbody>");

        var rowOffset = this.settings.showRowHeader ? 1 : 0;
        var colOffset = this.settings.showColumnHeader ? 1 : 0;

        for (var r = 0; r < rowCountOfTable; r++) {
            for (var c = 0; c < columnCountOfTable; c++) {
                if (c === 0) {
                    $tr = $("<tr></tr>");
                }

                $td = $("<td></td>").addClass(Strings.tableCSS.td);

                // The first row is alphabet index, and the first cell is blank
                if (r === 0) {
                    if (c === 0) {
                        $td.addClass(Strings.tableCSS.cellNumber).addClass(Strings.tableCSS.solidTd);
                    }
                    else {
                        // Convert the number to alphbet index
                        $td.text(ChartTableHelper.convertNumberToAlphabetIndex(c)).addClass(Strings.tableCSS.solidTd);
                    }
                }

                // The second row is for series name, and the second cell is blank
                if (r === 1 && this.settings.showRowHeader) {
                    if (c === 0) {
                        $td.text("1").addClass(Strings.tableCSS.cellNumber).addClass(Strings.tableCSS.solidTd);
                    }

                    if (c === 1 && this.settings.showColumnHeader) {
                        $td.addClass(Strings.tableCSS.cellNoBorder).addClass(Strings.tableCSS.solidTd);
                    }

                    if (c >= 1 && !(c === 1 && this.settings.showColumnHeader)) {
                        if (needMinCountOfColumnWithBorder && c - colOffset - 1 <= this.settings.minCountOfColumnWithBorder - 1) {
                            $td.addClass(Strings.tableCSS.cellSeries).addClass(Strings.tableCSS.solidTd);
                            if (c - colOffset - 1 === 0) {
                                $td.addClass(Strings.tableCSS.cellFirstSeries);
                            }
                            if (c - colOffset - 1 === this.settings.minCountOfColumnWithBorder - 1) {
                                $td.addClass(Strings.tableCSS.cellLastSeries);
                            }
                        }
                        if (c - colOffset - 1 < columnCountOfData) {
                            $td.text(chartData[0][c - colOffset]);
                            if (!needMinCountOfColumnWithBorder) {
                                $td.addClass(Strings.tableCSS.cellSeries).addClass(Strings.tableCSS.solidTd);
                                if (c - colOffset - 1 === 0) {
                                    $td.addClass(Strings.tableCSS.cellFirstSeries);
                                }
                                if (c - colOffset - 1 === columnCountOfData - 1) {
                                    $td.addClass(Strings.tableCSS.cellLastSeries);
                                }
                            }
                        }
                    }
                }

                if (r > 1 || (r === 1 && !this.settings.showRowHeader)) {
                    // The first cell is for row index
                    if (c === 0) {
                        $td.text(r).addClass(Strings.tableCSS.cellNumber).addClass(Strings.tableCSS.solidTd);
                    }

                    // The second cell is for category name
                    if (c === 1 && this.settings.showColumnHeader) {
                        if (needMinCountOfRowWithBorder && r - rowOffset - 1 <= this.settings.minCountOfRowWithBorder - 1) {
                            $td.addClass(Strings.tableCSS.cellCategory).addClass(Strings.tableCSS.solidTd);
                            if (r - rowOffset - 1 === 0) {
                                $td.addClass(Strings.tableCSS.cellFirstCategory);
                            }
                            if (r - rowOffset - 1 === this.settings.minCountOfRowWithBorder - 1) {
                                $td.addClass(Strings.tableCSS.cellLastCategory);
                            }
                        }

                        if (r - rowOffset - 1 < rowCountOfData) {
                            $td.text(chartData[r - rowOffset][0]);
                            if (!needMinCountOfRowWithBorder) {
                                $td.addClass(Strings.tableCSS.cellCategory).addClass(Strings.tableCSS.solidTd);
                                if (r - rowOffset - 1 === 0) {
                                    $td.addClass(Strings.tableCSS.cellFirstCategory);
                                }
                                if (r - rowOffset - 1 === rowCountOfData - 1) {
                                    $td.addClass(Strings.tableCSS.cellLastCategory);
                                }
                            }
                        }
                    }

                    if (c > 1 || (c === 1 && !this.settings.showColumnHeader)) {
                        if ((needMinCountOfRowWithBorder) &&
                            r - rowOffset - 1 === this.settings.minCountOfRowWithBorder - 1 &&
                            c - colOffset - 1 < Math.max(columnCountOfData, this.settings.minCountOfColumnWithBorder)) {
                            $td.addClass(Strings.tableCSS.cellBottomBoundary);
                        }
                        if ((needMinCountOfColumnWithBorder) &&
                            c - colOffset - 1 === this.settings.minCountOfColumnWithBorder - 1 &&
                            r - rowOffset - 1 < Math.max(rowCountOfData, this.settings.minCountOfRowWithBorder)) {
                            $td.addClass(Strings.tableCSS.cellRightBoundary);
                        }

                        if (r - rowOffset - 1 < Math.max(rowCountOfData, this.settings.minCountOfRowWithBorder) &&
                            c - colOffset - 1 < Math.max(columnCountOfData, this.settings.minCountOfColumnWithBorder)) {
                            if (r - rowOffset - 1 < rowCountOfData && c - colOffset - 1 < columnCountOfData) {
                                var dataText: string = !chartData[r - rowOffset][c - colOffset] ? "" : "" + chartData[r - rowOffset][c - colOffset];
                                $td.text(dataText).addClass(Strings.tableCSS.solidTd);
                            }
                            if (!needMinCountOfRowWithBorder && r - rowOffset - 1 === rowCountOfData - 1) {
                                $td.addClass(Strings.tableCSS.cellBottomBoundary);
                            }
                            if (!needMinCountOfColumnWithBorder && c - colOffset - 1 === columnCountOfData - 1) {
                                $td.addClass(Strings.tableCSS.cellRightBoundary);
                            }
                        }
                    }
                }

                $td.appendTo($tr);

                if (c === columnCountOfTable - 1) {
                    $tr.appendTo($tbody);
                }
            }
        }

        $("#dataTableDiv").children("table").remove();
        $tbody.appendTo($table);
        $table.appendTo($("#dataTableDiv"));

        ChartTableHelper.setColumnIndexVisibility();
        ChartTableHelper.setRowIndexVisibility();
        TableSelection.initialized();
        ChartTableHelper.addTableFocusListener();
        ChartTableHelper.addKeyDownListener();
        ChartTableHelper.addTDListners();
        ChartTableHelper.addCopyPaste();
        this.drawButtons();
    }

    /** 
    * Draw the generated buttons
    */
    private drawButtons() {
        $(".horizontal-select-grip").remove();
        $(".vertical-select-grip").remove();
        this.hideButtons();

        ChartTableHelper.findTr(1).children().each((i, e) => {
            if (i !== 0 || ChartTable.getInstance().settings.showColumnIndex) {
                var $td = $(e);
                var left = $td.offset().left + $("#tableFrame").scrollLeft() - 60 + 1;
                if (OfficeUtil.Util.isRtlLanguage()) {
                    left += 15;
                }
                var width = $td.outerWidth() - 2;

                var $columnSelectGrip = $("<div/>");

                $columnSelectGrip.addClass("horizontal-select-grip").css({
                    left: left + "px",
                    width: width + "px",
                });

                var $thick = $("<div/>").addClass("thick");
                var $thin = $("<div/>").addClass("thin");
                $thick.appendTo($columnSelectGrip);
                $thin.appendTo($columnSelectGrip);

                $columnSelectGrip.hover(
                    function () {
                        $(this).addClass("select-grip-active");
                        $(this).children().hide();
                    },
                    function () {
                        $(this).removeClass("select-grip-active");
                        $(this).children().show();
                    });

                $columnSelectGrip.appendTo($("#dataTableDiv"));
            }
        });

        ChartTableHelper.findTr().each((i, e) => {
            if (i !== 0 || ChartTable.getInstance().settings.showRowIndex) {
                var $td = $(e).children("td:eq(1)");
                var top = $td.offset().top + $("#tableFrame").scrollTop() - 167;
                var height = $td.outerHeight() - 2;

                var $rowSelectGrip = $("<div/>");
                $rowSelectGrip.addClass("vertical-select-grip").css({
                    top: top + "px",
                    height: height + "px",
                });

                var $thick = $("<div/>").addClass("thick");
                var $thin = $("<div/>").addClass("thin");
                $thick.appendTo($rowSelectGrip);
                $thin.appendTo($rowSelectGrip);

                $rowSelectGrip.hover(
                    function () {
                        $(this).addClass("select-grip-active");
                        $(this).children().hide();
                    },
                    function () {
                        $(this).removeClass("select-grip-active");
                        $(this).children().show();
                    });

                $rowSelectGrip.appendTo($("#dataTableDiv"));
            }
        });

        $(".horizontal-select-grip").on("click", function () {
            var self = ChartTable.getInstance();
            self.hideButtons();

            var $grip = $(this);
            var columnIndex = $grip.index(".horizontal-select-grip");
            if (!ChartTable.getInstance().settings.showColumnIndex) {
                columnIndex++;
            }
            self.$horizontalSelectedGrip.css({
                left: $grip.css("left"),
                width: $grip.css("width")
            });

            var $resizeHandler = self.$horizontalSelectedGrip.children("div").css({
                left: parseFloat($grip.css("width")) - 8
            });

            self.$insertColumnLeftButton.css({
                left: parseFloat($grip.css("left")) - 25
            });

            self.$insertColumnRightButton.css({
                left: parseFloat($grip.css("left")) + parseFloat($grip.css("width"))
            });

            if (columnIndex === 0) {
                TableSelection.setSelectionRange(null, null);
            }
            else {
                TableSelection.setSelectionRange({ col: columnIndex, row: 1 }, { col: columnIndex, row: ChartTableHelper.maxRowIndex() });
            }

            if (TableSelection.selectedColumnIndex() > 0) {
                self.$insertColumnLeftButton.show();
                self.$insertColumnLeftToolbar.show();
                self.$deleteColumnToolbar.show();
            }

            self.$secondSeparator.show();
            self.$insertColumnRightButton.show();
            self.$horizontalSelectedGrip.show();
            self.$insertColumnRightToolbar.show();
        });

        $(".vertical-select-grip").on("click", function () {
            var self = ChartTable.getInstance();
            self.hideButtons();

            var $grip = $(this);
            var rowIndex = $grip.index(".vertical-select-grip");
            if (!ChartTable.getInstance().settings.showRowIndex) {
                rowIndex++;
            }
            self.$verticalSelectedGrip.css({
                top: $grip.css("top"),
                height: $grip.css("height")
            });

            var $resizeHandler = self.$verticalSelectedGrip.children("div").css({
                top: parseFloat($grip.css("top")) + parseFloat($grip.css("height"))
            });

            self.$insertRowBelowButton.css({
                top: parseFloat($grip.css("top")) + parseFloat($grip.css("height"))
            });

            if (rowIndex === 0) {
                TableSelection.setSelectionRange(null, null);
            }
            else {
                TableSelection.setSelectionRange({ col: 1, row: rowIndex }, { col: ChartTableHelper.maxColumnIndex(), row: rowIndex });
            }

            if (TableSelection.selectedRowIndex() > 0) {
                self.$insertRowAboveButton.css({
                    top: parseFloat($grip.css("top")) - 25
                });
                self.$insertRowAboveButton.show();
                self.$insertRowAboveToolbar.show();
                self.$deleteRowToolbar.show();
            }

            self.$secondSeparator.show();
            self.$insertRowBelowButton.show();
            self.$verticalSelectedGrip.show();
            self.$insertRowBelowToolbar.show();
        });
    }

    /**
    * Hide the fixed buttons
    */
    public hideButtons() {
        this.$secondSeparator.hide();
        this.$horizontalSelectedGrip.hide();
        this.$verticalSelectedGrip.hide();
        this.$insertColumnLeftButton.hide();
        this.$insertColumnRightButton.hide();
        this.$insertRowAboveButton.hide();
        this.$insertRowBelowButton.hide();
        this.$insertColumnLeftToolbar.hide();
        this.$insertColumnRightToolbar.hide();
        this.$deleteColumnToolbar.hide();
        this.$insertRowAboveToolbar.hide();
        this.$insertRowBelowToolbar.hide();
        this.$deleteRowToolbar.hide();
    }

    /**
    * Show buttons of show headers
    */
    public showButtonsOfShowHeaders() {
        this.$firstSeparator.show();
        this.$showColumnHeader.show();
        this.$showRowHeader.show();
    }

    /**
    * Hide buttons of show headers
    */
    public hideButtonsOfShowHeaders() {
        this.$firstSeparator.hide();
        this.$showColumnHeader.hide();
        this.$showRowHeader.hide();
    }

    /**
    * Tear down the table and remove the listeners
    */
    public destroyTable() {
        $("#dataTableDiv").children("table").remove();
        ChartTableHelper.removeTDListeners();
        ChartTableHelper.removeKeyDownListener();
    }
}