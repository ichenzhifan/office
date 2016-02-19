var Office = Microsoft.Office.WebExtension;
var OfficeThemeManager;
var OfficeLocalization = OfficeAgave.Shared.Localization;
var OfficeUtil = OfficeAgave.Shared.Utility;

var ChartAgave = (function () {
    function ChartAgave() {
    }
    /**
    * Initialize the app
    */
    ChartAgave.initialize = function () {
        ChartAgave.language = Office.context.displayLanguage;
        ChartAgave.chartType = 0 /* RegularColumn */;
        ChartAgave.isHighContrast = OfficeUtil.Util.isHighContrast();
        ChartAgave.$content = $("#content");

        if (ChartAgave.isHighContrast) {
            AgaveTheme.setupHighContrastTheme();
            var $hc = $("<link href=\"../Content/HighContrast.css\" rel=\"stylesheet\" />");
            $("#chartAgaveTheme").parent().append($hc);
        } else {
            if (OfficeUtil.Util.isPresentationView()) {
                if (ChartAgave.theme == null) {
                    ChartAgave.theme = new AgaveTheme();
                }
                ChartAgave.theme.syncTheme();
                ChartAgave.theme.customizeTheme();
            } else {
                AgaveTheme.setupDefaultTheme();
            }
        }

        // If current html is rtl, add rtl style file.
        if (OfficeUtil.Util.isRtlLanguage()) {
            $("#chartAgaveDocument").css("direction", "rtl");
            var $rtl = $("<link href=\"../Content/RTL.css\" rel=\"stylesheet\" />");

            $("#chartAgaveTheme").parent().append($rtl);
        }

        // Init chart page.
        ChartAgave.$chartPage = $("#contentChartPage").load("Page/Chart/ChartPage.html", null, function () {
            ChartAgave.chartPage = new ChartPage();
            OfficeLocalization.Resources.apply("#contentChartPage");
            PageHelper.navigateToPage(ChartAgave.chartPage);
        });

        // Load correct modes based on current document view.
        if (OfficeUtil.Util.isPresentationView()) {
            OfficeUtil.Util.isPresentationConsumerMode(null, function () {
                ChartAgave.loadAuthoringModePart();
            });
        } else {
            ChartAgave.loadAuthoringModePart();
        }

        AgaveHelper.initBackbtn();

        // Localized application text.
        OfficeLocalization.Resources.apply();

        // Attach window resize event, to check whether current view is consumer mode.
        $(window).on("resize", function (event) {
            OfficeUtil.Util.isPresentationConsumerMode(ChartAgave.consumerModeHandle, ChartAgave.authoringModeHandle);
        });
    };

    /**
    * The handle will be called when presetation view is consumer mode.
    */
    ChartAgave.consumerModeHandle = function () {
        PageHelper.navigateToPage(ChartAgave.chartPage);

        ChartAgave.toolbarControl && ChartAgave.toolbarControl.disable && ChartAgave.toolbarControl.disable();
    };

    /**
    * The handle will be called when document view is authoring mode.
    */
    ChartAgave.authoringModeHandle = function () {
        if (ChartAgave.toolbarControl && !ChartAgave.toolbarControl.isEnable) {
            ChartAgave.toolbarControl.enable && ChartAgave.toolbarControl.enable();
        }
    };

    /**
    * Enable behaviors which only support on authoring mode.
    */
    ChartAgave.loadAuthoringModePart = function () {
        ChartAgave.$chartTypePage = $("#contentChartTypePage").load("Page/ChartType/ChartTypePage.html", null, function () {
            ChartAgave.chartTypePage = new ChartTypePage();
            OfficeLocalization.Resources.apply("#contentChartTypePage");
        });

        ChartAgave.$dataPage = $("#contentDataPage").load("Page/Data/DataPage.html", null, function () {
            ChartAgave.dataPage = new DataPage();
            OfficeLocalization.Resources.apply("#contentDataPage");
        });

        ChartAgave.toolbarControl = new ToolbarControl();
        ChartAgave.settingsControl = new SettingsControl();
    };
    ChartAgave.isFirstRun = true;
    ChartAgave.isHighContrast = false;
    return ChartAgave;
})();

(function () {
    Office.initialize = function (reason) {
        $(document).ready(function () {
            setTimeout(function () {
                // Setup localization options.
                var option = {
                    rootFolder: "../Resources",
                    resourceFileName: "resources.json",
                    success: ChartAgave.initialize
                };

                // Init localization to load resource data.
                OfficeLocalization.Resources.initialize(option);
            }, 150);
        });
    };
})();
var CopyPaste = (function () {
    function CopyPaste() {
        this.init();
    }
    /**
    * Creates a textarea that stays hidden on the page and gets focused
    * when user presses CTRL while not having a form input focused
    */
    CopyPaste.prototype.init = function () {
        var _this = this;
        this.pasteCallbacks = [];

        this.$textArea = $(".copyPaste");

        $(document).on("keydown", function (event) {
            if (ChartTableHelper.isEditing()) {
                return;
            }

            var isCtrlDown = false;
            if (event.ctrlKey) {
                isCtrlDown = true;
            }

            if (isCtrlDown) {
                _this.selectTextArea();
                setTimeout(function () {
                    _this.selectTextArea();
                }, 0);
            }

            // Ctrl + v
            if (isCtrlDown && event.keyCode === 86) {
                setTimeout(function () {
                    _this.triggerPaste(event);
                }, 0);
            }
        });
    };

    /**
    * Select the textarea
    */
    CopyPaste.prototype.selectTextArea = function () {
        this.$textArea.select();
    };

    /**
    * Trigger registered paste callbacks
    */
    CopyPaste.prototype.triggerPaste = function (event) {
        var _this = this;
        if (this.pasteCallbacks) {
            setTimeout(function () {
                var val = (_this.$textArea.val()).replace(/^[\r\n]*/g, '').replace(/[\r\n]*$/g, '');
                for (var i = 0, ilen = _this.pasteCallbacks.length; i < ilen; i++) {
                    _this.pasteCallbacks[i](val, event);
                }
            }, 50);
        }
    };

    /*
    * Register paste callback
    */
    CopyPaste.prototype.onPaste = function (fn) {
        this.pasteCallbacks.push(fn);
    };
    return CopyPaste;
})();
var SheetClip = (function () {
    function SheetClip() {
    }
    SheetClip.parse = function (str) {
        var r, rlen, rows, arr = [], a = 0, c, clen, multiline, last;
        rows = str.split('\n');
        if (rows.length > 1 && rows[rows.length - 1] === '') {
            rows.pop();
        }
        for (r = 0, rlen = rows.length; r < rlen; r += 1) {
            rows[r] = rows[r].split('\t');
            for (c = 0, clen = rows[r].length; c < clen; c += 1) {
                if (!arr[a]) {
                    arr[a] = [];
                }
                if (multiline && c === 0) {
                    last = arr[a].length - 1;
                    arr[a][last] = arr[a][last] + '\n' + rows[r][0];
                    if (multiline && (SheetClip.countQuotes(rows[r][0]) & 1)) {
                        multiline = false;
                        arr[a][last] = arr[a][last].substring(0, arr[a][last].length - 1).replace(/""/g, '"');
                    }
                } else {
                    if (c === clen - 1 && rows[r][c].indexOf('"') === 0) {
                        arr[a].push(rows[r][c].substring(1).replace(/""/g, '"'));
                        multiline = true;
                    } else {
                        arr[a].push(rows[r][c].replace(/""/g, '"'));
                        multiline = false;
                    }
                }
            }
            if (!multiline) {
                a += 1;
            }
        }
        return arr;
    };

    SheetClip.stringify = function (arr) {
        var r, rlen, c, clen, str = '', val;
        for (r = 0, rlen = arr.length; r < rlen; r += 1) {
            for (c = 0, clen = arr[r].length; c < clen; c += 1) {
                if (c > 0) {
                    str += '\t';
                }
                val = arr[r][c];
                if (typeof val === 'string') {
                    if (val.indexOf('\n') > -1) {
                        str += '"' + val.replace(/"/g, '""') + '"';
                    } else {
                        str += val;
                    }
                } else if (val === null || val === void 0) {
                    str += '';
                } else {
                    str += val;
                }
            }
            str += '\n';
        }
        return str;
    };

    SheetClip.countQuotes = function (str) {
        return str.split('"').length - 1;
    };
    return SheetClip;
})();
var TableSelection = (function () {
    function TableSelection() {
    }
    /**
    * Initialization for TableSelection
    */
    TableSelection.initialized = function () {
        TableSelection.isSelecting = false;
        if (!ChartTable.getInstance().selectionRange) {
            ChartTable.getInstance().selectionRange = {
                start: null,
                end: null
            };
        }
    };

    TableSelection.hasSelection = function () {
        return !!ChartTable.getInstance().selectionRange.start && !!ChartTable.getInstance().selectionRange.end;
    };

    /**
    * Ruturn ture if multiple cells is selected
    */
    TableSelection.isMultiple = function () {
        return ChartTable.getInstance().selectionRange.start !== ChartTable.getInstance().selectionRange.end;
    };

    /**
    * Return JQuery element of selected cell
    */
    TableSelection.selectedCell = function () {
        if (ChartTable.getInstance().selectionRange) {
            return ChartTableHelper.getCellByCoords(ChartTable.getInstance().selectionRange.start);
        }

        return null;
    };

    /**
    * Return the index of selected row
    */
    TableSelection.selectedRowIndex = function () {
        var chartTable = ChartTable.getInstance();
        var selectionRange = chartTable.selectionRange;
        if (selectionRange && selectionRange.start && selectionRange.end && selectionRange.start.row === selectionRange.end.row && selectionRange.start.col === 1 && selectionRange.end.col === ChartTableHelper.maxColumnIndex()) {
            return selectionRange.start.row;
        } else if (chartTable.$verticalSelectedGrip.is(":visible")) {
            return 0;
        }

        return null;
    };

    /**
    * Return the index of selected column
    */
    TableSelection.selectedColumnIndex = function () {
        var chartTable = ChartTable.getInstance();
        var selectionRange = chartTable.selectionRange;
        if (selectionRange && selectionRange.start && selectionRange.end && selectionRange.start.col === selectionRange.end.col && selectionRange.start.row === 1 && selectionRange.end.row === ChartTableHelper.maxRowIndex()) {
            return selectionRange.start.col;
        } else if (chartTable.$horizontalSelectedGrip.is(":visible")) {
            return 0;
        }

        return null;
    };

    /**
    * Select all cells
    */
    TableSelection.selectAll = function () {
        var start = { col: 1, row: 1 };
        var end = { col: ChartTableHelper.maxColumnIndex(), row: ChartTableHelper.maxRowIndex() };

        ChartTable.getInstance().hideButtons();
        TableSelection.setSelectionRange(start, end);
    };

    /**
    * Return true if all cells are selected
    */
    TableSelection.isSelectAll = function () {
        var selectionRange = ChartTable.getInstance().selectionRange;
        if (selectionRange.start.col == 1 && selectionRange.start.row == 1 && selectionRange.end.col == ChartTableHelper.maxColumnIndex() && selectionRange.end.row == ChartTableHelper.maxRowIndex()) {
            return true;
        }

        return false;
    };

    /**
    * Select the row by index
    */
    TableSelection.selectRow = function (index) {
        if (!ObjectExtensions.isNullOrUndefined(index)) {
            if (!ChartTable.getInstance().settings.showRowIndex) {
                index--;
            }
            $(".vertical-select-grip:eq(" + index + ")").click();
        }
    };

    /**
    * Select the column by index
    */
    TableSelection.selectColumn = function (index) {
        if (!ObjectExtensions.isNullOrUndefined(index)) {
            if (!ChartTable.getInstance().settings.showColumnIndex) {
                index--;
            }
            $(".horizontal-select-grip:eq(" + index + ")").click();
        }
    };

    /**
    * Select the columns by current selection
    */
    TableSelection.selectColumnsOfSelection = function () {
        var selectionRange = ChartTable.getInstance().selectionRange;

        if (selectionRange.start && selectionRange.end) {
            TableSelection.setSelectionRange({ row: 1, col: selectionRange.start.col }, { row: ChartTableHelper.maxRowIndex(), col: selectionRange.end.col });
        }
    };

    /**
    * Select the rows by current selection
    */
    TableSelection.selectRowsOfSelection = function () {
        var selectionRange = ChartTable.getInstance().selectionRange;

        if (selectionRange.start && selectionRange.end) {
            TableSelection.setSelectionRange({ row: selectionRange.start.row, col: 1 }, { row: selectionRange.end.row, col: ChartTableHelper.maxColumnIndex() });
        }
    };

    /**
    * Enlarge the selection to the beginning of rows by current selection
    */
    TableSelection.enlargeSelectionToBeginningOfRows = function () {
        var selectionRange = ChartTable.getInstance().selectionRange;

        if (selectionRange.start && selectionRange.end) {
            TableSelection.setSelectionRangeEnd({ row: selectionRange.end.row, col: 1 });
        }
    };

    /**
    * Enlarge the selection to the beginning of columns by current selection
    */
    TableSelection.enlargeSelectionToBeginningOfColumns = function () {
        var selectionRange = ChartTable.getInstance().selectionRange;

        if (selectionRange.start && selectionRange.end) {
            TableSelection.setSelectionRangeEnd({ row: 1, col: selectionRange.end.col });
        }
    };

    /**
    * Enlarge the selection to the end of columns by current selection
    */
    TableSelection.enlargeSelectionToEndOfColumns = function () {
        var selectionRange = ChartTable.getInstance().selectionRange;

        if (selectionRange.start && selectionRange.end) {
            TableSelection.setSelectionRangeEnd({ row: ChartTableHelper.maxRowIndex(), col: selectionRange.end.col });
        }
    };

    /**
    * Add mousemove listener of td
    */
    TableSelection.addTDMouseMoveListener = function () {
        ChartTableHelper.findTd().on("mouseover", function (e) {
            if (TableSelection.isSelecting) {
                var coords = {
                    col: ChartTableHelper.getColumnIndexOfCell($(this)),
                    row: ChartTableHelper.getRowIndexOfCell($(this))
                };
                TableSelection.setSelectionRangeEnd(coords);
            }
        });
    };

    /**
    * Remove mousemove listener of td
    */
    TableSelection.removeTDMouseMoveListener = function () {
        ChartTableHelper.findTd().off("mouseover");
    };

    /**
    * Add mouseup listener on document
    */
    TableSelection.addMouseUpListener = function () {
        $(document).on("mouseup", function (e) {
            if (TableSelection.isSelecting) {
                TableSelection.isSelecting = false;
                TableSelection.removeTDMouseMoveListener();
                TableSelection.removeMouseUplistener();
            } else {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    };

    /**
    * Remove mouseup listener on document
    */
    TableSelection.removeMouseUplistener = function () {
        $(document).off("mouseup");
    };

    /**
    * Set coords of selectionRange's start
    */
    TableSelection.setSelectionRangeStart = function (start) {
        ChartTable.getInstance().selectionRange.start = start;
        TableSelection.setSelectionRangeEnd(start);
    };

    /**
    * Set coords of selectionRange's end
    */
    TableSelection.setSelectionRangeEnd = function (end) {
        ChartTable.getInstance().selectionRange.end = end;

        if (!TableSelection.isMultiple()) {
            ChartTable.getInstance().hideButtons();
        }

        TableSelection.highlightSelectionRange();
    };

    /**
    * Tansform the end of selectionRange
    */
    TableSelection.transformSelectionRangeEnd = function (rowDelta, colDelta) {
        if (ChartTable.getInstance().selectionRange === null) {
            return;
        }

        var coords = {
            row: ChartTable.getInstance().selectionRange.end.row + rowDelta,
            col: ChartTable.getInstance().selectionRange.end.col + colDelta
        };

        if (coords.row <= 1) {
            coords.row = 1;
        } else if (coords.row >= ChartTableHelper.maxRowIndex()) {
            coords.row = ChartTableHelper.maxRowIndex();
        }

        if (coords.col <= 1) {
            coords.col = 1;
        } else if (coords.col >= ChartTableHelper.maxColumnIndex()) {
            coords.col = ChartTableHelper.maxColumnIndex();
        }

        TableSelection.setSelectionRangeEnd(coords);
    };

    /**
    * Set selectionRange
    */
    TableSelection.setSelectionRange = function (start, end) {
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
    };

    /**
    * Clear selection
    */
    TableSelection.clearSelection = function () {
        var chartTable = ChartTable.getInstance();
        chartTable.selectionRange.start = null;
        chartTable.selectionRange.end = null;
        $(".cell-current").removeClass("cell-current");
    };

    /**
    * Hightlight the selectionRange
    */
    TableSelection.highlightSelectionRange = function () {
        $("." + Strings.tableCSS.cellCurrent).removeClass(Strings.tableCSS.cellCurrent);

        var selectionRange = ChartTable.getInstance().selectionRange;
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

        var $td;
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
    };

    /**
    * Move selection by direction
    * if the shift key is down, change the selection range instead of moving the selection
    */
    TableSelection.moveSelection = function (moveDirection, shiftKey) {
        if (ChartTableHelper.isEditing()) {
            return;
        }

        if (shiftKey) {
            switch (moveDirection) {
                case 0 /* Left */:
                    TableSelection.transformSelectionRangeEnd(0, -1);
                    break;
                case 2 /* Up */:
                    TableSelection.transformSelectionRangeEnd(-1, 0);
                    break;
                case 1 /* Right */:
                    TableSelection.transformSelectionRangeEnd(0, 1);
                    break;
                case 3 /* Down */:
                    TableSelection.transformSelectionRangeEnd(1, 0);
                    break;
                default:
                    break;
            }
        } else {
            switch (moveDirection) {
                case 0 /* Left */:
                    ChartTableHelper.selectNeighbourCell(3 /* Left */);
                    break;
                case 2 /* Up */:
                    ChartTableHelper.selectNeighbourCell(0 /* Above */);
                    break;
                case 1 /* Right */:
                    ChartTableHelper.selectNeighbourCell(1 /* Right */);
                    break;
                case 3 /* Down */:
                    ChartTableHelper.selectNeighbourCell(2 /* Below */);
                    break;
                default:
                    break;
            }
        }
    };

    TableSelection.moveSelectionByEnter = function (shiftKey) {
        if (shiftKey) {
            ChartTableHelper.selectNeighbourCell(0 /* Above */);
        } else {
            ChartTableHelper.selectNeighbourCell(2 /* Below */);
        }
    };

    TableSelection.moveSelectionByTab = function (shiftKey) {
        if (shiftKey) {
            ChartTableHelper.selectNeighbourCell(3 /* Left */);
        } else {
            ChartTableHelper.selectNeighbourCell(1 /* Right */);
        }
    };
    return TableSelection;
})();

var PeopleChart = (function () {
    function PeopleChart(canvasId) {
        DataViz.mainApp = new DataViz.App();

        // Set default value.
        PeopleChart.configurationKey = Strings.configureKeys.shape;
        PeopleChart.currentIconId = "muscle-people";
        PeopleChart.iconHostSelector = ".sharp-list";

        PeopleChart.currentSKU && PeopleChart.currentSKU.reset();
        DataViz.mainApp.onConfigurationChangedCallback = this.onConfigurationChanged;

        DataViz.mainApp.init("", function (sku) {
            PeopleChart.currentSKU = sku;
            PeopleChart.configuration = DataViz.mainApp.Configuration;
            PeopleChart.layoutInstance = DataViz.mainApp.LayoutInstance;
            PeopleChart.icons = DataViz.Decoration.ShapeProvider.Instance.Shapes;

            PeopleChart.bindingPane = DataViz.UX.BindingPaneSpecific.getInstance();
            var bindData = ChartData.DataRecords.peopleChartData;
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
    PeopleChart.prototype.onConfigurationChanged = function (key, value) {
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
    };

    /**
    * Set people chart title.
    */
    PeopleChart.setTitle = function (title) {
        //DataViz.mainApp.LayoutInstance.setValue("title", title);
        $("#peopleChartTitle").text(title);
    };

    /**
    * Rebind data to current sku.
    */
    PeopleChart.rebindData = function (rawData) {
        if (this.currentSKU == null) {
            this.currentSKU = DataViz.mainApp.CurrentSKU;
        }

        if (this.currentSKU.DataBinder.isBound()) {
            return;
        }

        var renderData = new DataViz.Data.RawData();
        renderData.formatted = rawData;
        renderData.unformatted = rawData;

        this.currentSKU.Controller.visualizeData(renderData);
    };

    /**
    * Update chart theme.
    */
    PeopleChart.updateTheme = function (theme) {
        this.apply(Strings.configureKeys.theme, theme);
    };

    /**
    * Update chart shape.
    */
    PeopleChart.updateShape = function (shape) {
        this.apply(Strings.configureKeys.shape, shape);
    };

    /**
    * Update chart sku.
    */
    PeopleChart.updateSku = function (sku) {
        this.apply(Strings.configureKeys.sku, sku);
    };

    /**
    * Update configuration.
    */
    PeopleChart.apply = function (key, iconId) {
        if (this.configuration == null) {
            this.configuration = DataViz.mainApp.Configuration;
        }

        this.configuration.set(key, iconId);
        this.configuration = DataViz.mainApp.Configuration;
    };

    /**
    * Init people chart setting pane.
    */
    PeopleChart.populate = function (iconNames) {
        var currentWidth = 0;
        $(this.iconHostSelector + "> img").remove();

        for (var index = 0; index < this.icons.length; index++) {
            $(this.iconHostSelector).append("<img id=" + this.icons[index].id + " src=" + this.icons[index].thumbnail + " cursor: pointer; position:absolute'; class ='gallery-item';" + "alt='" + iconNames[index] + "' title='" + iconNames[index] + "' tabindex='1';/>");
            this.setIconClickListener(this.icons[index].id, index);
        }

        this.updatePaneBorder(this.currentIconId);
    };

    /**
    * Add icon click handler.
    */
    PeopleChart.setIconClickListener = function (iconId, index) {
        var _this = this;
        $("#" + iconId).off("click");
        $("#" + iconId).data("iconIndex", index).click(function (event) {
            _this.iconClickAction(event, index);
        }).keydown(function (event) {
            if (event.which === OfficeUtil.Strings.keyCodes.enter) {
                _this.iconClickAction(event, index);
            }
        });
    };

    /**
    * Icon click handler.
    */
    PeopleChart.iconClickAction = function (event, index) {
        var iconIndex = $(event.target).data("iconIndex");
        var iconId = this.icons[iconIndex].id;
        this.updatePaneBorder(iconId);
        this.apply(this.configurationKey, iconId);
    };

    /**
    * Updated selected style.
    */
    PeopleChart.updatePaneBorder = function (iconId) {
        for (var index = 0; index < this.icons.length; index++) {
            if (this.icons[index].id === iconId) {
                $("#" + this.icons[index].id).removeClass("gallery-item");
                $("#" + this.icons[index].id).addClass("gallery-item-click");
            } else {
                $("#" + this.icons[index].id).removeClass("gallery-item-click");
                $("#" + this.icons[index].id).addClass("gallery-item");
            }
        }
    };
    PeopleChart.icons = [];
    return PeopleChart;
})();
var ChartData = (function () {
    function ChartData() {
    }
    /**
    * Define sample data, which will be used when no user data.
    */
    ChartData.sampleData = function () {
        var cities = ["Seattle", "Phoenix", "Boston", "Tampa", "Orlando"];
        var sales = [21000, 15000, 33700, 5500, 31000];
        var profits = [5200, 4300, 8340, 2500, 13000];
        var bonuses = [1000, 8500, 2100, 2700, 3000];
        var years = ["2003", "2004", "2005", "2006", "2007"];
        return {
            categories: { name: "city", data: cities },
            series: [
                { name: "sales", data: sales },
                { name: "profits", data: profits }
            ]
        };
    };

    Object.defineProperty(ChartData, "data", {
        /**
        * Get raw data.
        */
        get: function () {
            return this.getChartData();
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ChartData, "DataRecords", {
        /**
        * Chart data records, which can be used to build chart.
        */
        get: function () {
            if (this.dataRecords == null || this.isDataChanged) {
                this.isDataChanged = false;
                this.dataRecords = this.buildData();
            }

            return this.dataRecords;
        },
        enumerable: true,
        configurable: true
    });

    /**
    * Return true if customized data is defined
    */
    ChartData.isCustomizedDataDefined = function () {
        return ChartData.customizedData && (ChartData.customizedData.categories.data.length > 0 || ChartData.customizedData.series.length > 0);
    };

    /**
    * Get chart data
    */
    ChartData.getChartData = function () {
        return ChartData.isCustomizedDataDefined() ? ChartData.customizedData : ChartData.sampleData();
    };

    /**
    * Set chart data
    */
    ChartData.setChartData = function (data, autoColumnHeader, autoRowHeader) {
        if (typeof autoColumnHeader === "undefined") { autoColumnHeader = false; }
        if (typeof autoRowHeader === "undefined") { autoRowHeader = false; }
        this.isDataChanged = true;
        if (!data || data.length === 0) {
            ChartData.customizedData = { categories: { name: Strings.seriesName, data: [] }, series: [] };
            return;
        }

        var categories = [];
        var series = [];
        var rowCount = data.length;
        var columnCount = data[0].length;

        if (ChartData.isColumnCategory === undefined) {
            ChartData.isColumnCategory = columnCount >= rowCount;
        }

        if (ChartData.isColumnCategory) {
            // Category name
            if (autoRowHeader) {
                for (var c = 1; c < columnCount; c++) {
                    categories.push("" + c);
                }
            } else {
                for (var c = 1; c < columnCount; c++) {
                    // Workaround: vuePlot treats all empty category name as 0
                    var name = !data[0][c] || StringExtensions.isEmpty(data[0][c]) ? "" + c : data[0][c];
                    categories.push(name);
                }
            }

            // Series name
            if (autoColumnHeader) {
                for (var r = 1; r < rowCount; r++) {
                    series.push({ name: "Series" + r, data: [] });
                }
            } else {
                for (var r = 1; r < rowCount; r++) {
                    // Workaround: vuePlot treats all empty series name as the same one,
                    // generate an unique name to avoid this issue
                    var name = !data[r][0] || StringExtensions.isEmpty(data[r][0]) ? "Series" + r : data[r][0];
                    series.push({ name: name, data: [] });
                }
            }

            for (var r = 0; r < series.length; r++) {
                for (var c = 0; c < categories.length; c++) {
                    var celltext = data[r + 1][c + 1];

                    // Workaround: to make vuePlot happy, set the data 0 when it is not a number
                    var cellData = !$.isNumeric(celltext) ? 0 : parseFloat(celltext);
                    series[r].data.push(cellData);
                }
            }
        } else {
            // Category name
            if (autoColumnHeader) {
                for (var r = 1; r < rowCount; r++) {
                    categories.push("" + r);
                }
            } else {
                for (var r = 1; r < rowCount; r++) {
                    // Workaround: vuePlot treats all empty category name as 0
                    var name = !data[r][0] || StringExtensions.isEmpty(data[r][0]) ? "" + r : data[r][0];
                    categories.push(name);
                }
            }

            // Series name
            if (autoRowHeader) {
                for (var c = 1; c < columnCount; c++) {
                    series.push({ name: "Series" + c, data: [] });
                }
            } else {
                for (var c = 1; c < columnCount; c++) {
                    // Workaround: vuePlot treats all empty series name as the same one,
                    // generate an unique name to avoid this issue
                    var name = !data[0][c] || StringExtensions.isEmpty(data[0][c]) ? "Series" + c : data[0][c];
                    series.push({ name: name, data: [] });
                }
            }

            for (var c = 0; c < series.length; c++) {
                for (var r = 0; r < categories.length; r++) {
                    var celltext = data[r + 1][c + 1];

                    // Workaround: to make vuePlot happy, set the data 0 when it is not a number
                    var cellData = !$.isNumeric(celltext) ? 0 : parseFloat(celltext);
                    series[c].data.push(cellData);
                }
            }
        }

        ChartData.customizedData = { categories: { name: Strings.seriesName, data: categories }, series: series };
    };

    /**
    * Build chart data.
    */
    ChartData.buildData = function () {
        return {
            chartData: this.buildDataRecords(),
            peopleChartData: this.buildPeopleDataRecords()
        };
    };

    /**
    * Build data which can be bound to chart from original selection data.
    */
    ChartData.buildDataRecords = function () {
        // Object array to store all data after format.
        var records = [];

        // Check whether has values.
        if (this.data.categories.data.length != 0) {
            // Declare a variable to store single record.
            // single record format: {category: "xx", coloumn1: "coloumn1", coloumn2: "coloumn2", coloumn3: "coloumn3"}
            var singleRecord = {};

            for (var r = 0; r < this.data.categories.data.length; r++) {
                // Reset singleRecord object for each loop.
                singleRecord = {};

                if (this.data.series.length != 0) {
                    for (var c = 0; c < this.data.series.length; c++) {
                        for (var i = 0; i < this.data.series.length; i++) {
                            singleRecord[this.data.series[i].name] = this.data.series[i].data[r];
                        }

                        // Add category key for singleRecord.
                        singleRecord[this.data.categories.name] = this.data.categories.data[r];
                    }
                } else {
                    // Add category key for singleRecord.
                    singleRecord[this.data.categories.name] = this.data.categories.data[r];
                }

                // Add singleRecord to records array.
                records.push(singleRecord);
            }
        }

        return records;
    };

    /**
    * Build data which can be bound to people chart from original selection data.
    */
    ChartData.buildPeopleDataRecords = function () {
        var _this = this;
        // Object array to store all data after format.
        var peopleData = [];

        if (this.data != null && this.data.categories.data.length != 0) {
            this.data.categories.data.forEach(function (item, index) {
                var singleRow = [];
                var value = _this.data.series[0].data[index];
                if (value && value > 0) {
                    singleRow.push(item);
                    singleRow.push(value);
                    peopleData.push(singleRow);
                }
            });
        }

        return peopleData;
    };
    ChartData.dataRecords = null;

    ChartData.isDataChanged = false;
    return ChartData;
})();
var AgaveTheme = (function () {
    function AgaveTheme() {
        var themeManager = new OfficeThemeManager();
        themeManager.onThemeChange(this.themeChangeHandler);
    }
    /**
    * Theme change handler, will hit when theme change on ppt host.
    */
    AgaveTheme.prototype.themeChangeHandler = function (e) {
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

        if (ChartAgave.chartType === 9 /* People */) {
            ChartAgave.theme && ChartAgave.theme.updatePeopleTheme();
        }
    };

    /**
    * Set customize chart theme.
    */
    AgaveTheme.prototype.customizeTheme = function () {
        var instance = this;

        // Workaround vuePlot issue about set titleSize in setCallback failed.
        var titleTheme = instance.titleTheme;
        if (Chart.chartPlot && titleTheme.fontSize) {
            (Chart.chartPlot).titleSize(titleTheme.fontSize);
        }

        // Update chart colors by accent colors.
        Chart.updateChartColor(Strings.defaultBarColors.values);

        // Update chart theme in this callback.
        vp.session.currentTheme().setCallback(function (partName, seriesIndex, ab) {
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
                case Strings.chartPartNames.yaxisTick: {
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
    };

    /**
    * Setup default theme for agave. it will be called in excel host.
    */
    AgaveTheme.setupHighContrastTheme = function () {
        // Update chart theme in this callback.
        vp.session.currentTheme().setCallback(function (partName, seriesIndex, ab) {
            switch (partName) {
                case Strings.chartPartNames.title: {
                    ab.fontFamily = Strings.fontFamilies.segoeUISemilight, ab.textFill = "#767676";
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
                    ab.fontFamily = Strings.fontFamilies.segoeUI, ab.textSize = "12";
                    ab.textFill = "#767676";
                    break;
                }
                case Strings.chartPartNames.layerText: {
                    ab.fontFamily = Strings.fontFamilies.segoeUI, ab.textSize = "12";
                    ab.textFill = "#767676";
                    break;
                }
                default: {
                    break;
                }
            }
        });
    };

    /**
    * Setup default theme for agave. it will be called in excel host.
    */
    AgaveTheme.setupDefaultTheme = function () {
        // Update chart theme in this callback.
        vp.session.currentTheme().setCallback(function (partName, seriesIndex, ab) {
            switch (partName) {
                case Strings.chartPartNames.title: {
                    ab.fontFamily = Strings.fontFamilies.segoeUISemilight, ab.textFill = "#767676";
                    break;
                }
                case Strings.chartPartNames.xaxisLabel:
                case Strings.chartPartNames.legendTitle:
                case Strings.chartPartNames.xaxisLabel:
                case Strings.chartPartNames.xaxisTitle:
                case Strings.chartPartNames.yaxisLabel:
                case Strings.chartPartNames.yaxisTitle:
                case Strings.chartPartNames.legendLabel: {
                    ab.fontFamily = Strings.fontFamilies.segoeUI, ab.textSize = "12";
                    ab.textFill = "#767676";
                    break;
                }
                case Strings.chartPartNames.layerText: {
                    ab.fontFamily = Strings.fontFamilies.segoeUI, ab.textSize = "12";
                    ab.textFill = "#767676";
                    break;
                }
                default: {
                    break;
                }
            }
        });
    };

    /**
    * Add accent color class name to support theme in ppt host.
    */
    AgaveTheme.prototype.syncTheme = function () {
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
            $seriesNames.each(function (index, name) {
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
                $.each(colorSquares, function (index, square) {
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
                $.each(colorSquares, function (index, square) {
                    $(square).css("background-color", colorSchemas[index]);
                });
            }

            var $accentColorCtrls = $(".accent-color");
            $accentColorCtrls.css("color", AgaveTheme.currentTheme.primaryFontColor);
            $accentColorCtrls.css("font-family", AgaveTheme.currentTheme.bodyFont);

            // Add presentation agave style to app.
            $("#chartAgaveTheme").attr("href", "../Content/PresentationChartAgave.css");
        }
    };

    /**
    * Update people theme by user choose.
    */
    AgaveTheme.prototype.updatePeopleTheme = function () {
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
    };

    Object.defineProperty(AgaveTheme.prototype, "titleTheme", {
        /**
        * Title theme.
        */
        get: function () {
            return {
                fontFamily: AgaveTheme.currentTheme.headerFont,
                fontSize: "28",
                fontColor: AgaveTheme.currentTheme.primaryFontColor
            };
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AgaveTheme.prototype, "legendFont", {
        /**
        * Legned font theme.
        */
        get: function () {
            return {
                fontFamily: AgaveTheme.currentTheme.bodyFont,
                fontSize: "12",
                fontColor: AgaveTheme.currentTheme.primaryFontColor
            };
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AgaveTheme.prototype, "chartText", {
        /**
        * Axis label theme.
        */
        get: function () {
            return {
                fontFamily: AgaveTheme.currentTheme.bodyFont,
                fontSize: "12",
                fontColor: AgaveTheme.currentTheme.primaryFontColor
            };
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AgaveTheme.prototype, "axisLine", {
        /**
        * Axis line theme.
        */
        get: function () {
            var axisline = {
                size: "1",
                color: "#D8D8D8"
            };
            return {
                axisline: axisline
            };
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(AgaveTheme.prototype, "frameOutline", {
        /**
        * Chart frame outline theme.
        */
        get: function () {
            var outline = {
                size: "2px",
                color: "#D8D8D8"
            };
            return {
                frameOutline: outline
            };
        },
        enumerable: true,
        configurable: true
    });
    return AgaveTheme;
})();
var AccessibilityHelper = (function () {
    function AccessibilityHelper() {
    }
    /**
    * Disable tab accessibity.
    */
    AccessibilityHelper.disableSettingPaneAccessibility = function () {
        $("#settingsPanel").find("[tabindex]").attr("tabindex", "-1");
    };

    /**
    * Added tab accessibility for back button.
    */
    AccessibilityHelper.enableBackButtonAccessibility = function (selector, tabIndex) {
        tabIndex = tabIndex ? tabIndex : "10";
        if (selector) {
            $(selector).find(".backBtn>img").attr("tabindex", tabIndex);
        } else {
            $(".backBtn>img").attr("tabindex", tabIndex);
        }
    };

    /**
    * Added tab accessibility for toolbar buttons.
    */
    AccessibilityHelper.enableToolbarAccessibility = function () {
        $("#toolbarChartType>img").attr("tabindex", "5");
        $("#toolbarData>img").attr("tabindex", "6");
        $("#toolbarSettings>img").attr("tabindex", "7");
    };

    /**
    * Enable tab accessibility for setting pane(except people setting pane).
    */
    AccessibilityHelper.enableSettingPaneAccessibility = function () {
        // Setting pane for chart exception people chart.
        var $container = $("#tabs");
        var options = [
            { selector: ".settings-title-text", tabIndex: "1" },
            { selector: ".keyboard-switch-container", tabIndex: "1" },
            { selector: ".text-box", tabIndex: "1" }
        ];
        OfficeUtil.Accessibility.addKeyboardTabAccess("#settingsPanel", options);
        this.enableBackButtonAccessibility("#settingsPanel", "2");
    };

    /**
    * Enable tab accessibility for basic tab in people setting pane.
    */
    AccessibilityHelper.enableBasicTabForPeopleSettingpane = function () {
        var options = [
            { selector: ".people-title-area", tabIndex: "1" },
            { selector: ".sharp-list>img", tabIndex: "1" },
            { selector: ".sub-title", tabIndex: "1" }
        ];

        OfficeUtil.Accessibility.addKeyboardTabAccess("#peopleTabs", options);
        this.enableBackButtonAccessibility("#settingsPanel", "2");
    };

    /**
    * Enable tab accessibility for type tab in people setting pane.
    */
    AccessibilityHelper.enableTypeTabForPeopleSettingpane = function () {
        var options = [
            { selector: ".people-types>img", tabIndex: "1" },
            { selector: ".sub-title", tabIndex: "1" }
        ];

        OfficeUtil.Accessibility.addKeyboardTabAccess("#peopleTabs", options);
        this.enableBackButtonAccessibility("#settingsPanel", "2");
    };

    /**
    * Enable tab accessibility for theme tab in people setting pane.
    */
    AccessibilityHelper.enableThemeTabForPeopleSettingpane = function () {
        var options = [
            { selector: ".people-theme>img", tabIndex: "1" },
            { selector: ".sub-title", tabIndex: "1" }
        ];

        OfficeUtil.Accessibility.addKeyboardTabAccess("#peopleTabs", options);
        this.enableBackButtonAccessibility("#settingsPanel", "2");
    };

    /**
    * Add keyboard accessibility for chart page.
    */
    AccessibilityHelper.enableChartPageAccessibility = function () {
        OfficeUtil.Accessibility.addKeyboardTabAccess("#contentChartPage", [
            { selector: "#welcomePopup", tabIndex: "1" },
            { selector: ".legend-Entry", tabIndex: "8" }]);
        this.enableToolbarAccessibility();
    };

    /**
    * Add keyboard accessibility for chart type page.
    */
    AccessibilityHelper.enableChartTypeAccessibility = function () {
        OfficeUtil.Accessibility.addKeyboardTabAccess(".charttype-container", [
            { selector: ".chartType-nav-ul>li", tabIndex: "1" },
            { selector: ".chartType-thumbnail-ul img", tabIndex: "2" },
            { selector: "#selectChartTypeBtn", tabIndex: "3" }
        ]);
        this.enableToolbarAccessibility();
        this.enableBackButtonAccessibility();
    };

    /**
    * Add keyboard accessibility for chart type page.
    */
    AccessibilityHelper.enableDataPageAccessibility = function () {
        OfficeUtil.Accessibility.addKeyboardTabAccess("#contentDataPage", [
            { selector: "#selectDataBtn", tabIndex: "1" },
            { selector: ".toolbar-icon", tabIndex: "1" },
            { selector: ".insert-colomn-icon", tabIndex: "1" },
            { selector: ".insert-row-icon", tabIndex: "1" }
        ]);
        this.enableToolbarAccessibility();
        this.enableBackButtonAccessibility();
    };

    /**
    * Add keyboard accessibility for Data selection page.
    */
    AccessibilityHelper.enableDataSelectionAccessibility = function () {
        OfficeUtil.Accessibility.addKeyboardTabAccess("#selectdatadiv_bottom", [{ selector: ".blueBtn", tabIndex: "1" }]);
    };
    return AccessibilityHelper;
})();
var AgaveHelper = (function () {
    function AgaveHelper() {
    }
    /**
    * Set setting button icons(default, hover and press).
    */
    AgaveHelper.initSettingsBtn = function () {
        this.setBtnIcons("#toolbarSettings>img", {
            icon: Strings.buttonIcons.setting,
            hoverIcon: Strings.buttonIcons.settingHover,
            pressIcon: Strings.buttonIcons.settingPress
        });
    };

    /**
    * Set data button icons(default, hover and press).
    */
    AgaveHelper.initDataBtn = function () {
        this.setBtnIcons("#toolbarData>img", {
            icon: Strings.buttonIcons.data,
            hoverIcon: Strings.buttonIcons.dataHover,
            pressIcon: Strings.buttonIcons.dataPress
        });
    };

    /**
    * Set ChartType button icons(default, hover and press).
    */
    AgaveHelper.initChartTypeBtn = function () {
        this.setBtnIcons("#toolbarChartType>img", {
            icon: Strings.buttonIcons.chartType,
            hoverIcon: Strings.buttonIcons.chartTypeHover,
            pressIcon: Strings.buttonIcons.chartTypePress
        });
    };

    /**
    * Set back button icons(default, hover and press under ppt/excel, rtl and default direction).
    */
    AgaveHelper.initBackbtn = function () {
        var backs = $(".topBanner .back-icon");
        this.setBackDefaultIcon();
        backs.hover(this.backHoverHandle, this.setBackDefaultIcon).focusin(this.backHoverHandle).focusout(this.setBackDefaultIcon).mousedown(this.backPressHandle).mouseup(this.setBackDefaultIcon);
    };

    /**
    * Set back button icon in hover(ppt/excel, rtl and default direction).
    */
    AgaveHelper.backHoverHandle = function (e) {
        // Set default hover icon(excel ltr).
        var src = Strings.buttonIcons.backHover;
        var $target = $(e.target || e.srcElement);

        if (OfficeUtil.Util.isRtlLanguage()) {
            if (OfficeUtil.Util.isPresentationView()) {
                src = Strings.buttonIcons.backHoverRTLPPT;
            } else {
                src = Strings.buttonIcons.backHoverRTL;
            }
        } else if (OfficeUtil.Util.isPresentationView()) {
            src = Strings.buttonIcons.backHoverPPT;
        }

        $target.attr("src", src);
        return false;
    };

    /**
    * Set back button icon in press(ppt/excel, rtl and default direction).
    */
    AgaveHelper.backPressHandle = function (e) {
        var $target = $(e.target || e.srcElement);

        // Set default press icon(excel ltr).
        var src = Strings.buttonIcons.backPress;

        if (OfficeUtil.Util.isRtlLanguage()) {
            if (OfficeUtil.Util.isPresentationView()) {
                src = Strings.buttonIcons.backPressRTLPPT;
            } else {
                src = Strings.buttonIcons.backPressRTL;
            }
        } else if (OfficeUtil.Util.isPresentationView()) {
            src = Strings.buttonIcons.backPressPPT;
        }

        $target.attr("src", src);
        return false;
    };

    /**
    * Set back button icon in default(ppt/excel, rtl and default direction).
    */
    AgaveHelper.setBackDefaultIcon = function () {
        var defaultSrc = Strings.buttonIcons.back;
        if (OfficeUtil.Util.isRtlLanguage()) {
            if (OfficeUtil.Util.isPresentationView()) {
                defaultSrc = Strings.buttonIcons.backRTLPPT;
            } else {
                defaultSrc = Strings.buttonIcons.backRTL;
            }
        } else if (OfficeUtil.Util.isPresentationView()) {
            defaultSrc = Strings.buttonIcons.backPPT;
        }
        $(".topBanner .back-icon").attr("src", defaultSrc);
    };

    /**
    * Set button icon in default, hover in, hover out, mouse down and mouse up.
    */
    AgaveHelper.setBtnIcons = function (selector, icons) {
        var btn = $(selector);
        btn.attr("src", icons.icon);

        btn.hover(function (e) {
            $(e.target || e.srcElement).attr("src", icons.hoverIcon);
            return false;
        }, function (e) {
            $(e.target || e.srcElement).attr("src", icons.icon);
            return false;
        }).focusin(function (e) {
            $(e.target || e.srcElement).attr("src", icons.hoverIcon);
            return false;
        }).focusout(function (e) {
            $(e.target || e.srcElement).attr("src", icons.icon);
            return false;
        }).mousedown(function (e) {
            $(e.target || e.srcElement).attr("src", icons.pressIcon);
            return false;
        }).mouseup(function (e) {
            $(e.target || e.srcElement).attr("src", icons.icon);
            return false;
        });
    };
    return AgaveHelper;
})();
var ChartTableHelper = (function () {
    function ChartTableHelper() {
    }
    /**
    * Convert decimal number to alphabet index (e.g. 1->A, 28->AB)
    */
    ChartTableHelper.convertNumberToAlphabetIndex = function (index) {
        if (index < 0) {
            return null;
        }

        return ChartTableHelper.recursiveFunctionForAlphabetConversion(index, "");
    };

    /**
    * Recursive function for alphabet conversion
    */
    ChartTableHelper.recursiveFunctionForAlphabetConversion = function (index, result) {
        if (index <= 26) {
            return ChartTableHelper.alphabetIndexTable[index] + result;
        }

        var div = Math.floor(index / 26);
        var rem = index % 26;

        return ChartTableHelper.recursiveFunctionForAlphabetConversion(div, ChartTableHelper.alphabetIndexTable[rem] + result);
    };

    /**
    * Trimmed the blank row from bottom, column from right
    */
    ChartTableHelper.getTableData = function () {
        var rowCount = ChartTableHelper.rowCountOfRenderTable();
        var columnCount = ChartTableHelper.columnCountOfRenderTable();

        var rowCountAfterTrim = rowCount;
        var columnCountAfterTrim = columnCount;

        var cellValue;

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
        var returnedData = [];
        if (rowCountAfterTrim > 1) {
            for (var r = rowStart; r < rowCountAfterTrim; r++) {
                var rowData = [];
                for (var c = colStart; c < columnCountAfterTrim; c++) {
                    if ((r === rowStart && !ChartTable.getInstance().settings.showRowHeader) || (c === colStart && !ChartTable.getInstance().settings.showColumnHeader)) {
                        rowData.push("");
                    } else {
                        rowData.push(ChartTableHelper.findTr(r).children("td:eq(" + c + ")").text());
                    }
                }
                returnedData.push(rowData);
            }
        }

        return returnedData;
    };

    /**
    * Return row count of chart data
    */
    ChartTableHelper.rowCountOfData = function () {
        if (ObjectExtensions.isNullOrUndefined(ChartTable.getInstance().tableData) || ChartTable.getInstance().tableData.length === 0) {
            return 0;
        } else {
            return ChartTable.getInstance().tableData.length - 1;
        }
    };

    /**
    * Return column count of chart data
    */
    ChartTableHelper.columnCountOfData = function () {
        if (ObjectExtensions.isNullOrUndefined(ChartTable.getInstance().tableData) || ChartTable.getInstance().tableData.length === 0) {
            return 0;
        } else {
            return ChartTable.getInstance().tableData[0].length - 1;
        }
    };

    /**
    * Return row count of chart data
    */
    ChartTableHelper.rowCountOfRenderTable = function () {
        // the minimal row count of table is 7
        if (ChartTable.getInstance().settings.showRowHeader) {
            return Math.max(ChartTableHelper.rowCountOfData(), 4) + 3;
        } else {
            return Math.max(ChartTableHelper.rowCountOfData(), 5) + 2;
        }
    };

    /**
    * Return column count of chart data
    */
    ChartTableHelper.columnCountOfRenderTable = function () {
        // the minimal column count of table is 7
        if (ChartTable.getInstance().settings.showColumnHeader) {
            return Math.max(ChartTableHelper.columnCountOfData(), 4) + 3;
        } else {
            return Math.max(ChartTableHelper.columnCountOfData(), 5) + 2;
        }
    };

    /**
    * Return JQuery elements of tr in the data table
    */
    ChartTableHelper.findTr = function (index) {
        if (typeof index === "undefined") { index = -1; }
        if (index < 0) {
            return $("#dataTableDiv").find("tr");
        }

        return $("#dataTableDiv").find("tr:eq(" + index + ")");
    };

    /**
    * Return JQuery elements of td in the data table
    */
    ChartTableHelper.findTd = function () {
        return $("#dataTableDiv").find("td");
    };

    /**
    * Get table cell by row and column index
    */
    ChartTableHelper.getCell = function (rowIndex, columnIndex) {
        return $("#dataTableDiv").find("tr:eq(" + rowIndex + ")").children("td:eq(" + columnIndex + ")");
    };

    ChartTableHelper.getLastCellOfUsedRange = function () {
        return $("#dataTableDiv").find(".cell-bottom-boundary").last();
    };

    /**
    * Get table cell by coords
    */
    ChartTableHelper.getCellByCoords = function (coords) {
        return ChartTableHelper.getCell(coords.row, coords.col);
    };

    /**
    * Get column index of the specified cell
    */
    ChartTableHelper.getColumnIndexOfCell = function ($td) {
        return $td.index();
    };

    /**
    * Get row index of the specified cell
    */
    ChartTableHelper.getRowIndexOfCell = function ($td) {
        return $td.parent().index();
    };

    /**
    * Get coords of the specified cell
    */
    ChartTableHelper.getCoordsOfCell = function ($td) {
        return { row: ChartTableHelper.getRowIndexOfCell($td), col: ChartTableHelper.getColumnIndexOfCell($td) };
    };

    /**
    * Delete a row by index
    */
    ChartTableHelper.deleteRow = function (index) {
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
    };

    /**
    * Insert a row above the given index
    */
    ChartTableHelper.insertRowAbove = function (index) {
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
    };

    /**
    * Insert a row below the given index
    */
    ChartTableHelper.insertRowBelow = function (index) {
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
    };

    /**
    * Delete a column by index
    */
    ChartTableHelper.deleteColumn = function (index) {
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
    };

    /**
    * Insert a column on the left of given index
    */
    ChartTableHelper.insertColumnLeft = function (index) {
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
    };

    /**
    * Insert a column on the right of given index
    */
    ChartTableHelper.insertColumnRight = function (index) {
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
    };

    /**
    * Get an empty row
    */
    ChartTableHelper.getEmptyRow = function () {
        var spareTr = ChartTableHelper.findTr().last();
        spareTr.children().empty();
        return $("<tr></tr>").html(spareTr.html());
    };

    /**
    * Return max row index of current table
    */
    ChartTableHelper.maxRowIndex = function () {
        return ChartTableHelper.findTr().length - 1;
    };

    /**
    * Return max column index of current table
    */
    ChartTableHelper.maxColumnIndex = function () {
        return ChartTableHelper.findTr().first().children("td").length - 1;
    };

    /**
    * Add table focus listener
    */
    ChartTableHelper.addTableFocusListener = function () {
        $("#dataTableDiv").children("table").off("focus").on("focus", function (e) {
            if (!TableSelection.hasSelection()) {
                var coords = { col: 1, row: 1 };
                TableSelection.setSelectionRange(coords, coords);
            }
        });
    };

    /**
    * Add td listners
    */
    ChartTableHelper.addTDListners = function () {
        ChartTableHelper.findTd().on("dblclick", function () {
            ChartTableHelper.enterEditingCell(0 /* Append */);

            return false;
        }).on("mousedown", function (e) {
            var coords = {
                col: ChartTableHelper.getColumnIndexOfCell($(this)),
                row: ChartTableHelper.getRowIndexOfCell($(this))
            };

            if (coords.col === 0 || coords.row === 0) {
                return false;
            }

            if (ChartTableHelper.isEditing() && coords.col === ChartTable.getInstance().selectionRange.start.col && coords.row === ChartTable.getInstance().selectionRange.start.row) {
                return;
            }

            if (!TableSelection.isSelecting && e.shiftKey) {
                TableSelection.setSelectionRangeEnd(coords);
            } else {
                TableSelection.isSelecting = true;
                TableSelection.setSelectionRangeStart(coords);
                TableSelection.addTDMouseMoveListener();
                TableSelection.addMouseUpListener();
            }

            ChartTableHelper.cellInput().blur();
            $(document).focus();
            e.preventDefault();
        });
    };

    /**
    * Remove td listners
    */
    ChartTableHelper.removeTDListeners = function () {
        ChartTableHelper.findTd().off("dblclick").off("mousedown");
    };

    /**
    * Return true if chart table is under editing
    */
    ChartTableHelper.isEditing = function () {
        return ChartTableHelper.cellInput().length > 0;
    };

    /**
    * Add keydown listener
    */
    ChartTableHelper.addKeyDownListener = function () {
        $(document).off("keydown");

        $(document).on("keydown", function (event) {
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
                    var $nextCell;

                    // Shift + Enter -> Exit edit mode and move above
                    if (event.shiftKey) {
                        ChartTableHelper.exitEditingCell(1 /* Overwrite */);
                        $nextCell = ChartTableHelper.getCell(selectionRange.start.row - 1, selectionRange.start.col);
                        ChartTableHelper.selectCell($nextCell);
                    } else if (event.altKey) {
                        var $input = $(".editingInput");
                        $input.val($input.val() + "\r");
                    } else {
                        ChartTableHelper.exitEditingCell(1 /* Overwrite */);
                        $nextCell = ChartTableHelper.getCell(selectionRange.start.row + 1, selectionRange.start.col);
                        ChartTableHelper.selectCell($nextCell);
                    }
                } else if (event.which === 9) {
                    var $nextCell;

                    // Shift + Tab -> Complete cell entry and select the previous cell in the row
                    if (event.shiftKey) {
                        ChartTableHelper.exitEditingCell(1 /* Overwrite */);
                        $nextCell = ChartTableHelper.getCell(selectionRange.start.row, selectionRange.start.col - 1);
                        ChartTableHelper.selectCell($nextCell);
                    } else {
                        ChartTableHelper.exitEditingCell(1 /* Overwrite */);
                        $nextCell = ChartTableHelper.getCell(selectionRange.start.row, selectionRange.start.col + 1);
                        ChartTableHelper.selectCell($nextCell);
                    }
                } else if (event.which === 27) {
                    ChartTableHelper.exitEditingCell(0 /* Escape */);
                } else if (event.which === 32) {
                    // Workaround: to avoid trigger keyboard accessibilty
                    var $input = $(".editingInput");
                    $input.val($input.val() + " ");
                } else {
                    preventDefault = false;
                }
            } else {
                // Delete -> delete the data
                if (event.which === 46) {
                    if (TableSelection.isSelectAll()) {
                        ChartTable.getInstance().tableData = [];
                        ChartTable.getInstance().drawTable();
                    } else {
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

                        var $cell;
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
                } else if (event.which === 8) {
                    var $cell = TableSelection.selectedCell();
                    ChartTableHelper.updateCell($cell, "", true);
                    ChartTable.getInstance().updateData();
                    ChartTableHelper.enterEditingCell(1 /* Clear */);
                } else if (event.which === 13) {
                    TableSelection.moveSelectionByEnter(event.shiftKey);
                } else if (event.which === 37) {
                    TableSelection.moveSelection(0 /* Left */, event.shiftKey);
                } else if (event.which === 38) {
                    TableSelection.moveSelection(2 /* Up */, event.shiftKey);
                } else if (event.which === 39) {
                    TableSelection.moveSelection(1 /* Right */, event.shiftKey);
                } else if (event.which === 40) {
                    TableSelection.moveSelection(3 /* Down */, event.shiftKey);
                } else if (event.which === 9) {
                    // Tab -> right one cell
                    // Shift + Tab -> left one cell
                    TableSelection.moveSelectionByTab(event.shiftKey);
                } else if (event.which === 36) {
                    // Ctrl + Home -> Go to A1
                    if (event.ctrlKey) {
                        var coords = { col: 1, row: 1 };
                        TableSelection.setSelectionRange(coords, coords);
                    } else if (event.shiftKey) {
                        TableSelection.enlargeSelectionToBeginningOfRows();
                    } else if (ChartTable.getInstance().selectionRange.start) {
                        var coords = { col: 1, row: ChartTable.getInstance().selectionRange.start.row };
                        TableSelection.setSelectionRange(coords, coords);
                    }
                } else if (event.which === 35) {
                    // Ctrl + End -> Last cell of used range
                    if (event.ctrlKey) {
                        var coords = ChartTableHelper.getCoordsOfCell(ChartTableHelper.getLastCellOfUsedRange());
                        TableSelection.setSelectionRange(coords, coords);
                    }
                } else if (event.which === 27) {
                    TableSelection.clearSelection();
                    if (OfficeUtil.Util.isPresentationView()) {
                        ChartTable.getInstance().$showColumnHeader.focus();
                    } else {
                        $("#selectDataBtn").focus();
                    }
                } else if (event.which === 113) {
                    ChartTableHelper.enterEditingCell(0 /* Append */);
                } else if (event.which === 32) {
                    // Ctrl + Space -> Entire column
                    if (event.ctrlKey) {
                        TableSelection.selectColumnsOfSelection();
                    }

                    // Shift + Space -> Entire row
                    if (event.shiftKey) {
                        TableSelection.selectRowsOfSelection();
                    }
                } else if (event.which === 33) {
                    // Shift + Page Up -> Up of cells in current column
                    if (event.shiftKey) {
                        TableSelection.enlargeSelectionToBeginningOfColumns();
                    }
                } else if (event.which === 34) {
                    // Shift + Page Down -> Down of cells in current column
                    if (event.shiftKey) {
                        TableSelection.enlargeSelectionToEndOfColumns();
                    }
                } else {
                    if (!isMultiple && event.which !== 16 && event.which !== 17) {
                        ChartTableHelper.enterEditingCell(1 /* Clear */);
                        preventDefault = false;
                    }
                }
            }

            if (preventDefault) {
                event.preventDefault();
            }
        });
    };

    /**
    * Remove keydown listener
    */
    ChartTableHelper.removeKeyDownListener = function () {
        $(document).off("keydown");
    };

    /**
    * Add the copy/paste callbacks
    */
    ChartTableHelper.addCopyPaste = function () {
        var copyPasteInstance = new CopyPaste();
        copyPasteInstance.onPaste(ChartTableHelper.onPaste);
    };

    /**
    * Paste handler
    */
    ChartTableHelper.onPaste = function (str) {
        var input = str.replace(/^[\r\n]*/g, '').replace(/[\r\n]*$/g, '');

        var inputArray = SheetClip.parse(input);

        var row = inputArray.length;
        var col = inputArray[0].length;

        // calculate the new selection range
        var chartTable = ChartTable.getInstance();
        var selectionRange = chartTable.selectionRange;
        var range = {
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

        if (data.length === 0) {
            // create a new table
            var emptyRow = [];
            for (var c = 0; c < range.end.col + colOffset; c++) {
                emptyRow.push("");
            }
            for (var r = 0; r < range.end.row + rowOffset; r++) {
                data.push(emptyRow.slice(0));
            }
        } else {
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

        for (var r = 0, rLens = range.end.row - range.start.row; r <= rLens; r++) {
            for (var c = 0, cLens = range.end.col - range.start.col; c <= cLens; c++) {
                data[range.start.row + r - 1 + rowOffset][range.start.col + c - 1 + colOffset] = ChartTableHelper.formatCellData(inputArray[r % inputArray.length][c % inputArray[0].length]);
            }
        }

        chartTable.tableData = data;

        // re-draw the table
        chartTable.drawTable();

        // select the new range
        setTimeout(function () {
            TableSelection.setSelectionRange(range.start, range.end);
        }, 0);
    };

    /**
    * Return the JQuery element of cell editing input
    */
    ChartTableHelper.cellInput = function () {
        return $(".editingInput");
    };

    /**
    * Select a cell
    */
    ChartTableHelper.selectCell = function ($cell) {
        // If there is a child, the cell is in editing mode
        if (ObjectExtensions.isNullOrUndefined($cell) || $cell.length === 0) {
            return;
        }

        var coords = {
            row: $cell.parent().index(),
            col: $cell.index()
        };
        TableSelection.setSelectionRange(coords, coords);
    };

    /**
    * Enter cell editing mode
    */
    ChartTableHelper.enterEditingCell = function (editingMode) {
        if (typeof editingMode === "undefined") { editingMode = 0 /* Append */; }
        var $cell = TableSelection.selectedCell();

        if (!ChartTableHelper.isCellEditable($cell) || $cell.children(".editingInput").length > 0) {
            return;
        }

        var text = $cell.text();

        var left = $cell.offset().left + $("#tableFrame").scrollLeft() - 60 + 2;
        if (OfficeUtil.Util.isRtlLanguage()) {
            left += 12;
        }
        var $input = $("<textarea />").css({
            "position": "absolute",
            "left": left,
            "top": $cell.offset().top + $("#tableFrame").scrollTop() - 163 - 2,
            "width": $cell.outerWidth() + 1,
            "height": $cell.outerHeight() - 2,
            "border": "none"
        }).addClass("editingInput");

        $input.appendTo($cell);
        $input.focus();

        if (editingMode === 0 /* Append */) {
            $input.val(text);
            $input[0]["setSelectionRange"](text.length, text.length);
        }

        $(".editingInput").on("blur", function (event) {
            ChartTableHelper.exitEditingCell(1 /* Overwrite */);
        });
    };

    /**
    * Exit editing cell
    */
    ChartTableHelper.exitEditingCell = function (exitingEditingCellMode) {
        var $input = ChartTableHelper.cellInput();
        var $cell = $input.parent();
        var val = $input.val();
        $input.remove();

        if (exitingEditingCellMode === 1 /* Overwrite */) {
            ChartTableHelper.updateCell($cell, val);
        } else if (exitingEditingCellMode === 0 /* Escape */) {
            ChartTableHelper.selectCell(TableSelection.selectedCell());
        }
    };

    /**
    * Update the cell
    */
    ChartTableHelper.updateCell = function ($cell, value, preventDrawTable) {
        if (typeof preventDrawTable === "undefined") { preventDrawTable = false; }
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
    };

    /**
    * Select the neighbour cell
    */
    ChartTableHelper.selectNeighbourCell = function (neighbourCell) {
        if (ObjectExtensions.isNullOrUndefined(TableSelection.selectedCell())) {
            return;
        }

        var $targetCell;
        var maxRowIndex = ChartTableHelper.maxRowIndex();
        var maxColumnIndex = ChartTableHelper.maxColumnIndex();
        var selectedRowIndex = ChartTable.getInstance().selectionRange.start.row;
        var selectedColumnIndex = ChartTable.getInstance().selectionRange.start.col;

        switch (neighbourCell) {
            case 0 /* Above */:
                if (selectedRowIndex - 2 < 0) {
                    return;
                }
                $targetCell = ChartTableHelper.getCell(selectedRowIndex - 1, selectedColumnIndex);
                break;
            case 2 /* Below */:
                if (selectedRowIndex + 1 > maxRowIndex) {
                    return;
                }
                $targetCell = ChartTableHelper.getCell(selectedRowIndex + 1, selectedColumnIndex);
                break;
            case 1 /* Right */:
                if (selectedColumnIndex + 1 > maxColumnIndex) {
                    return;
                }
                $targetCell = ChartTableHelper.getCell(selectedRowIndex, selectedColumnIndex + 1);
                break;
            case 3 /* Left */:
                if (selectedColumnIndex - 2 < 0) {
                    return;
                }
                $targetCell = ChartTableHelper.getCell(selectedRowIndex, selectedColumnIndex - 1);
                break;
        }

        ChartTableHelper.selectCell($targetCell);
    };

    /**
    * Return true if cell is editable
    */
    ChartTableHelper.isCellEditable = function ($cell) {
        return !($cell.index() < 1 || $cell.parent().index() < 1 || ($cell.index() === 1 && $cell.parent().index() === 1 && ChartTable.getInstance().settings.showColumnHeader && ChartTable.getInstance().settings.showRowHeader));
    };

    /**
    * Set the visibility of column header
    */
    ChartTableHelper.setColumnHeaderVisibility = function (show) {
        var chartTable = ChartTable.getInstance();
        if (!ObjectExtensions.isNullOrUndefined(show)) {
            chartTable.settings.showColumnHeader = show;
            chartTable.drawTable();
        }

        if (chartTable.settings.showColumnHeader) {
            chartTable.$showColumnHeader.addClass(Strings.tableCSS.toolbarIconActive);
            ChartTableHelper.applyColumnHeaders();
            chartTable.drawTable();
        } else {
            chartTable.$showColumnHeader.removeClass(Strings.tableCSS.toolbarIconActive);
            ChartTableHelper.cacheColumnHeaders();

            // To remove the data in headers
            chartTable.updateData();
            chartTable.drawTable();
        }
    };

    /**
    * Toggle the visibility of column header
    */
    ChartTableHelper.toggleColumnHeaderVisibility = function () {
        ChartTableHelper.setColumnHeaderVisibility(!ChartTable.getInstance().settings.showColumnHeader);
    };

    /**
    * Set the visibility of row header
    */
    ChartTableHelper.setRowHeaderVisibility = function (show) {
        var chartTable = ChartTable.getInstance();
        if (!ObjectExtensions.isNullOrUndefined(show)) {
            chartTable.settings.showRowHeader = show;
            chartTable.drawTable();
        }

        if (chartTable.settings.showRowHeader) {
            chartTable.$showRowHeader.addClass(Strings.tableCSS.toolbarIconActive);
            ChartTableHelper.applyRowHeaders();
            chartTable.drawTable();
        } else {
            chartTable.$showRowHeader.removeClass(Strings.tableCSS.toolbarIconActive);
            ChartTableHelper.cacheRowHeaders();

            // To remove the data in headers
            chartTable.updateData();
            chartTable.drawTable();
        }
    };

    /**
    * Toggle the visibility of row header
    */
    ChartTableHelper.toggleRowHeaderVisibility = function () {
        ChartTableHelper.setRowHeaderVisibility(!ChartTable.getInstance().settings.showRowHeader);
    };

    /**
    * Format the cell data and return it
    */
    ChartTableHelper.formatCellData = function (data) {
        // The size limition of cell value is 255
        return ("" + data).length > 255 ? ("" + data).substr(0, 254) : data;
    };

    ChartTableHelper.setColumnIndexVisibility = function (show) {
        var chartTable = ChartTable.getInstance();
        if (show === undefined || show === null) {
            show = chartTable.settings.showColumnIndex;
        }

        chartTable.settings.showColumnIndex = show;

        if (show) {
            $("#dataTableDiv td:first-child").show();
        } else {
            $("#dataTableDiv td:first-child").hide();
        }
    };

    ChartTableHelper.toggleColumnIndexVisibility = function () {
        ChartTableHelper.setColumnIndexVisibility(!ChartTable.getInstance().settings.showColumnIndex);
    };

    ChartTableHelper.setRowIndexVisibility = function (show) {
        var chartTable = ChartTable.getInstance();
        if (show === undefined || show === null) {
            show = chartTable.settings.showRowIndex;
        }

        chartTable.settings.showRowIndex = show;

        if (show) {
            ChartTableHelper.findTr(0).show();
        } else {
            ChartTableHelper.findTr(0).hide();
        }
    };

    ChartTableHelper.toggleRowIndexVisibility = function () {
        ChartTableHelper.setRowIndexVisibility(!ChartTable.getInstance().settings.showRowIndex);
    };

    ChartTableHelper.cacheRowHeaders = function () {
        var chartTable = ChartTable.getInstance();
        if (chartTable.tableData && chartTable.tableData.length > 0 && chartTable.tableData[0].length > 0) {
            chartTable.cachedRowHeaders = chartTable.tableData[0].slice(0);
        }
    };

    ChartTableHelper.applyRowHeaders = function (removeCahce) {
        if (typeof removeCahce === "undefined") { removeCahce = true; }
        var chartTable = ChartTable.getInstance();
        if (chartTable.cachedRowHeaders && chartTable.cachedRowHeaders.length > 0) {
            chartTable.tableData[0] = chartTable.cachedRowHeaders.slice(0);

            if (removeCahce) {
                chartTable.cachedRowHeaders = null;
            }
        }
    };

    ChartTableHelper.cacheColumnHeaders = function () {
        var chartTable = ChartTable.getInstance();
        if (chartTable.tableData && chartTable.tableData.length > 0 && chartTable.tableData[0].length > 0) {
            chartTable.cachedColumnHeaders = [];
            for (var i = 0; i < chartTable.tableData.length; i++) {
                chartTable.cachedColumnHeaders.push(chartTable.tableData[i][0]);
            }
        }
    };

    ChartTableHelper.applyColumnHeaders = function (removeCache) {
        if (typeof removeCache === "undefined") { removeCache = true; }
        var chartTable = ChartTable.getInstance();
        if (chartTable.cachedColumnHeaders && chartTable.cachedColumnHeaders.length > 0) {
            if (!chartTable.tableData || chartTable.tableData.length === 0) {
                chartTable.tableData = [];

                for (var i = 0; i < chartTable.cachedColumnHeaders.length; i++) {
                    chartTable.tableData.push([chartTable.cachedColumnHeaders[i]]);
                }
            } else {
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
    };
    ChartTableHelper.alphabetIndexTable = {
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
    return ChartTableHelper;
})();
var ControlHelper = (function () {
    function ControlHelper() {
    }
    /** show the specified control */
    ControlHelper.showControl = function (control, func, data) {
        if (!control.isVisible) {
            ControlHelper.toggleControl(control, func, data);
        }
    };

    /** hide the specified control */
    ControlHelper.hideControl = function (control, func, isAnimate) {
        if (typeof isAnimate === "undefined") { isAnimate = true; }
        if (control.isVisible) {
            ControlHelper.toggleControl(control, null, null, func, isAnimate);
        }
    };

    /** toggle the visibility of specifed control */
    ControlHelper.toggleControl = function (control, showCallback, data, hideCallback, isAnimate) {
        if (typeof isAnimate === "undefined") { isAnimate = true; }
        control.isVisible = !control.isVisible;
        var leftToMove = control.isVisible ? control.horizontalToggleOptions.showLeft : control.horizontalToggleOptions.hideLeft;

        if (control.isVisible) {
            control.$control.show(10, function () {
                control.loaded && control.loaded();
                showCallback && showCallback(data);
            });
        }

        if (isAnimate) {
            control.$control.animate({ left: leftToMove }, function () {
                if (!control.isVisible) {
                    control.$control.hide(10, function () {
                        control.leave && control.leave();
                        hideCallback && hideCallback();
                    });
                }
            });
        } else {
            control.$control.css("left", leftToMove).hide();
            control.leave && control.leave();
            hideCallback && hideCallback();
        }
    };
    return ControlHelper;
})();
var SettingsControl = (function () {
    function SettingsControl() {
        // Settings panel JQuery object.
        this.$control = $("#settingsPanel");
        // Init setting panel options.
        this.horizontalToggleOptions = {
            hideLeft: $(window).outerWidth(),
            showLeft: $(window).outerWidth() - this.$control.outerWidth()
        };
        // Back button.
        this.$backBtn = $("#settingsBackButton");
        if (OfficeUtil.Util.isRtlLanguage()) {
            this.horizontalToggleOptions = {
                hideLeft: -(this.$control.outerWidth() + 30),
                showLeft: 0
            };
            this.$control.css("left", this.horizontalToggleOptions.hideLeft);
        } else {
            this.$control.css("left", this.$control.parent().outerWidth());
        }

        // Hide setting by default.
        this.isVisible = false;
        ControlHelper.hideControl(this);

        // Init switch.
        SettingsControl.valueSwitch = new Switch("#showValueSwitch");
        SettingsControl.gridSwitch = new Switch("#showGridSwitch");

        // Turn off valueSwitch by default.
        SettingsControl.valueSwitch.switchOff();

        // Init tabs for setting panel.
        SettingsControl.tabs = new Tabs("#tabs");
        SettingsControl.peopleTabs = new Tabs("#peopleTabs");

        // Bound color item in setting panel.
        //this.bindColors();
        // Add controls events in setting panel.
        this.addEvents();
    }
    /**
    * This function will be invoked when setting pane was loaded.
    */
    SettingsControl.prototype.loaded = function () {
        if (ChartAgave.chartType !== 9 /* People */) {
            AccessibilityHelper.enableSettingPaneAccessibility();
            $(".settings-title-text").focus();
        }
    };

    /**
    * This function will be invoked when setting pane was hidden.
    */
    SettingsControl.prototype.leave = function () {
        $("#peopleTabs").off("keydown");
        AccessibilityHelper.disableSettingPaneAccessibility();

        // Enable keyboard accessibility for chart page.
        AccessibilityHelper.enableChartPageAccessibility();
        $(".legend-Entry").first().focus();
    };

    /**
    * Create color item and append to specified control.
    *
    * @param {JQuery} parent The variable.
    * @param {string} id The variable.
    * @param {string[]} colors The array.
    */
    SettingsControl.prototype.appendColorItem = function (parent, id, colors) {
        var $li = $("<li id=" + id + "></li>");

        $.each(colors, function (index, color) {
            var $span = $("<div class=\"color-item\"></div>");
            $span.css("background-color", color);
            $li.append($span);
        });

        parent.append($li);
    };

    /**
    * Add setting control events.
    */
    SettingsControl.prototype.addEvents = function () {
        var _this = this;
        // Add window resize event to adjust setting pane position in hide and show.
        $(window).on("resize", function () {
            if (OfficeUtil.Util.isRtlLanguage()) {
                _this.horizontalToggleOptions = {
                    hideLeft: -(_this.$control.outerWidth() + 30),
                    showLeft: 0
                };
            } else {
                _this.horizontalToggleOptions = {
                    hideLeft: $(window).outerWidth(),
                    showLeft: $(window).outerWidth() - _this.$control.outerWidth()
                };
            }

            ControlHelper.hideControl(_this);
        });

        // Bind the click handler for showing toolbar
        ChartAgave.$content.click(function () {
            ControlHelper.hideControl(_this, function () {
                $('[id^="tabs"]').fadeOut();
            });
            _this.isVisible = false;
        });

        // Add back button click event.
        this.$backBtn.click(function () {
            ControlHelper.hideControl(_this);
            _this.isVisible = false;
        });

        // Add title text change event, as long as text changed, it will
        // hit setTitle method to set new title to chart.
        $(".settings-title-text").change(function (event) {
            Chart.updateTitle($(event.target).val());
            return false;
        });

        // Add change event to gridswitch.
        SettingsControl.gridSwitch.change = function (value) {
            Chart.setGridVisibility(value === SettingsControl.gridSwitch.values.on);
            return false;
        };

        // Add change event to valueswitch.
        SettingsControl.valueSwitch.change = function (value) {
            Chart.setValueVisibility(value === SettingsControl.valueSwitch.values.on);
            return false;
        };

        // Add change event to x axis label.
        $(".x-axis").change(function (event) {
            Chart.updateXaxisLabel($(event.target).val());
            return false;
        });

        // Add change event to y axis label.
        $(".y-axis").change(function (event) {
            Chart.updateYaxisLabel($(event.target).val());
            return false;
        });

        // Add click event for color series, as long as mouse click
        // color series, will select current color schema and apply to chart.
        $("#tabs-2 li").click(function (event) {
            var $target = $(event.target);

            if ($target.hasClass("color-item")) {
                $target = $target.closest("li");
            }

            var id = $target.attr("id");
            if (id != null) {
                //Chart.updateChartColor(id);
                // Remove all selection firstly.
                $(".color-selection").removeClass("color-selection");

                // Add selecton style for target contrl.
                $("#" + id).addClass("color-selection");
            }

            return false;
        });

        // People chart events.
        $(".people-title-area").change(function (event) {
            var text = $(event.target).text();
            PeopleChart.setTitle(text);

            var settings = ChartSettings.peopleSettings;
            settings.title = text;
            ChartSettings.updatePeopleChartSettings(settings);
        });

        // Add keyboard accessibility.
        this.$control.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.esc) {
                ControlHelper.hideControl(_this);
            }
        });
        this.$backBtn.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter) {
                ControlHelper.hideControl(_this);
            }
        });
        $(".x-axis").on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter) {
                Chart.updateXaxisLabel($(e.target).val());
                return false;
            }
        });
        $(".y-axis").on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter) {
                Chart.updateYaxisLabel($(e.target).val());
                return false;
            }
        });

        // Update tab index for people tab in setting pane.
        SettingsControl.peopleTabs.tabClick = function (text) {
            SettingsControl.addPeopleSettingpaneAccessibility(text);
        };
    };

    /**
    * Keyboard accessibily handler.
    */
    SettingsControl.addPeopleSettingpaneAccessibility = function (tab) {
        switch (tab) {
            case Strings.peopleTabs.basic: {
                AccessibilityHelper.enableBasicTabForPeopleSettingpane();
                this.currentIcon = null;
                $("#peopleTabs").off("keydown");
                $("#peopleTabs").keydown(this.basicKeydownHandler);
                break;
            }
            case Strings.peopleTabs.type: {
                AccessibilityHelper.enableTypeTabForPeopleSettingpane();
                this.currentIcon = null;
                $("#peopleTabs").off("keydown");
                $("#peopleTabs").keydown(this.typeKeydownHandler);
                break;
            }
            case Strings.peopleTabs.theme: {
                AccessibilityHelper.enableThemeTabForPeopleSettingpane();
                this.currentIcon = null;
                $("#peopleTabs").off("keydown");
                $("#peopleTabs").keydown(this.themeKeydownHandler);
                break;
            }
            default: {
                break;
            }
        }
    };

    /**
    * Restore last selected tab before launch setting pane.
    */
    SettingsControl.setSelectedTab = function (lastSelectedTabId) {
        var $tabs = $("#tabs");
        var $peopleTabs = $("#peopleTabs");

        if (lastSelectedTabId) {
            $("a[href='" + lastSelectedTabId + "']").addClass("active-color");
            $(lastSelectedTabId).show();

            var parent = $(lastSelectedTabId).closest("#peopleTabs");
            if (parent && parent.length != 0) {
                SettingsControl.addPeopleSettingpaneAccessibility($(lastSelectedTabId).text());
            } else {
                AccessibilityHelper.enableSettingPaneAccessibility();
            }

            return;
        }

        if (ChartAgave.chartType == 9 /* People */) {
            $peopleTabs.find("div").first().show();
            $peopleTabs.find("li>a").first().addClass("active-color");
            AccessibilityHelper.enableBasicTabForPeopleSettingpane();
            $("#peopleTabs").off("keydown");
            $("#peopleTabs").keydown(this.basicKeydownHandler);
        } else {
            $tabs.find("div").first().show();
            $tabs.find("li>a").first().addClass("active-color");
            AccessibilityHelper.enableSettingPaneAccessibility();
        }
    };

    /**
    * Init setting panel settings by ChartOption param.
    *
    * @param {IChartOptions} chartOptions The object contains all settings of chart.
    */
    SettingsControl.initSettings = function (chartOptions) {
        var $tabs = $("#tabs");
        var $peopleTabs = $("#peopleTabs");

        if (chartOptions != null) {
            var that = this;
            $(".active-color").removeClass("active-color");
            if (ChartAgave.chartType == 9 /* People */) {
                $tabs.fadeOut("fast", function () {
                    SettingsControl.setSelectedTab(SettingsControl.peopleTabs.currentTab);

                    // Restore people settings.
                    var settings = ChartSettings.peopleSettings;
                    PeopleChart.setTitle(settings.title);
                    PeopleChart.updateShape(settings.shape);
                    PeopleChart.updateSku(settings.sku);
                    PeopleChart.updateTheme(settings.theme);

                    $(".people-title-area").text(settings.title);
                    var options = {
                        type: ".people-types",
                        theme: ".people-theme",
                        shape: ".shape-list"
                    };

                    // Popup setting pane
                    DataViz.UX.SettingPane.Instance.populate(options);
                    $peopleTabs.fadeIn();
                });

                return;
            }

            $peopleTabs.fadeOut("fast", function () {
                SettingsControl.setSelectedTab(SettingsControl.tabs.currentTab);
                $tabs.fadeIn();
            });

            // Init title textbox.
            if (chartOptions.settings && chartOptions.settings.title) {
                var $title = $(".settings-title-text");

                //$title.removeAttr("placeholder");
                $title.val(chartOptions.settings.title);
            }

            // Init "Show values" switch.
            if (chartOptions.settings && chartOptions.settings.gridVisibility != null) {
                if (chartOptions.settings.valueVisibility) {
                    SettingsControl.valueSwitch.switchOn();
                } else {
                    SettingsControl.valueSwitch.switchOff();
                }
            }

            // Init "Show grid" switch.
            if (chartOptions.settings && chartOptions.settings.gridVisibility != null) {
                if (chartOptions.settings.gridVisibility) {
                    SettingsControl.gridSwitch.switchOn();
                } else {
                    SettingsControl.gridSwitch.switchOff();
                }
            }

            // Init X and Y axis.
            chartOptions.settings && chartOptions.settings.xAxisLabel && $(".x-axis").val(chartOptions.settings.xAxisLabel);
            chartOptions.settings && chartOptions.settings.yAxisLabel && $(".y-axis").val(chartOptions.settings.yAxisLabel);

            // Init label contrl.
            chartOptions.settings && chartOptions.settings.peopleLable && $(".chart-label").text(chartOptions.settings.peopleLable);

            // Init color selection in color tab.
            if (chartOptions.settings && chartOptions.settings.colors && chartOptions.settings.colors.name != null) {
                // Remove all selection firstly.
                $(".color-selection").removeClass("color-selection");

                // Add selecton style for target contrl.
                var id = "#" + chartOptions.settings.colors.name;
                $(id).addClass("color-selection");
            }

            // Set people label visible, hide if current chart is not people chart.
            if (ChartAgave.chartType !== 9 /* People */) {
                $(".chart-label").closest("li").hide();
            }
        }
    };

    /**
    * Basic tab handler for keyboard
    */
    SettingsControl.basicKeydownHandler = function (e) {
        SettingsControl.KeydownHandler(".sharp-list", e, function (id) {
            PeopleChart.updateShape(id);
        });
    };

    /**
    * Type tab handler for keyboard
    */
    SettingsControl.typeKeydownHandler = function (e) {
        SettingsControl.KeydownHandler(".people-types", e, function (id) {
            PeopleChart.updateSku(id);
            $(id).focus();
        });
    };

    /**
    * Theme tab handler for keyboard
    */
    SettingsControl.themeKeydownHandler = function (e) {
        SettingsControl.KeydownHandler(".people-theme", e, function (id) {
            PeopleChart.updateTheme(id);
        });
    };

    /**
    * Keyboard handler for people tabs.
    */
    SettingsControl.KeydownHandler = function (selector, e, func) {
        switch (e.keyCode) {
            case OfficeUtil.Strings.keyCodes.left:
            case OfficeUtil.Strings.keyCodes.up: {
                this.currentIcon = $(selector).find(".gallery-item-click");
                var left = this.currentIcon.prev("img");
                if (left && left.length == 0) {
                    left = $(selector + ">img").last();
                }
                this.currentIcon = left;
                func && func(left.attr("id"));
                SettingsControl.updateIconBorder(selector, "#" + left.attr("id"));
                return false;
                break;
            }
            case OfficeUtil.Strings.keyCodes.down:
            case OfficeUtil.Strings.keyCodes.right: {
                this.currentIcon = $(selector).find(".gallery-item-click");
                var right = this.currentIcon.next("img");
                if (right && right.length == 0) {
                    right = $(selector + ">img").first();
                }
                this.currentIcon = right;
                func && func(right.attr("id"));
                SettingsControl.updateIconBorder(selector, "#" + right.attr("id"));
                return false;
            }
            default: {
                break;
            }
        }
    };

    /**
    * Update people icon style by selection.
    */
    SettingsControl.updateIconBorder = function (selector, iconId) {
        var icons = $(selector).find("img");
        icons.each(function (index, ele) {
            $(ele).removeClass("gallery-item-click");
        });

        $(selector).find(iconId).addClass("gallery-item-click");
    };
    return SettingsControl;
})();
var Switch = (function () {
    function Switch(id) {
        this.isPPT = false;
        // Lable control in switch container, used to store switch value.
        this.$label = $("<label class=\"\">on</label>");
        this.$keyBoardSubContainer = $("<div class=\"keyboard-switch-container\"></div>");
        this.$subContainer = $("<div class=\"switch-container\"></div>");
        // Slider control in switch container.
        this.$sliderBar = $("<span class=\"slider-bar\"></span>");
        // Switch control.
        this.$switch = $("<span class=\"switch\"></span>");
        // Define a variable to store switch value.
        this.values = {
            on: "On",
            off: "Off"
        };
        // Class names for slider bar.
        this.classes = {
            sliderBarOn: "sliderbar-on",
            switchOn: "on"
        };
        // Background colors for slider bar.
        // The colors schema are defined by redline.
        this.styles = {
            silderOn: "#9FD5B7",
            silderOnHover: "#D3F0E0",
            silderOnPressed: "#86BFA0",
            silderOnPPt: "#FCCDB6",
            silderOnHoverPPt: "#FCE4DC",
            silderOnPressedPPt: "#F5BA9D",
            silderOff: "#B3B3B3",
            silderOffHover: "#D8D8D8",
            silderOffPressed: "#B3B3B3"
        };
        this.$switchContainer = $(id);
        this.instance = this;
        this.init(this);
    }
    /**
    * Check whether it is presentaion view.
    */
    Switch.prototype.isPresentationView = function () {
        var lastIndex = Office.context.document.url.lastIndexOf(".");
        if (lastIndex !== -1) {
            var documentExtension = Office.context.document.url.substring(lastIndex + 1).toLowerCase();
            return documentExtension === "pptx";
        }

        return false;
    };

    /**
    * Create switch control structure.
    */
    Switch.prototype.createSwitch = function () {
        var _this = this;
        // Append label control to store switch value.
        // - "on": switch is turn on.
        // - "off": switch is turn off.
        this.$switchContainer.append(this.$label);

        this.$keyBoardSubContainer.attr("tabindex", "1");
        this.$switchContainer.append(this.$keyBoardSubContainer);

        // Append sub container which will contain slider bar and switch.
        this.$keyBoardSubContainer.append(this.$subContainer);

        // Append switch slider bar.
        this.$subContainer.append(this.$sliderBar);

        // Append switch control.
        this.$subContainer.append(this.$switch);

        // Add hover event for slider bar to change background color.
        this.$sliderBar.hover(function (event) {
            if (_this.isPPT) {
                _this.beforeMouseenterColor = _this.getBackgroundColor(event);
                _this.activedHandler(event, _this.styles.silderOnHoverPPt);
            } else {
                _this.beforeMouseenterColor = _this.getBackgroundColor(event);
                _this.activedHandler(event, _this.styles.silderOnHover);
            }
        }, function (event) {
            _this.activedHandler(event, _this.beforeMouseenterColor);
        });

        // Add pressed event for slider bar to change background color.
        this.$sliderBar.on("mousedown", function (event) {
            if (_this.isPPT) {
                _this.activedHandler(event, _this.styles.silderOnPressedPPt);
            } else {
                _this.activedHandler(event, _this.styles.silderOnPressed);
            }
        });
    };

    /**
    * Set active style by adding background color.
    */
    Switch.prototype.activedHandler = function (event, color) {
        var $target = $(event.target || event.srcElement);
        $target.css("background-color", color);
    };

    /**
    * Get background color.
    */
    Switch.prototype.getBackgroundColor = function (event) {
        var $target = $(event.target || event.srcElement);
        return $target.css("background-color");
    };

    /**
    * Switch turn on.
    */
    Switch.prototype.switchOn = function () {
        var _this = this;
        // Apply on style for sliderBar.
        this.$sliderBar.addClass(this.classes.sliderBarOn);

        // Move switch to right for turn on switch.
        this.$switch.addClass(this.classes.switchOn);

        // Set off to lable text.
        this.$label.text(OfficeLocalization.Resources.getResourceString("on"));

        // Call Chang method and pass "on" as param.
        this.change && this.change(this.values.on);

        if (this.isPPT) {
            this.$sliderBar.css("background-color", this.styles.silderOnPPt);
            this.beforeMouseenterColor = this.styles.silderOnPPt;
        } else {
            this.$sliderBar.css("background-color", this.styles.silderOn);
            this.beforeMouseenterColor = this.styles.silderOn;
        }

        // Add hover event for slider bar to change background color.
        this.$sliderBar.unbind("mouseenter mouseleave");
        this.$sliderBar.hover(function (event) {
            if (_this.isPPT) {
                _this.beforeMouseenterColor = _this.getBackgroundColor(event);
                _this.activedHandler(event, _this.styles.silderOnHoverPPt);
            } else {
                _this.beforeMouseenterColor = _this.getBackgroundColor(event);
                _this.activedHandler(event, _this.styles.silderOnHover);
            }
        }, function (event) {
            _this.activedHandler(event, _this.beforeMouseenterColor);
        });

        // Add pressed event for slider bar to change background color.
        this.$sliderBar.off("mousedown");
        this.$sliderBar.on("mousedown", function (event) {
            if (_this.isPPT) {
                _this.activedHandler(event, _this.styles.silderOnPressedPPt);
            } else {
                _this.activedHandler(event, _this.styles.silderOnPressed);
            }
        });
    };

    /**
    * Switch turn off.
    */
    Switch.prototype.switchOff = function () {
        var _this = this;
        // Apply off style for sliderBar.
        this.$sliderBar.removeClass(this.classes.sliderBarOn);

        // Move switch to left for turn off switch.
        this.$switch.removeClass(this.classes.switchOn);

        // Set off to lable text.
        this.$label.text(OfficeLocalization.Resources.getResourceString("off"));

        // Call Change method and pass "off" as param.
        this.change && this.change(this.values.off);

        this.$sliderBar.css("background-color", this.styles.silderOff);
        this.beforeMouseenterColor = this.styles.silderOff;

        // Add hover event for slider bar to change background color.
        this.$sliderBar.unbind("mouseenter mouseleave");
        this.$sliderBar.hover(function (event) {
            _this.beforeMouseenterColor = _this.getBackgroundColor(event);
            _this.activedHandler(event, _this.styles.silderOffHover);
        }, function (event) {
            _this.activedHandler(event, _this.beforeMouseenterColor);
        });

        // Add pressed event for slider bar to change background color.
        this.$sliderBar.off("mousedown");
        this.$sliderBar.on("mousedown", function (event) {
            _this.activedHandler(event, _this.styles.silderOffPressed);
        });
    };

    Switch.prototype.toggle = function ($switch, $target) {
        if ($target.hasClass($switch.classes.sliderBarOn)) {
            $switch.switchOff();
        } else {
            $switch.switchOn();
        }

        // Prevent default click event.
        return false;
    };

    /**
    * Init switch control.
    *
    * @param {Switch} that Switch object references.
    */
    Switch.prototype.init = function (that) {
        that.isPPT = that.isPresentationView();

        // Creat switch button.
        that.createSwitch();

        // Trun on by default.
        that.switchOn();

        that.$sliderBar.on("click", function (e) {
            that.toggle(that, $(e.target));
        });

        that.$keyBoardSubContainer.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                that.toggle(that, $(e.target).find(".slider-bar"));
            }
        });
    };
    return Switch;
})();
var Tabs = (function () {
    function Tabs(tabId) {
        // Get tabContol jquery object by id.
        this.tabControl = $(tabId);

        // Get all tab panels id.
        this.tabIds = this.getTabs();

        // Init tab control.
        this.init();
    }
    /**
    * Get all tab panels id by query "a" link property("href").
    * which linked to target panel.
    */
    Tabs.prototype.getTabs = function () {
        var tabs = [];
        this.tabControl.find("ul>li>a").each(function () {
            var href = $(this).attr("href");
            href && tabs.push(href);
        });

        return tabs;
    };

    /**
    * Set tab panel display to none to hide panel.
    */
    Tabs.prototype.hideTabs = function () {
        if (this.tabIds.length !== 0) {
            $.each(this.tabIds, function (index, id) {
                $(id).css("display", "none");
            });
        }
    };

    /**
    *  Show special tab panel by id.
    */
    Tabs.prototype.showTab = function (tabId) {
        if (tabId != null) {
            $(tabId).fadeIn();
        }

        return false;
    };

    /*
    * Init tab control.
    */
    Tabs.prototype.init = function () {
        // Define a veriable to refer to TabControl.
        var that = this;

        // Hide all tab panel by default.
        this.hideTabs();

        // Only show active tab panel.
        this.showTab($(".active-color").attr("href"));

        // Add click event for each tab link.
        this.tabControl.find("ul>li>a").click(function (e) {
            var $a = $(this);
            that.currentTab = $a.attr("href");

            // Get visibility tab.
            var visTab = $(".active-color").attr("href");

            // Fadeout original tab panel. and show target panel
            // in call back.
            $(visTab).fadeOut(100, function () {
                // Toggle active style.
                $(".settings-content>ul>li>a").removeClass("active-color");
                $a.addClass("active-color");

                // Show target tab panel.
                that.showTab($a.attr("href"));
                that.tabClick && that.tabClick($a.text());
            });

            return false;
        });
    };
    return Tabs;
})();
var ToolbarControl = (function () {
    function ToolbarControl() {
        var _this = this;
        this.$control = $("#toolbar");
        this.horizontalToggleOptions = {
            hideLeft: this.$control.parent().outerWidth(),
            // 26 = 24 + 2: margin + border
            showLeft: this.$control.parent().outerWidth() - (this.$control.outerWidth() + 26)
        };
        this.$chartTypeBtn = $("#toolbarChartType");
        this.$dataBtn = $("#toolbarData");
        this.$settingsBtn = $("#toolbarSettings");
        if (OfficeUtil.Util.isRtlLanguage()) {
            this.horizontalToggleOptions = {
                hideLeft: -this.$control.outerWidth(),
                showLeft: 0
            };
        }

        // hide the toolbar
        this.isVisible = true;
        this.isEnable = true;
        ControlHelper.hideControl(this);

        $(window).on("resize", function () {
            if (OfficeUtil.Util.isRtlLanguage()) {
                _this.horizontalToggleOptions = {
                    hideLeft: -_this.$control.outerWidth(),
                    showLeft: 0
                };
            } else {
                _this.horizontalToggleOptions = {
                    hideLeft: $(window).outerWidth(),
                    showLeft: $(window).outerWidth() - (_this.$control.outerWidth() + 26)
                };
            }

            ControlHelper.hideControl(_this);
        });

        this.enable();
        OfficeLocalization.Resources.apply("#toolbar");
    }
    /**
    * Hide toolbar control and remove click and keypress events.
    */
    ToolbarControl.prototype.disable = function () {
        ControlHelper.hideControl(this);
        ChartAgave.$content.off("click");
        this.$chartTypeBtn.off("click");
        this.$dataBtn.off("click");
        this.$settingsBtn.off("click");

        ChartAgave.$content.off("keypress");
        this.$chartTypeBtn.off("keypress");
        this.$dataBtn.off("keypress");
        this.$settingsBtn.off("keypress");
        this.isEnable = false;
    };

    /**
    * Add click and keypress events.
    */
    ToolbarControl.prototype.enable = function () {
        var _this = this;
        this.isEnable = true;

        // Set button icons.
        AgaveHelper.initSettingsBtn();
        AgaveHelper.initChartTypeBtn();
        AgaveHelper.initDataBtn();

        // bind the click handler for showing toolbar
        ChartAgave.$content.click(function () {
            ControlHelper.toggleControl(_this, function () {
                if (ChartAgave.toolbarControl.isVisible) {
                    ChartAgave.toolbarControl.$chartTypeBtn.focus();
                }
            });
        });

        // bind the click handler for the inner buttons
        this.$chartTypeBtn.click(function () {
            PageHelper.navigateToPage(ChartAgave.chartTypePage);
        });
        this.$dataBtn.click(function () {
            PageHelper.navigateToPage(ChartAgave.dataPage);
        });
        this.$settingsBtn.click(function () {
            ControlHelper.showControl(ChartAgave.settingsControl, SettingsControl.initSettings, ChartSettings.settings);
            ControlHelper.hideControl(_this, null, false);
        });

        // Add click event on toolbar.
        ChartAgave.$content.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter || e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                ControlHelper.toggleControl(_this, function () {
                    if (ChartAgave.toolbarControl.isVisible) {
                        ChartAgave.toolbarControl.$chartTypeBtn.focus();
                    }
                });
            }
        });

        // Add keyboard accessibility.
        this.$chartTypeBtn.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter || e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                PageHelper.navigateToPage(ChartAgave.chartTypePage);
                return false;
            }
        });
        this.$dataBtn.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter || e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                PageHelper.navigateToPage(ChartAgave.dataPage);
                return false;
            }
        });
        this.$settingsBtn.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter || e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                ControlHelper.showControl(ChartAgave.settingsControl, SettingsControl.initSettings, ChartSettings.settings);
                ControlHelper.hideControl(_this, null, false);
                return false;
            }
        });
    };
    return ToolbarControl;
})();
var Chart = (function () {
    function Chart() {
    }
    Object.defineProperty(Chart, "chartPlot", {
        // Define a property for Chart Plot.
        get: function () {
            return this.plot;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Chart, "chartLayer", {
        // Define a property for Chart layer.
        get: function () {
            return this.plotLayer;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Chart, "chartTextLayer", {
        // Define a property for Chart text layer.
        get: function () {
            return this.valueLayer;
        },
        enumerable: true,
        configurable: true
    });

    /**
    * Reset vuePlot object.
    */
    Chart.empty = function () {
        this.plot = null;
        this.plotLayer = null;
        this.chartPlot = null;
    };

    /**
    * Build Chart by according IChartOptions param. this param include all
    * Chart settings like title, width, height, data, etc.
    *
    * @param {IChartOptions} chartOptions Chart options object.
    * @param {boolean?} ignoreResize ture ingore resize chart layout, otherwise resize.
    */
    Chart.buildChart = function (chartOptions) {
        var _this = this;
        this.options = chartOptions;
        var $wrap = $(chartOptions.containerId);
        vp.events.attach(window, "resize", function () {
            var param = {
                grid: _this.grid,
                chartOptions: chartOptions,
                peopleContainerId: "#chartTypeCanvasRoot"
            };

            if (_this.isChartTypeResize) {
                param.isResizeCustomizedContainer = true;
            }

            _this.layout(param);
        });

        if (ChartAgave.chartType === 9 /* People */) {
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
    };

    /**
    * Build Chart by according IChartOptions param. this param include all
    * Chart settings like title, width, height, data, etc.
    *
    * @param {IChartOptions} chartOptions Chart options object.
    */
    Chart.build = function (chartOptions) {
        var seriesNames = chartOptions.seriesNames;
        this.seriesSettings = {};
        for (var i = 0; i < seriesNames.length; i++) {
            this.seriesSettings[seriesNames[i]] = true;
        }

        // Get chart host container.
        var root = vp.select(chartOptions.containerId);

        // Clear element under root.
        root.clear();

        // Create grid container to hold our chart.
        this.grid = vp.select(chartOptions.containerId).append(vp.visuals.createGridContainer());

        // Create a plot object and append it to the div:
        this.plot = this.grid.append(vp.visuals.createPlot()).isSelectionEnabled(false).isLegendVisible(false);

        // To improve performance by disable animation for large data.
        var rawData = ChartData.data;
        if (rawData.categories.data.length >= 20 || rawData.series.length >= 20) {
            this.plot.isAnimEnabled(false).isUiEnabled(false);
        }

        // Set plot title if it is not null.
        chartOptions.settings.title && this.updateTitle(chartOptions.settings.title);

        //chartOptions.settings.title && this.plot.title(chartOptions.settings.title);
        //(<any>(this.plot)).titleSize(28);
        // Set the size of the plot.
        var width = chartOptions.width != null ? chartOptions.width : 500;
        var height = chartOptions.height != null ? chartOptions.height : 250;
        this.grid.width(width).height(height);

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
            if (ChartAgave.chartType === 2 /* RegularBar */ || ChartAgave.chartType === 3 /* StackedBar */) {
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
        var param = {
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
        this.plotLayer.dataAnimMgr().enterAnim(vp.animation.makeEffects("fade")).exitAnim(vp.animation.makeEffects("fade"));

        this.addCustomeLegend(chartOptions);

        if (ChartAgave.chartType === 9 /* People */) {
            $(chartOptions.containerId).fadeIn();
        } else {
            $(chartOptions.containerId).closest(".chart-container").fadeIn();
        }
    };

    /**
    * Format number to locale number.
    */
    Chart.formatterToLocaleNumber = function (value) {
        var formatValue = value;
        try  {
            if (!isNaN(value)) {
                var nf = new Intl.NumberFormat(ChartAgave.language);
                formatValue = nf.format(value);
            }
        } catch (ex) {
        } finally {
            return formatValue;
        }
    };

    /**
    * Create chart legend to replace default one.
    */
    Chart.addCustomeLegend = function (chartOptions) {
        var _this = this;
        var $legendContainer = $(chartOptions.containerId).prev("div." + Strings.legendBoxClassNames.customLegend);
        $legendContainer.empty();

        if (chartOptions.seriesNames && chartOptions.seriesNames.length > 0) {
            if (chartOptions.seriesNames.length <= Strings.defaultBarColors.values.length) {
                $.each(chartOptions.seriesNames, function (index, name) {
                    var option = {
                        parent: $legendContainer,
                        bgColor: Strings.defaultBarColors.values[index],
                        text: name
                    };

                    _this.addLegendEntry(option);
                });
            } else {
                var colorIndex = 0;
                var iteration = 1;
                $.each(chartOptions.seriesNames, function (index, name) {
                    if (index < Strings.defaultBarColors.values.length) {
                        colorIndex = index;
                    } else if (index === Strings.defaultBarColors.values.length * iteration) {
                        colorIndex = 0;
                        iteration++;
                    } else {
                        colorIndex++;
                    }

                    var option = {
                        parent: $legendContainer,
                        bgColor: Strings.defaultBarColors.values[colorIndex],
                        text: name
                    };

                    _this.addLegendEntry(option);
                });
            }
        }
    };

    /**
    * Create legend entry and append to custome legend container.
    */
    Chart.addLegendEntry = function (option) {
        var _this = this;
        var $legendEntry = $("<span class=" + Strings.legendBoxClassNames.legendEntry + "></span>");
        var $colorSquare = $("<span class=" + Strings.legendBoxClassNames.colorSquare + "></span>");
        $colorSquare.css("background", option.bgColor);
        var $seriesName = $("<span class= " + Strings.legendBoxClassNames.seriesName + " accent-color " + ">" + option.text + "</span>");

        $legendEntry.append($colorSquare);
        $legendEntry.append($seriesName);

        $legendEntry.on("click", function () {
            _this.toggleSeries($legendEntry);
            $legendEntry.hasClass("legend-Entry-focus") && $legendEntry.removeClass(Strings.legendBoxClassNames.legendEntryFocus);
            return false;
        });

        // Key "press" to toggle chart series.
        $legendEntry.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                _this.toggleSeries($legendEntry);
                return false;
            }
        });

        // Monitor focusin and focusout event.
        $legendEntry.focusin(function (e) {
            $legendEntry.addClass(Strings.legendBoxClassNames.legendEntryFocus);
        }).focusout(function (e) {
            $legendEntry.removeClass(Strings.legendBoxClassNames.legendEntryFocus);
        });

        option.parent.append($legendEntry);
    };

    /**
    * Toggle series off/on handler.
    */
    Chart.toggleSeries = function ($target) {
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
        if (ChartAgave.chartType === 4 /* Line */) {
            this.plotLayer.stroke().palette(colors);
        } else if (ChartAgave.chartType !== 6 /* InnerRaduisPie */ && ChartAgave.chartType !== 5 /* RegularPie */) {
            this.plotLayer.fill().palette(colors);
        }

        if (ChartAgave.chartType === 2 /* RegularBar */ || ChartAgave.chartType === 3 /* StackedBar */) {
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
    };

    /**
    * Retrieve all active legend series and pass back color schema.
    */
    Chart.getActiveSeriesColor = function () {
        var squares = $(".legend-Entry:not(.inactive) .color-Square");
        var colors = [];
        squares.each(function (index, ele) {
            colors.push($(ele).css("background-color"));
        });

        return colors;
    };

    /**
    * Update chart title.
    *
    * @param {string} title Chart title text.
    */
    Chart.updateTitle = function (title) {
        if (title != null) {
            // Update chart title.
            //this.chartPlot.title(title);
            $(".vp-chart-title1").text(title);

            // Update title in settings object.
            var settings = ChartSettings.settings.settings;
            settings.title = title;
            ChartSettings.updateChartSettings(settings);
        }
    };

    /**
    * Set Chart value visible.
    *
    * @param {boolean} visibility true visible, false hide.
    */
    Chart.setValueVisibility = function (visibility) {
        var chartOptions = ChartSettings.settings;
        chartOptions.settings.valueVisibility = visibility;

        if (visibility) {
            this.valueLayer.opacity(1);
        } else {
            this.valueLayer.opacity(0);
        }
    };

    /**
    * Set Chart grid visible.
    *
    * @param {boolean} visibility true visible, false hide.
    */
    Chart.setGridVisibility = function (visibility) {
        // Set grid visible for chart.
        //this.chartPlot.isXGridVisible(visibility);
        if (ChartAgave.chartType === 2 /* RegularBar */ || ChartAgave.chartType === 3 /* StackedBar */) {
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
    };

    /**
    * Update x axis lable for chart.
    *
    * @param {string} text x axis label.
    */
    Chart.updateXaxisLabel = function (text) {
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
    };

    /**
    * Update y axis lable for chart.
    *
    * @param {string} text Y axis label.
    */
    Chart.updateYaxisLabel = function (text) {
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
    };

    /**
    * Update chart color.
    *
    * @param {string} name Color schema name.
    */
    Chart.updateChartColor = function (colors) {
        var _this = this;
        // Define function to update chart color.
        var func;

        // Set func body by different chart type.
        if (ChartAgave.chartType === 4 /* Line */) {
            func = function () {
                if (_this.chartLayer && colors && colors.length != 0) {
                    _this.chartLayer.stroke({ palette: colors, isDiscrete: true });
                }
            };
        } else {
            func = function () {
                if (_this.chartLayer && colors && colors.length != 0) {
                    _this.chartLayer.fill({ palette: colors, isDiscrete: true });
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
    };

    /**
    * Refresh chart data.
    */
    Chart.refreshData = function () {
        var helper = new ChartHelper();
        var data = ChartData.DataRecords.chartData;

        this.chartLayer.data(data);
        this.valueLayer.data(data);
    };

    /**
    * Update people chart container size.
    */
    Chart.resizePeopleChartContainer = function (id) {
        // Get window height and width after resizing.
        var windowHeight = vp.dom.height(window);
        var windowWidth = vp.dom.width(window);

        // Resizing people container.
        var containerHeight = windowHeight / Strings.peopleChartSizeOptions.heightRatio - 60;
        containerHeight = containerHeight < Strings.peopleChartSizeOptions.minHeight ? Strings.peopleChartSizeOptions.minHeight : containerHeight;
        $(id).height(containerHeight);
    };

    /**
    * Chart layout.
    *
    * @param {IChartOptions} chartOptions Chart options.
    */
    Chart.layout = function (param) {
        if (this.reSize) {
            // Get window height and width after resizing.
            var windowHeight = vp.dom.height(window);
            var windowWidth = vp.dom.width(window);

            // Resizing people container.
            this.resizePeopleChartContainer(param.peopleContainerId);

            // Calc expected grid height and width by ratio.
            var gridHeigth = windowHeight - 160;
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
                } else {
                    gridHeigth = containerHeight;
                }

                if (gridHeigth < Strings.customChartSizeOptions.minHeight || gridWidth < Strings.customChartSizeOptions.minWidth) {
                    gridHeigth = Strings.customChartSizeOptions.minHeight;
                    gridWidth = Strings.customChartSizeOptions.minWidth;
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
            param.grid.width(gridWidth).height(gridHeigth);

            if (ChartAgave.chartType === 6 /* InnerRaduisPie */ && this.chartLayer) {
                $(this.chartLayer).prop("_innerRadius", gridHeigth * Strings.pieSizeOptions.innerRadiusRatio);
            }
        }
    };

    /**
    * Create text layer.
    *
    * @param {ITextLayerOption} textLayerOption Textlayer option.
    */
    Chart.createTextLayer = function (textLayerOption) {
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
            textLayerOption.dodgeAxis && this.valueLayer.dodgeAxis(textLayerOption.dodgeAxis);

            // Set seriesAxis.
            textLayerOption.seriesAxis && this.valueLayer.seriesAxis(textLayerOption.seriesAxis);

            // Update text shapes for pie chart.
            if (ChartAgave.chartType === 6 /* InnerRaduisPie */ || ChartAgave.chartType === 5 /* RegularPie */) {
                this.postUpdateShapes(textLayerOption);
            }

            this.valueLayer.dataAnimMgr().enterAnim(vp.animation.makeEffects("fade")).exitAnim(vp.animation.makeEffects("fade"));
        }
    };

    /**
    * Update text shapes for pie chart.
    */
    Chart.postUpdateShapes = function (textLayerOption) {
        var that = this;
        that.chartTextLayer.postUpdateShapes(function (layInfo, elements) {
            var palette = that.chartLayer.fill().scale().palette();
            var outerMargin = that.chartLayer.outerMargin();
            var labelMargin = 10;

            var sliceInfo = vp.layouts.pieLabelHelper(layInfo.width, layInfo.height, outerMargin, labelMargin, palette, textLayerOption.dataRecords, textLayerOption.y[0]);

            elements.map(function (element, index) {
                var info = sliceInfo[index];
                var data = textLayerOption.dataRecords[index];

                vp.select(element).attr("x", info.xText).attr("y", info.yText);

                var adjust = vp.internal.calculateTextAdjust(element, info.hTextAlign, info.vTextAlign);
                vp.select(element).attr("dx", adjust.x).attr("dy", adjust.y);
            });
        });
    };
    Chart.seriesSettings = {};

    Chart.reSize = true;

    Chart.isChartTypeResize = false;
    return Chart;
})();
/**
* All chart types
*/
var ChartTypes;
(function (ChartTypes) {
    ChartTypes[ChartTypes["RegularColumn"] = 0] = "RegularColumn";
    ChartTypes[ChartTypes["StackedColumn"] = 1] = "StackedColumn";
    ChartTypes[ChartTypes["RegularBar"] = 2] = "RegularBar";
    ChartTypes[ChartTypes["StackedBar"] = 3] = "StackedBar";
    ChartTypes[ChartTypes["Line"] = 4] = "Line";
    ChartTypes[ChartTypes["RegularPie"] = 5] = "RegularPie";
    ChartTypes[ChartTypes["InnerRaduisPie"] = 6] = "InnerRaduisPie";
    ChartTypes[ChartTypes["RegularArea"] = 7] = "RegularArea";
    ChartTypes[ChartTypes["StackedArea"] = 8] = "StackedArea";
    ChartTypes[ChartTypes["People"] = 9] = "People";
})(ChartTypes || (ChartTypes = {}));

var MoveDirection;
(function (MoveDirection) {
    MoveDirection[MoveDirection["Left"] = 0] = "Left";
    MoveDirection[MoveDirection["Right"] = 1] = "Right";
    MoveDirection[MoveDirection["Up"] = 2] = "Up";
    MoveDirection[MoveDirection["Down"] = 3] = "Down";
})(MoveDirection || (MoveDirection = {}));

var CellEditingMode;
(function (CellEditingMode) {
    CellEditingMode[CellEditingMode["Append"] = 0] = "Append";
    CellEditingMode[CellEditingMode["Clear"] = 1] = "Clear";
})(CellEditingMode || (CellEditingMode = {}));

var ExitEditingCellMode;
(function (ExitEditingCellMode) {
    ExitEditingCellMode[ExitEditingCellMode["Escape"] = 0] = "Escape";
    ExitEditingCellMode[ExitEditingCellMode["Overwrite"] = 1] = "Overwrite";
})(ExitEditingCellMode || (ExitEditingCellMode = {}));

var NeighbourCell;
(function (NeighbourCell) {
    NeighbourCell[NeighbourCell["Above"] = 0] = "Above";
    NeighbourCell[NeighbourCell["Right"] = 1] = "Right";
    NeighbourCell[NeighbourCell["Below"] = 2] = "Below";
    NeighbourCell[NeighbourCell["Left"] = 3] = "Left";
})(NeighbourCell || (NeighbourCell = {}));
var ChartSettings = (function () {
    function ChartSettings() {
    }
    Object.defineProperty(ChartSettings, "settings", {
        // Property, defined current chart settings.
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(ChartSettings, "peopleSettings", {
        // Property, defined current chart settings.
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });

    /**
    * Build default people chart settings.
    */
    ChartSettings.buildDefaultPeopleSettings = function () {
        return {
            title: OfficeLocalization.Resources.getResourceString("chart_title"),
            shape: "muscle-people",
            theme: "giant-redwhiteblack",
            sku: "peoplebar-giant"
        };
    };

    /**
    * Build default chart settings.
    */
    ChartSettings.buildDefaultSettings = function () {
        // Init a ChartHelper instance.
        var helper = new ChartHelper();

        // Init a Chart instance.
        var chart = new Chart();

        // Create a BuildSettingOptions instance.
        var settings = helper.buildSettingOptions(null, false, true);

        // Create a BuildChartOptions instance.
        var chartOptions = helper.buildChartOptions(settings, "#myChart");

        return chartOptions;
    };

    /**
    * Update chart setting by param. and save latest settings.
    *
    * @param {SettingOptions} settingOptions The object of setting options.
    */
    ChartSettings.updateChartSettings = function (settingOptions) {
        this.chartOptions.settings = settingOptions;
        this.saveSettings(this.chartOptions.settings, this.settingKey);
    };

    /**
    * Update people chart setting by param. and save latest settings.
    *
    * @param {IPeopleChartOptions} options The object of people setting options.
    */
    ChartSettings.updatePeopleChartSettings = function (options) {
        this.peopleChartOptions = options;
        this.saveSettings(options, this.peopleSettingKey);
    };

    /**
    * Save settings to Office.context.document.settings.
    */
    ChartSettings.saveSettings = function (settings, key) {
        if (settings != null) {
            var json = JSON.stringify(settings);
            Office.context.document.settings.set(key, json);

            // Save settings, and will restore next time.
            Office.context.document.settings.saveAsync();
        }
    };

    /**
    * Restore settings from Office.context.document.settings.
    */
    ChartSettings.restoreSettings = function () {
        var mySettings = Office.context.document.settings.get(this.settingKey);
        if (mySettings != null) {
            if (this.chartOptions == null) {
                this.chartOptions = this.buildDefaultSettings();
            }
            this.chartOptions.settings = JSON.parse(mySettings);
        }
    };

    /**
    * Restore people settings from Office.context.document.settings.
    */
    ChartSettings.restorePeopleSettings = function () {
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
    };
    ChartSettings.settingKey = "chartSettings";
    ChartSettings.peopleSettingKey = "chartPeopleSettings";
    return ChartSettings;
})();
var ObjectExtensions = (function () {
    function ObjectExtensions() {
    }
    /**
    * Verifies wether the object is null.
    * Remarks: if the object is undefined, this returns false.
    *
    * @param {any} object The object.
    * @return {boolean} True if the object is null, false otherwise.
    */
    ObjectExtensions.isNull = function (object) {
        return (object === null);
    };

    /**
    * Verifies whether the object is undefined.
    * Remarks: if the object is null, this returns false.
    *
    * @param {any} object The object.
    * @return {boolean} True if the object is undefined, false otherwise.
    */
    ObjectExtensions.isUndefined = function (object) {
        return (typeof object === 'undefined');
    };

    /**
    * Verifies whether the object is of the given type.
    * Remarks: if the object is undefined, this returns false.
    *
    * @param {any} object The object.
    * @param {any} type The type to check against.
    * @return {boolean} True if the object is of the given type, false otherwise.
    */
    ObjectExtensions.isOfType = function (object, type) {
        return !ObjectExtensions.isUndefined(object) && object instanceof type;
    };

    /**
    * Verifies whether the object is null or undefined.
    *
    * @param {any} object The object.
    * @return {boolean} True if the object is null or undefined, false otherwise.
    */
    ObjectExtensions.isNullOrUndefined = function (object) {
        return ObjectExtensions.isNull(object) || ObjectExtensions.isUndefined(object);
    };

    /**
    * Verifies wether the object is a function.
    *
    * @param {any} object The object.
    * @return {boolean} True if the object is a function, false otherwise.
    */
    ObjectExtensions.isFunction = function (object) {
        return typeof object === "function";
    };

    /**
    * Verifies wether the variable is of type object.
    *
    * @param {any} variable The variable.
    * @return {boolean} True if the variable is an object, false otherwise.
    */
    ObjectExtensions.isObject = function (variable) {
        return typeof variable === "object";
    };

    /**
    * Do not use this function directly. Call update method on your proxy object.
    */
    ObjectExtensions.updateObservableProxyObject = function (newValue) {
        if (ObjectExtensions.isNullOrUndefined(newValue)) {
            return;
        }

        // get all properties from the object
        var keys = Object.keys(this);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var keyValue = this[key];

            if (keyValue == null) {
                continue;
            } else if ('subscribe' in keyValue) {
                // if property is a observable
                // update observable with new value
                keyValue(newValue[key]);
            } else if (typeof keyValue == 'object' && newValue[key] != null) {
                // if it's another complex object, update it as a if it were a new proxy
                keyValue.update(newValue[key]);
            }
        }
    };

    /**
    * Unwraps an proxy observable unwrapping all inner observables.
    */
    ObjectExtensions.unwrapObservableProxyObject = function (proxy) {
        if (!proxy.__isObservableProxy) {
            return proxy;
        }

        var unwrappedObject = {};

        // get all properties from the object
        var keys = Object.keys(proxy);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var keyValue = proxy[key];

            if (keyValue == null) {
                continue;
            } else if ('subscribe' in keyValue) {
                // if property is a observable
                // unwrap it
                unwrappedObject[key] = keyValue();

                // if property is array, it may contain observable proxies as well, so
                // unwrap all elements of it
                if ($.isArray(unwrappedObject[key])) {
                    var array = unwrappedObject[key];
                    for (var j = 0; j < array.length; j++) {
                        array[j] = ObjectExtensions.unwrapObservableProxyObject(array[j]);
                    }
                }
            } else if (typeof keyValue == 'object' && keyValue.__isObservableProxy) {
                // if it's a proxy inside a proxy, unwrap as well
                unwrappedObject[key] = ObjectExtensions.unwrapObservableProxyObject(keyValue);
            } else {
                // just a property, let's copy it
                unwrappedObject[key] = keyValue;
            }
        }

        delete unwrappedObject.__isObservableProxy;
        delete unwrappedObject.update;

        return unwrappedObject;
    };

    // Makes a copy of an object
    // Alternative for jquery (does not handle arrays correctly and it will break calls with Odata):
    // jquery example call that this method replaces: <any >$.extend(true, { }, <your object to clone >);
    //
    // @param {any} origObject The original object to clone
    // @return {any} The cloned object
    ObjectExtensions.clone = function (origObject) {
        return ObjectExtensions.safeClone(origObject, []);
    };

    // Makes a copy of an object
    // Alternative for jquery (does not handle arrays correctly and it will break calls with Odata):
    //
    // @param {any} origObject The original object to clone
    // @param {any} cloneMap A map of the objects that are being cloned to identify circular references
    // @return {any} The cloned object
    ObjectExtensions.safeClone = function (origObject, cloneMap) {
        if (ObjectExtensions.isNullOrUndefined(origObject)) {
            return origObject;
        }

        var newObj;
        if (origObject instanceof Array) {
            // Use the array reference in the object map if it exists
            if (!cloneMap.some(function (val) {
                if (val.id === origObject) {
                    newObj = val.value;
                    return true;
                }

                return false;
            })) {
                // Add the cloned array reference to the object map and clone the array
                newObj = [];
                cloneMap.push({ id: origObject, value: newObj });
                for (var i = 0; i < origObject.length; i++) {
                    if (typeof origObject[i] == "object") {
                        newObj.push(ObjectExtensions.safeClone(origObject[i], cloneMap));
                    } else {
                        newObj.push(origObject[i]);
                    }
                }
            }
        } else if (origObject instanceof Date) {
            newObj = new Date(origObject.valueOf());
        } else if (origObject instanceof Object) {
            // Use the object reference in the object map if it exists
            if (!cloneMap.some(function (val) {
                if (val.id === origObject) {
                    newObj = val.value;
                    return true;
                }

                return false;
            })) {
                // Add the cloned object reference to the object map and clone the object
                newObj = $.extend(false, {}, origObject);
                cloneMap.push({ id: origObject, value: newObj });
                for (var property in newObj) {
                    if (newObj.hasOwnProperty(property)) {
                        if (typeof newObj[property] == "object") {
                            if (property === "__metadata") {
                                newObj[property] = $.extend(false, {}, origObject[property]);
                            } else {
                                newObj[property] = ObjectExtensions.safeClone(origObject[property], cloneMap);
                            }
                        }
                    }
                }
            }
        } else {
            newObj = origObject;
        }

        return newObj;
    };

    /**
    * Help execute async calls in a sequence.
    *
    * @param {any[]} array The elements array.
    * @param {(entity, () => void) => void)} iterator Async iterator callback.
    * @param {any} [then] Success callback.
    */
    ObjectExtensions.forEachAsync = function (array, iterator, then) {
        function next(i) {
            if (i < array.length) {
                iterator(array[i], function () {
                    next(i + 1);
                }, i);
            } else {
                if (then)
                    then();
            }
        }
        ;

        next(0);
    };
    return ObjectExtensions;
})();
var StringExtensions = (function () {
    function StringExtensions() {
    }
    /**
    * Verifies wether the string is empty, but not null.
    *
    * @param {string} object The object.
    * @return {boolean} True if the object is empty, false othwerwise.
    */
    StringExtensions.isEmpty = function (object) {
        return object != null && object.length == 0;
    };

    /**
    * Verifies wether the string is empty or whitespace, but not null.
    *
    * @param {string} object The object.
    * @return {boolean} True if the object is empty or whitespace, false othwerwise.
    */
    StringExtensions.isEmptyOrWhitespace = function (object) {
        return object != null && typeof object.trim == 'function' && (object.trim() || '').length == 0;
    };

    /**
    * Verifies wether the string is null or whitespace.
    *
    * @param {string} object The object.
    * @return {boolean} True if the object is null or whitespace, false othwerwise.
    */
    StringExtensions.isNullOrWhitespace = function (object) {
        return ObjectExtensions.isNullOrUndefined(object) || object.trim().length == 0;
    };

    /**
    * Pad left with padString until the required length is reached.
    */
    StringExtensions.padLeft = function (object, padString, length) {
        if (ObjectExtensions.isNullOrUndefined(padString) || ObjectExtensions.isNullOrUndefined(object)) {
            return object;
        }

        while (object.length < length) {
            object = padString + object;
        }
        return object;
    };

    /**
    * Pad right with padString until the required length is reached.
    */
    StringExtensions.padRight = function (object, padString, length) {
        if (ObjectExtensions.isNullOrUndefined(padString) || ObjectExtensions.isNullOrUndefined(object)) {
            return object;
        }

        while (object.length < length) {
            object += padString;
        }
        return object;
    };

    /**
    * Basic C# like string format function.
    */
    StringExtensions.format = function (object) {
        var params = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            params[_i] = arguments[_i + 1];
        }
        if (StringExtensions.isNullOrWhitespace(object)) {
            return object;
        }

        if (params == null) {
            throw "Invalid parameter";
        }

        for (var index = 0; index < params.length; index++) {
            if (params[index] == null) {
                throw "Invalid parameter";
            }

            var regexp = new RegExp('\\{' + index + '\\}', 'gi');
            object = object.replace(regexp, params[index]);
        }

        return object;
    };

    /**
    * Returns an ordinal to indicate the ordering of the strings
    * -1: This object is less than comparison object
    * 0: This object is equal to the comparison object
    * 1: This object is greater than the comparison object
    */
    StringExtensions.compare = function (object, comparisonObject, ignoreCase) {
        if (ObjectExtensions.isNullOrUndefined(object) && ObjectExtensions.isNullOrUndefined(comparisonObject)) {
            return 0;
        } else if (ObjectExtensions.isNullOrUndefined(object)) {
            return -1;
        } else if (ObjectExtensions.isNullOrUndefined(comparisonObject)) {
            return 1;
        }

        var val1 = ignoreCase ? object.toLowerCase() : object;
        var val2 = ignoreCase ? comparisonObject.toLowerCase() : comparisonObject;

        return val1 < val2 ? -1 : val1 > val2 ? 1 : 0;
    };

    /**
    * Replaces new line character with <br /> for display.
    */
    StringExtensions.replaceNewLineWithBr = function (text) {
        if (text) {
            return text.replace("\n", "<br />");
        }

        return text;
    };

    /**
    * Escapes single quote to be send as part of urls.
    */
    StringExtensions.escapeSingleQuote = function (text) {
        return text.replace(/(')/g, "\'$1");
    };

    /**
    * Removes the trailing slashes from the URI.
    *
    * @param {string} uri The URI to clean.
    * @return {string} The uri without trailing slashes.
    */
    StringExtensions.CleanUri = function (uri) {
        if (StringExtensions.isNullOrWhitespace(uri)) {
            return StringExtensions.EMPTY;
        }

        // the cutoff index for the string
        var cutoffIndex = uri.length - 1;

        while (cutoffIndex >= 0 && (uri[cutoffIndex] == '/' || uri[cutoffIndex] == '\\')) {
            --cutoffIndex;
        }

        // if it ever becomes negative, cutoffIndex + 1 = 0
        return uri.substr(0, cutoffIndex + 1);
    };

    /**
    * Determines whether the end of string matches a specified string.
    *
    * @param {string} str: The string to search in.
    * @param {string} suffix: The string to compare to the substring at the end of str.
    * @param {boolean} caseSensitive: Determines if the comparision case sensitive (false, by default)
    * @return {boolean} true if suffix matches the end of str; otherwise, false.
    */
    StringExtensions.endsWith = function (str, suffix, caseSensitive) {
        if (typeof caseSensitive === "undefined") { caseSensitive = false; }
        if (ObjectExtensions.isNullOrUndefined(str) || ObjectExtensions.isNullOrUndefined(suffix)) {
            return false;
        }
        if (suffix.length > str.length) {
            return false;
        }

        var originalString = (caseSensitive) ? str : str.toLowerCase();
        var subString = (caseSensitive) ? suffix : suffix.toLowerCase();
        return originalString.indexOf(subString, originalString.length - subString.length) !== -1;
    };
    StringExtensions.EMPTY = '';
    return StringExtensions;
})();
var Strings = (function () {
    function Strings() {
    }
    Strings.chartTypeImages = {
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

    Strings.chartStackTypes = {
        stack: "stack",
        dodge: "dodge",
        identity: "identity",
        empty: ""
    };

    Strings.chartTypeGroups = {
        column: "chartType-column",
        bar: "chartType-bar",
        line: "chartType-line",
        pie: "chartType-pie",
        area: "chartType-area",
        people: "chartType-people"
    };

    Strings.defaultBarColors = {
        name: "chartAccent1Color",
        values: ["#4A72B8", "#ED7D31", "#8AB25F", "#846A52", "#B26DAA", "#89C6C0", "#EC4424"]
    };

    Strings.seriesName = "Series";

    Strings.tableCSS = {
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

    Strings.configureKeys = {
        theme: "theme",
        shape: "shape",
        sku: "sku"
    };

    Strings.peopleTabs = {
        basic: "Basic",
        type: "Type",
        theme: "Theme"
    };

    Strings.tableIcons = {
        insertColumnLeftButtonActive: "../Icons/insert_column_left_active.png",
        insertColumnLeftButtonRest: "../Icons/insert_column_left_rest.png",
        insertColumnRightButtonActive: "../Icons/insert_column_right_active.png",
        insertColumnRightButtonRest: "../Icons/insert_column_right_rest.png",
        insertRowAboveButtonActive: "../Icons/insert_row_above_active.png",
        insertRowAboveButtonRest: "../Icons/insert_row_above_rest.png",
        insertRowBelowButtonActive: "../Icons/insert_row_below_active.png",
        insertRowBelowButtonRest: "../Icons/insert_row_below_rest.png",
        selectAllActive: "../Icons/select_all_active.png",
        selectAllRest: "../Icons/select_all_rest.png"
    };

    Strings.officeContentAccent = {
        color: "office-contentAccent2-color",
        bgColor: "office-contentAccent3-bgColor",
        borderColor: "office-contentAccent1-borderColor"
    };

    Strings.chartPartNames = {
        title: "chartFrame.title",
        margins: "chartFrame.margins",
        plotBg: "chartFrame.plotBg",
        gridLines: "chartFrame.gridLines",
        xaxisLabel: "xaxis.label",
        xaxisTitle: "xaxis.title",
        yaxisLabel: "yaxis.label",
        yaxisTitle: "yaxis.title",
        yaxisLine: "yaxis.axisLine",
        yaxisTick: "yaxis.tick",
        legendTitle: "legend.title",
        legendLabel: "legendAxis.label",
        legendBox: "legend.box",
        axisLine: "legendAxis.axisLine",
        layerText: "layerText"
    };

    Strings.buttonIcons = {
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

    Strings.fontFamilies = {
        segoeUISemilight: "Segoe UI Semilight",
        segoeUI: "Segoe UI"
    };

    Strings.welcomeBoxSizeOptions = {
        minWidth: 450,
        minHeight: 300,
        scale: 0.8,
        marginTopScale: 0.1
    };

    Strings.chartSizeOptions = {
        heightRatio: 0.75,
        widthRatio: 0.95,
        minHeight: 245,
        minWidth: 500
    };

    Strings.peopleChartSizeOptions = {
        heightRatio: 1.27,
        minHeight: 200
    };

    Strings.customChartSizeOptions = {
        heightRatio: 1.4,
        widthRatio: 1.06,
        minHeight: 195,
        minWidth: 400
    };

    Strings.pieSizeOptions = {
        defaultValue: 100,
        innerRadiusRatio: 0.15
    };

    Strings.legendBoxClassNames = {
        customLegend: "custom-Legend",
        legendEntry: "legend-Entry",
        colorSquare: "color-Square",
        seriesName: "series-Name",
        legendEntryFocus: "legend-Entry-focus"
    };
    return Strings;
})();
var KeyboardHelper = (function () {
    function KeyboardHelper() {
    }
    /**
    * Add keyboard event to specified DOM.
    */
    KeyboardHelper.prototype.addKeyEvent = function (selector, keyCodes, handler, keyEvent) {
        if (selector) {
            keyEvent = keyEvent ? keyEvent : "keypress";
            $(selector).off(keyEvent);

            $(selector).on(keyEvent, function (e) {
                if (keyCodes.indexOf(e.keyCode) !== -1) {
                    handler(e);
                    return false;
                }
            });
        }
    };

    /**
    * Add ctrl combine keys(i.e. ctrl + F2) event.
    */
    KeyboardHelper.prototype.addCtrlKeyEvent = function (selector, keyCodes, handler) {
        this.addCombineKeyEvent(selector, OfficeUtil.Strings.keyCodes.ctrl, keyCodes, handler);
    };

    /**
    * Add shift combine(i.e. shift + F2) event.
    */
    KeyboardHelper.prototype.addShiftKeyEvent = function (selector, keyCodes, handler) {
        this.addCombineKeyEvent(selector, OfficeUtil.Strings.keyCodes.shift, keyCodes, handler);
    };

    /**
    * Add alt combine(i.e. alt + F2) event.
    */
    KeyboardHelper.prototype.addAltKeyEvent = function (selector, keyCodes, handler) {
        this.addCombineKeyEvent(selector, OfficeUtil.Strings.keyCodes.alt, keyCodes, handler);
    };

    /**
    * Add key board combine key event.
    */
    KeyboardHelper.prototype.addCombineKeyEvent = function (selector, firstKeyCode, secondKeyCodes, handler) {
        var isMatchFirstKey = false;
        $(selector).keydown(function (e) {
            if (e.which === firstKeyCode)
                isMatchFirstKey = true;
            if (secondKeyCodes.indexOf(e.which) !== -1 && isMatchFirstKey === true) {
                handler.apply(this, [e]);
                return false;
            }
        }).keyup(function (e) {
            if (e.which === firstKeyCode)
                isMatchFirstKey = false;
        });
    };
    return KeyboardHelper;
})();
var ChartTypePage = (function () {
    // Constructor for ChartTypePage
    function ChartTypePage() {
        var _this = this;
        // To identity whether chart is bound data.
        this.isChartBound = false;
        // Back button.
        this.$backBtn = $("#chartType_backBtn");
        // navigate list in ChartType page.
        this.$navChart = $(".chartType-nav>ul>li");
        // thumbnail image in ChartType page.
        this.$thumbnails = $(".chartType-thumbnail>ul>li>img");
        // Select chart type button.
        this.$selectChartTypeBtn = $("#selectChartTypeBtn");
        this.page = 1 /* ChartTypePage */;
        // Added click event for back button.
        this.$backBtn.click({ handler: PageHelper.backBtnHandler });

        // Added click event for nav list.
        this.$navChart.click(ChartTypePage.navChartHandler);

        // Added click event for thumbnail images.
        this.$thumbnails.on("click", function (e) {
            ChartTypePage.thumbnailsHandler($(this));
            $(this).focus();

            // Prevent default event.
            return false;
        });

        // Added click event for select button.
        this.$selectChartTypeBtn.on("click", function (e) {
            ChartTypePage.selectHandler($(this));

            // Prevent default event.
            return false;
        });

        // Set selection style for frist nav item.
        var first = this.$navChart.first();
        ChartTypePage.updateSelction(first.closest("ul"), first);

        // Set selection style for first thumbnail item.
        var firstThumbnail = this.$thumbnails.first();
        ChartTypePage.updateSelction(firstThumbnail.closest("ul"), firstThumbnail.closest("li"));

        this.currentChartTypeInstance = $(".chartType-column");
        this.currentDetailedChartTypeInstance = $("#RegularColumn");

        // Add keyboard accessibility.
        this.$backBtn.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter || e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                PageHelper.backBtnHandler();
                return false;
            }
        });

        // Add keyboard accessibility.
        this.$selectChartTypeBtn.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter || e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                ChartTypePage.selectHandler($(_this));
                return false;
            }
        });
    }
    /**
    * Loaded function will be called after page loaded at first time.
    */
    ChartTypePage.prototype.afterLoaded = function () {
        AgaveHelper.initBackbtn();

        // Hide settings command in tool bar in current page.
        $("#toolbarSettings").hide();
        ControlHelper.hideControl(ChartAgave.settingsControl);

        // Bound data to chart with column type.
        ChartTypePage.buildSampleChart();

        // Set this variable to true for identitying chart is bound.
        // No need to build chart again even if enter this page next time.
        this.isChartBound = true;

        // Enable keyboard accessibility.
        AccessibilityHelper.enableChartTypeAccessibility();

        $(document).keydown(this.keyPressHandler);
    };

    /**
    * Unbind keydown event.
    */
    ChartTypePage.prototype.beforeLeave = function () {
        $(document).unbind("keydown");
    };

    /**
    * Key press handler for down narrow, up narrow, left narrow and right narrow.
    */
    ChartTypePage.prototype.keyPressHandler = function (e) {
        switch (e.keyCode) {
            case OfficeUtil.Strings.keyCodes.down: {
                ChartAgave.chartTypePage.keyDownNarrow();
                break;
            }
            case OfficeUtil.Strings.keyCodes.up: {
                ChartAgave.chartTypePage.keyUpNarrow();
                break;
            }
            case OfficeUtil.Strings.keyCodes.left: {
                ChartAgave.chartTypePage.keyLeftNarrow();
                break;
            }
            case OfficeUtil.Strings.keyCodes.right: {
                ChartAgave.chartTypePage.keyRightNarrow();
                break;
            }

            default: {
                break;
            }
        }
    };

    /**
    * Handler for down narrow key.
    */
    ChartTypePage.prototype.keyDownNarrow = function () {
        if (this.currentChartTypeInstance == null) {
            this.currentChartTypeInstance = $(".chartType-column");
        }

        var next = this.currentChartTypeInstance.next("li");

        if (next.length === 0) {
            next = $(".chartType-column");
        }
        this.currentChartTypeInstance = next;
        this.currentChartTypeInstance.focus();
        ChartTypePage.navChartHandler.call(next);
        this.currentDetailedChartTypeInstance = null;
    };

    /**
    * Handler for up narrow key.
    */
    ChartTypePage.prototype.keyUpNarrow = function () {
        if (this.currentChartTypeInstance == null) {
            this.currentChartTypeInstance = $(".chartType-column");
        }

        var prev = this.currentChartTypeInstance.prev("li");

        if (prev.length === 0) {
            prev = $(".chartType-people");
        }
        this.currentChartTypeInstance = prev;
        this.currentChartTypeInstance.focus();
        ChartTypePage.navChartHandler.call(prev);
        this.currentDetailedChartTypeInstance = null;
    };

    /**
    * Handler for left narrow key.
    */
    ChartTypePage.prototype.keyLeftNarrow = function () {
        if (this.currentDetailedChartTypeInstance == null) {
            this.currentDetailedChartTypeInstance = $("#thumbnail1>img");
        }
        var left = this.currentDetailedChartTypeInstance.closest("li").prev("li");

        if (left && left.length != 0) {
            var img = left.find("img");
            ChartTypePage.thumbnailsHandler(img);
            this.currentDetailedChartTypeInstance = img;
            this.currentDetailedChartTypeInstance.focus();
            return false;
        } else {
            left = this.currentDetailedChartTypeInstance.closest("li").next("li");
            if (left && left.length != 0) {
                var img = left.find("img");
                ChartTypePage.thumbnailsHandler(img);
                this.currentDetailedChartTypeInstance = img;
                this.currentDetailedChartTypeInstance.focus();
                return false;
            }
        }
    };

    /**
    * Handler for right narrow key.
    */
    ChartTypePage.prototype.keyRightNarrow = function () {
        if (this.currentDetailedChartTypeInstance == null) {
            this.currentDetailedChartTypeInstance = $("#thumbnail1>img");
        }
        var right = this.currentDetailedChartTypeInstance.closest("li").next("li");

        if (right && right.length != 0) {
            var img = right.find("img");
            ChartTypePage.thumbnailsHandler(img);
            this.currentDetailedChartTypeInstance = img;
            this.currentDetailedChartTypeInstance.focus();
            return false;
        } else {
            right = this.currentDetailedChartTypeInstance.closest("li").prev("li");
            if (right && right.length != 0) {
                var img = right.find("img");
                ChartTypePage.thumbnailsHandler(img);
                this.currentDetailedChartTypeInstance = img;
                this.currentDetailedChartTypeInstance.focus();
                return false;
            }
        }
    };

    /**
    * Handler for navigate list in ChartType page.
    */
    ChartTypePage.navChartHandler = function () {
        var $type = $(this);

        // Update thumbnail item style, set first one as selection by default.
        var firstThumbnail = $(".chartType-thumbnail>ul>li").first();
        ChartTypePage.updateSelction(firstThumbnail.closest("ul"), firstThumbnail);

        switch ($type[0].className) {
            case Strings.chartTypeGroups.column: {
                var th1 = {
                    src: Strings.chartTypeImages.regularColumn,
                    id: ChartTypes[0 /* RegularColumn */],
                    title: OfficeLocalization.Resources.getResourceString("regular_column")
                };
                var th2 = {
                    src: Strings.chartTypeImages.stackedColumn,
                    id: ChartTypes[1 /* StackedColumn */],
                    title: OfficeLocalization.Resources.getResourceString("stacked_column")
                };
                ChartTypePage.updateThumbnailImage(th1, th2);
                ChartAgave.chartType = 0 /* RegularColumn */;

                // Bound data to chart with column type.
                ChartTypePage.buildSampleChart();
                break;
            }
            case Strings.chartTypeGroups.bar: {
                var th1 = {
                    src: Strings.chartTypeImages.regularBar,
                    id: ChartTypes[2 /* RegularBar */],
                    title: OfficeLocalization.Resources.getResourceString("regular_bar")
                };
                var th2 = {
                    src: Strings.chartTypeImages.stackedBar,
                    id: ChartTypes[3 /* StackedBar */],
                    title: OfficeLocalization.Resources.getResourceString("stacked_bar")
                };
                ChartTypePage.updateThumbnailImage(th1, th2);
                ChartAgave.chartType = 2 /* RegularBar */;

                // Bound data to chart with bar type.
                ChartTypePage.buildSampleChart();
                break;
            }
            case Strings.chartTypeGroups.line: {
                var th1 = {
                    src: Strings.chartTypeImages.line,
                    id: ChartTypes[4 /* Line */],
                    title: OfficeLocalization.Resources.getResourceString("line")
                };
                ChartTypePage.updateThumbnailImage(th1);
                ChartAgave.chartType = 4 /* Line */;

                // Bound data to chart with line type.
                ChartTypePage.buildSampleChart();
                break;
            }
            case Strings.chartTypeGroups.pie: {
                var th1 = {
                    src: Strings.chartTypeImages.regularPie,
                    id: ChartTypes[5 /* RegularPie */],
                    title: OfficeLocalization.Resources.getResourceString("regular_pie")
                };
                var th2 = {
                    src: Strings.chartTypeImages.innerRaduisPie,
                    id: ChartTypes[6 /* InnerRaduisPie */],
                    title: OfficeLocalization.Resources.getResourceString("donut_pie")
                };
                ChartTypePage.updateThumbnailImage(th1, th2);
                ChartAgave.chartType = 5 /* RegularPie */;

                // Bound data to chart with pie type.
                ChartTypePage.buildSampleChart();
                break;
            }
            case Strings.chartTypeGroups.area: {
                var th1 = {
                    src: Strings.chartTypeImages.regularArea,
                    id: ChartTypes[7 /* RegularArea */],
                    title: OfficeLocalization.Resources.getResourceString("regular_area")
                };
                var th2 = {
                    src: Strings.chartTypeImages.stackedArea,
                    id: ChartTypes[8 /* StackedArea */],
                    title: OfficeLocalization.Resources.getResourceString("stacked_area")
                };
                ChartTypePage.updateThumbnailImage(th1, th2);
                ChartAgave.chartType = 7 /* RegularArea */;

                // Bound data to chart with area type.
                ChartTypePage.buildSampleChart();
                break;
            }
            case Strings.chartTypeGroups.people: {
                var th1 = {
                    src: Strings.chartTypeImages.people,
                    id: ChartTypes[9 /* People */],
                    title: OfficeLocalization.Resources.getResourceString("people")
                };
                ChartTypePage.updateThumbnailImage(th1);
                ChartAgave.chartType = 9 /* People */;

                // No need show separator in this page.
                $(".title-separator").hide();

                // Bound data to chart with people type.
                ChartTypePage.buildPeopleSampleChart();
                break;
            }
            default:
                break;
        }

        // Updated selection style for selected element.
        ChartTypePage.updateSelction($type.closest("ul"), $type);
        return false;
    };

    /**
    * Update css style for selected control.
    *
    * @param {JQuery} parent The object.
    * @param {JQuery} currentSelection The object.
    */
    ChartTypePage.updateSelction = function (parent, currentSelection) {
        // Remove selection css style.
        if (parent != null) {
            parent.find("li").removeClass("actived");
        }

        // Apply selection style for selected element.
        if (currentSelection != null) {
            currentSelection.addClass("actived");
        }
    };

    /**
    * Update images by param.
    *
    * @param {string} thumbnail1 First image url.
    * @param {string} value1 To mark thumbnail1 element.
    * @param {string?} thumbnail2 Second image url, it is optional.
    * @param {string?} value2 To mark thumbnail2 element.
    */
    ChartTypePage.updateThumbnailImage = function (thumbnail1, thumbnail2) {
        // Remove img frist before creating new image.
        $("#thumbnail1>img").remove();
        $("#thumbnail2>img").remove();

        // thumbnail1 is required.
        if (thumbnail1 != null) {
            var $img = $("<img src=" + thumbnail1.src + " id=" + thumbnail1.id + " />");
            $img.attr("title", thumbnail1.title);
            $img.attr("tabindex", "2");
            $("#thumbnail1").append($img);
            if (thumbnail1.id === ChartTypes[9 /* People */]) {
                $img.addClass("people");
            }
            $img.focus();
        }

        // Update thumbnail name in label.
        $(".chartType-thumbnail-name").text(thumbnail1.title);

        // thumbnail2 is optional.
        if (thumbnail2 != null) {
            var $img = $("<img src=" + thumbnail2.src + " id=" + thumbnail2.id + " />");
            $img.attr("tabindex", "2");
            $img.attr("title", thumbnail2.title);
            $("#thumbnail2").append($img);
            $("#thumbnail2").show();
        } else {
            $("#thumbnail2").hide();
        }

        $(".chartType-thumbnail>ul>li>img").on("click", function (e) {
            ChartTypePage.thumbnailsHandler($(this));
            return false;
        });

        $(document).unbind("keydown");
        $(document).keydown(ChartAgave.chartTypePage.keyPressHandler);
    };

    /**
    * Handler for thumbnail in ChartType page.
    *
    * @param {JQuery} target The object.
    */
    ChartTypePage.thumbnailsHandler = function (target) {
        // Update selction style.
        ChartTypePage.updateSelction(target.closest("ul"), target.closest("li"));

        // Update thumbnail name in label.
        $(".chartType-thumbnail-name").text(target.attr("title"));

        // Check data-value of $thumbnail element, and build related chart.
        var value = target.attr("id");
        switch (value) {
            case ChartTypes[0 /* RegularColumn */]: {
                ChartAgave.chartType = 0 /* RegularColumn */;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[1 /* StackedColumn */]: {
                ChartAgave.chartType = 1 /* StackedColumn */;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[2 /* RegularBar */]: {
                ChartAgave.chartType = 2 /* RegularBar */;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[3 /* StackedBar */]: {
                ChartAgave.chartType = 3 /* StackedBar */;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[4 /* Line */]: {
                ChartAgave.chartType = 4 /* Line */;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[5 /* RegularPie */]: {
                ChartAgave.chartType = 5 /* RegularPie */;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[6 /* InnerRaduisPie */]: {
                ChartAgave.chartType = 6 /* InnerRaduisPie */;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[7 /* RegularArea */]: {
                ChartAgave.chartType = 7 /* RegularArea */;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[8 /* StackedArea */]: {
                ChartAgave.chartType = 8 /* StackedArea */;
                ChartTypePage.buildSampleChart();
                break;
            }
            case ChartTypes[9 /* People */]: {
                ChartAgave.chartType = 9 /* People */;
                ChartTypePage.buildSampleChart();
                break;
            }
            default: {
                break;
            }
        }

        // Block default click events.
        return false;
    };

    /**
    * Select change event handler.
    *
    * @param {JQuery} target The object.
    */
    ChartTypePage.selectHandler = function (target) {
        PageHelper.navigateToPage(ChartAgave.chartPage);
    };

    /**
    * Build sample chart.
    */
    ChartTypePage.buildSampleChart = function () {
        // Init a ChartHelper instance.
        var helper = new ChartHelper();

        // Init a Chart instance.
        var chart = new Chart();

        // Create a BuildChartOptions instance.
        var chartOptions = helper.buildChartOptions(ChartSettings.settings.settings, "#chartSample", 250, 620);
        if (ChartAgave.chartType === 6 /* InnerRaduisPie */) {
            chartOptions.innerRadius = 70;
        }

        // Build chart with BuildChartOptions.
        if (ChartAgave.chartType === 9 /* People */) {
            this.buildPeopleSampleChart();
        } else {
            $("#chartTypeCanvasRoot").fadeOut("fast", function () {
                Chart.isChartTypeResize = true;
                Chart.buildChart(chartOptions);
            });
        }
    };

    /**
    * Build people chart by data.
    */
    ChartTypePage.buildPeopleSampleChart = function () {
        $("#chartSample").fadeOut("fast", function () {
            $(DataViz.Chart.defaultSVGRootId).empty();
            DataViz.Chart.isWindowBand = false;
            DataViz.Chart.defaultSVGRootId = "#chartTypeCanvasRoot";
            Chart.resizePeopleChartContainer(DataViz.Chart.defaultSVGRootId);
            var pc = new PeopleChart(DataViz.Chart.defaultSVGRootId);
        });
    };
    return ChartTypePage;
})();
var ChartHelper = (function () {
    function ChartHelper() {
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
    ChartHelper.prototype.buildSettingOptions = function (title, valueVisibility, gridVisibility, xAxisLabel, yAxisLabel, colors, peopleLable) {
        title = title != null && title.trim() !== "" ? title : OfficeLocalization.Resources.getResourceString("chart_title");
        colors = colors != null ? colors : Strings.defaultBarColors;

        return {
            title: title,
            gridVisibility: gridVisibility,
            valueVisibility: valueVisibility,
            xAxisLabel: xAxisLabel,
            yAxisLabel: yAxisLabel,
            colors: colors,
            peopleLable: peopleLable
        };
    };

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
    ChartHelper.prototype.buildChartOptions = function (settings, containerId, height, width, lineSize, textSize, opacity, innerRadius, func) {
        // Create vuePlot layer by chart type.
        var layer = this.createLayerByType(ChartAgave.chartType);

        // Get chart stack.
        var stack = this.getStackByType(ChartAgave.chartType);

        // Get data to build chart.
        var categoryName = this.data.categories.name;
        var data = this.dataRecords.chartData;

        // Set chart height and width.
        height = height != null ? height : 350;
        width = width != null ? width : 650;

        // Set linesize height.
        lineSize = lineSize != null ? lineSize : 0;
        if (lineSize === 0 && ChartAgave.chartType === 4 /* Line */) {
            lineSize = 2;
        }

        // Set linesize height.
        textSize = textSize != null ? textSize : 0;

        // Set chart opcity
        opacity = opacity != null ? opacity : 1;
        innerRadius = innerRadius != null ? innerRadius : 0;
        if (innerRadius === 0 && ChartAgave.chartType === 6 /* InnerRaduisPie */) {
            innerRadius = Strings.pieSizeOptions.defaultValue;
        }

        // Get chart x and y axis.
        var xy = this.getXYaxis(ChartAgave.chartType);

        var outerMargin = 0;

        // Set func param
        if (ChartAgave.chartType === 4 /* Line */) {
            func = function (plotLayer) {
                layer.stroke({ colName: ["_seriesIndex"], palette: Strings.defaultBarColors.values, isDiscrete: true });
            };
        } else if (ChartAgave.chartType === 6 /* InnerRaduisPie */ || ChartAgave.chartType === 5 /* RegularPie */) {
            outerMargin = 50;
            func = function (plotLayer) {
                layer.fill({ colName: categoryName, palette: Strings.defaultBarColors.values, isDiscrete: true });
            };
        } else {
            func = function (plotLayer) {
                layer.fill({ colName: "_seriesIndex", palette: Strings.defaultBarColors.values, isDiscrete: true });
            };
        }

        // Get series names.
        var names = this.getSeriesName();
        if (ChartAgave.chartType === 6 /* InnerRaduisPie */ || ChartAgave.chartType === 5 /* RegularPie */) {
            if (names && names.length != 0) {
                names = [names[0]];
            }
        }

        // Create ChartOptions instance.
        return {
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
        };
    };

    /**
    * Build text layer options, used to create text layer.
    *
    * @param {IChartOptions} chartOptions To provide basic chart info.
    */
    ChartHelper.buildTextLayerOptions = function (chartOptions) {
        var textLayerOption;
        if (chartOptions) {
            switch (ChartAgave.chartType) {
                case 0 /* RegularColumn */: {
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
                case 1 /* StackedColumn */: {
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
                case 4 /* Line */: {
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

                case 8 /* StackedArea */: {
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
                case 7 /* RegularArea */: {
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
                case 2 /* RegularBar */: {
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
                case 3 /* StackedBar */: {
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
                case 6 /* InnerRaduisPie */:
                case 5 /* RegularPie */: {
                    if (chartOptions.y && chartOptions.y.length != 0) {
                        textLayerOption = {
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
    };

    /**
    * Get vuePlot layer by chartType.
    *
    * @param {ChartTypes} chartType Chart type object.
    */
    ChartHelper.prototype.createLayerByType = function (chartType) {
        var layer;
        switch (chartType) {
            case 2 /* RegularBar */:
            case 3 /* StackedBar */: {
                layer = vp.layers.createBar();
                break;
            }
            case 5 /* RegularPie */:
            case 6 /* InnerRaduisPie */: {
                layer = vp.layers.createPieSlice();
                break;
            }
            case 7 /* RegularArea */:
            case 8 /* StackedArea */: {
                layer = vp.layers.createArea();
                break;
            }
            case 4 /* Line */: {
                layer = vp.layers.createLine();
                break;
            }
            case 0 /* RegularColumn */:
            case 1 /* StackedColumn */: {
                layer = vp.layers.createColumn();
                break;
            }
            default: {
                layer = null;
                break;
            }
        }

        return layer;
    };

    /**
    * Get vuePlot layer stack type.
    *
    * @param {ChartTypes} chartType Chart type object.
    */
    ChartHelper.prototype.getStackByType = function (chartType) {
        var stack = Strings.chartStackTypes.dodge;

        switch (chartType) {
            case 1 /* StackedColumn */:
            case 8 /* StackedArea */:
            case 3 /* StackedBar */: {
                stack = Strings.chartStackTypes.stack;
                break;
            }
            case 7 /* RegularArea */: {
                stack = Strings.chartStackTypes.identity;
                break;
            }
            case 4 /* Line */: {
                stack = Strings.chartStackTypes.dodge;
                break;
            }
            default: {
                break;
            }
        }

        return stack;
    };

    /**
    * Get x and y axis series name.
    *
    * @param {ChartTypes} chartType Chart type object.
    */
    ChartHelper.prototype.getXYaxis = function (chartType) {
        var result;
        var categoryName = [this.data.categories.name];
        var seriesName = this.getSeriesName();

        result = {
            x: categoryName,
            y: seriesName
        };

        switch (chartType) {
            case 2 /* RegularBar */:
            case 3 /* StackedBar */: {
                result = {
                    x: seriesName,
                    y: categoryName
                };
                break;
            }
            case 6 /* InnerRaduisPie */:
            case 5 /* RegularPie */: {
                result = {
                    x: [],
                    y: seriesName && seriesName.length != 0 ? [seriesName[0]] : []
                };
                break;
            }
            default: {
                break;
            }
        }

        return result;
    };

    /**
    * Get all series names from data.
    */
    ChartHelper.prototype.getSeriesName = function () {
        var names = [];
        if (this.data.series.length != 0) {
            this.data.series.forEach(function (item, index) {
                names.push(item.name);
            });
        }

        return names;
    };
    return ChartHelper;
})();
var ChartPage = (function () {
    function ChartPage() {
        var _this = this;
        this.page = 0 /* ChartPage */;
        this.$welcome = $("#welcomePopup");
        // Add click event on welcome box.
        this.$welcome.on("click", function () {
            _this.$welcome.fadeOut();
        });
    }
    /**
    * This method will be invoked after page loaded.
    */
    ChartPage.prototype.afterLoaded = function () {
        var _this = this;
        // Hide settings command in tool bar in current page.
        $("#toolbarSettings").show();

        // Init a ChartHelper instance.
        this.helper = new ChartHelper();

        // Init a Chart instance.
        this.chart = new Chart();

        // Create a BuildChartOptions instance.
        var chartOptions = this.helper.buildChartOptions(ChartSettings.settings.settings, "#myChart");

        // Build chart with BuildChartOptions.
        Chart.isChartTypeResize = false;
        Chart.buildChart(chartOptions);

        // Add click event on welcome box.
        this.$welcome.on("click", function () {
            _this.$welcome.fadeOut();
        });

        // Enable keyboard accessibility.
        AccessibilityHelper.enableChartPageAccessibility();

        // Add click event on welcome box.
        this.$welcome.on("keypress", function (e) {
            if (e.keyCode == OfficeUtil.Strings.keyCodes.enter || e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                _this.$welcome.fadeOut();
            }
        });

        if (ChartAgave.isFirstRun && !ChartData.isCustomizedDataDefined()) {
            ChartAgave.isFirstRun = false;
            this.$welcome.fadeIn();
        }

        // Adjust welcome box size by current window size.
        this.resizeWelcomeLayout();
        this.resizeChartContainer();
    };

    /**
    * This method will be invoked before page loaded.
    */
    ChartPage.prototype.beforeLoaded = function () {
        this.layout();
        if (ChartData.isCustomizedDataDefined()) {
            this.$welcome.hide();
        }
    };

    /**
    * This method will be invoked before leave this page.
    */
    ChartPage.prototype.beforeLeave = function () {
        this.$welcome.off("click");
        this.$welcome.off("keypress");
    };

    /**
    * Resize welcome screen layout by window resize.
    */
    ChartPage.prototype.layout = function () {
        var _this = this;
        $(window).on("resize", function (event) {
            _this.resizeWelcomeLayout();
            _this.resizeChartContainer();
        });
    };

    /**
    * Calc window size, to adjust welcome dialog size.
    */
    ChartPage.prototype.resizeWelcomeLayout = function () {
        var width = $(window).outerWidth();
        var height = $(window).outerHeight();

        var $textContainer = $(".message-container");

        if (width >= Strings.welcomeBoxSizeOptions.minWidth && height >= Strings.welcomeBoxSizeOptions.minHeight) {
            $textContainer.width(width * Strings.welcomeBoxSizeOptions.scale);
            $textContainer.height(height * Strings.welcomeBoxSizeOptions.scale);
            $textContainer.css("margin-top", height * Strings.welcomeBoxSizeOptions.marginTopScale);
        } else {
            $textContainer.width(width);
            $textContainer.height(height);
            $textContainer.css("margin-top", 0);
        }

        // Welcome box size is always same as agave size. this is by design.
        // Set welcome box size.
        this.$welcome.width(width);
        this.$welcome.height(height);
    };

    /**
    * Calc window size, to adjust chart container dialog size.
    */
    ChartPage.prototype.resizeChartContainer = function () {
        var width = $(window).outerWidth();
        var height = $(window).outerHeight();
        var $container = $(".chart-sub-container");

        //var w = width - ($container.offset().left) * 2;
        // var h = height - ($container.offset().top) * 2;
        var w = width - 24 * 2;
        var h = height - 24 * 2;

        w = w < Strings.chartSizeOptions.minWidth ? Strings.chartSizeOptions.minWidth : w;
        h = h < Strings.chartSizeOptions.minHeight ? Strings.chartSizeOptions.minHeight : h;

        $container.width(w);
        $container.height(h);
        $container.css("overflow", "auto");
    };
    return ChartPage;
})();
var ChartTable = (function () {
    function ChartTable() {
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
    ChartTable.getInstance = function () {
        if (!ChartTable.instance) {
            ChartTable.instance = new ChartTable();
        }

        return ChartTable.instance;
    };

    /**
    * Initialize the table toolbar
    */
    ChartTable.prototype.initializeTableToolbar = function () {
        var _this = this;
        this.$firstSeparator = $("#firstSeparator");
        this.$showColumnHeader = $("#showColumnHeader").click(function () {
            ChartTableHelper.toggleColumnHeaderVisibility();
            return false;
        });

        this.$showRowHeader = $("#showRowHeader").click(function () {
            ChartTableHelper.toggleRowHeaderVisibility();
            return false;
        });

        // Keyboard accessibility.
        this.keyBoard.addKeyEvent("#showColumnHeader", [OfficeUtil.Strings.keyCodes.enter], function () {
            ChartTableHelper.toggleColumnHeaderVisibility();
            return false;
        });

        this.keyBoard.addKeyEvent("#showRowHeader", [OfficeUtil.Strings.keyCodes.enter], function () {
            ChartTableHelper.toggleRowHeaderVisibility();
            return false;
        });

        this.$secondSeparator = $("#secondSeparator");
        this.$horizontalSelectedGrip = $("#horizontalSelectedGrip");
        this.$verticalSelectedGrip = $("#verticalSelectedGrip");

        var insertLeftHandler = function () {
            var index = TableSelection.selectedColumnIndex();
            ChartTableHelper.insertColumnLeft(index);
            _this.updateData();
            _this.drawTable();
            TableSelection.selectColumn(index + 1);

            return false;
        };

        var insertRightHandler = function () {
            var index = TableSelection.selectedColumnIndex();
            ChartTableHelper.insertColumnRight(index);
            _this.updateData();
            _this.drawTable();
            TableSelection.selectColumn(index);

            return false;
        };

        var insertAboveHandler = function () {
            var index = TableSelection.selectedRowIndex();
            ChartTableHelper.insertRowAbove(index);
            _this.updateData();
            _this.drawTable();
            TableSelection.selectRow(index + 1);

            return false;
        };

        var insertBelowHandler = function () {
            var index = TableSelection.selectedRowIndex();
            ChartTableHelper.insertRowBelow(index);
            _this.updateData();
            _this.drawTable();
            TableSelection.selectRow(index);

            return false;
        };

        if (OfficeUtil.Util.isRtlLanguage()) {
            this.$insertColumnLeftToolbar = $("#addColumnLeft").click(insertRightHandler);
            this.$insertColumnRightToolbar = $("#addColumnRight").click(insertLeftHandler);

            // Keyboard accessibility.
            this.keyBoard.addKeyEvent("#addColumnLeft", [OfficeUtil.Strings.keyCodes.enter], insertRightHandler);

            this.keyBoard.addKeyEvent("#addColumnRight", [OfficeUtil.Strings.keyCodes.enter], insertLeftHandler);
        } else {
            this.$insertColumnLeftToolbar = $("#addColumnLeft").click(insertLeftHandler);
            this.$insertColumnRightToolbar = $("#addColumnRight").click(insertRightHandler);

            // Keyboard accessibility.
            this.keyBoard.addKeyEvent("#addColumnLeft", [OfficeUtil.Strings.keyCodes.enter], insertLeftHandler);

            this.keyBoard.addKeyEvent("#addColumnRight", [OfficeUtil.Strings.keyCodes.enter], insertRightHandler);
        }

        this.$deleteColumnToolbar = $("#deleteColumn").click(function () {
            ChartTableHelper.deleteColumn(TableSelection.selectedColumnIndex());
            _this.updateData();
            _this.drawTable();

            return false;
        });
        this.$insertRowAboveToolbar = $("#addRowAbove").click(insertAboveHandler);
        this.$insertRowBelowToolbar = $("#addRowBelow").click(insertBelowHandler);

        this.$deleteRowToolbar = $("#deleteRow").click(function () {
            ChartTableHelper.deleteRow(TableSelection.selectedRowIndex());
            _this.updateData();
            _this.drawTable();

            return false;
        });

        // Keyboard accessibility.
        this.keyBoard.addKeyEvent("#deleteColumn", [OfficeUtil.Strings.keyCodes.enter], function () {
            ChartTableHelper.deleteColumn(TableSelection.selectedColumnIndex());
            _this.updateData();
            _this.drawTable();
            return false;
        });

        this.keyBoard.addKeyEvent("#addRowAbove", [OfficeUtil.Strings.keyCodes.enter], insertAboveHandler);

        this.keyBoard.addKeyEvent("#addRowBelow", [OfficeUtil.Strings.keyCodes.enter], insertBelowHandler);

        this.keyBoard.addKeyEvent("#deleteRow", [OfficeUtil.Strings.keyCodes.enter], function () {
            ChartTableHelper.deleteRow(TableSelection.selectedRowIndex());
            _this.updateData();
            _this.drawTable();
            return false;
        });

        this.$insertColumnLeftButton = $("#insertColumnLeft").mouseleave(function () {
            _this.$insertColumnLeftButton.attr("src", Strings.tableIcons.insertColumnLeftButtonRest);
        }).mouseenter(function () {
            _this.$insertColumnLeftButton.attr("src", Strings.tableIcons.insertColumnLeftButtonActive);
        });
        this.$insertColumnRightButton = $("#insertColumnRight").mouseleave(function () {
            _this.$insertColumnRightButton.attr("src", Strings.tableIcons.insertColumnRightButtonRest);
        }).mouseenter(function () {
            _this.$insertColumnRightButton.attr("src", Strings.tableIcons.insertColumnRightButtonActive);
        });

        if (OfficeUtil.Util.isRtlLanguage()) {
            this.$insertColumnLeftButton.click(insertRightHandler);
            this.$insertColumnRightButton.click(insertLeftHandler);
        } else {
            this.$insertColumnLeftButton.click(insertLeftHandler);
            this.$insertColumnRightButton.click(insertRightHandler);
        }

        this.$insertRowAboveButton = $("#insertRowAbove").mouseleave(function () {
            _this.$insertRowAboveButton.attr("src", Strings.tableIcons.insertRowAboveButtonRest);
        }).mouseenter(function () {
            _this.$insertRowAboveButton.attr("src", Strings.tableIcons.insertRowAboveButtonActive);
        }).click(insertAboveHandler);
        this.$insertRowBelowButton = $("#insertRowBelow").mouseleave(function () {
            _this.$insertRowBelowButton.attr("src", Strings.tableIcons.insertRowBelowButtonRest);
        }).mouseenter(function () {
            _this.$insertRowBelowButton.attr("src", Strings.tableIcons.insertRowBelowButtonActive);
        }).click(insertBelowHandler);

        this.$selectAll = $("#selectAll").hover(function () {
            _this.$selectAll.addClass(Strings.tableCSS.selectAllSelected);
        }, function () {
            _this.$selectAll.removeClass(Strings.tableCSS.selectAllSelected);
        }).click(function () {
            TableSelection.selectAll();
        });

        // keyboard accessibility
        this.keyBoard.addKeyEvent("#selectAll", [OfficeUtil.Strings.keyCodes.enter], function () {
            TableSelection.selectAll();
        });

        $(".toolbar-icon").focusin(function (e) {
            $(_this).addClass("toolbar-icon-focus");
        }).focusout(function (e) {
            $(_this).removeClass("toolbar-icon-focus");
        });

        ChartTableHelper.setColumnHeaderVisibility();
        ChartTableHelper.setRowHeaderVisibility();

        // Above two functions invoked drawTable function, and add keypress listener in document.
        // Don't want to hit this event when this page don't be loaded. here remove the event listener
        // for workaround.
        ChartTableHelper.removeKeyDownListener();
    };

    /**
    * Update the table data
    */
    ChartTable.prototype.updateData = function () {
        this.tableData = ChartTableHelper.getTableData();
    };

    /**
    * Draw the editable table
    * the table is always one row and one column larger than data, and the minimal data size is 5x5
    * compared to data, two external rows/columns will be added:
    *   the first row shows the alphabet index of column (A, B, C and etc)
    *   the first column shows the number index of row (1, 2, 3 and etc)
    */
    ChartTable.prototype.drawTable = function () {
        var chartData = this.tableData;

        var rowCountOfTable = ChartTableHelper.rowCountOfRenderTable();
        var columnCountOfTable = ChartTableHelper.columnCountOfRenderTable();
        var rowCountOfData = ChartTableHelper.rowCountOfData();
        var columnCountOfData = ChartTableHelper.columnCountOfData();

        var needMinCountOfColumnWithBorder = columnCountOfData < this.settings.minCountOfColumnWithBorder;
        var needMinCountOfRowWithBorder = rowCountOfData < this.settings.minCountOfRowWithBorder;

        var $tr;
        var $td;

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
                    } else {
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
                        if ((needMinCountOfRowWithBorder) && r - rowOffset - 1 === this.settings.minCountOfRowWithBorder - 1 && c - colOffset - 1 < Math.max(columnCountOfData, this.settings.minCountOfColumnWithBorder)) {
                            $td.addClass(Strings.tableCSS.cellBottomBoundary);
                        }
                        if ((needMinCountOfColumnWithBorder) && c - colOffset - 1 === this.settings.minCountOfColumnWithBorder - 1 && r - rowOffset - 1 < Math.max(rowCountOfData, this.settings.minCountOfRowWithBorder)) {
                            $td.addClass(Strings.tableCSS.cellRightBoundary);
                        }

                        if (r - rowOffset - 1 < Math.max(rowCountOfData, this.settings.minCountOfRowWithBorder) && c - colOffset - 1 < Math.max(columnCountOfData, this.settings.minCountOfColumnWithBorder)) {
                            if (r - rowOffset - 1 < rowCountOfData && c - colOffset - 1 < columnCountOfData) {
                                var dataText = !chartData[r - rowOffset][c - colOffset] ? "" : "" + chartData[r - rowOffset][c - colOffset];
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
    };

    /**
    * Draw the generated buttons
    */
    ChartTable.prototype.drawButtons = function () {
        $(".horizontal-select-grip").remove();
        $(".vertical-select-grip").remove();
        this.hideButtons();

        ChartTableHelper.findTr(1).children().each(function (i, e) {
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
                    width: width + "px"
                });

                var $thick = $("<div/>").addClass("thick");
                var $thin = $("<div/>").addClass("thin");
                $thick.appendTo($columnSelectGrip);
                $thin.appendTo($columnSelectGrip);

                $columnSelectGrip.hover(function () {
                    $(this).addClass("select-grip-active");
                    $(this).children().hide();
                }, function () {
                    $(this).removeClass("select-grip-active");
                    $(this).children().show();
                });

                $columnSelectGrip.appendTo($("#dataTableDiv"));
            }
        });

        ChartTableHelper.findTr().each(function (i, e) {
            if (i !== 0 || ChartTable.getInstance().settings.showRowIndex) {
                var $td = $(e).children("td:eq(1)");
                var top = $td.offset().top + $("#tableFrame").scrollTop() - 167;
                var height = $td.outerHeight() - 2;

                var $rowSelectGrip = $("<div/>");
                $rowSelectGrip.addClass("vertical-select-grip").css({
                    top: top + "px",
                    height: height + "px"
                });

                var $thick = $("<div/>").addClass("thick");
                var $thin = $("<div/>").addClass("thin");
                $thick.appendTo($rowSelectGrip);
                $thin.appendTo($rowSelectGrip);

                $rowSelectGrip.hover(function () {
                    $(this).addClass("select-grip-active");
                    $(this).children().hide();
                }, function () {
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
            } else {
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
            } else {
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
    };

    /**
    * Hide the fixed buttons
    */
    ChartTable.prototype.hideButtons = function () {
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
    };

    /**
    * Show buttons of show headers
    */
    ChartTable.prototype.showButtonsOfShowHeaders = function () {
        this.$firstSeparator.show();
        this.$showColumnHeader.show();
        this.$showRowHeader.show();
    };

    /**
    * Hide buttons of show headers
    */
    ChartTable.prototype.hideButtonsOfShowHeaders = function () {
        this.$firstSeparator.hide();
        this.$showColumnHeader.hide();
        this.$showRowHeader.hide();
    };

    /**
    * Tear down the table and remove the listeners
    */
    ChartTable.prototype.destroyTable = function () {
        $("#dataTableDiv").children("table").remove();
        ChartTableHelper.removeTDListeners();
        ChartTableHelper.removeKeyDownListener();
    };
    return ChartTable;
})();
var DataPage = (function () {
    function DataPage() {
        var _this = this;
        this.$toolbar = $("#tableToolbar");
        this.$tableFrame = $("#tableFrame");
        this.$backBtn = $("#dataBackBtn");
        this.$selectDataBtn = $("#selectDataBtn");
        this.horizontalMarginToWindow = 105;
        this.verticalMarginToWindow = 180;
        this.page = 2 /* DataPage */;
        this.chartTable = ChartTable.getInstance();
        this.chartTable.initializeTableToolbar();

        DataSelection.getInstance().hideExternalButtonsOfShowHeaders();

        this.keyBoard = new KeyboardHelper();
        this.$tableFrame.css("width", $(window).outerWidth() - this.horizontalMarginToWindow).css("height", $(window).outerHeight() - this.verticalMarginToWindow);

        // Bind listeners
        this.$backBtn.click({ handler: PageHelper.backBtnHandler });

        this.$tableFrame.click(function () {
            ControlHelper.hideControl(ChartAgave.toolbarControl);

            // To avoid trigger toolbar
            return false;
        });

        if (OfficeUtil.Util.isPresentationView()) {
            this.$selectDataBtn.remove();
            $("#firstSeparator").remove();
        } else {
            this.$selectDataBtn.click(function () {
                ControlHelper.hideControl(ChartAgave.toolbarControl);

                // To dismiss the toolbar buttons
                ChartTableHelper.selectCell(ChartTableHelper.getCellByCoords({ row: 1, col: 1 }));
                _this.dataSelection = DataSelection.getInstance();
                _this.dataSelection.showDialog();
                return false;
            });
        }

        $(window).on("resize", function () {
            _this.$tableFrame.css("width", $(window).outerWidth() - _this.horizontalMarginToWindow).css("height", $(window).outerHeight() - _this.verticalMarginToWindow);
        });

        // Add keyboard accessibility.
        this.keyBoard.addKeyEvent("#dataBackBtn", [OfficeUtil.Strings.keyCodes.enter], PageHelper.backBtnHandler);

        this.keyBoard.addKeyEvent("#selectDataBtn", [OfficeUtil.Strings.keyCodes.enter], function () {
            ControlHelper.hideControl(ChartAgave.toolbarControl);

            // To dismiss the toolbar buttons
            ChartTableHelper.selectCell(ChartTableHelper.getCellByCoords({ row: 1, col: 1 }));
            _this.dataSelection = DataSelection.getInstance();
            _this.dataSelection.showDialog();
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
    DataPage.prototype.afterLoaded = function () {
        AgaveHelper.initBackbtn();

        // Hide settings command in toolbar in current page.
        $("#toolbarSettings").hide();
        ControlHelper.hideControl(ChartAgave.settingsControl);

        AccessibilityHelper.enableDataPageAccessibility();
        this.chartTable.drawTable();
    };

    /**
    * This method will be invoked before leaving this page.
    */
    DataPage.prototype.beforeLeave = function () {
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
    };
    DataPage.SelectionData = [];
    return DataPage;
})();
var Page;
(function (Page) {
    Page[Page["ChartPage"] = 0] = "ChartPage";
    Page[Page["ChartTypePage"] = 1] = "ChartTypePage";
    Page[Page["DataPage"] = 2] = "DataPage";
})(Page || (Page = {}));

var PageHelper = (function () {
    function PageHelper() {
    }
    /**
    * Navigate to the specified page
    */
    PageHelper.navigateToPage = function (page) {
        var $page;

        switch (page.page) {
            case 0 /* ChartPage */:
                $page = ChartAgave.$chartPage;
                break;
            case 1 /* ChartTypePage */:
                $page = ChartAgave.$chartTypePage;
                break;
            case 2 /* DataPage */:
                $page = ChartAgave.$dataPage;
                break;
            default:
                break;
        }

        if ($page !== undefined) {
            ChartAgave.currentPage && ChartAgave.currentPage.beforeLeave && ChartAgave.currentPage.beforeLeave();
            if (ChartAgave.toolbarControl !== undefined) {
                ControlHelper.hideControl(ChartAgave.toolbarControl, null, false);
            }
            page.beforeLoaded && page.beforeLoaded();
            $page.siblings().hide();
            $page.show();
            page.afterLoaded && page.afterLoaded();
            ChartAgave.currentPage = page;
        }
    };

    /**
    * Back to chart page
    */
    PageHelper.backBtnHandler = function () {
        PageHelper.navigateToPage(ChartAgave.chartPage);

        // To avoid invoke toolbar
        return false;
    };
    return PageHelper;
})();
var DataSelection = (function () {
    function DataSelection() {
        DataSelection.$createButton = $("#selectDataDivCreateBtn");
        DataSelection.$cancelButton = $("#selectDataDivCancelBtn").click(function () {
            DataSelection.getInstance().exitDataSelection();
            $("#selectDataBtn").focus();
            return false;
        });
        DataSelection.$dataSelectionBackground = $("#dataSelectionBackground").click(function () {
            DataSelection.getInstance().exitDataSelection();
            $("#selectDataBtn").focus();
            return false;
        });
        DataSelection.$selectDataDiv = $("#selectDataDiv").click(function () {
            return false;
        });

        DataSelection.$showExternalColumnHeader = $("#showExternalColumnHeader").click(function () {
            DataSelection.getInstance().toggleColumnHeader();
            return false;
        });
        DataSelection.$showExternalRowHeader = $("#showExternalRowHeader").click(function () {
            DataSelection.getInstance().toggleRowHeader();
            return false;
        });
    }
    DataSelection.getInstance = function () {
        if (!DataSelection.instance) {
            DataSelection.instance = new DataSelection();
        }

        return DataSelection.instance;
    };

    DataSelection.prototype.showDialog = function () {
        ChartTableHelper.removeKeyDownListener();
        AccessibilityHelper.enableDataSelectionAccessibility();
        DataSelection.$dataSelectionBackground.fadeIn("fast", function () {
            DataSelection.$selectDataDiv.fadeIn("fast");
            DataSelection.$cancelButton.focus();
        });
        DataSelection.$createButton.on("keyup", function (e) {
            if (e.keyCode === OfficeUtil.Strings.keyCodes.enter || e.keyCode === OfficeUtil.Strings.keyCodes.space) {
                DataSelection.getInstance().addDataBound();
                return false;
            }
        });

        DataSelection.$cancelButton.on("keyup", function (e) {
            if (e.keyCode === OfficeUtil.Strings.keyCodes.enter || e.keyCode === OfficeUtil.Strings.keyCodes.space) {
                DataSelection.getInstance().exitDataSelection();
                $("#selectDataBtn").focus();
                return false;
            }
        });
        this.selectionChangeHandler();
        Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, this.selectionChangeHandler);
    };

    DataSelection.prototype.enableCreateButton = function () {
        DataSelection.$createButton.removeAttr("disabled").addClass("enabled-button").off("click").on("click", function () {
            DataSelection.getInstance().addDataBound();
        });
    };

    DataSelection.prototype.disableCreateButton = function () {
        DataSelection.$createButton.attr("disabled", "disabled").removeClass("enabled-button").off("click");
    };

    DataSelection.prototype.exitDataSelection = function () {
        ChartTableHelper.addKeyDownListener();
        DataSelection.$selectDataDiv.fadeOut();
        DataSelection.$dataSelectionBackground.fadeOut();
        Office.context.document.removeHandlerAsync(Office.EventType.DocumentSelectionChanged, { handler: this.selectionChangeHandler });
        DataSelection.$createButton.off("keypress");
        DataSelection.$cancelButton.off("keypress");
        AccessibilityHelper.enableDataPageAccessibility();
    };

    DataSelection.prototype.setSelectionTip = function (rowCount, columnCount) {
        if (!rowCount || !columnCount) {
            $("#selectionTip").text(OfficeLocalization.Resources.getResourceString("SelectionTip")).css("color", "red");
        } else {
            $("#selectionTip").text(StringExtensions.format(OfficeLocalization.Resources.getResourceString("SelectionTip2"), rowCount, columnCount)).css("color", "green");
        }
    };

    DataSelection.prototype.setErrorMessage = function (message) {
        $("#selectionTip").text(message).css("color", "red");
    };

    DataSelection.prototype.selectionChangeHandler = function () {
        var self = DataSelection.getInstance();
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix, { valueFormat: Office.ValueFormat.Unformatted, filterType: Office.FilterType.OnlyVisible }, function (result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                var data = result.value;
                if (data != null && data.length >= 2 && data[0].length >= 2) {
                    self.setSelectionTip(data.length, data[0].length);
                    self.enableCreateButton();
                } else {
                    self.setSelectionTip();
                    self.disableCreateButton();
                }
            } else {
                self.setErrorMessage("failed: " + result.error.message);
            }
        });
    };

    DataSelection.prototype.addDataBound = function () {
        var self = DataSelection.getInstance();
        Office.context.document.bindings.releaseByIdAsync("MyBinding");
        Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Matrix, { id: "MyBinding" }, function (result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                var binding = Office.select("bindings#MyBinding");
                binding.addHandlerAsync(Office.EventType.BindingDataChanged, function () {
                    self.updateBindingData(true, false);
                });

                self.updateBindingData(false, true);
                ChartData.isDataBound = true;
            } else {
                self.setErrorMessage("failed: " + result.error.message);
            }
        });
    };

    DataSelection.prototype.removeDataBound = function () {
        Office.context.document.bindings.releaseByIdAsync("MyBinding");
        ChartData.isDataBound = false;
    };

    DataSelection.prototype.updateBindingData = function (refreshData, exitDataSelection) {
        if (typeof refreshData === "undefined") { refreshData = false; }
        if (typeof exitDataSelection === "undefined") { exitDataSelection = false; }
        var binding = Office.select("bindings#MyBinding");
        binding.getDataAsync({ coercionType: Office.CoercionType.Matrix }, function (result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                DataSelection.data = result.value;
                DataSelection.getInstance().setChartDataWithHeaderSettings();
                if (refreshData) {
                    Chart.refreshData();
                }
                if (exitDataSelection) {
                    var self = DataSelection.getInstance();
                    self.exitDataSelection();
                    self.showDataBoundPopup();
                    self.showExternalButtonsOfShowHeaders();
                    self.setColumnHeader(true);
                    self.setRowHeader(true);

                    ChartTable.getInstance().hideButtonsOfShowHeaders();
                    PageHelper.navigateToPage(ChartAgave.chartPage);
                }
            } else {
                self.setErrorMessage("failed: " + result.error.message);
            }
        });
    };

    DataSelection.prototype.showDataBoundPopup = function () {
        var _this = this;
        $("#tableFrameBackground").show();
        $("#tableFramePopup").show();
        $("#enableTableBtn").on("click", function () {
            _this.hideDataBoundPopup();
            _this.removeDataBound();
            ChartTable.getInstance().showButtonsOfShowHeaders();
            _this.hideExternalButtonsOfShowHeaders();

            return false;
        });
    };

    DataSelection.prototype.hideDataBoundPopup = function () {
        $("#tableFrameBackground").hide();
        $("#tableFramePopup").hide();
        $("#enableTableBtn").off("click");
    };

    DataSelection.prototype.showExternalButtonsOfShowHeaders = function () {
        $("#thirdSeparator").show();
        DataSelection.$showExternalColumnHeader.show();
        DataSelection.$showExternalRowHeader.show();
    };

    DataSelection.prototype.hideExternalButtonsOfShowHeaders = function () {
        $("#thirdSeparator").hide();
        DataSelection.$showExternalColumnHeader.hide();
        DataSelection.$showExternalRowHeader.hide();
    };

    DataSelection.prototype.toggleColumnHeader = function () {
        this.setColumnHeader(!DataSelection.showColumnHeader);
    };

    DataSelection.prototype.setColumnHeader = function (visible) {
        if (DataSelection.showColumnHeader === visible) {
            return;
        }

        DataSelection.showColumnHeader = visible;

        if (visible) {
            DataSelection.$showExternalColumnHeader.addClass(Strings.tableCSS.toolbarIconActive);
        } else {
            DataSelection.$showExternalColumnHeader.removeClass(Strings.tableCSS.toolbarIconActive);
        }

        DataSelection.getInstance().setChartDataWithHeaderSettings();
    };

    DataSelection.prototype.toggleRowHeader = function () {
        this.setRowHeader(!DataSelection.showRowHeader);
    };

    DataSelection.prototype.setRowHeader = function (visible) {
        if (DataSelection.showRowHeader === visible) {
            return;
        }

        DataSelection.showRowHeader = visible;
        if (visible) {
            DataSelection.$showExternalRowHeader.addClass(Strings.tableCSS.toolbarIconActive);
        } else {
            DataSelection.$showExternalRowHeader.removeClass(Strings.tableCSS.toolbarIconActive);
        }

        DataSelection.getInstance().setChartDataWithHeaderSettings();
    };

    DataSelection.prototype.setChartDataWithHeaderSettings = function () {
        if (!(DataSelection.data && DataSelection.data.length > 0 && DataSelection.data[0].length > 0)) {
            // Ideally, an exception should be thrown
            return;
        }

        if (DataSelection.showColumnHeader === undefined || DataSelection.showRowHeader === undefined) {
            return;
        }

        var shadowData = JSON.parse(JSON.stringify(DataSelection.data));

        if (!DataSelection.showColumnHeader) {
            for (var i = 0; i < shadowData.length; i++) {
                shadowData[i].splice(0, 0, "");
            }
        }

        if (!DataSelection.showRowHeader) {
            var row = [];
            for (var i = 0; i < shadowData[0].length; i++) {
                row.push("");
            }
            shadowData.splice(0, 0, row);
        }

        ChartData.setChartData(shadowData, !DataSelection.showColumnHeader, !DataSelection.showRowHeader);
    };
    return DataSelection;
})();
//# sourceMappingURL=ChartAgave.js.map
