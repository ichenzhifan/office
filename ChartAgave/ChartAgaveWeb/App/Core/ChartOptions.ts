interface IChartOptions {
    settings: ISettingOptions;
    containerId: string;
    layer: any;
    dataRecords: string[];
    x: string[];
    y: string[];
    seriesNames: string[];
    height?: number;
    width?: number;
    stackType?: string;
    lineSize?: number;
    textSize?: number;
    opacity?: number;
    innerRadius?: number;
    outerMargin?: number;
    func?: (layer: any) => void;
} 