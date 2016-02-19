class TableSelection {
    public static isSelecting: boolean;

    /**    
    * Initialization for TableSelection
    */
    public static initialized() {
        TableSelection.isSelecting = false;
        if (!ChartTable.getInstance().selectionRange) {
            ChartTable.getInstance().selectionRange = {
                start: null,
                end: null
            };
        }
    }

    public static hasSelection(): boolean {
        return !!ChartTable.getInstance().selectionRange.start && !!ChartTable.getInstance().selectionRange.end;
    }

    /**    
    * Ruturn ture if multiple cells is selected
    */
    public static isMultiple(): boolean {
        return ChartTable.getInstance().selectionRange.start !== ChartTable.getInstance().selectionRange.end;
    }

    /**    
    * Return JQuery element of selected cell
    */
    public static selectedCell(): JQuery {
        if (ChartTable.getInstance().selectionRange) {
            return ChartTableHelper.getCellByCoords(ChartTable.getInstance().selectionRange.start);
        }

        return null;
    }

    /**
    * Return the index of selected row
    */
    public static selectedRowIndex(): number {
        var chartTable = ChartTable.getInstance();
        var selectionRange = chartTable.selectionRange;
        if (selectionRange &&
            selectionRange.start &&
            selectionRange.end &&
            selectionRange.start.row === selectionRange.end.row &&
            selectionRange.start.col === 1 &&
            selectionRange.end.col === ChartTableHelper.maxColumnIndex()) {
            return selectionRange.start.row;
        }
        else if (chartTable.$verticalSelectedGrip.is(":visible")) {
            return 0;
        }

        return null;
    }

    /**
    * Return the index of selected column
    */
    public static selectedColumnIndex(): number {
        var chartTable = ChartTable.getInstance();
        var selectionRange = chartTable.selectionRange;
        if (selectionRange &&
            selectionRange.start &&
            selectionRange.end &&
            selectionRange.start.col === selectionRange.end.col &&
            selectionRange.start.row === 1 &&
            selectionRange.end.row === ChartTableHelper.maxRowIndex()) {
            return selectionRange.start.col;
        }
        else if (chartTable.$horizontalSelectedGrip.is(":visible")) {
            return 0;
        }

        return null;
    }

    /** 
    * Select all cells
    */
    public static selectAll(): void {
        var start: Coords = { col: 1, row: 1 };
        var end: Coords = { col: ChartTableHelper.maxColumnIndex(), row: ChartTableHelper.maxRowIndex() };

        ChartTable.getInstance().hideButtons();
        TableSelection.setSelectionRange(start, end);
    }

    /**    
    * Return true if all cells are selected
    */
    public static isSelectAll(): boolean {
        var selectionRange = ChartTable.getInstance().selectionRange;
        if (selectionRange.start.col == 1 &&
            selectionRange.start.row == 1 &&
            selectionRange.end.col == ChartTableHelper.maxColumnIndex() &&
            selectionRange.end.row == ChartTableHelper.maxRowIndex()) {
            return true;
        }

        return false;
    }

    /**
    * Select the row by index
    */
    public static selectRow(index: number): void {
        if (!ObjectExtensions.isNullOrUndefined(index)) {
            if (!ChartTable.getInstance().settings.showRowIndex) {
                index--;
            }
            $(".vertical-select-grip:eq(" + index + ")").click();
        }
    }

    /**
    * Select the column by index
    */
    public static selectColumn(index: number): void {
        if (!ObjectExtensions.isNullOrUndefined(index)) {
            if (!ChartTable.getInstance().settings.showColumnIndex) {
                index--;
            }
            $(".horizontal-select-grip:eq(" + index + ")").click();
        }
    }

    /**
    * Select the columns by current selection
    */
    public static selectColumnsOfSelection() {
        var selectionRange = ChartTable.getInstance().selectionRange;

        if (selectionRange.start && selectionRange.end) {
            TableSelection.setSelectionRange({ row: 1, col: selectionRange.start.col },
                { row: ChartTableHelper.maxRowIndex(), col: selectionRange.end.col });
        }
    }

    /**
    * Select the rows by current selection
    */
    public static selectRowsOfSelection() {
        var selectionRange = ChartTable.getInstance().selectionRange;

        if (selectionRange.start && selectionRange.end) {
            TableSelection.setSelectionRange({ row: selectionRange.start.row, col: 1 },
                { row: selectionRange.end.row, col: ChartTableHelper.maxColumnIndex() });
        }
    }

    /**
    * Enlarge the selection to the beginning of rows by current selection
    */
    public static enlargeSelectionToBeginningOfRows() {
        var selectionRange = ChartTable.getInstance().selectionRange;

        if (selectionRange.start && selectionRange.end) {
            TableSelection.setSelectionRangeEnd({row: selectionRange.end.row, col: 1});
        }
    }

    /**
    * Enlarge the selection to the beginning of columns by current selection
    */
    public static enlargeSelectionToBeginningOfColumns() {
        var selectionRange = ChartTable.getInstance().selectionRange;

        if (selectionRange.start && selectionRange.end) {
            TableSelection.setSelectionRangeEnd({ row: 1, col: selectionRange.end.col });
        }
    }

    /**
    * Enlarge the selection to the end of columns by current selection
    */
    public static enlargeSelectionToEndOfColumns() {
        var selectionRange = ChartTable.getInstance().selectionRange;

        if (selectionRange.start && selectionRange.end) {
            TableSelection.setSelectionRangeEnd({ row: ChartTableHelper.maxRowIndex(), col: selectionRange.end.col });
        }
    }

    /**    
    * Add mousemove listener of td
    */
    public static addTDMouseMoveListener() {
        ChartTableHelper.findTd().on("mouseover", function (e) {
            if (TableSelection.isSelecting) {
                var coords: Coords = {
                    col: ChartTableHelper.getColumnIndexOfCell($(this)),
                    row: ChartTableHelper.getRowIndexOfCell($(this))
                };
                TableSelection.setSelectionRangeEnd(coords);
            }
        });
    }

    /**    
    * Remove mousemove listener of td
    */
    public static removeTDMouseMoveListener() {
        ChartTableHelper.findTd().off("mouseover");
    }

    /**    
    * Add mouseup listener on document
    */
    public static addMouseUpListener() {
        $(document).on("mouseup", function (e) {
            if (TableSelection.isSelecting) {
                TableSelection.isSelecting = false;
                TableSelection.removeTDMouseMoveListener();
                TableSelection.removeMouseUplistener();
            }
            else {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    /**    
    * Remove mouseup listener on document
    */
    public static removeMouseUplistener() {
        $(document).off("mouseup");
    }

    /**    
    * Set coords of selectionRange's start
    */
    public static setSelectionRangeStart(start: Coords) {
        ChartTable.getInstance().selectionRange.start = start;
        TableSelection.setSelectionRangeEnd(start);
    }

    /**    
    * Set coords of selectionRange's end
    */
    public static setSelectionRangeEnd(end: Coords) {
        ChartTable.getInstance().selectionRange.end = end;

        if (!TableSelection.isMultiple()) {
            ChartTable.getInstance().hideButtons();
        }

        TableSelection.highlightSelectionRange();
    }

    /**    
    * Tansform the end of selectionRange
    */
    public static transformSelectionRangeEnd(rowDelta: number, colDelta: number) {
        if (ChartTable.getInstance().selectionRange === null) {
            return;
        }

        var coords = {
            row: ChartTable.getInstance().selectionRange.end.row + rowDelta,
            col: ChartTable.getInstance().selectionRange.end.col + colDelta
        };

        if (coords.row <= 1) {
            coords.row = 1;
        }
        else if (coords.row >= ChartTableHelper.maxRowIndex()) {
            coords.row = ChartTableHelper.maxRowIndex();
        }

        if (coords.col <= 1) {
            coords.col = 1;
        }
        else if (coords.col >= ChartTableHelper.maxColumnIndex()) {
            coords.col = ChartTableHelper.maxColumnIndex();
        }

        TableSelection.setSelectionRangeEnd(coords);
    }

    /**    
    * Set selectionRange
    */
    public static setSelectionRange(start: Coords, end: Coords) {
        ChartTable.getInstance().selectionRange = { start: start, end: end };
        $("." + Strings.tableCSS.cellCurrent).removeClass(Strings.tableCSS.cellCurrent);
        // When select the index row/column, we use null for start and end
        if (!start || !end) {
            return;
        }
        if (start.row < 0 || start.col < 0 || end.row < 0 || end.col < 0) {
            throw "invalid parameters";
        }

        if (!TableSelection.isMultiple()) {
            ChartTable.getInstance().hideButtons();
        }

        TableSelection.highlightSelectionRange();
    }

    /**
    * Clear selection
    */
    public static clearSelection() {
        var chartTable = ChartTable.getInstance();
        chartTable.selectionRange.start = null;
        chartTable.selectionRange.end = null;
        $(".cell-current").removeClass("cell-current");
    }

    /**    
    * Hightlight the selectionRange
    */
    public static highlightSelectionRange() {
        $("." + Strings.tableCSS.cellCurrent).removeClass(Strings.tableCSS.cellCurrent);

        var selectionRange = ChartTable.getInstance().selectionRange;
        var startRow = selectionRange.start.row;
        var startCol = selectionRange.start.col;
        var endRow = selectionRange.end.row;
        var endCol = selectionRange.end.col;

        if (startRow > endRow) {
            var temp = startRow
            startRow = endRow;
            endRow = temp;
        }
        if (startCol > endCol) {
            var temp2 = startCol;
            startCol = endCol;
            endCol = temp2;
        }

        startRow = startRow === 0 ? 1 : startRow;
        startCol = startCol === 0 ? 1 : startCol;

        var $td: JQuery;
        for (var r = startRow; r <= endRow; r++) {
            for (var c = startCol; c <= endCol; c++) {
                $td = ChartTableHelper.getCell(r, c);
                $td.addClass("cell-current");
            }
        }

        var scrollLeft = $("#tableFrame").scrollLeft();
        var scrollTop = $("#tableFrame").scrollTop();
        if (!$("#dataTableDiv").find("table").is(":focus")) {
            $("#dataTableDiv").find("table").focus();
        }
        $("#tableFrame").scrollLeft(scrollLeft);
        $("#tableFrame").scrollTop(scrollTop);
    }

    /**
    * Move selection by direction
    * if the shift key is down, change the selection range instead of moving the selection
    */
    public static moveSelection(moveDirection: MoveDirection, shiftKey: boolean) {
        if (ChartTableHelper.isEditing()) {
            return;
        }

        if (shiftKey) {
            switch (moveDirection) {
                case MoveDirection.Left:
                    TableSelection.transformSelectionRangeEnd(0, -1);
                    break;
                case MoveDirection.Up:
                    TableSelection.transformSelectionRangeEnd(-1, 0);
                    break;
                case MoveDirection.Right:
                    TableSelection.transformSelectionRangeEnd(0, 1);
                    break;
                case MoveDirection.Down:
                    TableSelection.transformSelectionRangeEnd(1, 0);
                    break;
                default:
                    break;
            }

        }
        else {
            switch (moveDirection) {
                case MoveDirection.Left:
                    ChartTableHelper.selectNeighbourCell(NeighbourCell.Left);
                    break;
                case MoveDirection.Up:
                    ChartTableHelper.selectNeighbourCell(NeighbourCell.Above);
                    break;
                case MoveDirection.Right:
                    ChartTableHelper.selectNeighbourCell(NeighbourCell.Right);
                    break;
                case MoveDirection.Down:
                    ChartTableHelper.selectNeighbourCell(NeighbourCell.Below);
                    break;
                default:
                    break;
            }

        }
    }

    public static moveSelectionByEnter(shiftKey: boolean) {
        if (shiftKey) {
            ChartTableHelper.selectNeighbourCell(NeighbourCell.Above);
        }
        else {
            ChartTableHelper.selectNeighbourCell(NeighbourCell.Below);
        }
    }

    public static moveSelectionByTab(shiftKey: boolean) {
        if (shiftKey) {
            ChartTableHelper.selectNeighbourCell(NeighbourCell.Left);
        }
        else {
            ChartTableHelper.selectNeighbourCell(NeighbourCell.Right);
        }
    }
}