interface IColors {
    name: string;
    values: string[];
}

interface ISettingOptions {
    title?: string;
    valueVisibility?: boolean;
    gridVisibility?: boolean;
    xAxisLabel?: string;
    yAxisLabel?: string;
    colors?: IColors;
    peopleLable?: string;
}