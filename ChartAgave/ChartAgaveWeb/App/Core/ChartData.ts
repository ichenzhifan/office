interface IData {
    categories: { name: string; data: any[] };
    series: { name: string; data: number[] }[];
}

interface IDataRecords {
    chartData: any[];
    peopleChartData: any[]
}

class ChartData {
    private static customizedData: IData;
    private static isColumnCategory: boolean;
    private static dataRecords: IDataRecords = null;

    public static isDataBound: boolean;
    public static isDataChanged: boolean = false;

    /**
    * Define sample data, which will be used when no user data.
    */
    private static sampleData(): IData {
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
    }

    /**
    * Get raw data.
    */
    public static get data() {
        return this.getChartData();
    }

    /**
    * Chart data records, which can be used to build chart.
    */
    public static get DataRecords() {
        if (this.dataRecords == null || this.isDataChanged) {
            this.isDataChanged = false;
            this.dataRecords = this.buildData();
        }

        return this.dataRecords;
    }

    /**
    * Return true if customized data is defined
    */
    public static isCustomizedDataDefined(): boolean {
        return ChartData.customizedData &&
            (ChartData.customizedData.categories.data.length > 0 || ChartData.customizedData.series.length > 0);
    }

    /**
    * Get chart data
    */
    public static getChartData(): IData {
        return ChartData.isCustomizedDataDefined() ? ChartData.customizedData : ChartData.sampleData();
    }

    /**
    * Set chart data
    */
    public static setChartData(data: any[][], autoColumnHeader = false, autoRowHeader = false) {
        this.isDataChanged = true;
        if (!data || data.length === 0) {
            ChartData.customizedData = { categories: { name: Strings.seriesName, data: [] }, series: [] };
            return;
        }

        var categories: string[] = [];
        var series: { name: string; data: number[] }[] = [];
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
            }
            else {
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
            }
            else {
                for (var r = 1; r < rowCount; r++) {
                    // Workaround: vuePlot treats all empty series name as the same one,
                    // generate an unique name to avoid this issue
                    var name = !data[r][0] || StringExtensions.isEmpty(data[r][0]) ? "Series" + r : data[r][0];
                    series.push({ name: name, data: [] });
                }
            }

            // Data
            for (var r = 0; r < series.length; r++) {
                for (var c = 0; c < categories.length; c++) {
                    var celltext = data[r + 1][c + 1];
                    // Workaround: to make vuePlot happy, set the data 0 when it is not a number
                    var cellData = !$.isNumeric(celltext) ? 0 : parseFloat(celltext);
                    series[r].data.push(cellData);
                }
            }
        }
        else {
            // Category name
            if (autoColumnHeader) {
                for (var r = 1; r < rowCount; r++) {
                    categories.push("" + r);
                }
            }
            else {
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
            }
            else {
                for (var c = 1; c < columnCount; c++) {
                    // Workaround: vuePlot treats all empty series name as the same one,
                    // generate an unique name to avoid this issue
                    var name = !data[0][c] || StringExtensions.isEmpty(data[0][c]) ? "Series" + c : data[0][c];
                    series.push({ name: name, data: [] });
                }
            }

            // Data
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
    }

    /**
    * Build chart data.
    */
    public static buildData(): IDataRecords{
        return {
            chartData: this.buildDataRecords(),
            peopleChartData: this.buildPeopleDataRecords()
        };
    }

    /**    
    * Build data which can be bound to chart from original selection data.
    */
    private static buildDataRecords() {
        // Object array to store all data after format.
        var records = [];       

        // Check whether has values.
        if (this.data.categories.data.length != 0) {

            // Declare a variable to store single record.
            // single record format: {category: "xx", coloumn1: "coloumn1", coloumn2: "coloumn2", coloumn3: "coloumn3"}          
            var singleRecord = {};

            // Loop row lenght.
            for (var r = 0; r < this.data.categories.data.length; r++) {
                // Reset singleRecord object for each loop.
                singleRecord = {};

                if (this.data.series.length != 0) {
                    for (var c = 0; c < this.data.series.length; c++) {
                        // Loop all series and add serie item to singleRecord.                   
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
    }

    /**    
    * Build data which can be bound to people chart from original selection data.
    */
    private static buildPeopleDataRecords() {
        // Object array to store all data after format.
        var peopleData: any[][] = [];      

        if (this.data != null && this.data.categories.data.length != 0) {
            this.data.categories.data.forEach((item, index) => {
                var singleRow: any[] = [];
                var value = this.data.series[0].data[index];
                if (value && value > 0) {
                    singleRow.push(item);
                    singleRow.push(value);
                    peopleData.push(singleRow);
                }
            });
        }

        return peopleData;
    }
}