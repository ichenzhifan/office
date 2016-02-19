interface Coords {
    row: number;
    col: number;
}

class ChartTableHelper {
    private static alphabetIndexTable = {
        1: "A",
        2: "B",
        3: "C",
        4: "D",
        5: "E",
        6: "F",
        7: "G",
        8: "H",
        9: "I",
        10: "J",
        11: "K",
        12: "L",
        13: "M",
        14: "N",
        15: "O",
        16: "P",
        17: "Q",
        18: "R",
        19: "S",
        20: "T",
        21: "U",
        22: "V",
        23: "W",
        24: "X",
        25: "Y",
        26: "Z"
    };

    /** 
    * Convert decimal number to alphabet index (e.g. 1->A, 28->AB)
    */
    public static convertNumberToAlphabetIndex(index: number): string {
        if (index < 0) {
            return null;
        }

        return ChartTableHelper.recursiveFunctionForAlphabetConversion(index, "");
    }

    /** 
    * Recursive function for alphabet conversion
    */
    private static recursiveFunctionForAlphabetConversion(index: number, result: string): string {
        if (index <= 26) {
            return ChartTableHelper.alphabetIndexTable[index] + result;
        }

        var div = Math.floor(index / 26);
        var rem = index % 26;

        return ChartTableHelper.recursiveFunctionForAlphabetConversion(div, ChartTableHelper.alphabetIndexTable[rem] + result);
    }

    /**
    * Trimmed the blank row from bottom, column from right
    */
    public static getTableData(): any[][] {
        var rowCount = ChartTableHelper.rowCountOfRenderTable();
        var columnCount = ChartTableHelper.columnCountOfRenderTable();

        var rowCountAfterTrim = rowCount;
        var columnCountAfterTrim = columnCount;

        var cellValue: string;

        var rowStart = ChartTable.getInstance().settings.showRowHeader ? 1 : 0;
        var colStart = ChartTable.getInstance().settings.showColumnHeader ? 1 : 0;

        // trim row
        var isRowEmpty = true;
        for (var r = 1; r < rowCount; r++) {
            if (!isRowEmpty) {
                break;
            }
            for (var c = 1; c < columnCount; c++) {
                cellValue = ChartTableHelper.findTr(rowCount - r).children("td:eq(" + c + ")").text();
                if (!StringExtensions.isNullOrWhitespace(cellValue)) {
                    isRowEmpty = false;
                    break;
                }
                if (c === columnCount - 1) {
                    rowCountAfterTrim--;
                }
            }
        }

        // trim column
        var isColumnEmpty = true;
        for (var c = 1; c < columnCount; c++) {
            if (!isColumnEmpty) {
                break;
            }
            for (var r = 1; r < rowCountAfterTrim; r++) {
                cellValue = ChartTableHelper.findTr(r).children("td:eq(" + (columnCount - c) + ")").text();
                if (!StringExtensions.isNullOrWhitespace(cellValue)) {
                    isColumnEmpty = false;
                    break;
                }
                if (r === rowCountAfterTrim - 1) {
                    columnCountAfterTrim--;
                }
            }
        }

        // import data
        var returnedData: any[][] = [];
        if (rowCountAfterTrim > 1) {
            for (var r = rowStart; r < rowCountAfterTrim; r++) {
                var rowData: any[] = [];
                for (var c = colStart; c < columnCountAfterTrim; c++) {
                    if ((r === rowStart && !ChartTable.getInstance().settings.showRowHeader) ||
                        (c === colStart && !ChartTable.getInstance().settings.showColumnHeader)) {
                        rowData.push("");
                    }
                    else {
                        rowData.push(ChartTableHelper.findTr(r).children("td:eq(" + c + ")").text());
                    }
                }
                returnedData.push(rowData);
            }
        }

        return returnedData;
    }

    /**
    * Return row count of chart data
    */
    public static rowCountOfData(): number {
        if (ObjectExtensions.isNullOrUndefined(ChartTable.getInstance().tableData) || ChartTable.getInstance().tableData.length === 0) {
            return 0;
        }
        else {
            return ChartTable.getInstance().tableData.length - 1;
        }
    }

    /**
    * Return column count of chart data
    */
    public static columnCountOfData(): number {
        if (ObjectExtensions.isNullOrUndefined(ChartTable.getInstance().tableData) || ChartTable.getInstance().tableData.length === 0) {
            return 0;
        }
        else {
            return ChartTable.getInstance().tableData[0].length - 1;
        }
    }

    /**
    * Return row count of chart data
    */
    public static rowCountOfRenderTable(): number {
        // the minimal row count of table is 7
        if (ChartTable.getInstance().settings.showRowHeader) {
            return Math.max(ChartTableHelper.rowCountOfData(), 4) + 3;
        }
        else {
            return Math.max(ChartTableHelper.rowCountOfData(), 5) + 2;
        }
    }

    /**
    * Return column count of chart data
    */
    public static columnCountOfRenderTable(): number {
        // the minimal column count of table is 7
        if (ChartTable.getInstance().settings.showColumnHeader) {
            return Math.max(ChartTableHelper.columnCountOfData(), 4) + 3;
        }
        else {
            return Math.max(ChartTableHelper.columnCountOfData(), 5) + 2;
        }
    }

    /**
    * Return JQuery elements of tr in the data table
    */
    public static findTr(index = -1): JQuery {
        if (index < 0) {
            return $("#dataTableDiv").find("tr");
        }

        return $("#dataTableDiv").find("tr:eq(" + index + ")");
    }

    /**
    * Return JQuery elements of td in the data table
    */
    public static findTd(): JQuery {
        return $("#dataTableDiv").find("td");
    }

    /**
    * Get table cell by row and column index
    */
    public static getCell(rowIndex: number, columnIndex: number): JQuery {
        return $("#dataTableDiv").find("tr:eq(" + rowIndex + ")").children("td:eq(" + columnIndex + ")");
    }

    public static getLastCellOfUsedRange(): JQuery {
        return $("#dataTableDiv").find(".cell-bottom-boundary").last();
    }

    /**
    * Get table cell by coords
    */
    public static getCellByCoords(coords: Coords): JQuery {
        return ChartTableHelper.getCell(coords.row, coords.col);
    }

    /**
    * Get column index of the specified cell
    */
    public static getColumnIndexOfCell($td: JQuery): number {
        return $td.index();
    }

    /**
    * Get row index of the specified cell
    */
    public static getRowIndexOfCell($td: JQuery): number {
        return $td.parent().index();
    }

    /**
    * Get coords of the specified cell
    */
    public static getCoordsOfCell($td: JQuery): Coords {
        return { row: ChartTableHelper.getRowIndexOfCell($td), col: ChartTableHelper.getColumnIndexOfCell($td) };
    }

    /**
    * Delete a row by index
    */
    public static deleteRow(index: number) {
        var $tr = ChartTableHelper.findTr(index);
        if ($tr !== null) {
            $tr.remove();
        }

        // Do the same operation on cached column header
        var columnHeader = ChartTable.getInstance().cachedColumnHeaders;
        if (ChartTable.getInstance().settings.showRowHeader) {
            index--;
        }
        if (columnHeader && columnHeader.length > index) {
            columnHeader = columnHeader.splice(index, 1);
        }
    }

    /**
    * Insert a row above the given index
    */
    public static insertRowAbove(index: number) {
        var $tr = ChartTableHelper.findTr(index);
        if ($tr !== null) {
            ChartTableHelper.getEmptyRow().insertBefore($tr);
        }

        // Do the same operation on cached column header
        var columnHeader = ChartTable.getInstance().cachedColumnHeaders;
        if (ChartTable.getInstance().settings.showRowHeader) {
            index--;
        }
        if (columnHeader && columnHeader.length > index) {
            columnHeader = columnHeader.splice(index, 0, '');
        }
    }

    /**
    * Insert a row below the given index
    */
    public static insertRowBelow(index: number) {
        var $tr = ChartTableHelper.findTr(index);
        if ($tr !== null) {
            ChartTableHelper.getEmptyRow().insertAfter($tr);
        }

        // Do the same operation on cached column header
        var columnHeader = ChartTable.getInstance().cachedColumnHeaders;
        if (ChartTable.getInstance().settings.showRowHeader) {
            index--;
        }
        if (columnHeader && columnHeader.length > index + 1) {
            columnHeader = columnHeader.splice(index + 1, 0, '');
        }
    }

    /**
    * Delete a column by index
    */
    public static deleteColumn(index: number) {
        ChartTableHelper.findTr().each(function () {
            var $td = $(this).find("td:eq(" + index + ")");
            if ($td !== null) {
                $td.remove();
            }
        });

        // Do the same operation on cached row header
        var rowHeaders = ChartTable.getInstance().cachedRowHeaders;
        if (ChartTable.getInstance().settings.showColumnHeader) {
            index--;
        }
        if (rowHeaders && rowHeaders.length > index) {
            rowHeaders = rowHeaders.splice(index, 1);
        }
    }

    /**
    * Insert a column on the left of given index
    */
    public static insertColumnLeft(index: number) {
        ChartTableHelper.findTr().each(function () {
            var $td = $(this).find("td:eq(" + index + ")");
            if ($td !== null) {
                $("<td></td>").insertBefore($td);
            }
        });

        // Do the same operation on cached row header
        var rowHeaders = ChartTable.getInstance().cachedRowHeaders;
        if (ChartTable.getInstance().settings.showColumnHeader) {
            index--;
        }
        if (rowHeaders && rowHeaders.length > index) {
            rowHeaders = rowHeaders.splice(index, 0, '');
        }
    }

    /**
    * Insert a column on the right of given index
    */
    public static insertColumnRight(index: number) {
        ChartTableHelper.findTr().each(function () {
            var $td = $(this).find("td:eq(" + index + ")");
            if ($td !== null) {
                $("<td></td>").insertAfter($td);
            }
        });

        // Do the same operation on cached row header
        var rowHeaders = ChartTable.getInstance().cachedRowHeaders;
        if (ChartTable.getInstance().settings.showColumnHeader) {
            index--;
        }
        if (rowHeaders && rowHeaders.length > index + 1) {
            rowHeaders = rowHeaders.splice(index + 1, 0, '');
        }
    }

    /**
    * Get an empty row
    */
    private static getEmptyRow(): JQuery {
        var spareTr = ChartTableHelper.findTr().last();
        spareTr.children().empty();
        return $("<tr></tr>").html(spareTr.html());
    }

    /**
    * Return max row index of current table
    */
    public static maxRowIndex(): number {
        return ChartTableHelper.findTr().length - 1;
    }

    /**
    * Return max column index of current table
    */
    public static maxColumnIndex(): number {
        return ChartTableHelper.findTr().first().children("td").length - 1;
    }

    /**
    * Add table focus listener
    */
    public static addTableFocusListener(): void {
        $("#dataTableDiv").children("table").off("focus").on("focus", e => {
            if (!TableSelection.hasSelection()) {
                var coords: Coords = { col: 1, row: 1 };
                TableSelection.setSelectionRange(coords, coords);
            }
        });
    }

    /**
    * Add td listners
    */
    public static addTDListners(): void {
        ChartTableHelper.findTd()
            .on("dblclick", function () {
                ChartTableHelper.enterEditingCell(CellEditingMode.Append);

                return false;
            })
            .on("mousedown", function (e) {
                var coords: Coords = {
                    col: ChartTableHelper.getColumnIndexOfCell($(this)),
                    row: ChartTableHelper.getRowIndexOfCell($(this))
                };

                if (coords.col === 0 || coords.row === 0) {
                    return false;
                }

                if (ChartTableHelper.isEditing() &&
                    coords.col === ChartTable.getInstance().selectionRange.start.col &&
                    coords.row === ChartTable.getInstance().selectionRange.start.row) {
                    return;
                }

                if (!TableSelection.isSelecting && e.shiftKey) { // Shift
                    TableSelection.setSelectionRangeEnd(coords);
                }
                else {
                    TableSelection.isSelecting = true;
                    TableSelection.setSelectionRangeStart(coords);
                    TableSelection.addTDMouseMoveListener();
                    TableSelection.addMouseUpListener();
                }

                ChartTableHelper.cellInput().blur();
                $(document).focus();
                e.preventDefault();
            });
    }

    /**
    * Remove td listners
    */
    public static removeTDListeners(): void {
        ChartTableHelper.findTd().off("dblclick").off("mousedown");
    }

    /**
    * Return true if chart table is under editing
    */
    public static isEditing(): boolean {
        return ChartTableHelper.cellInput().length > 0;
    }

    /**
    * Add keydown listener
    */
    public static addKeyDownListener() {
        $(document).off("keydown");

        $(document).on("keydown", (event) => {
            var $parent = $(event.target).closest("#dataTableDiv");
            if (($parent == null || $parent.length === 0) || !TableSelection.hasSelection()) {
                return;
            }

            var isMultiple = TableSelection.isMultiple();
            var isEditing = ChartTableHelper.isEditing();
            var selectionRange = ChartTable.getInstance().selectionRange;

            var preventDefault = true;
            if (isEditing) {
                // Enter
                if (event.which === 13) {
                    var $nextCell: JQuery;
                    // Shift + Enter -> Exit edit mode and move above
                    if (event.shiftKey) {
                        ChartTableHelper.exitEditingCell(ExitEditingCellMode.Overwrite);
                        $nextCell = ChartTableHelper.getCell(selectionRange.start.row - 1, selectionRange.start.col);
                        ChartTableHelper.selectCell($nextCell);
                    }
                    // Alt + Enter -> Start a new line in same cell
                    else if (event.altKey) {
                        var $input = $(".editingInput");
                        $input.val($input.val() + "\r");
                    }
                    // Enter -> Exit edit mode and move down
                    else {
                        ChartTableHelper.exitEditingCell(ExitEditingCellMode.Overwrite);
                        $nextCell = ChartTableHelper.getCell(selectionRange.start.row + 1, selectionRange.start.col);
                        ChartTableHelper.selectCell($nextCell);
                    }
                }
                // Tab
                else if (event.which === 9)
                {
                    var $nextCell: JQuery;
                    // Shift + Tab -> Complete cell entry and select the previous cell in the row
                    if (event.shiftKey) {
                        ChartTableHelper.exitEditingCell(ExitEditingCellMode.Overwrite);
                        $nextCell = ChartTableHelper.getCell(selectionRange.start.row, selectionRange.start.col - 1);
                        ChartTableHelper.selectCell($nextCell);
                    }
                    // Tab -> Complete cell entry and select the next cell in the row
                    else {
                        ChartTableHelper.exitEditingCell(ExitEditingCellMode.Overwrite);
                        $nextCell = ChartTableHelper.getCell(selectionRange.start.row, selectionRange.start.col + 1);
                        ChartTableHelper.selectCell($nextCell);
                    }
                }
                // Escape -> Exit edit mode
                else if (event.which === 27) {
                    ChartTableHelper.exitEditingCell(ExitEditingCellMode.Escape);
                }
                // Space
                else if (event.which === 32) {
                    // Workaround: to avoid trigger keyboard accessibilty
                    var $input = $(".editingInput");
                    $input.val($input.val() + " ");
                }
                else {
                    preventDefault = false;
                }
            }
            else {
                // Delete -> delete the data
                if (event.which === 46) {
                    if (TableSelection.isSelectAll()) {
                        ChartTable.getInstance().tableData = [];
                        ChartTable.getInstance().drawTable();
                    }
                    else {
                        var startRow = selectionRange.start.row;
                        var startCol = selectionRange.start.col;
                        var endRow = selectionRange.end.row;
                        var endCol = selectionRange.end.col;

                        if (startRow > endRow) {
                            var temp = startRow;
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

                        var $cell: JQuery;
                        for (var r = startRow; r <= endRow; r++) {
                            for (var c = startCol; c <= endCol; c++) {
                                $cell = ChartTableHelper.getCell(r, c);
                                if (ChartTableHelper.isCellEditable($cell)) {
                                    ChartTableHelper.updateCell($cell, "", true);
                                }
                            }
                        }

                        ChartTable.getInstance().updateData();
                        ChartTable.getInstance().drawTable();
                    }
                    TableSelection.highlightSelectionRange();
                }
                // Backspace -> clear selected cell of selecton start and start editing
                else if (event.which === 8) {
                    var $cell = TableSelection.selectedCell();
                    ChartTableHelper.updateCell($cell, "", true);
                    ChartTable.getInstance().updateData();
                    ChartTableHelper.enterEditingCell(CellEditingMode.Clear);
                }
                // Enter -> move down
                else if (event.which === 13) {
                    TableSelection.moveSelectionByEnter(event.shiftKey);
                }
                // Left arrow -> move left
                else if (event.which === 37) {
                    TableSelection.moveSelection(MoveDirection.Left, event.shiftKey);
                }
                // Up arrow -> move up
                else if (event.which === 38) {
                    TableSelection.moveSelection(MoveDirection.Up, event.shiftKey);
                }
                // Right arrow -> move right
                else if (event.which === 39) {
                    TableSelection.moveSelection(MoveDirection.Right, event.shiftKey);
                }
                // Down arrow -> move down
                else if (event.which === 40) {
                    TableSelection.moveSelection(MoveDirection.Down, event.shiftKey);
                }
                // Tab
                else if (event.which === 9) {
                    // Tab -> right one cell
                    // Shift + Tab -> left one cell
                    TableSelection.moveSelectionByTab(event.shiftKey);
                }
                // Home
                else if (event.which === 36) {
                    // Ctrl + Home -> Go to A1
                    if (event.ctrlKey) {
                        var coords: Coords = { col: 1, row: 1 };
                        TableSelection.setSelectionRange(coords, coords);
                    }
                    // Shift + Home -> To beginning of row
                    else if (event.shiftKey) {
                        TableSelection.enlargeSelectionToBeginningOfRows();
                    }
                    // Home -> Beginning of the row
                    else if (ChartTable.getInstance().selectionRange.start) {
                        var coords: Coords = { col: 1, row: ChartTable.getInstance().selectionRange.start.row };
                        TableSelection.setSelectionRange(coords, coords);
                    }
                }
                // End
                else if (event.which === 35) {
                    // Ctrl + End -> Last cell of used range
                    if (event.ctrlKey) {
                        var coords = ChartTableHelper.getCoordsOfCell(ChartTableHelper.getLastCellOfUsedRange());
                        TableSelection.setSelectionRange(coords, coords);
                    }
                }
                // Escape -> Exit from the table and move to menu.
                else if (event.which === 27) {
                    TableSelection.clearSelection();
                    if (OfficeUtil.Util.isPresentationView()) {
                        ChartTable.getInstance().$showColumnHeader.focus();
                    }
                    else {
                        $("#selectDataBtn").focus();
                    }
                }
                // F2 -> Enter edit mode
                else if (event.which === 113) {
                    ChartTableHelper.enterEditingCell(CellEditingMode.Append);
                }
                // Space
                else if (event.which === 32) {
                    // Ctrl + Space -> Entire column
                    if (event.ctrlKey) {
                        TableSelection.selectColumnsOfSelection();
                    }
                    // Shift + Space -> Entire row
                    if (event.shiftKey) {
                        TableSelection.selectRowsOfSelection();
                    }
                }
                // Page Up
                else if (event.which === 33)
                {
                    // Shift + Page Up -> Up of cells in current column
                    if (event.shiftKey) {
                        TableSelection.enlargeSelectionToBeginningOfColumns();
                    }
                }
                // Page Down
                else if (event.which === 34) {
                    // Shift + Page Down -> Down of cells in current column
                    if (event.shiftKey) {
                        TableSelection.enlargeSelectionToEndOfColumns();
                    }
                }
                // Any other key to enter edit mode
                else {
                    if (!isMultiple && event.which !== 16 && event.which !== 17) {
                        ChartTableHelper.enterEditingCell(CellEditingMode.Clear);
                        preventDefault = false;
                    }
                }
            }

            if (preventDefault) {
                event.preventDefault();
            }
        });
    }

    /**
    * Remove keydown listener
    */
    public static removeKeyDownListener() {
        $(document).off("keydown");
    }

    /**
    * Add the copy/paste callbacks
    */
    public static addCopyPaste() {
        var copyPasteInstance = new CopyPaste();
        copyPasteInstance.onPaste(ChartTableHelper.onPaste);
    }

    /**
    * Paste handler
    */
    public static onPaste(str: string) {
        var input = str.replace(/^[\r\n]*/g, '').replace(/[\r\n]*$/g, '');

        var inputArray = SheetClip.parse(input);

        var row = inputArray.length;
        var col = inputArray[0].length;

        // calculate the new selection range
        var chartTable = ChartTable.getInstance();
        var selectionRange = chartTable.selectionRange;
        var range: typeof selectionRange = {
            start: {
                row: Math.min(selectionRange.start.row, selectionRange.end.row),
                col: Math.min(selectionRange.start.col, selectionRange.end.col)
            },
            end: {
                row: Math.max(selectionRange.start.row, selectionRange.end.row),
                col: Math.max(selectionRange.start.col, selectionRange.end.col)
            }
        };

        range.end.row = Math.max(range.start.row + inputArray.length - 1, range.end.row);
        range.end.col = Math.max(range.start.col + inputArray[0].length - 1, range.end.col);

        var data = ChartTableHelper.getTableData();

        var rowOffset = chartTable.settings.showRowHeader ? 0 : 1;
        var colOffset = chartTable.settings.showColumnHeader ? 0 : 1;

        if (data.length === 0) { // if table is empty, create the data
            // create a new table
            var emptyRow = [];
            for (var c = 0; c < range.end.col + colOffset; c++) {
                emptyRow.push("");
            }
            for (var r = 0; r < range.end.row + rowOffset; r++) {
                data.push(emptyRow.slice(0));
            }
        }
        else {
            // add empty columns
            var columnCount = data[0].length;
            var rowCount = data.length;

            var countOfEmptyColumns = range.end.col - columnCount + colOffset;
            if (countOfEmptyColumns > 0) {
                for (var r = 0; r < rowCount; r++) {
                    for (var i = 0; i < countOfEmptyColumns; i++) {
                        data[r].push("");
                    }
                }
            }

            // add empty rows
            var countOfEmptyRows = range.end.row - rowCount + rowOffset;
            if (countOfEmptyRows > 0) {
                var emptyRow = [];
                for (var c = 0; c < data[0].length; c++) {
                    emptyRow.push("");
                }
                for (var r = 0; r < countOfEmptyRows; r++) {
                    data.push(emptyRow.slice(0));
                }
            }
        }

        // update the data
        for (var r = 0, rLens = range.end.row - range.start.row; r <= rLens; r++) {
            for (var c = 0, cLens = range.end.col - range.start.col; c <= cLens; c++) {
                data[range.start.row + r - 1 + rowOffset][range.start.col + c - 1 + colOffset] =
                ChartTableHelper.formatCellData(inputArray[r % inputArray.length][c % inputArray[0].length]);
            }
        }

        chartTable.tableData = data;

        // re-draw the table
        chartTable.drawTable();

        // select the new range
        setTimeout(() => {
            TableSelection.setSelectionRange(range.start, range.end);
        }, 0);

    }

    /**
    * Return the JQuery element of cell editing input
    */
    public static cellInput(): JQuery {
        return $(".editingInput");
    }

    /** 
    * Select a cell 
    */
    public static selectCell($cell: JQuery): void {
        // If there is a child, the cell is in editing mode
        if (ObjectExtensions.isNullOrUndefined($cell) || $cell.length === 0) {
            return;
        }

        var coords: Coords = {
            row: $cell.parent().index(),
            col: $cell.index()
        };
        TableSelection.setSelectionRange(coords, coords);
    }

    /** 
    * Enter cell editing mode
    */
    public static enterEditingCell(editingMode = CellEditingMode.Append): void {
        var $cell = TableSelection.selectedCell();

        if (!ChartTableHelper.isCellEditable($cell) || $cell.children(".editingInput").length > 0) {
            return;
        }

        var text = $cell.text();

        var left = $cell.offset().left + $("#tableFrame").scrollLeft() - 60 + 2;
        if (OfficeUtil.Util.isRtlLanguage()) {
            left += 12;
        }
        var $input = $("<textarea />")
            .css({
                "position": "absolute",
                "left": left,
                "top": $cell.offset().top + $("#tableFrame").scrollTop() - 163 - 2,
                "width": $cell.outerWidth() + 1,
                "height": $cell.outerHeight() - 2,
                "border": "none",
            })
            .addClass("editingInput");

        $input.appendTo($cell);
        $input.focus();

        if (editingMode === CellEditingMode.Append) {
            $input.val(text);
            $input[0]["setSelectionRange"](text.length, text.length);
        }

        $(".editingInput").on("blur", function (event) {
            ChartTableHelper.exitEditingCell(ExitEditingCellMode.Overwrite);
        });
    }

    /** 
    * Exit editing cell 
    */
    public static exitEditingCell(exitingEditingCellMode: ExitEditingCellMode) {
        var $input = ChartTableHelper.cellInput();
        var $cell = $input.parent();
        var val = $input.val();
        $input.remove();

        if (exitingEditingCellMode === ExitEditingCellMode.Overwrite) {
            ChartTableHelper.updateCell($cell, val);

        }
        else if (exitingEditingCellMode === ExitEditingCellMode.Escape) {
            ChartTableHelper.selectCell(TableSelection.selectedCell());
        }
    }

    /** 
    * Update the cell 
    */
    public static updateCell($cell: JQuery, value: string, preventDrawTable = false): void {
        // If nothing changes, simply return
        if ($cell.text() == value) {
            return;
        }

        $cell.text(ChartTableHelper.formatCellData(value));

        if (!preventDrawTable) {
            // Update current data
            ChartTable.getInstance().updateData();
            // NOTE: re-draw the table for each update is a performance hit here,
            // and cause some event can't be handled as the element is missing.
            ChartTable.getInstance().drawTable();
        }
    }

    /** 
    * Select the neighbour cell 
    */
    public static selectNeighbourCell(neighbourCell: NeighbourCell): void {
        if (ObjectExtensions.isNullOrUndefined(TableSelection.selectedCell())) {
            return;
        }

        var $targetCell: JQuery;
        var maxRowIndex = ChartTableHelper.maxRowIndex();
        var maxColumnIndex = ChartTableHelper.maxColumnIndex();
        var selectedRowIndex = ChartTable.getInstance().selectionRange.start.row;
        var selectedColumnIndex = ChartTable.getInstance().selectionRange.start.col;

        switch (neighbourCell) {
            case NeighbourCell.Above:
                if (selectedRowIndex - 2 < 0) {
                    return;
                }
                $targetCell = ChartTableHelper.getCell(selectedRowIndex - 1, selectedColumnIndex);
                break;
            case NeighbourCell.Below:
                if (selectedRowIndex + 1 > maxRowIndex) {
                    return;
                }
                $targetCell = ChartTableHelper.getCell(selectedRowIndex + 1, selectedColumnIndex);
                break;
            case NeighbourCell.Right:
                if (selectedColumnIndex + 1 > maxColumnIndex) {
                    return;
                }
                $targetCell = ChartTableHelper.getCell(selectedRowIndex, selectedColumnIndex + 1);
                break;
            case NeighbourCell.Left:
                if (selectedColumnIndex - 2 < 0) {
                    return;
                }
                $targetCell = ChartTableHelper.getCell(selectedRowIndex, selectedColumnIndex - 1);
                break;
        }

        ChartTableHelper.selectCell($targetCell);
    }

    /** 
    * Return true if cell is editable 
    */
    public static isCellEditable($cell: JQuery): boolean {
        return !($cell.index() < 1
            || $cell.parent().index() < 1
            || ($cell.index() === 1 && $cell.parent().index() === 1 && ChartTable.getInstance().settings.showColumnHeader && ChartTable.getInstance().settings.showRowHeader));
    }

    /** 
    * Set the visibility of column header
    */
    public static setColumnHeaderVisibility(show?: boolean) {
        var chartTable = ChartTable.getInstance();
        if (!ObjectExtensions.isNullOrUndefined(show)) {
            chartTable.settings.showColumnHeader = show;
            chartTable.drawTable();
        }

        if (chartTable.settings.showColumnHeader) {
            chartTable.$showColumnHeader.addClass(Strings.tableCSS.toolbarIconActive);
            ChartTableHelper.applyColumnHeaders();
            chartTable.drawTable();
        }
        else {
            chartTable.$showColumnHeader.removeClass(Strings.tableCSS.toolbarIconActive);
            ChartTableHelper.cacheColumnHeaders();
            // To remove the data in headers
            chartTable.updateData();
            chartTable.drawTable();
        }
    }

    /** 
    * Toggle the visibility of column header
    */
    public static toggleColumnHeaderVisibility() {
        ChartTableHelper.setColumnHeaderVisibility(!ChartTable.getInstance().settings.showColumnHeader);
    }

    /** 
    * Set the visibility of row header
    */
    public static setRowHeaderVisibility(show?: boolean) {
        var chartTable = ChartTable.getInstance();
        if (!ObjectExtensions.isNullOrUndefined(show)) {
            chartTable.settings.showRowHeader = show;
            chartTable.drawTable();
        }

        if (chartTable.settings.showRowHeader) {
            chartTable.$showRowHeader.addClass(Strings.tableCSS.toolbarIconActive);
            ChartTableHelper.applyRowHeaders();
            chartTable.drawTable();
        }
        else {
            chartTable.$showRowHeader.removeClass(Strings.tableCSS.toolbarIconActive);
            ChartTableHelper.cacheRowHeaders();
            // To remove the data in headers
            chartTable.updateData();
            chartTable.drawTable();
        }
    }

    /** 
    * Toggle the visibility of row header
    */
    public static toggleRowHeaderVisibility() {
        ChartTableHelper.setRowHeaderVisibility(!ChartTable.getInstance().settings.showRowHeader);
    }

    /** 
    * Format the cell data and return it
    */
    private static formatCellData(data: any): any {
        // The size limition of cell value is 255
        return ("" + data).length > 255 ? ("" + data).substr(0, 254) : data;
    }

    public static setColumnIndexVisibility(show?: boolean) {
        var chartTable = ChartTable.getInstance();
        if (show === undefined || show === null) {
            show = chartTable.settings.showColumnIndex;
        }

        chartTable.settings.showColumnIndex = show;

        if (show) {
            $("#dataTableDiv td:first-child").show();
        }
        else {
            $("#dataTableDiv td:first-child").hide();
        }
    }

    public static toggleColumnIndexVisibility() {
        ChartTableHelper.setColumnIndexVisibility(!ChartTable.getInstance().settings.showColumnIndex);
    }

    public static setRowIndexVisibility(show?: boolean) {
        var chartTable = ChartTable.getInstance();
        if (show === undefined || show === null) {
            show = chartTable.settings.showRowIndex;
        }

        chartTable.settings.showRowIndex = show;

        if (show) {
            ChartTableHelper.findTr(0).show();
        }
        else {
            ChartTableHelper.findTr(0).hide();
        }
    }

    public static toggleRowIndexVisibility() {
        ChartTableHelper.setRowIndexVisibility(!ChartTable.getInstance().settings.showRowIndex);
    }

    public static cacheRowHeaders() {
        var chartTable = ChartTable.getInstance();
        if (chartTable.tableData && chartTable.tableData.length > 0 && chartTable.tableData[0].length > 0) {
            chartTable.cachedRowHeaders = chartTable.tableData[0].slice(0);
        }
    }

    public static applyRowHeaders(removeCahce = true) {
        var chartTable = ChartTable.getInstance();
        if (chartTable.cachedRowHeaders && chartTable.cachedRowHeaders.length > 0) {
            chartTable.tableData[0] = chartTable.cachedRowHeaders.slice(0);

            if (removeCahce) {
                chartTable.cachedRowHeaders = null;
            }
        }
    }

    public static cacheColumnHeaders() {
        var chartTable = ChartTable.getInstance();
        if (chartTable.tableData && chartTable.tableData.length > 0 && chartTable.tableData[0].length > 0) {
            chartTable.cachedColumnHeaders = [];
            for (var i = 0; i < chartTable.tableData.length; i++) {
                chartTable.cachedColumnHeaders.push(chartTable.tableData[i][0]);
            }
        }
    }

    public static applyColumnHeaders(removeCache = true) {
        var chartTable = ChartTable.getInstance();
        if (chartTable.cachedColumnHeaders && chartTable.cachedColumnHeaders.length > 0) {
            if (!chartTable.tableData || chartTable.tableData.length === 0) {
                chartTable.tableData = [];

                for (var i = 0; i < chartTable.cachedColumnHeaders.length; i++) {
                    chartTable.tableData.push([chartTable.cachedColumnHeaders[i]]);
                }
            }
            else {
                if (chartTable.tableData.length < chartTable.cachedColumnHeaders.length) {
                    var row = [];
                    for (var i = 0; i < chartTable.tableData[0].length; i++) {
                        row.push("");
                    }
                    for (var j = 0, jLen = chartTable.cachedColumnHeaders.length - chartTable.tableData.length; j < jLen; j++) {
                        chartTable.tableData.push(row.slice(0));
                    }
                }

                for (var i = 0; i < chartTable.cachedColumnHeaders.length; i++) {
                    chartTable.tableData[i][0] = chartTable.cachedColumnHeaders[i];
                }
            }

            if (removeCache) {
                chartTable.cachedColumnHeaders = null;
            }
        }
    }
}