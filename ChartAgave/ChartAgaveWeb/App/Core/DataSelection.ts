class DataSelection {
    private static $dataSelectionBackground: JQuery;
    private static $selectDataDiv: JQuery;
    private static $createButton: JQuery;
    private static $cancelButton: JQuery;
    private static $showExternalColumnHeader: JQuery;
    private static $showExternalRowHeader: JQuery;

    private static data: any[][];

    private static showColumnHeader: boolean;
    private static showRowHeader: boolean;

    private static instance: DataSelection;

    public static getInstance(): DataSelection {
        if (!DataSelection.instance) {
            DataSelection.instance = new DataSelection();
        }

        return DataSelection.instance;
    }

    constructor() {
        DataSelection.$createButton = $("#selectDataDivCreateBtn");
        DataSelection.$cancelButton = $("#selectDataDivCancelBtn").click(() => {
            DataSelection.getInstance().exitDataSelection();
            $("#selectDataBtn").focus();
            return false;
        });
        DataSelection.$dataSelectionBackground = $("#dataSelectionBackground").click(() => {
            DataSelection.getInstance().exitDataSelection();
            $("#selectDataBtn").focus();
            return false;
        });
        DataSelection.$selectDataDiv = $("#selectDataDiv").click(() => {
            return false;
        });

        DataSelection.$showExternalColumnHeader = $("#showExternalColumnHeader").click(() => {
            DataSelection.getInstance().toggleColumnHeader();
            return false;
        });
        DataSelection.$showExternalRowHeader = $("#showExternalRowHeader").click(() => {
            DataSelection.getInstance().toggleRowHeader();
            return false;
        });
    }

    public showDialog() {
        ChartTableHelper.removeKeyDownListener();
        AccessibilityHelper.enableDataSelectionAccessibility();
        DataSelection.$dataSelectionBackground.fadeIn("fast", () => {
            DataSelection.$selectDataDiv.fadeIn("fast");
            DataSelection.$cancelButton.focus();
        })
         DataSelection.$createButton.on("keyup", (e) => {
            if (e.keyCode === OfficeUtil.Strings.keyCodes.enter ||
                e.keyCode === OfficeUtil.Strings.keyCodes.space) {
                DataSelection.getInstance().addDataBound();
                return false;
            }
        });

        DataSelection.$cancelButton.on("keyup", (e) => {
            if (e.keyCode === OfficeUtil.Strings.keyCodes.enter ||
                e.keyCode === OfficeUtil.Strings.keyCodes.space) {
                DataSelection.getInstance().exitDataSelection();
                $("#selectDataBtn").focus();
                return false;
            }
        });
        this.selectionChangeHandler();
        Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, this.selectionChangeHandler);       
    }

    public enableCreateButton() {
        DataSelection.$createButton
            .removeAttr("disabled")
            .addClass("enabled-button")
            .off("click")
            .on("click", () => {
                DataSelection.getInstance().addDataBound();
            });
    }

    public disableCreateButton() {
        DataSelection.$createButton
            .attr("disabled", "disabled")
            .removeClass("enabled-button")
            .off("click");
    }

    public exitDataSelection() {
        ChartTableHelper.addKeyDownListener();
        DataSelection.$selectDataDiv.fadeOut();
        DataSelection.$dataSelectionBackground.fadeOut();
        Office.context.document.removeHandlerAsync(Office.EventType.DocumentSelectionChanged, { handler: this.selectionChangeHandler });
        DataSelection.$createButton.off("keypress");
        DataSelection.$cancelButton.off("keypress");
        AccessibilityHelper.enableDataPageAccessibility();
    }

    public setSelectionTip(rowCount?: number, columnCount?: number) {
        if (!rowCount || !columnCount) {
            $("#selectionTip")
                .text(OfficeLocalization.Resources.getResourceString("SelectionTip"))
                .css("color", "red");
        }
        else {
            $("#selectionTip")
                .text(StringExtensions.format(OfficeLocalization.Resources.getResourceString("SelectionTip2"), rowCount, columnCount))
                .css("color", "green");
        }
    }

    public setErrorMessage(message: string) {
        $("#selectionTip").text(message).css("color", "red");
    }

    private selectionChangeHandler() {
        var self = DataSelection.getInstance();
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix,
            { valueFormat: Office.ValueFormat.Unformatted, filterType: Office.FilterType.OnlyVisible },
            (result) => {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    var data: any[][] = result.value;
                    if (data != null && data.length >= 2 && data[0].length >= 2) {
                        self.setSelectionTip(data.length, data[0].length);
                        self.enableCreateButton();
                    }
                    else {
                        self.setSelectionTip();
                        self.disableCreateButton();
                    }
                }
                else {
                    self.setErrorMessage("failed: " + result.error.message);
                }
            });
    }

    public addDataBound() {
        var self = DataSelection.getInstance();
        Office.context.document.bindings.releaseByIdAsync("MyBinding");
        Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Matrix,
            { id: "MyBinding" },
            (result) => {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    var binding: Microsoft.Office.WebExtension.Binding = Office.select("bindings#MyBinding");
                    binding.addHandlerAsync(Office.EventType.BindingDataChanged, () => {
                        self.updateBindingData(true, false);
                    });

                    self.updateBindingData(false, true);
                    ChartData.isDataBound = true;
                }
                else {
                    self.setErrorMessage("failed: " + result.error.message);
                }
            });
    }

    public removeDataBound() {
        Office.context.document.bindings.releaseByIdAsync("MyBinding");
        ChartData.isDataBound = false;
    }

    private updateBindingData(refreshData = false, exitDataSelection = false) {
        var binding: Microsoft.Office.WebExtension.Binding = Office.select("bindings#MyBinding");
        binding.getDataAsync({ coercionType: Office.CoercionType.Matrix }, (result) => {
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
            }
            else {
                self.setErrorMessage("failed: " + result.error.message);
            }
        });
    }

    private showDataBoundPopup() {
        $("#tableFrameBackground").show();
        $("#tableFramePopup").show();
        $("#enableTableBtn").on("click", () => {
            this.hideDataBoundPopup();
            this.removeDataBound();
            ChartTable.getInstance().showButtonsOfShowHeaders();
            this.hideExternalButtonsOfShowHeaders();

            return false;
        });
    }

    private hideDataBoundPopup() {
        $("#tableFrameBackground").hide();
        $("#tableFramePopup").hide();
        $("#enableTableBtn").off("click");
    }

    public showExternalButtonsOfShowHeaders() {
        $("#thirdSeparator").show();
        DataSelection.$showExternalColumnHeader.show();
        DataSelection.$showExternalRowHeader.show();
    }

    public hideExternalButtonsOfShowHeaders() {
        $("#thirdSeparator").hide();
        DataSelection.$showExternalColumnHeader.hide();
        DataSelection.$showExternalRowHeader.hide();
    }

    private toggleColumnHeader(): void {
        this.setColumnHeader(!DataSelection.showColumnHeader);
    }

    private setColumnHeader(visible: boolean): void {
        if (DataSelection.showColumnHeader === visible) {
            return;
        }

        DataSelection.showColumnHeader = visible;
        
        if (visible) {
            DataSelection.$showExternalColumnHeader.addClass(Strings.tableCSS.toolbarIconActive);
        }
        else {
            DataSelection.$showExternalColumnHeader.removeClass(Strings.tableCSS.toolbarIconActive);
        }

        DataSelection.getInstance().setChartDataWithHeaderSettings();
    }

    private toggleRowHeader(): void {
        this.setRowHeader(!DataSelection.showRowHeader);
    }

    private setRowHeader(visible: boolean): void {
        if (DataSelection.showRowHeader === visible) {
            return;
        }

        DataSelection.showRowHeader = visible;
        if (visible) {
            DataSelection.$showExternalRowHeader.addClass(Strings.tableCSS.toolbarIconActive);
        }
        else {
            DataSelection.$showExternalRowHeader.removeClass(Strings.tableCSS.toolbarIconActive);
        }

        DataSelection.getInstance().setChartDataWithHeaderSettings();
    }

    private setChartDataWithHeaderSettings(): void {
        if (!(DataSelection.data && DataSelection.data.length > 0 && DataSelection.data[0].length > 0)) {
            // Ideally, an exception should be thrown
            return;
        }

        if (DataSelection.showColumnHeader === undefined || DataSelection.showRowHeader === undefined) {
            return;
        }

        var shadowData: any[][] = JSON.parse(JSON.stringify(DataSelection.data));

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
    }
}