//-----------------------------------------------------------------------------------------------------------------
// VuePlotCore.d.ts    Copyright 2014 Microsoft Corporation.
//      TypeScript API for VuePlotCore - an HTML 5 / Javascript low level library for building visualizations.
//-----------------------------------------------------------------------------------------------------------------
//"use strict";

declare module vp {
}
/** used to extend array class with new functions. */
interface Array<T> {
    distinct(itemFunc?: any): T[];
    generate(container: any, tagName: string, callBack?: any): any[];
    groupBy(groupCol: string): T[];
    max(itemFunc?: any): number;
    min(itemFunc?: any): number;
    orderByNum(keyFunc?: any): T[];
    orderByStr(keyFunc?: any): T[];
    remove(elem: any): void;
    removeAt(index: number): void;
    sum(itemFunc?: any): number;
    take(amt: any): T[];
    insert(index: number, value: any): void;
    where(itemFunc?: any): T[];
}

///----------------------------------------------------------------
/// (from _helpers\colorPalettes.d.ts)
///----------------------------------------------------------------
declare module vp.colorPalettes {
    function blueRed(): any[];
    function redGreen(): any[];
    function surface(): string[];
    function grays(steps: any, startPercent: any, endPercent: any): any[];
    function reds(steps: any): any[];
    function greens(steps: any): any[];
    function rainbow(steps: any): any[];
    function rainbowPairs(steps: any): any[];
    function darkLight(color1: any): any[];
    function darkLightDark(cr: any, cr2: any): any[][];
    function lightDark(color1: any): any[];
    function hueSteps(color: any, steps: any): any[];
    function analogs(color: any): any[];
    function shades(color: any, count: any, startPercent?: any, endPercent?: any): any[];
}

///----------------------------------------------------------------
/// (from _helpers\dataUtils.d.ts)
///----------------------------------------------------------------
declare module vp.data {
    function clamp(value: any, min: any, max: any): any;
    function dataPairHolder(dataItem: any, dataIndex: any): {
        dataItem: any;
        dataIndex: any;
    };
    function dataRepeat(value: any, count: any): any[];
    function lerp(percent: any, a: any, b: any): any;
    function makeLastData(data: any[]): any[];
    function generateItems(root: any, tagName: any, data: any): any;
    function dataJoin(data: any, name1: any): any[];
    function dataFrame(desc: any): any[];
    function dataSelect(data: any, field: any): any[];
    /**  builds a matrix of records in X and Y, dim size x size, with a "value" field that has some peaks and valleys. */
    function peaks(size: any, flatten: any): any[];
}

///----------------------------------------------------------------
/// (from _helpers\hsl.d.ts)
///----------------------------------------------------------------
declare module vp.color {
    class hsl {
        public _hue: number;
        public _saturation: number;
        public _lightness: number;
        public _alpha: number;
        constructor(hue: number, saturation: number, lightness: number, alpha?: number);
        public toRgb(): any[];
        public toString(): string;
        public lighten(): hsl;
        public darken(): hsl;
        public hue(): number;
        public saturation(): number;
        public lightness(): number;
        public alpha(): number;
    }
    function hslFromRgb(rgb: any): hsl;
    function rgbFromHsl(hsl: any, ...args: any[]): any[];
    function hueToRgb(m1: any, m2: any, h: any): any;
    function normalizeHue(value: any): any;
}

///----------------------------------------------------------------
/// (from _helpers\math.d.ts)
///----------------------------------------------------------------
declare module vp {
}
/** used to extend MATH class with new functions. */
interface Math {
    log10(value: number): number;
}

///----------------------------------------------------------------
/// (from _helpers\scanner.d.ts)
///----------------------------------------------------------------
declare module vp.utils {
    enum tokenType {
        none = 0,
        operator = 1,
        id = 2,
        string = 3,
        number = 4,
        comment = 5,
        newLine = 6,
        space = 7,
        eof = 8,
    }
    class scanner {
        public _index: number;
        public _tokenType: tokenType;
        public _token: string;
        public _spacesSkipped: number;
        public _str: string;
        constructor(str?: string);
        public init(str: string): void;
        public tokenType(): tokenType;
        public spacesSkipped(): boolean;
        public token(): string;
        private isStartOfNum(str, ch, index);
        public isDigitChar(ch: string, isFirst: boolean): boolean;
        public scan(): tokenType;
    }
}

///----------------------------------------------------------------
/// (from _helpers\string.d.ts)
///----------------------------------------------------------------
declare module vp {
}
/** used to extend string class with new functions. */
interface String {
    startsWith(prefix: string): boolean;
    endsWith(suffix: string): boolean;
    ltrim(): string;
    rtrim(): string;
    contains(substr: string): boolean;
    capitalize(): string;
}

///----------------------------------------------------------------
/// (from _helpers\utilities.d.ts)
///----------------------------------------------------------------
declare module vp.utils {
    function cb(thisObj: any, func: any): any;
    /** When set to a function, the function is called before an error is reported. */
    var onError: any;
    function error(msg: any, lineNum?: any): void;
    function jsonToStr(obj: any): string;
    function getFileExtension(name: string): string;
    function jsonFromStr(str: string): any;
    function float32Array(length: any): any;
    function int32Array(length: any): any;
    function toRadians(value: number): number;
    function toHex2(value: number): string;
    function makeCtxColorStr(cr3: any): string;
    function cancelEventDefault(e: any): void;
    function cancelEventBubble(e: any): void;
    function argumentsAsArray(args: any): any[];
    function setTimer(interval: number, callback: any): number;
    function clearTimer(handle: number): void;
    function setOneShotTimer(interval: number, callback: any): number;
    function clearOneShotTimer(handle: number): void;
    function globalEval(js: any, wantReturn: any): any;
    function mapValue(value: any, fromMin: any, fromMax: any, toMin: any, toMax: any): any;
    function range(from: number, to?: number, incr?: number): any[];
    function getCmdParams(cmd: any): any;
    function getUrlParams(): any;
    function getUrlDirectory(): string;
    var epsilon: number;
    function floatLeq(a: any, b: any): boolean;
    function floatLess(a: any, b: any): boolean;
    function floatGeq(a: any, b: any): boolean;
    function floatEq(a: any, b: any): boolean;
    function keys(obj: any): string[];
    function hasKey(obj: any): boolean;
    function numberOfKeys(theObject: any): number;
    function measureText(text: any, spanClass: any): {
        width: number;
        height: number;
    };
    function measureSvgText(svgNode: any, text: any, className: any): {
        width: number;
        height: number;
    };
    function routePropCalls(from: any, to: any): void;
    function routeFuncCalls(from: any, to: any): void;
    function routePropCallsPost(from: any, to: any, postCall: any): void;
    function generateFunc(args: any, body: any, maker: any): any;
    function deepCopy(objectToCopy: any): any;
    function getCanvasOrSvgParent(elem: any): any;
    function getCrispTranslate(container: any, x: number, y: number): {
        x: number;
        y: number;
    };
}
declare module vp.marks {
    /** Base class for all other mark classes. */
    class markBaseClass {
        public _container: any;
        public _groupElem: any;
        public _dataAnimMgr: animation.dataAnimMgrExClass;
        public _keyFunc: (record: any, index: number) => string;
        public _seriesIndex: number;
        public _seriesCount: number;
        public _animationDuraton: number;
        public _containerType: containerType;
        public _onShaderCallback: (element: HTMLElement, record: any, index: number, isNew: boolean, context: any) => any;
        public _glBuilder: glBuilderClass;
        public _jsParser: jsParserClass;
        public _data: any;
        public _fromGlParams: any;
        public _shapeName: string;
        public _glShapeName: string;
        public _className: string;
        public _computedStyle: any;
        constructor(container: HTMLElement, shapeName: string, glShapeName?: string, useWebGl?: boolean, className?: string);
        public groupElem(): any;
        public translate(x: number, y: number, makeCrispAdjustment?: boolean): markBaseClass;
        public onUpdate(): any;
        public onUpdate(callback: (element: any, record: any, index: number, isNew: boolean) => any): markBaseClass;
        public onShade(): any;
        public onShade(callback: (element: any, record: any, index: number, isNew: boolean) => any): markBaseClass;
        public update(...args: any[]): void;
        public generate(data: any[], ...args: any[]): void;
        public applyClass(elem: any): void;
        public postProcessShape(element: HTMLElement): void;
        public clear(): void;
        public eraseCanvas(): void;
    }
    enum containerType {
        svg = 0,
        canvasElem = 1,
        canvasGroup = 2,
        glCanvas = 3,
        glGroup = 4,
    }
}

///----------------------------------------------------------------
/// (from _marks\circleMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of SVG/Canvas CIRCLE primitives.  Can be used with animations.  Core function
    is "update()". */
    class circleMarkClass extends markBaseClass {
        constructor(container: HTMLElement, className?: string);
    }
    function createCircleMark(container: HTMLElement, className?: string): circleMarkClass;
}

///----------------------------------------------------------------
/// (from _marks\ellipseMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of SVG/Canvas ellipse primitives.  Can be used with animations.  Core function
    is "update()". */
    class ellipseMarkClass extends markBaseClass {
        constructor(container: HTMLElement, className?: string);
    }
    function createEllipseMark(container: HTMLElement, className?: string): ellipseMarkClass;
}

///----------------------------------------------------------------
/// (from _marks\glBuilder.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** WebGL helper class for marks. */
    class glBuilderClass {
        public _gl: any;
        public _shaderProgram: any;
        public _vertexBuffer: any;
        public _canvas: HTMLCanvasElement;
        public _trans3d: plotBox.transform3dClass;
        public _animation: any;
        public _usingPosition: boolean;
        public _shapeVertices: any;
        public _usingWidth: boolean;
        public _glShapeName: string;
        public _randomVectors: {};
        public _animStartTime: number;
        public _animFrameCount: number;
        public _animFPS: number;
        public _shapesDrawn: number;
        public _statsCallback: any;
        constructor(canvas: HTMLCanvasElement, glShapeName: any);
        public init(data: any[], glParams: any, fromGlParams: any): void;
        public updateScreenSize(w: number, h: number): void;
        public buildVertexShader(glParams: any, fromGlParams: any): string;
        public fragShader(): string;
        public clear(): void;
        public drawScene(data: any[], transition: transitionClass, glParams: any, fromGlParams: any): void;
        public drawSceneFrame(percent: number): void;
        public applyShaderParams(shader: string, glParams: any, fromGlParams: any): string;
        public getShader(gl: any, id: any, glParams: any, fromGlParams: any): any;
        public initShaders(glParams: any, fromGlParams: any): void;
        public setShaderConstants(glParams: any, fromGlParams: any): void;
        public initBuffers(data: any[], glParams: any, fromGlParams: any): void;
        public getRandomVector(name: string, count: number): number[];
        public setPointVertices(data: any[]): number;
        public setTriangleVertices(data: any[]): number;
        public setRect2dVertices(data: any[]): number;
        public setLine2dVertices(data: any[]): number;
        public statsCallback(value: any): glBuilderClass;
    }
}

///----------------------------------------------------------------
/// (from _marks\groupMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of SVG/Canvas group primitives.  Can be used with animations.  Core function
    is "update()". */
    class groupMarkClass extends markBaseClass {
        constructor(container: HTMLElement, className?: string);
    }
    function createGroupMark(container: HTMLElement, className?: string): groupMarkClass;
}

///----------------------------------------------------------------
/// (from _marks\imageMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of SVG/Canvas image primitives.  Can be used with animations.  Core function
    is "update()". */
    class imageMarkClass extends markBaseClass {
        constructor(container: HTMLElement, className?: string);
    }
    function createImageMark(container: HTMLElement, className?: string): imageMarkClass;
}

///----------------------------------------------------------------
/// (from _marks\jsParser.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Used to translate JavaScript shader functions into GL shader statements and expressions. */
    class jsParserClass {
        public _context: any;
        constructor();
        public makeRecordColumnName(name: string): string;
        public colorToGlColor(ca: any): any;
        public removeQuotes(name: any): any;
        public fixupNumber(value: string): string;
        public processRecordColumn(token: string, attrBlock: any): string;
        public translateExp(line: string, usage: string, attrBlock: any): string;
        public translateJsStatements(lines: string[], attrBlock: any): void;
        public translateAttrCall(line: string, attrBlock: any): void;
        public getGlParams(shaderCallback: any, context: any): {
            size: string;
            width: string;
            height: string;
            fill: number[];
            stroke: number[];
            x: string;
            y: string;
            opacity: string;
            strokeSize: number;
            cmds: string;
            origColNames: any[];
            dataColNames: any[];
            randomColNames: any[];
            functions: string;
        };
    }
}

///----------------------------------------------------------------
/// (from _marks\lineMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of SVG/Canvas line primitives.  Can be used with animations.  Core function
    is "update()". */
    class lineMarkClass extends markBaseClass {
        constructor(container: HTMLElement, className?: string);
    }
    function createLineMark(container: HTMLElement, className?: string): lineMarkClass;
}

///----------------------------------------------------------------
/// (from _marks\pathMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of SVG/Canvas path primitives.  Can be used with animations.  Core function
    is "update()". */
    class pathMarkClass extends markBaseClass {
        constructor(container: HTMLElement, className?: string);
    }
    function createPathMark(container: HTMLElement, className?: string): pathMarkClass;
}

///----------------------------------------------------------------
/// (from _marks\pointMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of WebGL POINT primitives.  Can be used with animations.  Core function
    is "update()". */
    class pointMarkClass extends markBaseClass {
        constructor(container: HTMLElement, useWebGl?: boolean, className?: string);
        public postProcessShape(element: HTMLElement): void;
    }
    function createPointMark(container: HTMLElement, className?: string): pointMarkClass;
}

///----------------------------------------------------------------
/// (from _marks\rect2dMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of WebGL rect2d primitives.  Can be used with animations.  Core function
    is "update()". */
    class rect2dMarkClass extends markBaseClass {
        constructor(container: HTMLElement, useWebGl?: boolean, className?: string);
        public postProcessShape(element: HTMLElement): void;
    }
    function createRect2dMark(container: HTMLElement, useWebGl?: boolean, className?: string): rect2dMarkClass;
}

///----------------------------------------------------------------
/// (from _marks\rectangleMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of SVG/Canvas RECT primitives.  Can be used with animations.  Core function
    is "update()". */
    class rectangleMarkClass extends markBaseClass {
        constructor(container: HTMLElement, className?: string);
    }
    function createRectangleMark(container: HTMLElement, className?: string): rectangleMarkClass;
}

///----------------------------------------------------------------
/// (from _marks\textMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of SVG/Canvas text primitives.  Can be used with animations.  Core function
    is "update()". */
    class textMarkClass extends markBaseClass {
        constructor(container: HTMLElement, className?: string);
    }
    function createTextMark(container: HTMLElement, className?: string): textMarkClass;
}

///----------------------------------------------------------------
/// (from _marks\transition.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of SVG text primitives.  Can be used with animations.  Core function
    is "update()". */
    class transitionClass {
        public _animDuration: number;
        public _animEasing: any;
        public _delay: number;
        public _primaryKey: any;
        public _enter: {
            fadeType: any;
            slideLoc: any;
            growOrigin: any;
            rotateAngle: any;
            rotateCx: any;
            rotateCy: any;
        };
        public _exit: {
            fadeType: any;
            slideLoc: any;
            growOrigin: any;
            rotateAngle: any;
            rotateCx: any;
            rotateCy: any;
        };
        public _update: any;
        constructor();
        /** The primary key can be a column name, or a function that returns a unique ID string for each record. */
        public primaryKey(): any;
        public primaryKey(columnOrFunc: any): transitionClass;
        public duration(): number;
        public duration(ms: number): transitionClass;
        public delay(): number;
        public delay(ms: number): transitionClass;
        public enter(): any;
        public enter(effect: any): transitionClass;
        public exit(): any;
        public exit(effect: any): transitionClass;
        public update(): any;
        public update(effect: any): transitionClass;
        public easing(): any;
        public easing(ease: any): transitionClass;
    }
    function createTransition(): transitionClass;
}

///----------------------------------------------------------------
/// (from _marks\triangleMark.d.ts)
///----------------------------------------------------------------
declare module vp.marks {
    /** Supports data-based generation of WebGL triangle primitives.  Can be used with animations.  Core function
    is "update()". */
    class triangleMarkClass extends markBaseClass {
        constructor(container: HTMLElement, className?: string);
        public postProcessShape(element: HTMLElement): void;
    }
    function createTriangleMark(container: HTMLElement, className?: string): triangleMarkClass;
}
declare module vp.dom {
    class selectedSet implements IWrapper<selectedSet> {
        public animation: any;
        public ctr: string;
        public length: number;
        public push: (...items: any[]) => number;
        public sort: (compareFn?: (a: any, b: any) => number) => any[];
        public splice: {
            (start: number): any[];
            (start: number, deleteCount: number, ...items: any[]): any[];
        };
        public indexOf: (searchElement: any, fromIndex?: number) => number;
        constructor(elements?: any);
        public frameRateChanged(fpsCallBack: any): selectedSet;
        public add(content: any): singleWrapperClass;
        public clear(): selectedSet;
        public show(): boolean;
        public show(showIt: boolean): selectedSet;
        public showToggle(): selectedSet;
        public hide(): boolean;
        public hide(showIt: boolean): selectedSet;
        public collapse(): selectedSet;
        public expand(): selectedSet;
        public docOffset(elem: any): any;
        public left(): number;
        public left(value: number): selectedSet;
        public top(): number;
        public top(value: number): selectedSet;
        public width(): any;
        public width(value: any): selectedSet;
        public css(name: string): string;
        public css(name: string, value: any): selectedSet;
        public height(): any;
        public height(value: any): selectedSet;
        public totalHeight(): number;
        public totalWidth(): number;
        public toolTipEnabled(): boolean;
        public toolTipEnabled(value: boolean): selectedSet;
        public animate(duration?: number, ease?: any, container?: any): selectedSet;
        public onAnimationComplete(completedFunc: any): selectedSet;
        public remove(): selectedSet;
        public attr(name: string): string;
        public attr(name: string, value: string): selectedSet;
        public attr(name: string, value: number): selectedSet;
        public prop(name: any, value: any): any;
        public attrXlink(name: any, origValue: any): selectedSet;
        public attrNS(ns: any, name: any, value: any): selectedSet;
        public hLine(x1: number, x2: number, y: number, makeCrisp: boolean): selectedSet;
        public vLine(y1: number, y2: number, x: number, makeCrisp: boolean): selectedSet;
        public bounds(x: any, y: any, width: any, height: any): selectedSet;
        public radius(): number;
        public radius(value: number): selectedSet;
        public tabIndex(): string;
        public tabIndex(value: string): selectedSet;
        public opacity(): number;
        public opacity(value: number): selectedSet;
        public checked(): number;
        public checked(value: number): selectedSet;
        public position(x: any, y: any): selectedSet;
        public absPosition(left: any, top: any): selectedSet;
        public removeProp(name: any): selectedSet;
        public center(cx: any, cy: any): selectedSet;
        public id(): string;
        public id(value: string): selectedSet;
        public addClass(name: any): selectedSet;
        public removeClass(name: any): selectedSet;
        public hasClass(name: any): boolean;
        public getBounds(relToParent: HTMLElement): any;
        public setClass(name: any): selectedSet;
        public toggleClass(name: any): selectedSet;
        public attach(eventName: string, funcToCall: any, useCapture?: boolean): selectedSet;
        public detach(eventName: string, funcToCall: any, useCapture?: boolean): selectedSet;
        public transform(): string;
        public transform(value: string): selectedSet;
        public translate(x: any, y: any, makeCrisp?: boolean): selectedSet;
        public transformOrigin(): string;
        public transformOrigin(value: string): selectedSet;
        public addStop(offset: any, color: string, opacity?: number): selectedSet;
        public textBaseline(alignType: string, rc?: SVGRect): selectedSet;
        public from(x1: any, y1: any): selectedSet;
        public to(x2: any, y2: any): selectedSet;
        public font(family: any, size: any, weight: any, style: any): selectedSet;
        public dataPair(dataItem: any, dataIndex: any): selectedSet;
        public data(): any[];
        public data(value: any[]): selectedSet;
        public dataItem(): any;
        public dataItem(dataItem: any): selectedSet;
        public dataIndex(): number;
        public dataIndex(value: number): selectedSet;
        public customAttr(name: any): string;
        public customAttr(name: any, value: string): selectedSet;
        public text(): string;
        public text(value: string): selectedSet;
        public title(): string;
        public title(value: string): selectedSet;
        public value(): string;
        public value(value: string): selectedSet;
        public html(): string;
        public html(value: string): selectedSet;
        public colors(fill: any, stroke: any, strokeWidth: any): selectedSet;
        public href(): string;
        public href(value: string): selectedSet;
        public safeHref(value: any, fallback: any): selectedSet;
        public kids(): selectedSet;
        public elementSizes(callBack: any): any;
        public background(): string;
        public background(value: string): selectedSet;
        public focus(): selectedSet;
        public dataId(): string;
        public dataId(value: string): selectedSet;
        public shapeId(): string;
        public shapeId(value: string): selectedSet;
        public get(index: any): any;
        public element(): any;
        public wrap(index: any): any;
        public toArray(): any[];
        public each(callback: any): selectedSet;
        public eachWrapped(callback: any): selectedSet;
        public merge(elemOrArray: any): selectedSet;
        private removeCore(content);
        public append<T>(content: T): T;
        public append(content: string): singleWrapperClass;
        public prepend(content: any): singleWrapperClass;
        public insertBefore(content: any): singleWrapperClass;
        public insertAfter(content: any): singleWrapperClass;
        public context(origRequest: any): any;
    }
}

///----------------------------------------------------------------
/// (from _dom\$singleWrapper.d.ts)
///----------------------------------------------------------------
declare module vp.dom {
    interface IWrapper<T> {
        length: number;
        background(): string;
        background(value: string): T;
        width(): any;
        width(value: any): T;
        height(): any;
        height(value: any): T;
        dataId(): string;
        dataId(value: string): T;
        shapeId(): string;
        shapeId(value: string): T;
        text(): string;
        text(value: string): T;
        value(): string;
        value(value: string): T;
        title(): string;
        title(value: string): T;
        html(): string;
        html(value: string): T;
        show(): boolean;
        show(value: boolean): T;
        hide(): boolean;
        hide(value: boolean): T;
        data(): any[];
        data(value: any[]): T;
        dataItem(): any;
        dataItem(value: any): T;
        dataIndex(): number;
        dataIndex(value: number): T;
        attr(name: string): string;
        attr(name: string, value: string): T;
        attr(name: string, value: number): T;
        css(name: string): string;
        css(name: string, value: string): T;
        href(): string;
        href(value: string): T;
        id(): string;
        id(value: string): T;
        checked(): number;
        checked(value: number): T;
        left(): number;
        left(value: number): T;
        top(): number;
        top(value: number): T;
        transform(): string;
        transform(value: string): T;
        transformOrigin(): string;
        transformOrigin(value: string): T;
        opacity(): number;
        opacity(value: number): T;
        radius(): number;
        radius(value: number): T;
        tabIndex(): string;
        tabIndex(value: string): T;
        toolTipEnabled(): boolean;
        toolTipEnabled(value: boolean): T;
        customAttr(name: string): string;
        customAttr(name: string, value: string): T;
        append(content: string): singleWrapperClass;
        append(content: HTMLElement): singleWrapperClass;
        append<T>(content: T): T;
        add(content: any): singleWrapperClass;
        prepend(content: any): singleWrapperClass;
        insertBefore(content: any): singleWrapperClass;
        insertAfter(content: any): singleWrapperClass;
        element(): any;
        safeHref(value: string, fallback: string): any;
        bounds(x: number, y: number, width: number, height: number): T;
        colors(fill: string, stroke: string, strokeWidth: any): T;
        collapse(): T;
        expand(): T;
        totalHeight(): number;
        totalWidth(): number;
        hLine(x1: number, x2: number, y: number, makeCrisp: boolean): T;
        vLine(y1: number, y2: number, x: number, makeCrisp: boolean): T;
        textBaseline(alignType: string, rc?: SVGRect): T;
        setClass(value: string): T;
        hasClass(value: string): boolean;
        addClass(value: string): T;
        removeClass(value: string): T;
        toggleClass(value: string): T;
        translate(x: number, y: number, makeCrisp?: boolean): T;
        attach(name: string, callback: any, useCapture?: boolean): T;
        detach(name: string, callback: any, useCapture?: boolean): T;
        clear(): T;
        remove(): T;
        animate(duration?: number, ease?: any, container?: any): T;
        onAnimationComplete(callback: any): any;
        toArray(): any[];
        kids(): selectedSet;
        showToggle(): T;
        dataPair(dataItem: any, dataIndex: number): T;
        from(x: number, y: number): T;
        to(x: number, y: number): T;
        font(family: string, size: string, weight: string, style: string): T;
        getBounds(relToParent: HTMLElement): any;
        center(x: number, y: number): T;
        position(x: number, y: number): T;
        absPosition(left: number, top: number): T;
        addStop(offset: any, color: string, opacity?: number): T;
        frameRateChanged(callback: any): T;
        merge(elem: any): selectedSet;
        each(callback: any): T;
        elementSizes(callback: any): any;
        focus(y: any): T;
    }
    interface IWrapperOuter extends IWrapper<IWrapperOuter> {
    }
    /** class that wraps a single element (HTML, SVG, Canvas, or WebGL item). */
    class singleWrapperSuperClass<T> implements IWrapper<T> {
        public elem: HTMLElement;
        public prop: any;
        public length: number;
        constructor(elem: HTMLElement);
        public element(value?: HTMLElement): HTMLElement;
        public css(name: string): string;
        public css(name: string, value: string): T;
        public hLine(x1: number, x2: number, y: number, makeCrisp: boolean): T;
        public vLine(y1: number, y2: number, x: number, makeCrisp: boolean): T;
        public bounds(x: any, y: any, width: any, height: any): T;
        public colors(fill: any, stroke: any, strokeWidth: any): T;
        public text(): string;
        public text(value: string): T;
        public tabIndex(): string;
        public tabIndex(value: string): T;
        public title(): string;
        public title(value: string): T;
        public value(): string;
        public value(value: string): T;
        public html(): string;
        public html(value: string): T;
        public show(): boolean;
        public show(showIt: boolean): T;
        public showToggle(): T;
        public hide(): boolean;
        public hide(showIt: boolean): T;
        public collapse(): T;
        public expand(): T;
        public dataIndex(): number;
        public dataIndex(value: number): T;
        public data(): any[];
        public data(value: any[]): T;
        public dataItem(): any;
        public dataItem(value: any): T;
        public dataPair(dataItem: any, dataIndex: any): T;
        public to(x: any, y: any): T;
        public from(x: any, y: any): T;
        public attach(name: string, callBack: any, useCapture?: boolean): T;
        public detach(name: string, callBack: any, useCapture?: boolean): T;
        public transform(): string;
        public transform(value: string): T;
        public translate(x: any, y: any, makeCrisp?: boolean): T;
        public transformOrigin(): string;
        public transformOrigin(value: string): T;
        public href(): string;
        public href(value: string): T;
        public safeHref(value: any, fallback: any): T;
        public font(family: any, size: any, weight: any, style: any): T;
        public setClass(value: any): T;
        public hasClass(value: any): boolean;
        public addClass(value: any): T;
        public removeClass(value: any): T;
        public toggleClass(value: any): T;
        public id(): string;
        public id(value: string): T;
        public getBounds(relToParent: any): ClientRect;
        public center(cx: any, cy: any): T;
        public position(x: any, y: any): T;
        public absPosition(left: any, top: any): T;
        public opacity(): number;
        public opacity(value: number): T;
        public radius(): number;
        public radius(value: number): T;
        public attr(name: string): string;
        public attr(name: string, value: string): T;
        public attr(name: string, value: number): T;
        public customAttr(name: any): string;
        public customAttr(name: any, value: string): T;
        public remove(): T;
        public toolTipEnabled(): boolean;
        public toolTipEnabled(value: boolean): T;
        public height(): any;
        public height(value: any): T;
        public width(): any;
        public width(value: any): T;
        public totalHeight(): number;
        public totalWidth(): number;
        public left(): number;
        public left(value: number): T;
        public top(): number;
        public top(value: number): T;
        public checked(): number;
        public checked(value: number): T;
        public clear(): T;
        public add(content: any): singleWrapperClass;
        public append(content: string): singleWrapperClass;
        public append(content: HTMLElement): singleWrapperClass;
        public append<T>(content: T): T;
        public prepend(content: any): singleWrapperClass;
        public insertBefore(content: any): singleWrapperClass;
        public insertAfter(content: any): singleWrapperClass;
        public addStop(offset: any, color: string, opacity?: number): T;
        public textBaseline(alignType: string, rc?: SVGRect): T;
        public animate(duration?: number, ease?: any, container?: any): T;
        public onAnimationComplete(callback: any): T;
        public frameRateChanged(callBack: any): T;
        public merge(elemOrArray: any): selectedSet;
        public toArray(): HTMLElement[];
        public wrap(index: any): any;
        public kids(): selectedSet;
        public each(callback: any): T;
        public elementSizes(): {
            width: number;
            height: number;
            marginWidth: number;
            marginHeight: number;
            borderWidth: number;
            borderHeight: number;
            paddingWidth: number;
            paddingHeight: number;
        };
        public focus(): T;
        public background(): string;
        public background(value: string): T;
        public dataId(): string;
        public dataId(value: string): T;
        public shapeId(): string;
        public shapeId(value: string): T;
    }
    /** class that wraps a single element (HTML, SVG, Canvas, or WebGL item). */
    class singleWrapperClass extends singleWrapperSuperClass<singleWrapperClass> {
        public ctr: string;
    }
    function createSingleWrapper(elem: HTMLElement): singleWrapperClass;
}

///----------------------------------------------------------------
/// (from _dom\basicSelect.d.ts)
///----------------------------------------------------------------
declare module vp.dom {
    function getElementsInSelectorString(parentElem: any, selector: any): any[];
    function wrapElements(elemOrArray: any): any;
    function unwrap(elem: any): any;
}
declare module vp {
    function select(p1?: any, p2?: any): dom.IWrapperOuter;
}

///----------------------------------------------------------------
/// (from _dom\canvasSelectedSet.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasSelectedSet extends dom.selectedSet {
        public ctr: string;
        public parentElem: any;
        public length: number;
        public selector: any;
        constructor(parentElem: any, selector: any);
        public merge(elemOrArray: any): canvasSelectedSet;
        public multiAppend(str: any, count: any): any[];
        public updateBounds(w: any, h: any): dom.selectedSet;
        public initShaderAnimations(duration: any, onCompleteCallback: any): dom.selectedSet;
        public resetShaderAnimations(): dom.selectedSet;
        public pointSize(value: any): any;
        public usePointSprites(value: any): any;
        public usePointSize(value: any): any;
        public markRebuildNeeded(): dom.selectedSet;
        public append(content: string): dom.singleWrapperClass;
        public append<T>(content: T): T;
        public attr(name: string): string;
        public attr(name: string, origValue: any): canvasSelectedSet;
    }
    function canvasSelect(selectStr?: any): canvasSelectedSet;
    function selectContext(selectObj: any, contextName: any): canvasSelectedSet;
}

///----------------------------------------------------------------
/// (from _dom\canvasUtils.d.ts)
///----------------------------------------------------------------
declare module vp.internal {
    class parsePathDataAndGenerateDrawFunc {
        public index: number;
        public d: any;
        public firstPt: {
            x: number;
            y: number;
        };
        public lastPt: {
            x: number;
            y: number;
        };
        public firstPointSeen: boolean;
        public minX: number;
        public minY: number;
        public maxX: number;
        public maxY: number;
        constructor(dstr: any);
        public parse(): {}[];
        public skipSpaces(d: any): void;
        public parseNumber(d: any): number;
        public parsePoint(d: any, isRelative: any): {
            x: number;
            y: number;
        };
        public onPointSeen(pt: any): void;
    }
}

///----------------------------------------------------------------
/// (from _dom\colors.d.ts)
///----------------------------------------------------------------
declare module vp.color {
    var colors: any;
    function getColorFromName(name: any): any;
    function getRandomColor(): any;
    function getColorFromHexString(str: any): any;
    function getColorFromRgbString(str: any): any;
    function toColor(r: any, g?: any, b?: any, a?: any): any;
    function getColorFromString(str: any): any;
    function interpolateColors(color1: any, color2: any, percent: any): any[];
    function isValidColor(value: any): boolean;
    function colorFromPalette(palette: any, index: any): any;
}

///----------------------------------------------------------------
/// (from _dom\dom.d.ts)
///----------------------------------------------------------------
declare module vp.dom {
    function left(elem: any, value?: any): any;
    function top(elem: any, value?: any): any;
    function getBounds(elem: any, relToParent?: any): ClientRect;
    function parentOffset(elem: any): {
        left: any;
        top: any;
    };
    function windowSize(): {
        width: number;
        height: number;
    };
    function getWidth(elem: any): number;
    function totalWidth(elem: any): number;
    function totalHeight(elem: any): number;
    function elementSizes(elem: any): {
        width: number;
        height: number;
        marginWidth: number;
        marginHeight: number;
        borderWidth: number;
        borderHeight: number;
        paddingWidth: number;
        paddingHeight: number;
    };
    function getBaseVal(elem: any, propName: any, prop: any): number;
    function getHeight(elem: any): number;
    function setWidth(elem: any, value: any): void;
    function setHeight(elem: any, value: any): void;
    function width(elem: any, value?: any): number;
    function height(elem: any, value?: any): number;
    function background(elem: any, value?: any): any;
    function getCssNumber(cssValueStr: any, parentValue?: any): number;
    function center(elem: any, cx: any, cy: any): void;
    function from(elem: any, x1: any, y1: any): void;
    function font(elem: any, family: any, size?: any, weight?: any, style?: any): void;
    function to(elem: any, x2: any, y2: any): void;
    function translate(elem: any, x: any, y: any): void;
    function transform(elem: any, strTransform?: any): any;
    function transformOrigin(elem: any, value?: any): any;
    function position(elem: any, x: any, y: any): void;
    function absPosition(elem: any, left: any, top: any): void;
    function isSizeName(name: any): boolean;
    function attr(elem: any, name: any, value?: any): any;
    function attrNS(elem: any, ns: any, name: any, value?: any): any;
    function href(elem: any, value?: any): any;
    function prop(elem: any, name: any, value?: any): any;
    var customAttr: typeof prop;
    function opacity(elem: any, value?: any): any;
    function checked(elem: any, value?: any): any;
    function removeAttribute(elem: any, name: any): void;
    function removeProp(elem: any, name: any): boolean;
    function id(elem: any, value?: any): any;
    function toolTipEnabled(elem: any, value?: any): any;
    function getClass(elem: any): string;
    function setClass(elem: any, name: any): void;
    function addClass(elem: any, name: any): void;
    function hasClass(elem: any, name: any): boolean;
    function removeClass(elem: any, name: any): void;
    function toggleClass(elem: any, name: any): void;
    function tabIndex(elem: any, value?: any): any;
    function text(elem: any, value?: any): any;
    function getTitleChild(elem: any): any;
    function title(elem: any, value?: any): any;
    function html(elem: any, value?: any): any;
    function value(elem: any, value?: any): any;
    function clear(element: any): void;
    function remove(element: any): void;
    function hide(elem: any): void;
    function collapse(elem: any): void;
    function expand(elem: any): void;
    function show(elem: any, showIt: any): void;
    function visibility(elem: any, value?: any): any;
    function showToggle(elem: any): void;
    function css(elem: any, prop: any, value?: any): any;
    function parent(elem: any): any;
    function children(parentElem: any, includeAll?: any): any[];
    function childNodes(parentElem: any, includeAll?: any): any[];
    function bounds(elem: any, x: any, y: any, width: any, height: any): void;
    function colors(elem: any, fill: any, stroke?: any, strokeWidth?: any): void;
    function addStop(brush: any, offset: any, color: any, opacity: any): void;
    function dataItem(elem: any, value?: any): any;
    function dataIndex(elem: any, value?: any): any;
    function animate(elem: any, duration?: any, ease?: any, container?: any, delay?: any): void;
    function onAnimationComplete(elem: any, completedFunc?: any): void;
    function frameRateChanged(elem: any, callBack: any): void;
    function radius(elem: any, value?: any): any;
    function returnFalse(): boolean;
    function dataPair(elem: any, dataItem: any, dataIndex: any): void;
    function focus(elem: any): void;
    function dataId(elem: any, value?: any): any;
    function shapeId(elem: any, value?: any): any;
    function vLine(elem: any, y1: number, y2: number, x: number, makeCrisp: boolean): void;
    function hLine(elem: any, x1: number, x2: number, y: number, makeCrisp: boolean): void;
    function enableElementSelection(elem: any, enable: any): void;
    function getBodyScroll(): {
        x: number;
        y: number;
    };
    function docOffset(elem: any): {
        left: number;
        top: number;
    };
    function textBaseline(textElem: any, alignType: string, rc?: SVGRect): number;
}

///----------------------------------------------------------------
/// (from _dom\events.d.ts)
///----------------------------------------------------------------
declare module vp.events {
    var keyCodes: {
        enter: number;
        shift: number;
        ctrl: number;
        alt: number;
        escape: number;
        left: number;
        up: number;
        right: number;
        down: number;
        insert: number;
        home: number;
        pageUp: number;
        "delete": number;
        end: number;
        pageDown: number;
        space: number;
        A: number;
        Z: number;
    };
    var keyboardKeys: {};
    function cancelEvent(evt: any): boolean;
    function monitorKeyboard(enable: any): void;
    function isKeyPressed(keyCode: any): boolean;
    function mousePosition(e: any, relToParent?: any): {
        x: any;
        y: any;
    };
    function setCapture(element: any, evt: any, mouseMoveCallback: any, mouseUpCallback: any): any;
    function setFocus(elem: any): void;
    function releaseCapture(element: any, evt: any, mouseMoveCallback?: any, mouseUpCallback?: any): any;
    function enableDragDrop(isEnabled: any): void;
    function attach(elem: any, eventName: any, funcToCall: any, useCapturePhase?: any): void;
    function triggerResize(elem: any): void;
    function wheelDelta(evt: any): any;
    function detach(elem: any, eventName: any, funcToCall: any, useCapture?: boolean): void;
    function elementFromPoint(x: any, y: any): any;
}

///----------------------------------------------------------------
/// (from _dom\inkHitTest.d.ts)
///----------------------------------------------------------------
declare module vp.internal {
    class inkHitTest {
        public tempCanvas: any;
        public root: any;
        public w: number;
        public h: number;
        public ctx: any;
        public rect: ClientRect;
        constructor(rect: any);
        private transferAttrs(fromElem, toElem, attrNameList);
        private canvasElemFromSvg(canvasRoot, svgElem);
        private addCanvasChild(canvasParent, svgElem);
        public close(): void;
        public doesShapeOverlap(svgShape: any): boolean;
    }
}

///----------------------------------------------------------------
/// (from _dom\insertAppend.d.ts)
///----------------------------------------------------------------
declare module vp.dom {
    function createHtml(tagName: any): HTMLElement;
    function createSvg(tagName: any): SVGElement;
    /** createElement(parent, tagName) - creates an HTML, SVG, or CANVAS element with the specified tagName.
    returns: the newly created element (unwrapped). */
    function createElement(parent: any, tagName: any): any;
    function createElements(parent: any, tagName: any, count: any): any[];
    function add(container: any, content: any): any[];
    function append(container: any, content: any): any;
    function appendElements(container: any, elements: any): void;
    function prepend(container: any, content: any): any;
    function insertBefore(container: any, content: any): any;
    function insertAfter(container: any, content: any): any;
    function appendCoreMulti(self: any, content: any, insertOp: any): any;
}

///----------------------------------------------------------------
/// (from _dom\isFuncs.d.ts)
///----------------------------------------------------------------
declare module vp.utils {
    var isFireFox: boolean;
    var isChrome: boolean;
    var isIE: boolean;
    var isIE11: boolean;
    function isUndefined(obj: any): boolean;
    function isDefined(obj: any): boolean;
    function isVuePlotControl(obj: any): boolean;
    function isSvgElement(obj: any): boolean;
    function isSvgDocOrElement(elem: any): boolean;
    function isCanvas(obj: any): boolean;
    function isCanvasChild(obj: any): boolean;
    function isCanvasContainer(obj: any): boolean;
    function isFunction(obj: any): boolean;
    function isNumber(obj: any): boolean;
    function isObject(obj: any): boolean;
    function isBoolean(obj: any): boolean;
    function isValidNumber(obj: any): boolean;
    function isArray(obj: any): boolean;
    function isString(obj: any): boolean;
    function isSelectedSet(elem: any): boolean;
}

///----------------------------------------------------------------
/// (from _dom\styleSheet.d.ts)
///----------------------------------------------------------------
declare module vp.dom {
    class styleSheetClass {
        public _styleSheet: any;
        public _elem: any;
        constructor();
        public addRule(selector: any, style: any): styleSheetClass;
        public remove(): void;
        public sheet(): any;
        public id(value: any): any;
    }
    function createStyleSheet(): styleSheetClass;
}

///----------------------------------------------------------------
/// (from _dom\utils.d.ts)
///----------------------------------------------------------------
declare module vp.utils {
    function indexKeyFunc(dataRecord: any, index: any): any;
    function debug(msg: any): void;
    function assert(cond: boolean, msg?: any): void;
    function hasKeys(obj: any): boolean;
    var computedStyles: {};
    function getComputedStyleFromClass(shapeName: string, parentClassName: string, className: string): any;
    function getShapeId(element: HTMLElement): string;
    function toArray(pseudoArray: any): any[];
    /** find HTML, SVG, or canvas elements that overlap with specificed rcBounds. */
    function getElementsInBounds(container: any, rcBounds: ClientRect, rcAdjusted: ClientRect): any[];
}

///----------------------------------------------------------------
/// (from _dom\wrapperTests.d.ts)
///----------------------------------------------------------------
declare module vp.internal {
    interface ISmallWrapper<T> {
        background(): string;
        background(value: string): T;
        close(): T;
    }
    interface ISmallWrapper2<T> extends ISmallWrapper<T> {
        fill(): string;
        fill(value: string): T;
    }
    interface ISmallWrapper2End extends ISmallWrapper2<ISmallWrapper2End> {
    }
    class SmallWrapperImpl implements ISmallWrapper<SmallWrapperImpl> {
        public background(): string;
        public background(value: string): SmallWrapperImpl;
        public close(): SmallWrapperImpl;
        public foo(): SmallWrapperImpl;
    }
    function smallSelect(abc: string): ISmallWrapper2End;
    class SmallWrapper2Base<T> implements ISmallWrapper2<T> {
        public background(): string;
        public background(value: string): T;
        public fill(): string;
        public fill(value: string): T;
        public close(): T;
        public foobar(): T;
    }
    class SmallWrapper2Impl extends SmallWrapper2Base<SmallWrapper2Impl> {
    }
}
declare module vp.animation {
    class animationClass {
        public ctr: string;
        private _children;
        private elementsBeingAnimated;
        private elemsToDelete;
        private completedFunc;
        private onFrameCallback;
        private removed;
        private timer;
        private timeStarted;
        private delaying;
        private _frameCount;
        private elem;
        private duration;
        private easeObj;
        private container;
        private delay;
        constructor(elem: any, duration: any, easeObj: any, parentAnimation: any, delay?: any);
        public setTimer(): void;
        public remove(anim: any): void;
        public frameCount(): number;
        private getSlideLoc(slideLoc, elem);
        public initAnim(elem: any): void;
        public clearAnim(elem: any): void;
        private getTranslateTo(trans);
        public applyEffect(elem: any, effect: any, isEnter: any): void;
        public applyEnterEffect(elem: any, effect: any): void;
        public applyExitEffect(elem: any, effect: any): void;
        private getTransformObject(elem);
        private parseTransformParams(scanner, transObj, paramCount);
        private parseTransform(str);
        private getFromValue(elem, isStyle, propOwner, name);
        private animateColorValue(elem, name, isStyle, fromValue, value);
        private animateTransformValue(elem, name, isStyle, fromValue, value);
        public animateAttr(elem: any, name: any, value: any, value2?: any, cx?: any, cy?: any, isStyle?: any): void;
        public deleteElementOnCompleted(elem: HTMLElement): void;
        private addAnimation(child);
        public animateFrame(): boolean;
        public children(): any[];
        public animateFrameCore(percent: number, startingChildIndex?: number): void;
        public stop(): boolean;
        public onAnimationComplete(arg: any): any;
        public onFrame(arg: any): any;
        private onAnimationStopped();
    }
    function createAnimation(elem: any, duration: any, easeObj: any, container: any, delay: any): animationClass;
    function requestAnimationFrame(callback: any): any;
    function cancelAnimationFrame(timer: any): void;
    var shaderAnimationMgr: any;
}

///----------------------------------------------------------------
/// (from animation\animationContainer.d.ts)
///----------------------------------------------------------------
declare module vp.animation {
    class animationContainer {
        public ctr: string;
        public children: any[];
        public completedFunc: any;
        public timer: any;
        public _timeStarted: any;
        public easeObj: any;
        public isRunning: boolean;
        constructor();
        public timeStarted(): any;
        public add(anim: any): void;
        public stop(): void;
        public onCompleted(completedFuncParam: any): void;
        public clear(): void;
        private onStoppedOrCompleted();
        public animateFrame(): void;
    }
}

///----------------------------------------------------------------
/// (from animation\colorAnimation.d.ts)
///----------------------------------------------------------------
declare module vp.animation {
    class colorAnimation {
        public from: number[];
        public to: number[];
        public element: any;
        public parent: any;
        public attributeName: string;
        constructor(parent: any, element: any, attributeName: any, fromColor: any, toColor: any);
        private getAnimatedValue(percent);
        public animateFrame(percent: any): void;
    }
}

///----------------------------------------------------------------
/// (from animation\dataAnimMgrEx.d.ts)
///----------------------------------------------------------------
declare module vp.animation {
    class dataAnimMgrExClass {
        public ctr: string;
        public _enterShapes: any[];
        public _updateShapes: any[];
        public _exitShapes: any[];
        public _updateRows: any[];
        public _container: any;
        public _keys: {};
        public _data: any[];
        public _masterAnim: any;
        public _enterDataPairs: any[];
        public _pkCallback: any;
        public _dataId: any;
        public _seriesCount: number;
        public _appendNameOrCallback: any;
        public _layerId: string;
        public _isSeriesLayer: boolean;
        public _seriesNames: string[];
        public _pendingSeriesNames: string[];
        public _animDelay: any;
        public _animDuration: any;
        public _animEasing: any;
        public _enterAnim: any;
        public _exitAnim: any;
        public _updateAnim: any;
        public _animStartTime: number;
        public _animFPS: number;
        public _shapesDrawn: number;
        public _statsCallback: any;
        constructor(containerUW: any, pkFunc: any, appendSFCtor: any, layerId: string, isSeriesLayer?: boolean);
        public setData(newData: any, isNewDataSet?: boolean, newDataId?: any): dataAnimMgrExClass;
        /** this is only called from layers that support series plotting.  It should be called after setData(), but before
        updateShapes().  */
        public setSeriesNames(value: string[]): void;
        private applySeriesNames();
        public updateShapes(seriesIndex: any, totalSeries: any, callBack: any, appendStrOrFunc?: any): any;
        public createExitAnimations(seriesIndex: number, shapesTouched: any[], callBack: any): void;
        public createEnterAnimations(seriesIndex: number, shapesTouched: any[], callBack: any): void;
        public createUpdateAnimations(seriesIndex: number, shapesTouched: any[], callBack: any): void;
        public getData(): any[];
        public clear(): void;
        public updateWithoutDataChange(): void;
        public createMultipleShapes(appendStrOrFunc: any, seriesCount: any, enterDataPairs: any): any[];
        public createShape(appendStrOrFunc: any, dataRecord: any, index: any, key: any, seriesIndex: any): any;
        public createEnterShapesIfNeeded(seriesCount: any, appendStrOrFunc: any): void;
        public processNewlyCreatedShapes(newShapes: any[], pairList: any[], seriesCount: number, seriesIndex?: number): void;
        public onAnimationComplete(anim: animationClass, changeType: string, seriesIndex: number): void;
        public buildAnimationProps(anim: any): {
            duration: any;
            easing: any;
            delay: any;
            effect: any;
        };
        public removeExitShapesNow(seriesIndex: any): void;
        public lookupElement(dataItem: any, dataIndex: any, seriesIndex: any): any;
        private getPrimaryKey(dataItem, dataIndex);
        private getFullKey(dataItem, dataIndex, seriesIndex, key?);
        public animDuration(value: any): any;
        public animDelay(value: any): any;
        public animEasing(value: any): any;
        public enterAnim(value: any): any;
        public exitAnim(value: any): any;
        public updateAnim(value: any): any;
        public container(value: any): any;
        public dataId(value: any): any;
        /** public property: keyFunc (can be a column name (string) or a callbackthat returns a unique ID for each record). */
        public keyFunc(value: any): any;
        public getExistingShapes(): any[];
        public statsCallback(value: any): dataAnimMgrExClass;
    }
}

///----------------------------------------------------------------
/// (from animation\dataAnimMgrForSeries.d.ts)
///----------------------------------------------------------------
declare module vp.animation {
    class dataAnimMgrForSeriesClass {
        public ctr: string;
        private _enterShapes;
        private _updateShapes;
        private _exitShapes;
        private _updatedRowIndexes;
        private _container;
        private _existingRows;
        private _data;
        private _masterAnim;
        private _enterDataInfos;
        private _pkCallback;
        private _dataId;
        private _seriesCount;
        private _appendSFCtor;
        private _seriesColList;
        private _layerId;
        private _animDelay;
        private _animDuration;
        private _animEasing;
        private _enterAnim;
        private _exitAnim;
        private _updateAnim;
        private _animStartTime;
        private _animFPS;
        private _shapesDrawn;
        private _statsCallback;
        constructor(containerUW: any, pkFunc: any, appendSFCtor: any, layerId: number);
        public getData(): any[];
        public clear(): void;
        public updateWithoutDataChange(): void;
        public setData(newData: any[], isNewDataSet: boolean, newDataId: number): dataAnimMgrForSeriesClass;
        private createMultipleShapes(appendStrOrFunc, enterDataInfos);
        private createShape(appendStrOrFunc, dataRecord, index, key, seriesIndex);
        /** Creates one shape for each enterDataInfo. */
        private createEnterShapesIfNeeded(appendStrOrFunc);
        private makeDataItem(dataId, seriesIndex, key, dataRecord);
        private storeShapeInRow(pk, uelem);
        /** Set mapping of series columns.  Should be called AFTER setData() but BEFORE updateShapes(). */
        public setSeriesCols(origAfterList: string[]): void;
        private addEnterInfo(dataRecord, dataIndex, seriesIndex);
        public updateShapes(seriesIndex: number, totalSeries: number, callBack: any, appendStrOrFunc: any): any;
        private createExitAnimations(seriesColName, shapesTouched, callBack);
        public removeSeriesFromList(list: HTMLElement[], seriesColName: string): any[];
        private createEnterAnimations(seriesColName, shapesTouched, callBack);
        private createUpdateAnimations(seriesColName, shapesTouched, callBack);
        public onAnimationComplete(anim: animationClass, changeType: string, seriesColName: string): void;
        private buildAnimationProps(anim);
        private removeExitShapesNow(seriesColName);
        private getPrimaryKey(dataItem, dataIndex);
        public animDuration(value: any): any;
        public animDelay(value: any): any;
        public animEasing(value: any): any;
        public enterAnim(value: any): any;
        public exitAnim(value: any): any;
        public updateAnim(value: any): any;
        public container(value: any): any;
        public dataId(value: any): any;
        /** public property: keyFunc (can be a column name (string) or a callbackthat returns a unique ID for each record). */
        public keyFunc(value: any): any;
        public getExistingShapes(): any[];
        public statsCallback(value: any): dataAnimMgrForSeriesClass;
    }
    class DataItem {
        /** normally set to "1" but can be used to distingish between multiple sources of data. */
        public dataId: number;
        /** this is the seriesIndex. */
        public shapeId: number;
        /** more robust mapping to a series than seriesIndex. */
        public seriesColName: string;
        /** primary key of associated record. */
        public key: string;
        /** the data record. */
        public data: any;
        constructor(dataId: number, seriesIndex: number, seriesColName: string, key: string, dataRecord: any);
    }
}

///----------------------------------------------------------------
/// (from animation\eases.d.ts)
///----------------------------------------------------------------
declare module vp.eases {
    enum EaseMode {
        easeIn = 0,
        easeOut = 1,
        easeInOut = 2,
    }
    enum BezierEaseMode {
        ease = 0,
        easeIn = 1,
        easeOut = 2,
        easeInOut = 3,
        linear = 4,
        maxEase = 5,
    }
    class easeBase {
        public easeMode: EaseMode;
        public easeCore(t: any): any;
        public ease(t: any): any;
    }
    class floorEase extends easeBase {
        public easeCore(t: any): number;
    }
    class nearestNeighborEase extends easeBase {
        public easeCore(t: any): number;
    }
    class linearEase extends easeBase {
        public easeCore(t: any): any;
    }
    class quadraticEase extends easeBase {
        public easeCore(t: any): number;
    }
    class cubicEase extends easeBase {
        public easeCore(t: any): number;
    }
    class quarticEase extends easeBase {
        public easeCore(t: any): number;
    }
    class sineEase extends easeBase {
        public easeCore(t: any): number;
    }
    class circleEase extends easeBase {
        public easeCore(t: any): number;
    }
    class backEase extends easeBase {
        public amplitude: number;
        constructor(amplitude: number);
        public easeCore(t: any): number;
    }
    class powEase extends easeBase {
        public n: number;
        constructor(n: number);
        public easeCore(t: any): number;
    }
    class stdEaseOut extends easeBase {
        constructor();
        public easeCore(t: any): number;
    }
    class expEase extends easeBase {
        public n: number;
        constructor(n: number);
        public easeCore(t: any): any;
    }
    class springEase extends easeBase {
        public springiness: number;
        public oscillations: number;
        constructor(springiness: number, oscillations: number);
        public easeCore(t: any): number;
    }
}

///----------------------------------------------------------------
/// (from animation\effects.d.ts)
///----------------------------------------------------------------
declare module vp.animation {
    enum FadeType {
        none = 0,
        fade = 1,
    }
    enum SlideLoc {
        none = 0,
        left = 1,
        top = 2,
        right = 3,
        bottom = 4,
    }
    enum GrowOrigin {
        none = 0,
        left = 1,
        top = 2,
        right = 3,
        bottom = 4,
        center = 5,
    }
    function makeEffects(fadeType: any, slideLoc?: any, growOrigin?: any, rotateAngle?: any, rotateCx?: any, rotateCy?: any): {
        fadeType: any;
        slideLoc: any;
        growOrigin: any;
        rotateAngle: any;
        rotateCx: any;
        rotateCy: any;
    };
}

///----------------------------------------------------------------
/// (from animation\numberAnimation.d.ts)
///----------------------------------------------------------------
declare module vp.animation {
    class numberAnimation {
        public from: number;
        public to: number;
        public isCssProperty: boolean;
        public parent: any;
        public element: any;
        public attributeName: string;
        constructor(parent: any, element: any, attributeName: string, fromValue: string, toValue: string, isCssProperty: boolean);
        private getAnimatedValue(percent);
        private isStyled();
        public animateFrame(percent: number): void;
    }
}

///----------------------------------------------------------------
/// (from animation\transformAnimation.d.ts)
///----------------------------------------------------------------
declare module vp.animation {
    class transformAnimation {
        public parent: any;
        public element: any;
        public parts: any[];
        constructor(parent: any, element: any);
        public makeTransform(name: any, fromValue: any, toValue: any, cx: any, cy: any): void;
        private getAnimatedValue(percent);
        public animateFrame(percent: any): void;
    }
}
declare module vp.visuals {
    /** The base class for the 4 axisHelper classes.  This class holds drawing data & properties & provides getter/setter access to them.  */
    class axisHelperBaseClass<T> {
        public _markBase: marks.markBaseClass;
        public _groupElem: any;
        public _fakeLabel: SVGTextElement;
        public _fakeSvg: dom.singleWrapperClass;
        public _ellipsesBounds: SVGRect;
        public _makeCrisp: boolean;
        public _location: LabelLocation;
        public _axisSize: number;
        public _expandSpace: number;
        public _axisLineMark: marks.lineMarkClass;
        public _tickMark: marks.lineMarkClass;
        public _minorMark: marks.lineMarkClass;
        public _labelMark: marks.textMarkClass;
        public _nameMark: marks.textMarkClass;
        public _name: string;
        public _labelStrings: string[];
        public _labelOffsets: number[];
        public _tickOffsets: number[];
        public _minorTickOffsets: number[];
        public _gridLineOffsets: number[];
        public _drawAxisLine: boolean;
        public _drawAxisName: boolean;
        public _ticksOnInside: boolean;
        public _labelOverflow: LabelOverflow;
        public _labelRotation: LabelRotation;
        public _nameRotation: LabelRotation;
        public _onShade: any;
        /** minimum spacing between largest label and avail space per label before overflow algorithm applies, for 0, 45, and 90 degree rotations. */
        public _minLabelSpacing: number[];
        /** when set, limits the size of the label space perpendicular to the axis.  */ 
        public _maxPerpendicularSize: number;
        public _tickLength: number;
        public _minorTickLength: number;
        public _spaceAfterTick: number;
        public _spaceAfterLabel: number;
        public _spaceAfterName: number;
        public _labelSizes: SVGRect[];
        public _szMaxText: {
            width: number;
            height: number;
        };
        public _availPixelsPerLabel: number;
        public _actualLabelRotation: number;
        constructor(container: any, location: LabelLocation, useWebGl?: boolean, makeCrisp?: boolean);
        public groupElem(): any;
        public translate(x: number, y: number, makeCrispAdjustment: boolean): axisHelperBaseClass<T>;
        public generate(transition?: marks.transitionClass): void;
        public rotateText45(wrapElem: any, yCorrection: number, rc: geom.rectLight, alignTo: LabelLocation): {
            width: number;
            height: number;
        };
        public labelSizes(): any;
        public labelSizes(value: any): T;
        public getAvailablePixelsPerLabelForTruncation(actualLabelRotation: number): number;
        public shadeTextLabel(index: number, element: any, cx: number, cy: number, text: string, hAlign: string, vAlign: string, alignTo: LabelLocation, returnWidth: boolean, availPixelsPerLabel: number): number;
        public getLabelBounds(index: number, x: number, y: number, hAlign: string): {
            x: number;
            y: number;
            width: number;
            height: number;
            yCorrection: number;
        };
        public rotatedSize(rotation: LabelRotation, normalSize: number, size90: number): number;
        public rotateText90(wrapElem: any, yCorrection: number, rc: geom.rectLight, alignTo: LabelLocation): {
            width: number;
            height: number;
        };
        public hideTicksIfTooMany(): void;
        public getActualLabelRotation(maxMeasuredWidth: number, maxMeasuredHeight: number, axisSize: number, labelCount: number): LabelRotation;
        public getAvailPixelsPerLabel(actualRotation: LabelRotation, availAxisSize: number, labelCount: number): number;
        /** See if labels can fit the axis, using rotation and trimming. */
        public canLabelsFit(availAxisSize: number, labelCount: number, maxMeasuredWidth: number, maxMeasuredHeight: number): boolean;
        public measureAllLabels(labelStrings: string[]): {
            width: number;
            height: number;
        };
        public truncateText(text: any, maxLength: any, overflow: LabelOverflow): string;
        public eraseCanvas(): void;
        public tickOffsets(): number[];
        public tickOffsets(value: number[]): T;
        public minorTickOffsets(): number[];
        public minorTickOffsets(value: number[]): T;
        public labelOffsets(): number[];
        public labelOffsets(value: number[]): T;
        public labelStrings(): string[];
        public labelStrings(value: string[]): T;
        public drawAxisLine(): boolean;
        public drawAxisLine(value: boolean): T;
        public drawAxisName(): boolean;
        public drawAxisName(value: boolean): T;
        public name(): string;
        public name(value: string): T;
        public labelRotation(): LabelRotation;
        public labelRotation(value: LabelRotation): T;
        public nameRotation(): LabelRotation;
        public nameRotation(value: LabelRotation): T;
        /** The minimum spacing between largest label and avail space per label before overflow algorithm applies, for 0, 45, and 90 degree rotations. */
        public minLabelSpacing(): number[];
        public minLabelSpacing(value: number): T;
        public minLabelSpacing(value: number[]): T;
        public maxPerpendicularSize(): number;
        public maxPerpendicularSize(value: number): T;
        public expandSpace(): number;
        public expandSpace(value: number): T;
        public labelOverflow(): LabelOverflow;
        public labelOverflow(value: LabelOverflow): T;
        public onShade(): any;
        public onShade(value: any): T;
    }
    interface axisHelperBase extends axisHelperBaseClass<axisHelperBase> {
    }
    /** Specifies how to truncate or hide axis labels that exceed the available space.  If "maxLabelSize" is specified, the
    width of the unrotated label, or the height of the rotated label, is compared to the specified value of "maxLabelSize".  Otherwise, the rotated  size of the
    label in the direction of the axis is compared to the available space between breaks on the axis.  When not enough space is available,
    "LabelOverflow" specifies how the label is drawn. */
    enum LabelOverflow {
        /** draws the entire label, even if it results in labels overwriting each other. */
        overWrite = 0,
        /** truncates the label to fit the available space. */
        truncate = 1,
        /** truncates the label with "..." marks to fit the available space. */
        ellipses = 2,
        /** hides all of the labels on the axis if any of the labels is too large for the available space. */
        hideAll = 3,
    }
    /** Specifies the rotation of the axis labels or name. */
    enum LabelRotation {
        none = 0,
        rotate45 = 45,
        rotate90 = 90,
        auto = -1,
    }
    /** Specifies where the labels are, relative to the axis line.  */
    enum LabelLocation {
        left = 0,
        top = 1,
        right = 2,
        bottom = 3,
    }
}

///----------------------------------------------------------------
/// (from axes\axis.d.ts)
///----------------------------------------------------------------
declare module vp.visuals {
    /** Creates a class that, given explicit information, can draw a change-animated axis.  */
    class axisClass {
        public _scale: scales.IScaleRun;
        public _helper: axisHelperBase;
        public _breakValues: any;
        public _minorBreakValues: any;
        public _tickCount: number;
        public _location: LabelLocation;
        public _isNameVisible: boolean;
        public _isAxisVisible: boolean;
        public _isLabelsVisible: boolean;
        public _isTicksVisible: boolean;
        public _hideInteriorLabels: boolean;
        public _name: string;
        constructor(container: HTMLElement, scale: scales.IScaleRun, location: LabelLocation, useWebGl?: boolean, makeCrisp?: boolean);
        public generate(transition?: marks.transitionClass): void;
        public getActualBreaks(): any[];
        public getActualMinorBreaks(breaks: any[]): any[];
        public getActualLabels(breakValues: number[]): string[];
        public width(): number;
        public width(value: number): axisClass;
        public height(): number;
        public height(value: number): axisClass;
        public getMeasuredWidth(): number;
        public getMeasuredHeight(): number;
        public name(): string;
        public name(value: string): axisClass;
        public tickCount(): number;
        public tickCount(value: number): axisClass;
        public isNameVisible(): boolean;
        public isNameVisible(value: boolean): axisClass;
        public isLabelsVisible(): boolean;
        public isLabelsVisible(value: boolean): axisClass;
        public isTicksVisible(): boolean;
        public isTicksVisible(value: boolean): axisClass;
        public isAxisVisible(): boolean;
        public isAxisVisible(value: boolean): axisClass;
        public hideInteriorLabels(): boolean;
        public hideInteriorLabels(value: boolean): axisClass;
        public nameRotation(): LabelRotation;
        public nameRotation(value: LabelRotation): axisClass;
        public labelRotation(): LabelRotation;
        public labelRotation(value: LabelRotation): axisClass;
        public maxPerpendicularSize(): number;
        public maxPerpendicularSize(value: number): axisClass;
        /** The minimum spacing between largest label and avail space per label before overflow algorithm applies, for 0, 45, and 90 degree rotations. */
        public minLabelSpacing(): number[];
        public minLabelSpacing(value: number): axisClass;
        public minLabelSpacing(value: number[]): axisClass;
        public labelOverflow(): LabelOverflow;
        public labelOverflow(value: LabelOverflow): axisClass;
        public labelSizes(): any;
        public labelSizes(value: any): axisClass;
        public groupElem(): any;
        public translate(x: number, y: number, makeCrispAdjustment?: boolean): axisClass;
        public onShade(): any;
        public onShade(value: any): axisClass;
    }
    function createAxis(container: HTMLElement, scale: scales.IScaleRun, labelLocation: LabelLocation, useWebGl?: boolean, makeCrisp?: boolean): axisClass;
}

///----------------------------------------------------------------
/// (from axes\bottomAxisHelper.d.ts)
///----------------------------------------------------------------
declare module vp.visuals {
    /** Helper class for drawing an axis with the labels on the bottom.  */
    class bottomAxisHelperClass extends axisHelperBaseClass<bottomAxisHelperClass> {
        public _yOffset: number;
        public _maxTextHeight: number;
        public _measuredHeight: number;
        constructor(container: HTMLElement, useWebGl?: boolean, makeCrisp?: boolean);
        public generate(transition?: marks.transitionClass): void;
        public width(): number;
        public width(value: number): bottomAxisHelperClass;
        public getMeasuredHeight(): number;
    }
    function createBottomAxisHelper(container: HTMLElement, useWebGl?: boolean, makeCrisp?: boolean): bottomAxisHelperClass;
}

///----------------------------------------------------------------
/// (from axes\leftAxisHelper.d.ts)
///----------------------------------------------------------------
declare module vp.visuals {
    /** Helper class for drawing an axis with the labels on the left.  */
    class leftAxisHelperClass extends axisHelperBaseClass<leftAxisHelperClass> {
        public _xOffset: number;
        public _maxTextWidth: number;
        public _measuredWidth: number;
        constructor(container: HTMLElement, useWebGl?: boolean, makeCrisp?: boolean);
        public generate(transition?: marks.transitionClass): void;
        public height(): number;
        public height(value: number): leftAxisHelperClass;
        public getMeasuredWidth(): number;
    }
    function createLeftAxisHelper(container: HTMLElement, useWebGl?: boolean, makeCrisp?: boolean): leftAxisHelperClass;
}

///----------------------------------------------------------------
/// (from axes\rightAxisHelper.d.ts)
///----------------------------------------------------------------
declare module vp.visuals {
    /** Helper class for drawing an axis with the labels on the right.  */
    class rightAxisHelperClass extends axisHelperBaseClass<rightAxisHelperClass> {
        public _xOffset: number;
        public _maxTextWidth: number;
        public _measuredWidth: number;
        constructor(container: HTMLElement, useWebGl?: boolean, makeCrisp?: boolean);
        public generate(transition?: marks.transitionClass): void;
        public height(): number;
        public height(value: number): rightAxisHelperClass;
        public getMeasuredWidth(): number;
    }
    function createRightAxisHelper(container: HTMLElement, useWebGl?: boolean, makeCrisp?: boolean): rightAxisHelperClass;
}

///----------------------------------------------------------------
/// (from axes\topAxisHelper.d.ts)
///----------------------------------------------------------------
declare module vp.visuals {
    /** Helper class for drawing an axis with the labels on the top.  */
    class topAxisHelperClass extends axisHelperBaseClass<topAxisHelperClass> {
        public _yOffset: number;
        public _maxTextHeight: number;
        public _measuredHeight: number;
        constructor(container: HTMLElement, useWebGl?: boolean, makeCrisp?: boolean);
        public generate(transition?: marks.transitionClass): void;
        public width(): number;
        public width(value: number): topAxisHelperClass;
        public getMeasuredHeight(): number;
    }
    function createTopAxisHelper(container: HTMLElement, useWebGl?: boolean, makeCrisp?: boolean): topAxisHelperClass;
}
declare module vp.canvas {
    class canvasElement {
        public ctr: string;
        public rootContainer: canvasContainerElement;
        public opacity: number;
        public parentNode: any;
        public children: any[];
        public visibility: string;
        public transform: geom.ITransform;
        public id: number;
        public stylesByClass: {};
        public stroke: string;
        public fill: string;
        constructor(parent: any);
        public clientRectToBoundingBox(rc: ClientRect): {
            x: number;
            y: number;
            width: number;
            height: number;
            right: number;
            bottom: number;
        };
        public getRoot(elem: any): any;
        public drawFrame(ctx: CanvasRenderingContext2D, container: any): void;
        public preDraw(ctx: CanvasRenderingContext2D): void;
        public drawAll(ctx: CanvasRenderingContext2D, container: any): void;
        public postDraw(ctx: CanvasRenderingContext2D): void;
        public markDrawNeeded(): void;
        public setPathData(value: string): void;
        public setPathPoints(value: string): void;
        public getInsideOfFuncStr(str: string, funcName: string): any;
        public setTransform(value: string): void;
        public getTransform(): string;
        public applyStyle(style: any): void;
        public setAttribute(name: any, value: any): void;
        public getAttribute(name: any): any;
        public append(strElem: any): any;
    }
}

///----------------------------------------------------------------
/// (from canvas\canvasCircleElement.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasCircleElement extends canvasElement {
        public ctr: string;
        public tagName: string;
        public parentElement: any;
        public cx: number;
        public cy: number;
        public r: number;
        public fill: string;
        public stroke: string;
        constructor(parentElement: any);
        public applyStyle(style: any): void;
        public getOffset(): {
            x: number;
            y: number;
        };
        public hitTest(x: any, y: any): any;
        public drawAll(ctx: CanvasRenderingContext2D, container: any): void;
        public getWidth(): number;
        public getHeight(): number;
    }
}

///----------------------------------------------------------------
/// (from canvas\canvasContainerElement.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasContainerElement extends canvasElement {
        public ctr: string;
        public canvas: any;
        public ctx: any;
        public contextRequest: any;
        public initialized: boolean;
        public frameCount: number;
        public lastTime: number;
        public bufferBuildTime: number;
        public frameRate: number;
        public frameRateChanged: any;
        public opacity: number;
        public currentFill: string;
        public currentStroke: string;
        public currentStrokeWidth: number;
        public selectedFill: string;
        public drawCallback: any;
        public activeAnimations: any[];
        public drawNeeded: boolean;
        public isHitTesting: boolean;
        public hitTestX: number;
        public hitTestY: number;
        public hitTestResult: any;
        public drawTimer: any;
        public drawCount: number;
        constructor(canvas: any, ctx: any, contextRequest: any);
        public getCanvasElementAtPoint(x: any, y: any): any;
        public markDrawNeeded(): void;
        public removeChild(element: any): void;
        public clear(): void;
        public hitTestPath(ctx: any, elem: any): void;
        public drawAll(ctx: any): void;
        public drawFrame(rearmTimer?: any): void;
        public close(): void;
    }
}

///----------------------------------------------------------------
/// (from canvas\canvasEllipseElement.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasEllipseElement extends canvasElement {
        public ctr: string;
        public tagName: string;
        public opacity: number;
        public cx: number;
        public cy: number;
        public rx: number;
        public ry: number;
        public fill: string;
        public stroke: string;
        constructor(parentElement: any);
        public getOffset(): {
            x: number;
            y: number;
        };
        public hitTest(x: any, y: any): any;
        public drawAll(ctx: any, container: any): void;
        public getWidth(): number;
        public getHeight(): number;
    }
}

///----------------------------------------------------------------
/// (from canvas\canvasGroupElement.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasGroupElement extends canvasElement {
        public ctr: string;
        public tagName: string;
        public opacity: number;
        public children: any[];
        public x: number;
        public y: number;
        constructor(parentElement: any);
        public getOffset(): {
            x: number;
            y: number;
        };
        public hitTest(x: any, y: any): any;
        public appendChild(element: any): void;
        public removeChild(element: any): void;
        public clear(): void;
        public drawAll(ctx: any, container: any): void;
    }
}

///----------------------------------------------------------------
/// (from canvas\canvasImageElement.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasImageElement extends canvasElement {
        public ctr: string;
        public tagName: string;
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public strokePlacement: string;
        public image: HTMLImageElement;
        public _href: any;
        public layoutX: any;
        public layoutY: any;
        constructor(parentElement: any);
        public getOffset(): {
            x: number;
            y: number;
        };
        public getBBox(): {
            left: any;
            top: any;
            width: number;
            height: number;
            right: any;
            bottom: any;
        };
        public hrefOverride(src: any): any;
        public hitTest(x: any, y: any): any;
        public drawAll(ctx: any, container: any): void;
        public getWidth(): number;
        public getHeight(): number;
    }
}

///----------------------------------------------------------------
/// (from canvas\canvasLineElement.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasLineElement extends canvasElement {
        public ctr: string;
        public tagName: string;
        public opacity: number;
        public x1: number;
        public x2: number;
        public y1: number;
        public y2: number;
        public stroke: string;
        public fill: string;
        constructor(parentElement: any);
        public getOffset(): {
            x: number;
            y: number;
        };
        public hitTest(x: any, y: any): any;
        public drawAll(ctx: any, container: any): void;
        public getWidth(): number;
        public getHeight(): number;
    }
}

///----------------------------------------------------------------
/// (from canvas\canvasPathElement.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasPathElement extends canvasElement {
        public ctr: string;
        public tagName: string;
        public opacity: number;
        public boundingBox: {
            x: number;
            y: number;
            width: number;
            height: number;
            right: number;
            bottom: number;
        };
        public createPathFunc: any;
        public pathDataStr: string;
        public fill: string;
        public stroke: string;
        constructor(parentElement: any);
        public getOffset(): {
            x: number;
            y: number;
        };
        public getBBox(): {
            x: number;
            y: number;
            width: number;
            height: number;
            right: number;
            bottom: number;
        };
        public createPathOnContext(ctx: any): void;
        public hitTest(x: any, y: any): any;
        public drawAll(ctx: any, container: any): void;
        public setPathData(value: string): void;
        public parseDataStr(): void;
        public getWidth(): number;
        public getHeight(): number;
    }
}

///----------------------------------------------------------------
/// (from canvas\canvasPolygonElement.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasPolygonElement extends canvasElement {
        public ctr: string;
        public tagName: string;
        public opacity: number;
        public boundingBox: {
            x: number;
            y: number;
            width: number;
            height: number;
            right: number;
            bottom: number;
        };
        public pointStr: string;
        public fill: string;
        public stroke: string;
        constructor(parentElement: any);
        public getOffset(): {
            x: number;
            y: number;
        };
        public getBBox(): {
            x: number;
            y: number;
            width: number;
            height: number;
            right: number;
            bottom: number;
        };
        public drawPath(ctx: any): void;
        public hitTest(x: any, y: any): any;
        public drawAll(ctx: any, container: any): void;
        public setPathPoints(value: string): void;
        public points(): string;
        public points(value: string): canvasPolygonElement;
        public genDrawFromPoints(): void;
        public getWidth(): number;
        public getHeight(): number;
    }
}

///----------------------------------------------------------------
/// (from canvas\canvasRectElement.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasRectElement extends canvasElement {
        public ctr: string;
        public tagName: string;
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public strokePlacement: string;
        public fill: string;
        public stroke: string;
        public layoutX: any;
        public layoutY: any;
        constructor(parentElement: any);
        public getOffset(): {
            x: number;
            y: number;
        };
        public getBBox(): {
            left: any;
            top: any;
            width: number;
            height: number;
            right: any;
            bottom: any;
        };
        public hitTest(x: any, y: any): any;
        public drawAll(ctx: any, container: any): void;
        public getWidth(): number;
        public getHeight(): number;
    }
}

///----------------------------------------------------------------
/// (from canvas\canvasTextElement.d.ts)
///----------------------------------------------------------------
declare module vp.canvas {
    class canvasTextElement extends canvasElement {
        public ctr: string;
        public tagName: string;
        public textContent: string;
        public opacity: number;
        public x: number;
        public y: number;
        public fill: string;
        public stroke: string;
        public width: number;
        public height: number;
        public fontWeight: any;
        public fontStyle: any;
        public verticalAlign: string;
        public layoutX: any;
        public layoutY: any;
        constructor(parentElement: any);
        public applyStyle(style: any): void;
        public hitTest(x: any, y: any): any;
        public getOffset(): {
            x: number;
            y: number;
        };
        public setContextForDrawing(ctx: CanvasRenderingContext2D): void;
        public drawAll(ctx: any, container: any): void;
        public getBBox(): {
            x: any;
            y: any;
            width: number;
            height: number;
            right: any;
            bottom: any;
        };
        public getWidth(): number;
        public getHeight(): number;
    }
}
declare module vp.layouts {
    /** A structure for accelerating N-body type calculations. */
    class quadTreeClass {
        public points: geom.IPoint[];
        public rootNode: quadNodeClass;
        constructor(points: geom.IPoint[]);
        public buildTree(): void;
        /** Visits each node of the tree in pre-order. */
        public visit(callback: any): void;
        /** Visits each node of the tree in post-order. */
        public visitPostOrder(callback: any, visitEmptyNodes?: boolean): void;
    }
    class quadNodeClass {
        public left: number;
        public top: number;
        public right: number;
        public bottom: number;
        public nodes: quadNodeClass[];
        public isLeaf: boolean;
        public point: geom.IPoint;
        constructor(left: number, top: number, right: number, bottom: number);
        public postOrder(callback: any, visitEmptyNodes: boolean): void;
        public insert(pt: geom.IPoint): boolean;
        public subdivide(): void;
        public visit(callback: any): void;
        public containsPoint(pt: geom.IPoint): boolean;
    }
    function createQuadTree(points: geom.IPoint[]): quadTreeClass;
}

///----------------------------------------------------------------
/// (from layouts\dragHelper.d.ts)
///----------------------------------------------------------------
declare module vp.layouts {
    /** Supports dragstart, drag, dragend events. */
    class dragHelperClass {
        public _onDragStartCallback: any;
        public _onDragCallback: any;
        public _onDragEndCallback: any;
        public _dragElem: any;
        public _ownerCallback: any;
        constructor(ownerCallback: any);
        public addElements(elements: HTMLElement[]): void;
        public addElement(elem: HTMLElement): void;
        public startDragging(e: any): void;
        public dragging(e: any): void;
        public endDragging(e: any): void;
        public onDragStart(callback: any): any;
        public onDrag(callback: any): any;
        public onDragEnd(callback: any): any;
    }
}

///----------------------------------------------------------------
/// (from layouts\forceLayout.d.ts)
///----------------------------------------------------------------
declare module vp.layouts {
    /** Layout of nodes and optional links using force directed layout. Supports start, tick, and end events. */
    class forceLayoutClass {
        public _nodes: IForceNode[];
        public _links: IForceLink[];
        public _timer: number;
        public _alpha: number;
        public _friction: number;
        public _gravity: number;
        public _charge: any;
        public _width: number;
        public _height: number;
        public _linkDistance: any;
        public _linkStrength: any;
        public _chargeDistance: number;
        public _theta: number;
        public _tickCount: number;
        public _onStartCallback: any;
        public _onTickCallback: any;
        public _onEndCallback: any;
        public _lastTickTime: number;
        public _lastDt: number;
        public _tickCallbackInProgress: boolean;
        public _dragHelper: dragHelperClass;
        public _quadTree: quadTreeClass;
        public _xDelta: number;
        public _yDelta: number;
        public _totalUpdateNodesTime: number;
        public _maxUpdateNodesTime: number;
        public _lastStatTime: number;
        public _onStatsCallback: any;
        constructor();
        /** Return a drag helper class, to assist caller in dragging elements associated with "nodes". */
        public getDragHelper(): dragHelperClass;
        public processDragEvent(name: string, dragElem: any, e: any): void;
        public start(): void;
        private innerStart(alphaValue);
        public initNodesAsNeeded(): void;
        public initLinksAsNeeded(): void;
        public stop(): void;
        public onStopped(): void;
        public resume(): void;
        public tick(startTimer?: boolean): void;
        public updateNodes(): void;
        public addMassToQuadTree(quadTree: quadTreeClass): void;
        public updateNode(node: IForceNode, quadTree: quadTreeClass, dt: any, lastDt: any): void;
        public computeLinkForces(node: IForceNode): {
            x: number;
            y: number;
        };
        public computeLinkForce(node: IForceNode, target: IForceNode, link: IForceLink, forceTotal: geom.IPoint): void;
        public computeNodeForces(fromNode: IForceNode, quadTree: quadTreeClass): {
            x: number;
            y: number;
        };
        public addForceWithDistance(from: geom.IPoint, to: geom.IPoint, charge: number, maxDistance: number, distOp: string, forceTotal: geom.IPoint): void;
        public computeQuadTreeNodeForce(node: IForceNode, qtNode: quadNodeMass, forceTotal: geom.IPoint): void;
        public onStart(callback: any): forceLayoutClass;
        public onTick(callback: any): forceLayoutClass;
        public onEnd(callback: any): forceLayoutClass;
        public onStats(callback: any): forceLayoutClass;
        public nodes(): IForceNode[];
        public nodes(value: IForceNode[]): forceLayoutClass;
        public links(): IForceLink[];
        public links(value: IForceLink[]): forceLayoutClass;
        public gravity(): number;
        public gravity(value: number): forceLayoutClass;
        public charge(): any;
        public charge(value: any): forceLayoutClass;
        public width(): number;
        public width(value: number): forceLayoutClass;
        public height(): number;
        public height(value: number): forceLayoutClass;
        public alpha(): number;
        public alpha(value: number): forceLayoutClass;
        public chargeDistance(): number;
        public chargeDistance(value: number): forceLayoutClass;
        public linkDistance(): number;
        public linkDistance(value: number): forceLayoutClass;
        public theta(): number;
        public theta(value: number): forceLayoutClass;
        public friction(): number;
        public friction(value: number): forceLayoutClass;
    }
    function createForceLayout(): forceLayoutClass;
    interface IForceNode {
        id: number;
        x: number;
        y: number;
        px: number;
        py: number;
        weight: number;
        charge: number;
        fixed: boolean;
        dragFixed: boolean;
    }
    interface IForceLink {
        source: IForceNode;
        target: IForceNode;
        distance: number;
        strength: number;
    }
    class quadNodeMass extends quadNodeClass {
        public totalMass: number;
        public xCom: number;
        public yCom: number;
    }
}
declare module vp.geom {
    interface IPoint {
        x: number;
        y: number;
    }
    interface ILocation {
        left: number;
        top: number;
    }
    interface ISize {
        width: number;
        height: number;
    }
    interface ITransform {
        sx: number;
        sy: number;
        tx: number;
        ty: number;
        angle: number;
        cx: number;
        cy: number;
    }
    class rectLight {
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        constructor(x: any, y: any, width: any, height: any);
    }
}

///----------------------------------------------------------------
/// (from geom\matrix4.d.ts)
///----------------------------------------------------------------
declare module vp.geom {
    class matrix4 {
        public length: number;
        constructor();
        public toArray(): any[];
        static fromFloats(m11: any, m12: any, m13: any, m14: any, m21: any, m22: any, m23: any, m24: any, m31: any, m32: any, m33: any, m34: any, m41: any, m42: any, m43: any, m44: any): matrix4;
        static identity(): matrix4;
        static invert(m: matrix4): matrix4;
        static createOrthographic(width: any, height: any, nearPlane: any, farPlane: any): matrix4;
        static createOrthographicOffCenter(left: any, right: any, bottom: any, top: any, near: any, far: any): matrix4;
        static createLookAt(eyePos: any, lookAt: any, up: any): matrix4;
        static createPerspectiveRH(width: any, height: any, zNear: any, zFar: any): matrix4;
        static createPerspectiveFovRH(fov: any, aspect: any, zNear: any, zFar: any): matrix4;
        static createPerspectiveOffCenterRH(left: any, right: any, bottom: any, top: any, zNear: any, zFar: any): matrix4;
        static multiplyVector(m: matrix4, v: vector4): vector4;
        static multiply(m: matrix4, m2: matrix4): matrix4;
        static transformPoint(mat: matrix4, v: vector3): vector3;
        static createTranslation(x: number, y: number, z: number): matrix4;
        static createScale(x: any, y: any, z: any): matrix4;
        /**Returns a matrix that does a rotation about the X axis by the specified angle in radians. */
        static createRotationX(angle: number): matrix4;
        /**Returns a matrix that does a rotation about the Y axis by the specified angle in radians. */
        static createRotationY(angle: number): matrix4;
        /**Returns a matrix that does a rotation about the Z axis by the specified angle in radians. */
        static createRotationZ(angle: number): matrix4;
        /** Returns a matrix that rotates about the z (yaw), y (pitch), and x (roll) axes.  All
        angles are specified in radians. */
        static createFromYawPitchRoll(yaw: number, pitch: number, roll: number): matrix4;
    }
}

///----------------------------------------------------------------
/// (from geom\point2.d.ts)
///----------------------------------------------------------------
declare module vp.geom {
    class point2 {
        public x: number;
        public y: number;
        constructor(x?: number, y?: number);
    }
    function createPoint2(x?: number, y?: number): point2;
}

///----------------------------------------------------------------
/// (from geom\point3.d.ts)
///----------------------------------------------------------------
declare module vp.geom {
    class point3 {
        public x: number;
        public y: number;
        public z: number;
        constructor(x?: number, y?: number, z?: number);
    }
    function createPoint3(x?: number, y?: number, z?: number): point3;
}

///----------------------------------------------------------------
/// (from geom\rect.d.ts)
///----------------------------------------------------------------
declare module vp.geom {
    function createRect(left: number, top: number, w: number, h: number): ClientRect;
    function rect(left: number, top: number, w: number, h: number): ClientRect;
    function rectFromPoints(pt1: any, pt2: any): {
        left: number;
        top: number;
        width: number;
        height: number;
        right: number;
        bottom: number;
    };
    function rectContainsPoint(rc: any, pt: any): boolean;
    function rectContainsRect(rcOuter: any, rcInner: any): boolean;
    function rectIntersectsRect(rc1: any, rc2: any): boolean;
    function rectIntersectsSvgShape(rc: any, shape: any): boolean;
    function rectIntersectsAreaPolygon(rc: any, pointStr: any): boolean;
    function rectIntersectsLine(rc: any, x1: any, y1: any, x2: any, y2: any): boolean;
    function offsetRect(rc: any, xoff: any, yoff: any): {
        left: any;
        top: any;
        width: any;
        height: any;
        right: any;
        bottom: any;
    };
}

///----------------------------------------------------------------
/// (from geom\vector2.d.ts)
///----------------------------------------------------------------
declare module vp.geom {
    class vector2 {
        public x: number;
        public y: number;
        constructor(x?: number, y?: number);
        static add(v: vector2, v2: vector2): vector2;
        static subtract(v: vector2, v2: vector2): vector2;
        static multiply(v: vector2, s: number): vector2;
        static dot(v: vector2, v2: vector2): number;
        static normal(v: vector2): vector2;
    }
    function createVector2(x?: number, y?: number): vector2;
}

///----------------------------------------------------------------
/// (from geom\vector3.d.ts)
///----------------------------------------------------------------
declare module vp.geom {
    class vector3 {
        public x: number;
        public y: number;
        public z: number;
        constructor(x?: number, y?: number, z?: number);
        static add(v: vector3, v2: vector3): vector3;
        static subtract(v: vector3, v2: vector3): vector3;
        static multiply(v: vector3, s: number): vector3;
        static cross(v: vector3, v2: vector3): vector3;
        static dot(v: vector3, v2: vector3): number;
        static normal(v: vector3): vector3;
        static normalToPoints(pt1: point3, pt2: point3, pt3: point3): vector3;
        static zero(): vector3;
        static up(): vector3;
    }
    function createVector3(x?: number, y?: number, z?: number): vector3;
}

///----------------------------------------------------------------
/// (from geom\vector4.d.ts)
///----------------------------------------------------------------
declare module vp.geom {
    class vector4 {
        public x: number;
        public y: number;
        public z: number;
        public w: number;
        constructor(x: number, y: number, z: number, w: number);
        static add(v: vector4, v2: vector4): vector4;
        static subtract(v: vector4, v2: vector4): vector4;
        static multiply(v: any, s: any): vector4;
        static dot(v: any, v2: any): number;
        static normal(v: any): vector4;
        static zero(): vector4;
    }
}
declare module vp.paths {
    function buildPie(data: any[], cx: number, cy: number, innerRadius: number, outerRadius: number, createCanvasPath: boolean, callback: any): any[];
    function getPieSlicePath(xCenter: number, yCenter: number, innerRadius: number, outerRadius: number, angleDegrees: number, rotation: number, createCanvasPath?: boolean): string;
    function getPieSlicePathSvg(xCenter: number, yCenter: number, innerRadius: number, outerRadius: number, angleDegrees: number, rotation: number): string;
    function getPieSlicePathCanvas(xCenter: number, yCenter: number, innerRadius: number, outerRadius: number, angleDegrees: number, rotation: number): string;
}

///----------------------------------------------------------------
/// (from paths\curveFitting.d.ts)
///----------------------------------------------------------------
declare module vp.curveFitting {
    function line(xa: any, ya: any): {};
    function polyFit(xa: any, ya: any, degree: any): {
        coef: any[];
        sigma: number;
    };
    function weightedLinearRegression(xa: any, ya: any, wa: any): {
        coef: number[];
    };
    function exponentialFit(xa: any, ya: any): {
        coef: number[];
    };
    function linearRegression(xa: any, ya: any, f: any): {
        coef: any[];
        sigma: number;
    };
    function spline(xx: any, yy: any): any[];
}

///----------------------------------------------------------------
/// (from paths\paths.d.ts)
///----------------------------------------------------------------
declare module vp.paths {
    function buildShape(shapeName: string, x: number, y: number, size: number, createCanvasPath?: boolean): string;
    function buildLine(data: any[], buildSinglePath: boolean, callback: any): any[];
    function buildArea(data: any[], callback: any): any[];
    function buildSpline(data: any[], callback: any): any[];
}

///----------------------------------------------------------------
/// (from paths\shapeData.d.ts)
///----------------------------------------------------------------
declare module vp.paths {
    function getPathDataForShape(shapeType: ShapeType, x: number, y: number, w: number, h: number, createCanvasPath?: boolean): string;
    enum ShapeType {
        circle = 0,
        diamond = 1,
        hexagram = 2,
        pentagram = 3,
        square = 4,
        triangleUp = 5,
        triangleDown = 6,
        triangleLeft = 7,
        triangleRight = 8,
        asterisk = 9,
        x = 10,
        plus = 11,
        plusInDiamond = 12,
        plusInCircle = 13,
        plusInSquare = 14,
        triangleUpDown = 15,
        triangleInSquare = 16,
        xInCircle = 17,
        xInSquare = 18,
    }
    var ShapeTypeNames: string[];
}
declare module vp.plotBox {
    interface AxisOptions {
        showAxis: boolean;
        showTitle: boolean;
        showGridLines: boolean;
        showTicks: boolean;
        showLabels: boolean;
        title: string;
        scale: scales.IScaleRun;
    }
}

///----------------------------------------------------------------
/// (from plotBox\plotBox.d.ts)
///----------------------------------------------------------------
declare module vp.plotBox {
    class plotBoxClass {
        public _transform3d: transform3dClass;
        public _canvas: HTMLCanvasElement;
        public _ctx: CanvasRenderingContext2D;
        public _width: number;
        public _height: number;
        constructor();
        public width(): number;
        public width(value: number): plotBoxClass;
        public height(): number;
        public height(value: number): plotBoxClass;
        public draw(xOptions: AxisOptions, yOptions: AxisOptions, zOptions: AxisOptions): ClientRect;
    }
    function createPlotBox(): plotBoxClass;
}

///----------------------------------------------------------------
/// (from plotBox\transform3d.d.ts)
///----------------------------------------------------------------
declare module vp.plotBox {
    interface IElevationCamera {
        getZoom(): number;
        getX(): number;
        getY(): number;
        getElevation(): number;
        getRotation(): number;
        getMatrix(): geom.matrix4;
        getScreenMatrix(): geom.matrix4;
        setZoom(value: number): any;
        setX(value: number): any;
        setY(valuex: number): any;
        setElevation(value: number): any;
        setRotation(value: number): any;
        screenWidth(): number;
        screenWidth(value: number): transform3dClass;
        screenHeight(): number;
        screenHeight(value: number): transform3dClass;
        xMin(): number;
        xMin(value: number): transform3dClass;
        yMin(): number;
        yMin(value: number): transform3dClass;
        xMax(): number;
        xMax(value: number): transform3dClass;
        yMax(): number;
        yMax(value: number): transform3dClass;
        adjustZoom(value: number, x: number, y: number): any;
        rebuild(): any;
        resetCamera(): any;
    }
    /** This class uses azimuth and elevation to project point3s from 3D space to 2D space. */
    class transform3dClass implements IElevationCamera {
        public _xFact: number;
        public _yFact: number;
        public _xShift: number;
        public _yShift: number;
        public _azimuth: number;
        public _elevation: number;
        public _screenWidth: number;
        public _screenHeight: number;
        public _xOffset: number;
        public _yOffset: number;
        public _xScale: number;
        public _yScale: number;
        public _xMin: number;
        public _xMax: number;
        public _yMin: number;
        public _yMax: number;
        public _zMin: number;
        public _zMax: number;
        public _mat: geom.matrix4;
        public _mainMat: geom.matrix4;
        public _matScreen: geom.matrix4;
        public _origWidth: number;
        public _xRange: number;
        public _yRange: number;
        public _zRange: number;
        public _isScreenOutput: boolean;
        /** builds a 3D matrix that can be used to translate point3s from 3D to 2D.  The projection
        is specified by an azimuth and an elevation (both in degrees of rotation).  The
        standard MATLAB setting for a 3D view is azimuth=-37.5, elevation=30.  For a direct overhead (2D)
        view, use azimuth=0, elevation=90. */
        constructor(screenWidth?: number, screenHeight?: number, azimuth?: number, elevation?: number, xMin?: number, xMax?: number, yMin?: number, yMax?: number, zMin?: number, zMax?: number, isScreenOutput?: boolean);
        public getZoom(): number;
        public getX(): number;
        public getY(): number;
        public getElevation(): number;
        public getRotation(): number;
        public setZoom(value: number): void;
        public setX(value: number): void;
        public setY(value: number): void;
        public setElevation(value: number): void;
        public setRotation(value: number): void;
        public resetCamera(): void;
        public getMatrix(): geom.matrix4;
        public getScreenMatrix(): geom.matrix4;
        public rebuild(): transform3dClass;
        public transformPointEx(x: number, y: number, z: number): geom.vector3;
        public adjustZoom(scaleFactor: number, x: number, y: number): void;
        private safeRange(max, min);
        private testTheMatrix();
        public xMin(): number;
        public xMin(value: number): transform3dClass;
        public xMax(): number;
        public xMax(value: number): transform3dClass;
        public yMin(): number;
        public yMin(value: number): transform3dClass;
        public yMax(): number;
        public yMax(value: number): transform3dClass;
        public screenWidth(): number;
        public screenWidth(value: number): transform3dClass;
        public screenHeight(): number;
        public screenHeight(value: number): transform3dClass;
        /** transform a point3 from 3D to 2D */
        public transformPoint(x: number, y: number, z: number): geom.point3;
    }
    function createTransform3d(screenWidth?: number, screenHeight?: number, azimuth?: number, elevation?: number, xMin?: number, xMax?: number, yMin?: number, yMax?: number, zMin?: number, zMax?: number, isScreenOutput?: boolean): transform3dClass;
}
declare module vp.scales {
    /** base class for scales.  it maps an input value into a palette of range values.  An optional
    stops[] can be used to place the range values non-linearly (like a gradient definiton).  "T"
    is the final subclass of baseScaleClass (for correctly typed property setter functions).  */
    interface IScale {
        /** Allows caller to override normal percent-to-color mapping with his own mapping.  */
        mappingCallback(): any;
        mappingCallback(value: any): IScale;
        /** maps an input (domain) value to an output (range) value.  Range values are defined by the palette property. */
        scale(value: any): any;
    }
    class baseScaleClass<T extends IScaleRun> implements IScaleRun {
        public ctr: string;
        public scaleName: string;
        public _palette: any[];
        public _expandSpace: number;
        public _stops: number[];
        public _isRangeClipping: boolean;
        public _domainMin: number;
        public _domainMax: number;
        public _isPaletteDiscrete: any;
        public _mappingCallback: any;
        public _scaleType: ScaleType;
        public _categoryKeys: {};
        public _nextKeyIndex: number;
        public _domainDelta: number;
        public _userSetCategoryKeys: boolean;
        constructor();
        /** The amount of space between the edges of the range space and the first/last break.  */
        public expandSpace(): number;
        public expandSpace(value: number): T;
        /** Allows caller to override normal percent-to-color mapping with his own mapping.  */
        public mappingCallback(): any;
        public mappingCallback(value: any): T;
        /** when true, we map each input category value to next palette entry.  */
        public isPaletteDiscrete(): boolean;
        public isPaletteDiscrete(value: boolean): T;
        /** Specifies how to handle values outside the domain that then get potentially mapped to values outside of the range. */
        public isRangeClipping(): boolean;
        public isRangeClipping(value: boolean): T;
        /** Specifies if this scales is linear, categorical, or categorical with no duplicates. */
        public scaleType(): ScaleType;
        public scaleType(value: ScaleType): T;
        /** specifies a set of values to be mapped to.
        The values can be passed as an array, or as multiple arguments. */
        public palette(): any[];
        public palette(value: any[]): T;
        /** specifies the minimum value to be mapped to.  Provided as legacy access to palette property. */
        public rangeMin(): number;
        public rangeMin(value: number): T;
        /** specifies the maximum value to be mapped to.  Provided as legacy access to palette property. */
        public rangeMax(): number;
        public rangeMax(value: number): T;
        public onRangeChanged(): void;
        public onPaletteChanged(): void;
        /** specifies a set stop values to be used in parallel withe the palette[].
        The values can be passed as an array, or as multiple arguments. */
        public stops(value?: number[]): T;
        public domainMin(): number;
        public domainMin(value: number): T;
        public domainMax(): number;
        public domainMax(value: number): T;
        public onDomainChanged(): void;
        public resetKeys(): void;
        public categoryKeys(): string[];
        public categoryKeys(value: string[]): T;
        public setCategoryKeys(keys: string[]): void;
        public onMapTypeChanged(): void;
        /** this gets replaced by one of the 3 scale routines internally. */
        public scale: (value: any, seriesIndex?: any) => any;
        public categoryScale(recordIndex: number): any;
        public getIndexOfKey(value: any): number;
        public categoryKeyScale(value: any): any;
        public clip(value: number, min: number, max: number): number;
        public calcPercent(value: number): number;
        public lerpPalette(t: number, palette: any[]): any;
        public lerpScale(value: any, rangePalette?: number[]): any;
        public lerp(num: number, num2: number, t: number): number;
        public interpolateValues(min: any, max: any, t: any): any;
    }
    class baseScale extends baseScaleClass<baseScale> {
    }
    /** type of mapping used in scales to extract values from a range palette. */
    enum ScaleType {
        /** use normalized input value to interplate between palette entries. */
        linear = 0,
        /** take log of input values before doing linear scale to range. */
        log = 1,
        /** use itemIndex as index into palette. */
        category = 2,
        /** use a map to track unique values and use key index as index into palette. */
        categoryKey = 3,
        /** simliar to linear, but with support for nice date breaks and formatting on axis/legend. */
        dateTime = 4,
    }
    /** interface for using a scale from an axis, chart, etc. (vs. setting its properties). */
    interface IScaleRun {
        scaleName: string;
        scaleType(): ScaleType;
        scaleType(value: ScaleType): IScaleRun;
        domainMin(): number;
        domainMin(value: number): IScaleRun;
        domainMax(): number;
        domainMax(value: number): IScaleRun;
        rangeMin(): number;
        rangeMin(value: number): IScaleRun;
        palette(): any[];
        palette(value: string[]): IScaleRun;
        categoryKeys(): string[];
        categoryKeys(value: string[]): IScaleRun;
        expandSpace(): number;
        expandSpace(value: number): IScaleRun;
        scale(value: any, seriesIndex?: number): any;
    }
    interface ICategoryScale extends IScaleRun {
        stepSize(): number;
    }
}

///----------------------------------------------------------------
/// (from scales\categoryScale.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    class categoryScaleClass extends baseScale {
        public _rangeBounds: number[];
        public _stepSize: number;
        constructor();
        public stepSize(): number;
        /** setter can pass a single array argument, or a set of values. */
        public domain(): any[];
        public domain(...args: any[]): categoryScaleClass;
        /** setter can pass a single array argument, or a set of values. */
        public range(): any[];
        public range(...args: any[]): categoryScaleClass;
        public rangeFromBounds(...args: number[]): categoryScaleClass;
        public onRangeChanged(): void;
        public computeRangeFromBounds(): void;
        public map(value: string): any;
    }
    function createCategory(): categoryScaleClass;
}

///----------------------------------------------------------------
/// (from scales\formatters.d.ts)
///----------------------------------------------------------------
declare module vp.formatters {
    function comma(value: any, numDecimalPlaces?: number, forceDecimalPlaces?: boolean, removeLeadingSingleZero?: boolean): any;
    function percent(value: any, numDecimalPlaces: any): any;
    function dollar(value: any, numDecimalPlaces: any): any;
    function scientific(value: any, numDecimalPlaces: any): any;
    function date(value: any): any;
    function string(value: any): string;
    function format(value: any): any;
}

///----------------------------------------------------------------
/// (from scales\linearScale.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    class linearScaleClass extends baseScale {
        constructor();
        public domain(): number[];
        public domain(min: number, max: number): linearScaleClass[];
        public range(): number[];
        public range(min: number, max: number): linearScaleClass[];
        public map(value: number): any;
    }
    function createLinear(): linearScaleClass;
}

///----------------------------------------------------------------
/// (from scales\logScale.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    class logScaleClass extends baseScale {
        constructor();
        public domain(): number[];
        public domain(min: number, max: number): linearScaleClass[];
        public range(): number[];
        public range(min: number, max: number): linearScaleClass[];
        public map(value: number): any;
        public calcPercent(value: number): number;
    }
    function createLog(): logScaleClass;
}

///----------------------------------------------------------------
/// (from scales\niceNumbers.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    /** settings for an attribute (value, scaling, and legend data). */
    class niceNumbers {
        static calculate: (dataMin: number, dataMax: number, extendDomainToZero: boolean, useOnlyIntBreaks: boolean, callerMin?: number, callerMax?: number, callerTickCount?: number, addmaxHeadroom?: boolean) => any;
        private static calcIncr;
        private static calcMinMax;
    }
}
declare module vp.data {
    interface IGroupData {
        key: string;
        values: any[];
    }
}
declare module vp.session {
    function changeAgent(viewName: any, shareName: any, appName: any, externalShare: any, dataChangedFunc: any): any;
    function currentTheme(): any;
    function themeMgr(): any;
    function query(): any;
}
declare module vp.utils {
    function argCheck(args: any, funcName: any, minArgs: any, maxArgs: any, argTypes: any): any;
    function isDataNumeric(data: any): boolean;
    function ready(onReadyCallback: any): any;
    function zoomBoxHelper(wrappedElement: any): any;
}
declare module vp.stats {
    function statIdentity(): any;
    function statBoxPlot(): any;
    function statDensity(): any;
    function statBin(): any;
    function statBin2d(): any;
    function statSpaceFill(): any;
    function binParams(binCount: number, forceCategory: boolean, usePercent: boolean, niceBuckets: boolean): void;
}
declare module vp.file {
    function httpRead(url: string, isJson: boolean, successFunc: any, failFunc?: any, callAsync?: boolean): any;
    function getJsonFromResponse(txt: string): any;
    function bigDataPath(fn: string): any;
    function csvToJson(csv: any, hasHeader: any, sepChar: any, findTypes: any): any;
}
declare module vp.visuals {
    interface IControl extends dom.IWrapper<IControl> {
    }
    function verticalScrollBar(): any;
    function ribbonGroup(): any;
    function ribbonBar(): any;
    function categoryAxis(): IControl;
    function gridLines(): IControl;
    function legend(): IControl;
    function numericAxis(): IControl;
    function scrollbar(): IControl;
    function scrollViewer(): IControl;
    function createChartFrame(): any;
    function toolTip(ttDiv: any, ttShowingFunc: any, swapCtrlKey?: boolean): void;
    enum LabelFit {
        /** Just draw all labels and let any overlaps happen */
        drawAll = 0,
        /** Skip 0-N labels, as needed, to make the others fit without overlap */
        skip = 1,
        /** Truncate labels, as needed, so that they don't exceed their available space. */
        truncate = 2,
        /** If all labels cannot be drawn without overlap, rotate the labels 45 degrees to allow them to fit better. */
        rotate45 = 3,
        /** If all labels cannot be drawn without overlap, rotate the labels 90 degrees to allow them to fit better. */
        rotate90 = 4,
        /** If all labels cannot be drawn without overlap, rotate the labels 45 or 90 degrees to allow them to fit better. */
        rotateAuto = 5,
        /** If all labels cannot be drawn without overlap, hide them all. */
        hideAll = 6,
    }
}
declare module vp.geom {
    interface Point3d {
        x: number;
        y: number;
        z: number;
    }
}
declare module vp {
}
declare module vp.internal {
    var textElemJustDrawn: any;
    function drawText(group: any, da: any, x: any, y: any, width: any, height: any, halign: any, valign: any, rotation: any, cxRot: any, cyRot: any): {
        width: number;
        height: number;
    };
    function drawHLine(group: any, da: any, x1: any, x2: any, y: any): void;
    function drawVLine(group: any, da: any, y1: any, y2: any, x: any): void;
    function applyTextAttributes(elem: any, da: any, alignText?: boolean, negativeTextAdjust?: string): void;
    function calculateTextAdjust(textElem: any, hAlign: any, vAlign: any): {
        x: number;
        y: number;
    };
    function applyShapeAttributes(elem: any, da: any): void;
    function applyShapeAttributesU(uelem: any, da: any): void;
    function applyLineAttributes(elem: any, da: any): void;
    function applyLineAttributesU(uelem: any, da: any): void;
    function drawBox(group: any, da: any, x: any, y: any, w: any, h: any): any;
}
declare module vp.visuals {
    /** Creates a helper for doing rectangular drag selections on HTML, SVG< and Canvas elements.
    canvasUW - SVG or HTML element that will be used to drag out and draw the selection rectangle
    selectCallback - the function that will be called when the user completes the selection action. */
    class rubberBandSelector {
        private _isEnabled;
        private isBanding;
        private ptMouseDown;
        private rubberBand;
        private canvas;
        private isSvgCanvas;
        private selectCallback;
        constructor(canvasUW: any, selectCallback: any);
        private initBuild();
        private setRubberBand(rc);
        private clearRubberBand();
        private cancelBanding(clearBanding, evt);
        private isToggleKey(evt);
        private onUp(evt);
        private onMove(evt);
        private onDown(evt);
        public isEnabled(): boolean;
        public isEnabled(value: boolean): rubberBandSelector;
    }
    function createRubberBandSelector(canvasUW: any, selectCallback: any): rubberBandSelector;
}
declare module vp.layers {
    class mappingsClass<T> {
        public ctr: string;
        public _data: any[];
        public _x: scales.attributeClass;
        public _y: scales.attributeClass;
        public _yMin: scales.attributeClass;
        public _yMax: scales.attributeClass;
        public _yOpen: scales.attributeClass;
        public _yClose: scales.attributeClass;
        public _xEnd: scales.attributeClass;
        public _yEnd: scales.attributeClass;
        public _stroke: scales.attributeClass;
        public _fill: scales.attributeClass;
        public _opacity: scales.attributeClass;
        public _lineType: scales.attributeClass;
        public _shapeType: scales.attributeClass;
        public _lineSize: scales.attributeClass;
        public _shapeSize: scales.attributeClass;
        public _textSize: scales.attributeClass;
        public _textFill: scales.attributeClass;
        public _label: scales.attributeClass;
        public _hAlign: number;
        public _vAlign: number;
        public _fontFamily: string;
        public _stackType: string;
        public _key: any;
        public _key2: any;
        public _showOutliers: boolean;
        public _direction: string;
        public _fillRule: string;
        public yIntercept: any;
        public xIntercept: any;
        public slope: any;
        constructor();
        public pop(): T;
        public markRebuildNeeded(): void;
        public capitalize(str: string): string;
        public generalProp(propName: string): scales.attributeClass;
        public generalProp(propName: string, scaleName?: string, args?: any): T;
        public x(): scales.attributeClass;
        public x(firstValue: any): T;
        public y(): scales.attributeClass;
        public y(firstValue: any): T;
        public stroke(): scales.attributeClass;
        public stroke(firstValue: any): T;
        public fill(): scales.attributeClass;
        public fill(firstValue: any): T;
        public lineSize(): scales.attributeClass;
        public lineSize(firstValue: any): T;
        public shapeSize(): scales.attributeClass;
        public shapeSize(firstValue: any): T;
        public textSize(): scales.attributeClass;
        public textSize(firstValue: any): T;
        public textFill(): scales.attributeClass;
        public textFill(firstValue: any): T;
        public lineType(): scales.attributeClass;
        public lineType(firstValue: any): T;
        public label(): scales.attributeClass;
        public label(value: any): T;
        public hAlign(): scales.attributeClass;
        public hAlign(value: any): T;
        public vAlign(): scales.attributeClass;
        public vAlign(value: any): T;
        public yMin(): scales.attributeClass;
        public yMin(value: any): T;
        public yMax(): scales.attributeClass;
        public yMax(value: any): T;
        public xEnd(): scales.attributeClass;
        public xEnd(value: any): T;
        public yEnd(): scales.attributeClass;
        public yEnd(value: any): T;
        public yOpen(): scales.attributeClass;
        public yOpen(value: any): T;
        public yClose(): scales.attributeClass;
        public yClose(value: any): T;
        public opacity(): scales.attributeClass;
        public opacity(firstValue: any): T;
        public shapeType(): scales.attributeClass;
        public shapeType(value: any): T;
        public fillRule(): string;
        public fillRule(value: string): T;
        public fontFamily(): string;
        public fontFamily(value: string): T;
        public stackType(): string;
        public stackType(value: string): T;
        public key(): any;
        public key(value: any): T;
        public key2(): string;
        public key2(value: string): T;
        public showOutliers(): boolean;
        public showOutliers(value: boolean): T;
        public direction(): any;
        public direction(value: any): T;
        public onKeyChanged(): void;
        public onKey2Changed(): void;
    }
}

///----------------------------------------------------------------
/// (from layers\-baseLayer.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /**  the base class for a plotLayer object. "T" is the outer layer class. */
    class baseLayerClass<T> extends mappingsClass<T> {
        /** public field that gives the name of the class */
        public ctr: string;
        /** public field that provides information about drawShapes caller */
        public info: ILayerInfo;
        public _drawnShapes: any[];
        /** True if this layer supports 0-N series of data (used by dataAnimMgr). */
        public _isSeriesLayer: boolean;
        public _dataAnimMgr: animation.dataAnimMgrExClass;
        public _newTagOrFunc: any;
        public _data2: any;
        public _dataAnimMgr2: animation.dataAnimMgrExClass;
        public _newTagOrFunc2: any;
        public _xAttr: scales.attributeClass;
        public _yAttr: scales.attributeClass;
        public _xDefaults: attrDefaults;
        public _yDefaults: attrDefaults;
        public _plotDefaults: plotDefaults;
        public _filter: any;
        public _toolTipFormatter: IToolTipFormatter;
        public _container: any;
        public _defaultStackType: string;
        public _vvParent: any;
        public _stat: any;
        public _layerType: any;
        public _postCreateFunc: any;
        public _postUpdateShapes: any;
        public _seriesAxis: string;
        public _toolTipCols: boolean;
        public _isAnimEnabled: boolean;
        public _animDuration: number;
        public _key: any;
        public _key2: any;
        public _chartName: any;
        public _xColAfterStat: any;
        public _yColsAfterStat: any;
        public _xCol2AfterStat: any;
        public _yCols2AfterStat: any;
        public _layerId: number;
        public _isStrokeMapped: boolean;
        public _isFillMapped: boolean;
        public _isOpacityMapped: boolean;
        public _isLineTypeMapped: boolean;
        public _isShapeTypeMapped: boolean;
        public _isShapeSizeMapped: boolean;
        public _isLineSizeMapped: boolean;
        public _isTextSizeMapped: boolean;
        public _isTextFillMapped: boolean;
        public _isTextLabelMapped: boolean;
        constructor();
        public error(msg: string): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<T>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        public prepScaleIfNeeded(attrs: any, seriesNames: string[], attrName: string): void;
        public prepAttrScaleIfNeeded(attr: scales.attributeClass, seriesNames: string[]): void;
        public getActiveAttributes(): any[];
        public onChartRebuild(): void;
        public toolTipFormatter(): IToolTipFormatter;
        public toolTipFormatter(value?: IToolTipFormatter): T;
        public vvParent(): any;
        public vvParent(value?: any): T;
        public onKeyChanged(): void;
        public onKey2Changed(): void;
        public layerType(): string;
        public layerType(value?: string): T;
        public stat(): any;
        public stat(value?: any): T;
        public statType(value: any): any;
        public toolTipCols(): any;
        public toolTipCols(value?: any): T;
        public getItemStroke(seriesIndex: number, itemIndex: number, filteredData: any[], daStroke: any): any;
        public getItemFill(seriesIndex: number, itemIndex: number, filteredData: any[], daFill: any): any;
        public formatValue(value: any, colName: any, seriesIndex: any): any;
        public defaultFormatValue(value: any, colName: any, seriesIndex: any): any;
        /** subclass should implement this, if needed */
        public adjustChartOptions(): void;
        public calculateTextAdjust(textElem: any, hAlign: any, vAlign: any): {
            x: number;
            y: number;
        };
        public getItemOpacity(seriesIndex: any, itemIndex: any, filteredData: any, da: any): any;
        public getSizeCore(seriesIndex: any, itemIndex: any, filteredData: any, da: any, sizeName: string): any;
        public getTextSize(seriesIndex: any, itemIndex: any, filteredData: any, da: any): any;
        public getTextFill(seriesIndex: any, itemIndex: any, filteredData: any, da: any): any;
        public getItemLabel(seriesIndex: any, itemIndex: any, filteredData: any, da: any): any;
        public pop(): any;
        public getLineType(seriesIndex: any, itemIndex: any, filteredData: any, da: any): any;
        public addConstantDrawingAttributes(da: any, seriesIndex: any, filteredData: any): any;
        public addToList(list: any, name: any, value: any): void;
        public updateDrawingAttributes(daList: any, seriesIndex: number, itemIndex: number, filteredData: any[]): void;
        public setElementInfo(elem: any, dataId: any, seriesIndex: any): void;
        public setElementInfoU(uelem: any, dataId: any, seriesIndex: any): void;
        public applyLineAttributes(elem: any, da: any): void;
        public applyShapeAttributes(elem: any, da: any): void;
        public applyTextAttributes(elem: any, da: any, negativeTextAdjust?: string): void;
        public getItemShapeType(seriesIndex: any, itemIndex: any, filteredData: any, da: any): any;
        public attributes(): baseLayerClass<T>;
        public xBeforeStat(): {
            value: string[];
            isConstant: boolean;
        };
        public yBeforeStat(): {
            value: string[];
            isConstant: boolean;
        };
        public xAfterStat(): any;
        public yAfterStat(): any;
        public buildFrameFromValue(value: any, name: any): any[];
        public addValueToFrame(data: any, value: any, name: any): any;
        public combineConstantAndMappedData(inData: any, idDataId: any): {
            xInfo: any;
            yInfo: any;
            dataId: any;
            data: any;
        };
        public runStatOnData(inData: any, inDataId: any): IDataCombo;
        public buildDam(): void;
        public buildDam2(): void;
        public isAnimEnabled(): boolean;
        public isAnimEnabled(value?: boolean): T;
        public animDuration(): number;
        public animDuration(value?: number): T;
        public seriesAxis(): string;
        public seriesAxis(value?: string): T;
        public onAnimChanged(): void;
        public ensureDataAnimMgrExists(): void;
        public ensureDataAnimMgr2Exists(): void;
        public applyFilter(filterQuery: any, isNewDataSet: any, onlySetFilter?: boolean): baseLayerClass<T>;
        /** Set mapping of series columns. */
        public setSeriesNamesForAnimation(value: string[]): void;
        public getAllData(): IDataCombo;
        public updateShapeVisuals(selectionCount: any, daSelected: any, daUnselected: any, daHover: any): void;
        public updateSingleShapeVisuals(elem: any, daSelected: any, daUnselected: any, daHover: any, selectionCount: any, isHighlighted: any, isSelected: any): void;
        public getAllData2(): IDataCombo;
        public validateData(data: any[]): any[];
        public data(): any;
        public data(value: any, isNewDataSet?: boolean): T;
        public data2(): any;
        public data2(value2: any, isNewDataSet?: boolean): T;
        public onPlotDataChanged(isNewDataSet: any): void;
        public getProp(la: scales.attributeClass, pa: scales.attributeClass, propName: string): any;
        public bindProperties(): void;
        public onPlotData2Changed(isNewDataSet: any): void;
        public markRebuildNeeded(): baseLayerClass<T>;
        public defaultStackType(): string;
        public defaultStackType(value: string): T;
        public chartName(): string;
        public chartName(value: string): T;
        public postCreate(): any;
        public postCreate(value: any): T;
        public dataAnimMgr(): any;
        public dataAnimMgr(value: any): T;
        public dataAnimMgr2(): any;
        public dataAnimMgr2(value: any): T;
        public newTagOrFunc(): any;
        public newTagOrFunc(value: any): T;
        public newTagOrFunc2(): any;
        public newTagOrFunc2(value: any): T;
        public container(): any;
        public container(value: any): T;
        public remove(): void;
        public postUpdateShapes(): number;
        public postUpdateShapes(value: number): T;
        public postDraw(layInfo: any, shapes: any): baseLayerClass<T>;
    }
    class baseLayer extends baseLayerClass<baseLayer> {
    }
    interface IDataRecordInfo {
        data: any;
        name: string;
        colName: string;
        tooltip: string;
        autoGenerated: boolean;
    }
    interface IDrawAttrBlock {
        left: number;
        shapeSize: any;
        fill: any;
        stroke: any;
        lineSize: any;
        hAlign: number;
        vAlign: number;
    }
    /** used to pass information about series stacking type from chart to layer. */
    interface ISeriesInfo {
        stackType: any;
        itemAccums: number[];
        itemAccumsNeg: number[];
        itemTotals: number[];
    }
    interface IDataCombo {
        data: any[];
        xCol: string[];
        yCols: string[];
        dataId: number;
    }
    interface IRecordColumInfo {
        data: any[];
        name: string;
        title: string;
        tooltip: string;
        autoGenerated: boolean;
    }
    interface ILayerInfo {
        seriesCount: number;
        xSeriesCount: number;
        ySeriesCount: number;
        seriesNames: string[];
        dataRecords: any[];
        filteredData: any[];
        keyFunc: any;
        stackType: any;
        xRecords: IRecordColumInfo[];
        yRecords: IRecordColumInfo[];
        byRecords: IRecordColumInfo[];
        plotRecords: IRecordColumInfo[];
        /** is this still used? */
        swapAxes: boolean;
        /** root of HTML shapes drawing layer. */
        htmlShapesGroup: dom.IWrapperOuter;
        /** An early attempt to type a chart, based on the primary layer.  Mostly obsolete now. */
        chartType: string;
        width: number;
        height: number;
    }
    interface IToolTipFormatter {
        (value: any, colName: string, seriesIndex: number): string;
    }
}

///----------------------------------------------------------------
/// (from layers\-line.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /**  the base class for the LINE LAYER class. "T" is the outer layer class. */
    class lineSuperClass<T extends lineClass> extends baseLayerClass<T> {
        constructor();
        public toolTipFormatter(): IToolTipFormatter;
        public toolTipFormatter(value?: IToolTipFormatter): T;
        public adjustChartOptions(): void;
        public getX(index: number, xRecord: any, xScale: any, xIsCategoryScale: boolean): any;
        public getY(index: number, yRecord: any, yScale: any, pi: ISeriesInfo): any;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<T>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    class lineClass extends lineSuperClass<lineClass> {
    }
    function createLine(): lineClass;
}

///----------------------------------------------------------------
/// (from layers\-tile.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** create a fixed size "tile" layer for a plot.  Tiles are layed out in a grid, starting with the upper left corner of the plot.
    The tile layer supports optional "x" and "y" mapped, which are used only to provide category labels for the x and y axes.
    For a variable sized tile plot, see the "xyTile" class. */
    class tileSuperClass<T extends tileClass> extends baseLayerClass<T> {
        public _numCols: any;
        public _dummy: number;
        constructor();
        public adjustChartOptions(): void;
        public getNumCols(numRows: number, xRecord: IDataRecordInfo): any;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<T>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        public numCols(): number;
        public numCols(value: number): tileSuperClass<T>;
    }
    class tileClass extends tileSuperClass<tileClass> {
    }
    function createTile(): tileClass;
}

///----------------------------------------------------------------
/// (from layers\-xyTile.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    class xyTileSuperClass<T extends xyTileClass> extends baseLayerClass<T> {
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<T>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    class xyTileClass extends xyTileSuperClass<xyTileClass> {
    }
    function createXyTile(): xyTileClass;
}

///----------------------------------------------------------------
/// (from layers\abLine.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates an abLine layer (set of lines based on slope, y-intercept values) for a plot.  */
    class abLineClass extends baseLayerClass<abLineClass> {
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<abLineClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createAbLine(): abLineClass;
}

///----------------------------------------------------------------
/// (from layers\area.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates an area plot as a layer of a plot. */
    class areaClass extends baseLayerClass<areaClass> {
        constructor();
        public adjustChartOptions(): void;
        public addPoint(str: string, x: number, y: number): string;
        public getX(index: number, xRecord: any, xScale: any, xIsCategoryScale: boolean): any;
        public getY(index: number, yRecord: any, yScale: any, pi: ISeriesInfo): {
            y: any;
            h: number;
            yZero: any;
        };
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<areaClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createArea(): areaClass;
}

///----------------------------------------------------------------
/// (from layers\attrDefaults.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** settings for an attribute (value, scaling, legend data, etc).  User settings take precedence over these values. */
    class attrDefaults {
        public dataMin: number;
        public dataMax: number;
        public isMinMaxSoft: any;
        public tickCount: number;
        public isDiscrete: boolean;
        public breaks: any[];
        public dataOverride: any[];
        public dateFormat: string;
        public usePercentFormatting: boolean;
        public zeroAxis: boolean;
        public addMaxHeadroom: boolean;
        public useNiceNumbers: boolean;
        public percentGap: number;
        public combineDups: boolean;
        public colNames: any[];
        public intOnlyBreaks: boolean;
    }
}

///----------------------------------------------------------------
/// (from layers\bar.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /**  creates a layer of vertical columns */
    class barClass extends baseLayerClass<barClass> {
        public _percentGap: number;
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<barClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        /** the size of the gap between columns (0-1). */
        public percentGap(value: any): any;
    }
    function createBar(): barClass;
}

///----------------------------------------------------------------
/// (from layers\boxPlot.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /**  creates a "box plot" layer for a plot. */
    class boxPlotClass extends baseLayerClass<boxPlotClass> {
        public _whiskerType: WhiskerType;
        public _stat: any;
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<boxPlotClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        public whiskerType(): WhiskerType;
        public whiskerType(value: WhiskerType): boxPlotClass;
    }
    function createBoxPlot(): boxPlotClass;
    enum WhiskerType {
        /** from min data point to max data point. */
        minMax = 0,
        /** min and max data points within  Q1 - 1.5*IQR, Q3 + 1.5*IQR   (IQR: Q3 - Q1). */
        tukey = 1,
        /** from 9th percentile to 91st percentile. */
        percentile9to91 = 2,
        /** from 2nd percentile to 98th percentile. */
        percentile2to98 = 3,
        /** one standard deviation above and below the MEAN of the data. */
        stdDev = 4,
    }
}

///----------------------------------------------------------------
/// (from layers\candlestick.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a candlestick layer for a plot. */
    class candlestickClass extends baseLayerClass<candlestickClass> {
        constructor();
        public adjustChartOptions(): void;
        public calcYScaleForLayer(descRecord: any): {
            min: number;
            max: number;
        };
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<candlestickClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createCandlestick(): candlestickClass;
}

///----------------------------------------------------------------
/// (from layers\column.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    class columnSuperClass<T extends columnClass> extends baseLayerClass<T> {
        public _percentGap: number;
        constructor();
        public adjustChartOptions(): void;
        /** draw vertical column shapes.
        NOTE: this is also used by layerHistogram, which sometimes uses a LINEAR XSCALE. */
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<columnClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        /** the size of the gap between columns (0-1). */
        public percentGap(value: any): any;
    }
    class columnClass extends columnSuperClass<columnClass> {
    }
    function createColumn(): columnClass;
}

///----------------------------------------------------------------
/// (from layers\contour.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a "line range" layer for a plot. */
    class contourClass extends baseLayerClass<contourClass> {
        public _contourCount: number;
        constructor();
        public calcXScaleForLayer(descRecord: any): {
            min: any;
            max: any;
        };
        public calcYScaleForLayer(descRecord: any): {
            min: any;
            max: any;
        };
        public contourCount(): number;
        public contourCount(value: number): contourClass;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<contourClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createContour(): contourClass;
}

///----------------------------------------------------------------
/// (from layers\crossBar.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates an area plot as a layer of a plot. */
    class crossBarClass extends baseLayerClass<crossBarClass> {
        constructor();
        public adjustChartOptions(): void;
        public calcYScaleForLayer(descRecord: any): {
            min: number;
            max: number;
        };
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<crossBarClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createCrossBar(): crossBarClass;
}

///----------------------------------------------------------------
/// (from layers\density.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a density layer for a plot. */
    class densityClass extends lineSuperClass<densityClass> {
        public _binPercent: number;
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<densityClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        public onBinPercentChanged(): void;
        public binPercent(value: any): any;
    }
    function createDensity(): densityClass;
}

///----------------------------------------------------------------
/// (from layers\errorBar.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates an area plot as a layer of a plot. */
    class errorBarClass extends baseLayerClass<errorBarClass> {
        constructor();
        public adjustChartOptions(): void;
        public calcYScaleForLayer(descRecord: any): {
            min: number;
            max: number;
        };
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<errorBarClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createErrorBar(): errorBarClass;
}

///----------------------------------------------------------------
/// (from layers\graph.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** create a node link graph as a layer of a plot. */
    class graphClass extends baseLayerClass<graphClass> {
        public _drawParams: any;
        public _group: any;
        public _layoutTimer: any;
        public _padding: number;
        public _useEllipse: boolean;
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<graphClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        public startLayout(): void;
        public drawShapesWithLayout(result: any): void;
    }
    function createGraph(): graphClass;
}

///----------------------------------------------------------------
/// (from layers\histogram.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a histogram layer for a plot. */
    class histogramClass extends columnSuperClass<histogramClass> {
        public _binPercent: number;
        public _forceCategory: boolean;
        public _usePercent: boolean;
        public _niceBuckets: boolean;
        constructor();
        public calcXScaleForLayer(descRecord: any): any;
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<histogramClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        public onBinPercentChanged(): void;
        public binPercent(value: any): any;
        public onForceCategoryChanged(): void;
        public forceCategory(value: any): any;
        public onUsePercentChanged(): void;
        public onNiceBucketsChanged(): void;
        public usePercent(value: any): any;
        public niceBuckets(value: any): any;
    }
    function createHistogram(): histogramClass;
}

///----------------------------------------------------------------
/// (from layers\histogram2d.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a "2d histogram" (aka bin2d or heatmap) layer for a plot. */
    class histogram2dClass extends tileSuperClass<histogram2dClass> {
        public _xBinCount: number;
        public _xForceCategory: boolean;
        public _xNiceBuckets: boolean;
        public _xUsePercent: boolean;
        public _yBinCount: number;
        public _yForceCategory: boolean;
        public _yNiceBuckets: boolean;
        public _yUsePercent: boolean;
        constructor();
        public adjustChartOptions(): void;
        public calcXScaleForLayer(descRecord: any): any;
        public calcYScaleForLayer(descRecord: any): any;
        public buildBreaks(results: any): any[];
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<histogram2dClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        public onStatParamsChanged(): void;
        public xBinCount(value: any): any;
        public yBinCount(value: any): any;
        public xForceCategory(value: any): any;
        public yForceCategory(value: any): any;
        public xUsePercent(value: any): any;
        public yUsePercent(value: any): any;
        public xNiceBuckets(value: any): any;
        public yNiceBuckets(value: any): any;
    }
    function createHistogram2d(): histogram2dClass;
}

///----------------------------------------------------------------
/// (from layers\hLine.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates an hLine (set of horizontal lines) layer for a plot. */
    class hLineClass extends baseLayerClass<hLineClass> {
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<hLineClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createHLine(): hLineClass;
}

///----------------------------------------------------------------
/// (from layers\lineRange.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a "line range" layer for a plot. */
    class lineRangeClass extends baseLayerClass<lineRangeClass> {
        constructor();
        public adjustChartOptions(): void;
        public calcYScaleForLayer(descRecord: any): {
            min: number;
            max: number;
        };
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<lineRangeClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createLineRange(): lineRangeClass;
}

///----------------------------------------------------------------
/// (from layers\openClose.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates an "open close" layer for a plot. */
    class openCloseClass extends baseLayerClass<openCloseClass> {
        constructor();
        public adjustChartOptions(): void;
        public calcYScaleForLayer(descRecord: any): {
            min: number;
            max: number;
        };
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<openCloseClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createOpenClose(): openCloseClass;
}

///----------------------------------------------------------------
/// (from layers\path.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates an area plot as a layer of a plot. */
    class pathClass extends lineSuperClass<pathClass> {
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<pathClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createPath(): pathClass;
}

///----------------------------------------------------------------
/// (from layers\pieSlice.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** plots a "pie chart" layer for a plot. */
    class pieSliceClass extends baseLayerClass<pieSliceClass> {
        public _innerRadius: number;
        public _spacingRadius: number;
        public _outerMargin: number;
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<pieSliceClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        /** the radius of the center hole in the pie slice. */
        public innerRadius(value: any): any;
        /** the space between rings, for multiple series */
        public spacingRadius(value: any): any;
        /** the space between rings, for multiple series */
        public outerMargin(value: any): any;
    }
    function createPieSlice(): pieSliceClass;
}

///----------------------------------------------------------------
/// (from layers\plotDefaults.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** default settings for the plot object (set internally).  User settings take precedence over these values.  */
    class plotDefaults {
        public shapesEnterFromBottom: boolean;
        public showLegend: boolean;
        public gridLinesOnTop: boolean;
        public showXAxis: boolean;
        public showYAxis: boolean;
        public showXTitle: boolean;
        public showYTitle: boolean;
        public showXGridLines: boolean;
        public showYGridLines: boolean;
    }
}

///----------------------------------------------------------------
/// (from layers\point.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a "scatter plot" layer for a plot. */
    class pointClass extends baseLayerClass<pointClass> {
        public _da: any;
        constructor();
        public createElem(dataRecord: any, index: any, seriesIndex: any, filteredData: any): any;
        public elementFromShapeType(shapeType: paths.ShapeType): any;
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<pointClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        public setShapeElemAttrs(uelem: any, da: any, x: any, y: any): void;
    }
    function createPoint(): pointClass;
}

///----------------------------------------------------------------
/// (from layers\pointRange.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a "point range" layer for a plot. */
    class pointRangeClass extends baseLayerClass<pointRangeClass> {
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<pointRangeClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createPointRange(): pointRangeClass;
}

///----------------------------------------------------------------
/// (from layers\polygon.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a polygon layer for a plot. */
    class polygonClass extends baseLayerClass<polygonClass> {
        constructor();
        public adjustChartOptions(): void;
        public addPoint(str: any, x: any, y: any): any;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<polygonClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createPolygon(): polygonClass;
}

///----------------------------------------------------------------
/// (from layers\ribbon.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates an area plot as a layer of a plot. */
    class ribbonClass extends baseLayerClass<ribbonClass> {
        constructor();
        public adjustChartOptions(): void;
        public calcYScaleForLayer(descRecord: any): {
            min: number;
            max: number;
        };
        public addPoint(str: any, x: any, y: any): any;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<ribbonClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createRibbon(): ribbonClass;
}

///----------------------------------------------------------------
/// (from layers\segment.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a set of lines as a layer of a plot. */
    class segmentClass extends baseLayerClass<segmentClass> {
        constructor();
        public calcXScaleForLayer(descRecord: any): {
            min: number;
            max: number;
        };
        public calcYScaleForLayer(descRecord: any): {
            min: number;
            max: number;
        };
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<segmentClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createSegment(): segmentClass;
}

///----------------------------------------------------------------
/// (from layers\spaceFill.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** create a space filling layer to draw treemaps and other space filling plots. */
    class spaceFillClass extends baseLayerClass<spaceFillClass> {
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<spaceFillClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        public startLoc(value: any): any;
        public chunking(value: any): any;
        public phrasing(value: any): any;
    }
    function createSpaceFill(): spaceFillClass;
}

///----------------------------------------------------------------
/// (from layers\stem.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a stem layer for a plot. */
    class stemClass extends baseLayerClass<stemClass> {
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<stemClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createStem(): stemClass;
}

///----------------------------------------------------------------
/// (from layers\step.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates an area plot as a layer of a plot. */
    class stepClass extends baseLayerClass<stepClass> {
        constructor();
        public adjustChartOptionsfunction(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<stepClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createStep(): stepClass;
}

///----------------------------------------------------------------
/// (from layers\streamGraph.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a stream plot layer for a plot. */
    class streamGraphClass extends baseLayerClass<streamGraphClass> {
        public _useSmoothing: boolean;
        public _lastTopSegments: any;
        constructor();
        public adjustChartOptions(): void;
        public addPoint(str: any, x: any, y: any): any;
        public addPoints(str: any, pts: any, reverseOrder: any): any;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<streamGraphClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
        public computeYByCol(pts: any[], fromCol?: number, toCol?: number): any[];
        public checkForCrossing(topPoints: any, botPoints: any): boolean;
        public useSmoothing(value: any): any;
    }
    function createStreamGraph(): streamGraphClass;
}

///----------------------------------------------------------------
/// (from layers\text.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** plots text strings at specified x/y locations as a plot layer. */
    class textClass extends baseLayerClass<textClass> {
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<textClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createText(): textClass;
}

///----------------------------------------------------------------
/// (from layers\treeMap.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates a treemap layer for a plot. */
    class treeMapClass extends baseLayerClass<treeMapClass> {
        public _rootCount: number;
        public _leaveCount: number;
        public _maxDepth: number;
        public _nameColCount: number;
        public _namesWithBlanks: number;
        public _statsCallBack: any;
        public _colorAttribute: any;
        public _sizeCol: any;
        public _nodes: any[];
        constructor();
        public adjustChartOptions(): void;
        public toSysColor(cr: any): internal.System.Drawing.Color;
        public getTreeStats(): {
            rootCount: number;
            leaveCount: number;
            maxDepth: number;
            nameColCount: number;
            namesWithBlanks: number;
        };
        public statsCallBack(callback: any): void;
        public addChildSizesToParent(parentNode: any, depth: any): number;
        public makeNode(name: any, nodeSize: any, fill: any, record: any, daNode: any, daText: any, dataItem: any): any;
        public ensureNodeExists(parentNode: any, name: any, nodeSize: any, fill: any, record: any, daNode: any, daText: any, dataItem: any): any;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<treeMapClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createTreeMap(): treeMapClass;
}

///----------------------------------------------------------------
/// (from layers\vLine.d.ts)
///----------------------------------------------------------------
declare module vp.layers {
    /** creates an vLine (set of vertical lines) layer for a plot. */
    class vLineClass extends baseLayerClass<vLineClass> {
        constructor();
        public adjustChartOptions(): void;
        public drawShapes(shapeRoot: dom.singleWrapperClass, xRecord: IDataRecordInfo, yRecord: IDataRecordInfo, seriesIndex: number, pi: ISeriesInfo, layer: baseLayerClass<vLineClass>, xScale: scales.ISpaceScale, yScale: scales.ISpaceScale, plot?: visuals.plotClass, da?: IDrawAttrBlock): any[];
    }
    function createVLine(): vLineClass;
}
declare module vp.layouts {
    class baseLayoutClass<T> {
        public _width: number;
        public _height: number;
        public _count: number;
        public _useCenter: boolean;
        constructor();
        public getBoundsByIndex(index?: number): any;
        public makeBounds(x: number, y: number, w: number, h: number): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        public width(): number;
        public width(value: number): T;
        public height(): number;
        public height(value: number): T;
        public count(): number;
        public count(value: number): T;
        public useCenter(): boolean;
        public useCenter(value: boolean): T;
    }
}

///----------------------------------------------------------------
/// (from layouts\dock.d.ts)
///----------------------------------------------------------------
declare module vp.layouts {
    /**  returns a path layout object that will layout items within a docking container. */
    class dockClass extends baseLayoutClass<dockClass> {
        public _needInit: boolean;
        public _left: number;
        public _top: number;
        public _right: number;
        public _bottom: number;
        constructor();
        private init();
        public getBounds(itemWidth: number, itemHeight: number, dockType: string): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        private makeSize(value);
    }
    function createDock(): dockClass;
}

///----------------------------------------------------------------
/// (from layouts\grid.d.ts)
///----------------------------------------------------------------
declare module vp.layouts {
    /** returns a grid layout object that will layout items in a rectangular grid shape. */
    class gridClass extends baseLayoutClass<gridClass> {
        public _userRows: any;
        public _userColumns: any;
        public _rows: number;
        public _columns: number;
        public _layoutNeeded: boolean;
        constructor();
        public getBoundsByIndex(index?: number): any;
        public markLayoutNeeded(): void;
        public computeLayout(): void;
        public rowCount(): number;
        public rowCount(value: number): gridClass;
        public colCount(): number;
        public colCount(value: number): gridClass;
    }
    function createGrid(): gridClass;
}

///----------------------------------------------------------------
/// (from layouts\horizontal.d.ts)
///----------------------------------------------------------------
declare module vp.layouts {
    /** returns a horizontal object closure that will layout items from left to right. */
    class horizontalClass extends baseLayoutClass<horizontalClass> {
        constructor();
        public getBoundsByIndex(index?: number): any;
    }
    function createHorizontal(): horizontalClass;
}

///----------------------------------------------------------------
/// (from layouts\path.d.ts)
///----------------------------------------------------------------
declare module vp.layouts {
    /** returns a path layout object that will layout items along an SVG layeretry path. */
    class pathClass extends baseLayoutClass<pathClass> {
        public _path: any;
        public _itemWidth: number;
        public _itemHeight: number;
        public _atStart: boolean;
        public _atEnd: boolean;
        constructor();
        public getBoundsByIndex(index?: number): any;
        private rand(min, max);
        public path(): any;
        public path(value: any): pathClass;
        public itemWidth(): number;
        public itemWidth(value: number): pathClass;
        public itemHeight(): number;
        public itemHeight(value: number): pathClass;
        public atStart(): boolean;
        public atStart(value: boolean): pathClass;
        public atEnd(): boolean;
        public atEnd(value: boolean): pathClass;
    }
    function createPath(): pathClass;
}

///----------------------------------------------------------------
/// (from layouts\pieLabelHelper.d.ts)
///----------------------------------------------------------------
declare module vp.layouts {
    /** Provide following info about each pie slide: center, radius, startAngle, endAngle, color, midArc,
    cxText, cyText, hTextAlign, vTextAlign). */
    function pieLabelHelper(width: number, height: number, outerMargin: number, labelMargin: number, colorPalette: any[], data: any[], valueColName?: string, labelColName?: string): any[];
}

///----------------------------------------------------------------
/// (from layouts\random.d.ts)
///----------------------------------------------------------------
declare module vp.layouts {
    /** returns a random layout object that will layout items in random (overlapping) places. */
    class randomClass extends baseLayoutClass<randomClass> {
        public _itemWidth: number;
        public _itemHeight: number;
        constructor();
        public getBoundsByIndex(index?: number): any;
        private rand(min, max);
        public itemWidth(): number;
        public itemWidth(value: number): randomClass;
        public itemHeight(): number;
        public itemHeight(value: number): randomClass;
    }
    function createRandom(): randomClass;
}

///----------------------------------------------------------------
/// (from layouts\vertical.d.ts)
///----------------------------------------------------------------
declare module vp.layouts {
    /** returns a vertical layout object that will layout items from top to bottom. */
    class verticalClass extends baseLayoutClass<verticalClass> {
        constructor();
        public getBoundsByIndex(index?: number): any;
    }
    function createVertical(): verticalClass;
}
declare module vp.scales {
    /** settings for an attribute (value, scaling, and legend data). */
    class attributeClass {
        public ctr: string;
        public layerDefaults: layers.attrDefaults;
        public plotDefaults: layers.attrDefaults;
        public _attrName: string;
        public _owner: any;
        public _breaks: any[];
        public _labels: any[];
        public _zeroAxis: any;
        public _domainMin: number;
        public _domainMax: number;
        public _isDiscrete: any;
        public _combineDups: any;
        public _numDecimalPlaces: number;
        public _useNiceNumbers: any;
        public _tickCount: any;
        public _intOnlyBreaks: any;
        public _addHeadRoom: any;
        public _expandSpace: any;
        public _isScaleLocked: boolean;
        public _title: string;
        public _flipInLegend: boolean;
        public _formatter: any;
        public _isLegendVisible: boolean;
        public _isScalingEnabled: boolean;
        public _calculatedTickCount: any;
        public _value: any;
        public _colName: string[];
        public _palette: any[];
        public _colData: any[];
        public _percentGap: number;
        public _dateFormat: string;
        public _afterPropName: string;
        public _scale: baseScale;
        public _scaleNeedsSetup: boolean;
        public _hasScaleDomainBeenSet: boolean;
        constructor(attrName: string, scale?: baseScale);
        /** sets one or more attribute properties.  If 'value' is an array of strings, it sets
        the 'colName' property.  If 'value' is a scalar, it sets the 'value' property.
        Otherwise, if 'value' is an object with key/value pairs, it is used to set
        the names properties of the attribute.  */
        public quickSet(value: any): any;
        public getActualIsDiscrete(): any;
        public getActualZeroAxis(): any;
        public getActualCombineDups(): any;
        public getActualIntOnlyBreaks(): any;
        public getActualPercentGap(): number;
        public getActualTickCount(): any;
        public getActualAddHeadroom(): any;
        public getActualExpandSpace(): any;
        public getActualUseNiceNumbers(): any;
        public getActualDateFormat(): string;
        public needsSetUp(value?: boolean): any;
        /** the constant value of the attribute. */
        public value(val?: any): any;
        /** when defined, treats input values as dates and formats them according to this value */
        public dateFormat(): string;
        public dateFormat(value: string): attributeClass;
        /** when true, and when isDiscrete is true, duplicate input values are treated as the same value. */
        public combineDups(): boolean;
        public combineDups(value: boolean): attributeClass;
        /** when set, add the specified space (in pixels) around the min/max range values. */
        public expandSpace(): number;
        public expandSpace(value: number): attributeClass;
        /** when true, "headroom" is added to domain max for fitting shapes & labels */
        public addHeadRoom(): boolean;
        public addHeadRoom(value: boolean): attributeClass;
        /** when true, breaks are calculated so that they are integers */
        public intOnlyBreaks(): boolean;
        public intOnlyBreaks(value: boolean): attributeClass;
        /** when false, don't draw the legend (or axis+label) for this attribute. */
        public isLegendVisible(): boolean;
        public isLegendVisible(value: boolean): attributeClass;
        /** when true, actual domainMin, domainMax are not changed by the system. */
        public isScaleLocked(): boolean;
        public isScaleLocked(value: boolean): attributeClass;
        /** when false, don't draw the legend (or axis+label) for this attribute. */
        public isScalingEnabled(): boolean;
        public isScalingEnabled(value: boolean): attributeClass;
        /** when true, domain min (or max in some cases) is set to zero. */
        public zeroAxis(): boolean;
        public zeroAxis(value: boolean): attributeClass;
        /** when true, values for axis/legend breaks use "nice numbers". */
        public useNiceNumbers(): boolean;
        public useNiceNumbers(value: boolean): attributeClass;
        /** specifies the number of ticks or breaks in the associated axis/legend. */
        public tickCount(): number;
        public tickCount(value: number): attributeClass;
        /** overrides the minimum value for scaling of the input data. */
        public domainMin(): number;
        public domainMin(value: number): attributeClass;
        /** overrides the maximum value for scaling of the input data. */
        public domainMax(): number;
        public domainMax(value: number): attributeClass;
        /** sets the spacing of bars/columns as percentage of total per item area. */
        public percentGap(): number;
        public percentGap(value: number): attributeClass;
        /** allows caller to override the default formatting function to use when labeling the associated axis/legend. */
        public formatter(): any;
        public formatter(value: any): attributeClass;
        /** allows caller to override the default formatting function to use when labeling the associated axis/legend. */
        public numDecimalPlaces(): number;
        public numDecimalPlaces(value: number): attributeClass;
        /** allows caller to override the default values in the input space used to draw the
        "tick" locations for the axis or legend associated with this attribute.
        For discrete attributes, this should be an array of record indexes (0-relative).
        For the "_seriesIndex"/"_seriesName" mapped attribute, this should be an array of record indexes (0-relative).
        For all other attributes, this should be an array of input values.
        */
        public breaks(): number[];
        public breaks(value: number[]): attributeClass;
        public onBreaksChanged(): void;
        /** allows caller to override the default string labels that correspond to each of the breaks for this attribute. */
        public labels(): number[];
        public labels(value: number[]): attributeClass;
        /** gets the actual formatting function to be used to label values in the axis/legend for this attribute. */
        public getActualFormatter(): any;
        /** Running stats on our data can change our X and Y column mappings.  This function returns
        the new property name assoicated with this attribute. */
        public getAfterStatsPropName(seriesIndex: number): string;
        /** gets the actual array of input data values used for the axis/legend breaks for this attribute.
        The user-specified set of breaks takes priority.
        Otherwise, for DISCRETE attributes WITH Dup merging, this is the set of unique key values with a NULL appended at the end;
        Otherwise, for DISCRETE attributes WITHOUT Dup merging, this is the 0-relative set of index values for each row with an
        "N" (the record count) appended at the end;
        For "_seriesIndex", this is the 0-relative set of index values for each series;
        Otherwise, (most popular case) it is the set of "tickCount" values between "min" and "max". */
        public getActualBreaks(): any[];
        /** returns the actual labels for the associated axis/legend. */
        public getActualLabels(breakData?: any[]): any[];
        /** the column name(s) that supplies data for the attribute. */
        public colName(): string[];
        public colName(value: string): attributeClass;
        public colName(value: string[]): attributeClass;
        /** the title displayed on the axis or legend for this attribute. */
        public title(): string;
        public title(value: string): attributeClass;
        /** if true, values should be reversed in the legend associated with this attribute */
        public flipInLegend(): boolean;
        public flipInLegend(value: boolean): attributeClass;
        /** true if the attibute's scale should be a discrete (vs. continuous) scale. */
        public isDiscrete(): boolean;
        public isDiscrete(value: boolean): attributeClass;
        /** an array of values that defines the set of mapped outputs for this attribute */
        public palette(): any[];
        public palette(value: any[]): attributeClass;
        /** the array of values associated with this mapped column.  Usually calculated in
        setUpScale(). */
        public colData(value?: any[]): any;
        /** the object that owns this attribute. */
        public owner(value?: any): any;
        /** returns the layer that owns this attribute. */
        public pop(): any;
        /** returns true if user mapped this attribute to a column. */
        public isUserMapped(): boolean;
        /** returns true if user or system mapped this attribute to a column. */
        public isMapped(): boolean;
        /** get the constant or mapped value of the attribute, for the specified item. */
        public getItemValue(seriesIndex: number, itemIndex: number, filteredData: any[], daForAttr: any, seriesNames: string[], stackType: string): any;
        /** get the mapped value of the attribute, for the specified item. */
        private getMappedValue(propName, filteredData, seriesCount, seriesIndex, itemIndex, palette, seriesNames, daForAttr, stackType);
        /** get or set the scale associated with this attribute. */
        public scale(): baseScale;
        public scale(value: baseScale): attributeClass;
        private getDataForAttribute(propName, filteredData, seriesNames);
        public getOnErrorFromPlot(): any;
        public callOnError(errType: string, info: any): any;
        public setScaleDomain(min: number, max: number, tickCount?: number): void;
        /** this is called to setUp the scale for this attribute before the legend is drawn.  The
        scale is then used by the legend drawing code. */
        public setupScale(filteredData: any[], seriesNames: string[], daForAttr: any, stackType: string, afterPropName: string): attributeClass;
    }
    function createAttribute(attrName: string, scale?: baseScale): attributeClass;
}

///----------------------------------------------------------------
/// (from scales\barHelper.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    /** helps place ticks, labels, and shapes for category type plots.  Also supports multiple-series "clustered" layouts.  */
    class barHelperClass {
        public _percentGap: number;
        public _scale: baseScale;
        public _seriesCount: number;
        public _recordCount: number;
        public _areaSize: number;
        public _multiBarSize: number;
        public _gapSize: number;
        public _rangeMin: number;
        public _rangeMax: number;
        /** recordCount should be set to the number of CATEGORY values in the domain.  */
        constructor(scale: baseScale, recordCount: number, seriesCount: number, percentGap?: number);
        public caclAll(): void;
        /** the percentage of white space in each bar area. */
        public percentGap(): number;
        public percentGap(value: number): barHelperClass;
        /** return the offset along the axis where the specified tick should be drawn. */
        public getTickOffset(tickIndex: number): number;
        /** return the offset along the axis where the center of the specified label should be drawn. */
        public getBarAreaCenter(rowIndex: number): number;
        /** return the size of the each bar area (includes gaps and multi-series bars). */
        public getBarAreaSize(): number;
        /** The main scaling function for discrete scales.
        For X axes, return the offset for the "LEFT" property of the specified bar.  This will scale
        rowIndex=0 to the "rangeMin" and rowIndex=recordCount to the "rangeMax".
        For Y axes, return the offset for the "BOTTOM" property of the specified bar.  This will scale
        rowIndex=0 to the "rangeMax" and rowIndex=recordCount to the "rangeMin".  */
        public getBarOffset(rowIndex: number, seriesIndex?: number, supressGapSize?: boolean): number;
        public getSeriesBarOffset(seriesIndex: number): number;
        /** return the size of a single bar. */
        public getBarSize(): number;
    }
    function createBarHelper(scale: baseScale, recordCount: number, seriesCount: number, percentGap: number): barHelperClass;
}

///----------------------------------------------------------------
/// (from scales\colorScale.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    class colorScaleClass extends baseScaleClass<colorScaleClass> {
        constructor();
        public lerpScale(value: any): any;
        public interpolateValues(min: any, max: any, t: any): any;
        public onMapTypeChanged(): void;
        public onPaletteChanged(): void;
    }
    function createColor(): colorScaleClass;
}

///----------------------------------------------------------------
/// (from scales\lineType.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    class lineTypeClass extends baseScaleClass<lineTypeClass> {
        constructor();
    }
    function createLineType(): lineTypeClass;
}

///----------------------------------------------------------------
/// (from scales\opacity.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    class opacityClass extends baseScaleClass<opacityClass> {
        constructor();
    }
    function createOpacity(): opacityClass;
}

///----------------------------------------------------------------
/// (from scales\shape.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    class shapeClass extends baseScaleClass<shapeClass> {
        constructor();
    }
    function createShape(): shapeClass;
}

///----------------------------------------------------------------
/// (from scales\size.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    class sizeClass extends baseScaleClass<sizeClass> {
        constructor();
    }
    function createSize(): sizeClass;
}

///----------------------------------------------------------------
/// (from scales\space.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    class spaceClass extends baseScaleClass<spaceClass> {
        public _autoRange: boolean;
        public _barHelper: barHelperClass;
        public _baseScale: (value: number, seriesIndex?: number) => number;
        public _isFlipped: boolean;
        public _internalCall: boolean;
        constructor();
        /** return the width (size) of a full item (1-N bars, without gap space) for associated axis. */
        public itemWidth(): number;
        public onRangeChanged(): void;
        /** return the width (size) of a full item for associated axis. */
        public seriesItemWidth(): number;
        public onSetUp(dataCount: number, seriesCount: number, stackType: string, percentGap: number): void;
        public flipPalette(): void;
        /** scale the value (using LERP scaling), with an optional seriesIndex adjustment */
        public scale: (value: number, seriesIndex?: number) => number;
        /** Overrides baseScale's implementation.  This uses barHelper to map the recordIndex
        to an offset in the palette min/max.  This REQUIRES that the palette contain [rangeMin, rangeMax].
        */
        public categoryScale(recordIndex: any, seriesIndex?: number, supressGapSize?: boolean): any;
        /** flip the palette before scaling; typically used to reverse the direction of the Y axis. */
        public flipScale(value: number, seriesIndex?: number): number;
        public scaleSize(value: number): number;
        /** When true, this sets the scale's range (palette) to the size of the associated axis shape. */
        public autoRange(): boolean;
        public autoRange(value: boolean): spaceClass;
    }
    function createSpace(): spaceClass;
    /** an interface for xScale and yScale passed to layer when drawing shapes. */
    class ISpaceScale extends spaceClass {
    }
}

///----------------------------------------------------------------
/// (from scales\textSize.d.ts)
///----------------------------------------------------------------
declare module vp.scales {
    class textSizeClass extends baseScaleClass<textSizeClass> {
        constructor();
    }
    function createTextSize(): textSizeClass;
}
declare module vp.internal.System {
    class InvalidOperationException {
        constructor(s: string);
    }
    class ArgumentOutOfRangeException {
        constructor(a: string, v: Object, s: string);
    }
    class AssertionException {
        constructor(e: any);
    }
}
declare module vp.internal.System.Diagnostics {
    class Debug {
        static Assert(e: any): void;
        static AssertNotEmpty(s: any): void;
    }
}

///----------------------------------------------------------------
/// (from treeMap\emptySpace.d.ts)
///----------------------------------------------------------------
declare module vp.internal {
    interface vue_object {
        remove(): void;
        append(s: string): vue_object;
        bounds(x: number, y: number, width: number, height: number): vue_object;
        attr(s: string, o: Object): vue_object;
        position(x: number, y: number): vue_object;
        text(s: string): vue_object;
        colors(f: Object, s?: Object, sw?: Object): vue_object;
        font(s: string, n: string): vue_object;
        css(s: string, v: string): vue_object;
        opacity(n: number): vue_object;
        animate(n: number): vue_object;
        markRebuildNeeded(): void;
        width(): number;
        height(): number;
    }
    var MAX_VALUE: number;
}
declare module vp.internal.Microsoft.Treemap.Generator {
    enum EmptySpaceLocation {
        DeterminedByLayoutAlgorithm = 0,
        Top = 1,
    }
    enum LayoutAlgorithm {
        BottomWeightedSquarified = 0,
        TopWeightedSquarified = 1,
    }
    enum NodeLevelsWithText {
        All = 0,
        Leaves = 1,
        None = 2,
        Range = 3,
    }
    enum ContentLocation {
        CenteredText = 0,
        TopText = 1,
        OwnerDraw = 2,
    }
    class EmptySpace {
        constructor();
        public SizeMetric : number;
        public TreemapGenerator : TreemapGenerator;
        public FireRedrawRequired(): void;
        public AssertValid(): void;
        public m_oTreemapGenerator: TreemapGenerator;
        public m_fSizeMetric: number;
    }
}

///----------------------------------------------------------------
/// (from treeMap\generator.d.ts)
///----------------------------------------------------------------
declare module vp.internal.Microsoft.Treemap.Generator {
    class TreemapGenerator {
        static MinPaddingPx: number;
        static MaxPaddingPx: number;
        static MinPaddingDecrementPerLevelPx: number;
        static MaxPaddingDecrementPerLevelPx: number;
        static MinPenWidthPx: number;
        static MaxPenWidthPx: number;
        static MinPenWidthDecrementPerLevelPx: number;
        static MaxPenWidthDecrementPerLevelPx: number;
        constructor(displayRoot: vue_object);
        public Nodes : Nodes;
        public LayoutAlgorithm : LayoutAlgorithm;
        public PaddingPx : number;
        public PaddingDecrementPerLevelPx : number;
        public PenWidthPx : number;
        public PenWidthDecrementPerLevelPx : number;
        public BackColor : System.Drawing.Color;
        public BorderColor : System.Drawing.Color;
        public FontFamily : string;
        public FontSolidColor : System.Drawing.Color;
        public FontNormSizePt : number;
        public AnimationDuration : number;
        public IsAnimationEnabled : boolean;
        public SelectedFontColor : System.Drawing.Color;
        public SelectedBackColor : System.Drawing.Color;
        public NodeLevelsWithText : NodeLevelsWithText;
        public ContentLocation : ContentLocation;
        public ContentDrawer : Util.IContentDrawer;
        public EmptySpaceLocation : EmptySpaceLocation;
        public SelectedNode : Node;
        public GetNodeLevelsWithTextRange(minLevel: number, maxLevel: number): void;
        public SetNodeLevelsWithTextRange(minLevel: number, maxLevel: number): void;
        public GetFontSizeRange(minSizePt: number, maxSizePt: number, incrementPt: number): void;
        public SetFontSizeRange(minSizePt: number, normSizePt: number, maxSizePt: number, incrementPt: number): void;
        public GetFontAlphaRange(minAlpha: number, maxAlpha: number, incrementPerLevel: number): void;
        public SetFontAlphaRange(minAlpha: number, maxAlpha: number, incrementPerLevel: number): void;
        public BeginUpdate(): void;
        public EndUpdate(): void;
        public Clear(): void;
        public Draw(): void;
        public GetNodeFromPoint(pointF: System.Drawing.Point): Node;
        public SelectNode(node: Node): void;
        private CalculateAndDrawRectangles(oTreemapRectangle, oNodes, oParentNode);
        private CalculateRectangles(oNodes, oParentRectangle, oParentNode, iTopPaddingPx, iLeftRightBottomPaddingPx, iPenWidthPx, oLayoutEngine);
        private DrawRectangles(oNodes, iNodeLevel, oPenColor);
        private DrawNodeAsSelected(oNode);
        public FireRedrawRequired(): void;
        private CancelSelectedNode();
        private CreateLayoutEngine();
        private CreateTextDrawer();
        private AddPaddingToParentRectangle(oParentRectangle, iTopPaddingPx, iLeftRightBottomPaddingPx);
        private AddPaddingToRectangle(oRectangle, iTopPaddingPx, iLeftRightBottomPaddingPx);
        private AddPaddingToChildRectangle2(oChildRectangle, oParentRectangle, iPaddingPx);
        private AddPaddingToChildRectangle(oChildRectangle, oParentRectangle, iPaddingPx);
        private GetTopLevelTopPaddingPx();
        private GetTopMinimumTextHeight();
        private DecrementPadding(iPaddingPx);
        private DecrementPenWidth(iPenWidthPx);
        private RectangleIsSmallerThanMin(oRectangle);
        private FixSmallRectangle(oUnpaddedNodeRectangle);
        public AssertValid(): void;
        static MinRectangleWidthOrHeightPx: number;
        public m_displayRoot: vue_object;
        public m_oNodes: Nodes;
        public m_iPaddingPx: number;
        public m_iPaddingDecrementPerLevelPx: number;
        public m_iPenWidthPx: number;
        public m_iPenWidthDecrementPerLevelPx: number;
        public m_oBackColor: System.Drawing.Color;
        public m_oBorderColor: System.Drawing.Color;
        public m_sFontFamily: string;
        public m_fFontNormSizePt: number;
        public m_fFontMinSizePt: number;
        public m_fFontMaxSizePt: number;
        public m_fFontIncrementPt: number;
        public m_oFontSolidColor: System.Drawing.Color;
        public m_iFontMinAlpha: number;
        public m_iFontMaxAlpha: number;
        public m_iFontAlphaIncrementPerLevel: number;
        public m_fAnimDuration: number;
        public m_bIsAnimationEnabled: boolean;
        public m_oSelectedFontColor: System.Drawing.Color;
        public m_oSelectedBackColor: System.Drawing.Color;
        public m_iNodeLevelsWithText: NodeLevelsWithText;
        public m_iMinNodeLevelWithText: number;
        public m_iMaxNodeLevelWithText: number;
        public m_eContentLocation: ContentLocation;
        public m_eEmptySpaceLocation: EmptySpaceLocation;
        public m_oSelectedNode: Node;
        public m_bInBeginUpdate: boolean;
        public m_eLayoutAlgorithm: LayoutAlgorithm;
        public m_ownerDraw: Util.IContentDrawer;
    }
}

///----------------------------------------------------------------
/// (from treeMap\graphicsLib.d.ts)
///----------------------------------------------------------------
declare module vp.internal.Microsoft.Treemap.GraphicsLib {
    class GraphicsUtil {
        static RectangleFToRectangle(oRectangle: System.Drawing.Rectangle, iPenWidthPx: number): System.Drawing.Rectangle;
    }
    class TransparentBrushMapper {
        constructor();
        public Initialize(oSolidColor: System.Drawing.Color, iMinAlpha: number, iMaxAlpha: number, iAlphaIncrementPerLevel: number): void;
        public LevelToTransparentBrush(iLevel: number): System.Drawing.Color;
        static ValidateAlphaRange(iMinAlpha: number, iMaxAlpha: number, iIncrementPerLevel: number, sCaller: string): void;
        public AssertValid(): void;
        public m_oTransparentBrushes: System.Drawing.Color[];
        public m_iTransparentBrushes: number;
    }
}

///----------------------------------------------------------------
/// (from treeMap\node.d.ts)
///----------------------------------------------------------------
declare module vp.internal.Microsoft.Treemap.Generator {
    class Node {
        constructor(text: string, sizeMetric: number, absoluteColor?: System.Drawing.Color, tag?: Object, toolTip?: string, textColor?: System.Drawing.Color);
        public Text : string;
        public SizeMetric : number;
        public AbsoluteColor : System.Drawing.Color;
        public Tag : Object;
        public ToolTip : string;
        public Bounds : System.Drawing.Rectangle;
        public Nodes : Nodes;
        public Parent : Node;
        public Level : number;
        public PrivateSetParent(oParentNode: Node): void;
        public HasBeenDrawn : boolean;
        public Rectangle : System.Drawing.Rectangle;
        public RectangleToDraw : System.Drawing.Rectangle;
        public AspectRatio : number;
        public PenWidthPx : number;
        public InitializeWithValidation(sText: string, fSizeMetric: number, color: System.Drawing.Color): void;
        public SetParent(oParentNode: Node): void;
        public TreemapGenerator : TreemapGenerator;
        public GetNodeFromPoint(oPointF: System.Drawing.Point): Node;
        static ValidateSizeMetric(fValue: number, sCaller: string): void;
        public SaveRectangle(): void;
        public RestoreRectangle(): void;
        public FireRedrawRequired(): void;
        public DisplayRectangle(displayRoot: vue_object, iWidthPx: number, oPenColor: System.Drawing.Color, oBrush: System.Drawing.Color, iNodeLevel: number, fAnimDuration: number): void;
        public SetToolTip(str: any): void;
        public SetRectangleFill(fill: System.Drawing.Color): void;
        public RemoveRectangle(): void;
        public DisplayText(displayRoot: vue_object, oRect: System.Drawing.Rectangle, oFont: System.Drawing.Font, oBrush: System.Drawing.Color, oStringFormat: System.Drawing.StringFormat, iNodeLevel: number, fAnimDuration: number): void;
        public SetTextColor(color: System.Drawing.Color): void;
        public RemoveText(): void;
        public DisplayedElement : vue_object;
        public AssertValid(): void;
        public m_oTreemapGenerator: TreemapGenerator;
        public m_oParentNode: Node;
        public m_sText: string;
        public m_fSizeMetric: number;
        public m_oNodeColor: System.Drawing.Color;
        public m_oTag: Object;
        public m_sToolTip: string;
        public m_oTextColor: System.Drawing.Color;
        public m_oNodes: Nodes;
        public m_oRectangle: System.Drawing.Rectangle;
        public m_oSavedRectangle: System.Drawing.Rectangle;
        public m_iPenWidthPx: number;
        public m_bRectangleSet: boolean;
        public m_bRectangleSaved: boolean;
        public m_oShape: vue_object;
        public m_oText: vue_object;
        public m_dispelem: vue_object;
    }
}

///----------------------------------------------------------------
/// (from treeMap\nodes.d.ts)
///----------------------------------------------------------------
declare module vp.internal.Microsoft.Treemap.Generator {
    class Nodes {
        constructor(oParentNode: Node);
        public Count : number;
        public RecursiveCount : number;
        public Item(zeroBasedIndex: number): Node;
        public EmptySpace : EmptySpace;
        public Add1(text: string, sizeMetric: number, absoluteColor: System.Drawing.Color, tag?: Object, toolTip?: string, textColor?: System.Drawing.Color): Node;
        public Add(oNode: Node): Node;
        public ToArray(): Node[];
        public TreemapGenerator : TreemapGenerator;
        public Initialize(oParentNode: Node): void;
        public Clear(): void;
        public GetNodeFromPoint(oPointF: System.Drawing.Point): Node;
        public ToArraySortedBySizeMetric(): Node[];
        public FireRedrawRequired(): void;
        public AssertValid(): void;
        public m_oTreemapGenerator: TreemapGenerator;
        public m_oParentNode: Node;
        public m_oNodes: Node[];
        public m_oEmptySpace: EmptySpace;
    }
}

///----------------------------------------------------------------
/// (from treeMap\systemDrawing.d.ts)
///----------------------------------------------------------------
declare module vp.internal.System.Drawing {
    class Color {
        constructor(alpha: number, red: number, green: number, blue: number);
        public m_alpha: number;
        public m_red: number;
        public m_green: number;
        public m_blue: number;
        static Empty: Color;
        static FromArgb1(argb: number): Color;
        static FromArgb2(alpha: number, red: number, green: number, blue: number): Color;
        static FromArgb3(alpha: number, baseColor: Color): Color;
        static FromArgb4(red: number, green: number, blue: number): Color;
        public GetBrightness(): number;
        public GetHue(): number;
        public GetSaturation(): number;
        public ToArgb(): number;
        public ToHTML : string;
        public A : number;
        public R : number;
        public G : number;
        public B : number;
        static AliceBlue : Color;
        static AntiqueWhite : Color;
        static Aqua : Color;
        static Aquamarine : Color;
        static Azure : Color;
        static Beige : Color;
        static Bisque : Color;
        static Black : Color;
        static BlanchedAlmond : Color;
        static Blue : Color;
        static BlueViolet : Color;
        static Brown : Color;
        static BurlyWood : Color;
        static CadetBlue : Color;
        static Chartreuse : Color;
        static Chocolate : Color;
        static Coral : Color;
        static CornflowerBlue : Color;
        static Cornsilk : Color;
        static Crimson : Color;
        static Cyan : Color;
        static DarkBlue : Color;
        static DarkCyan : Color;
        static DarkGoldenrod : Color;
        static DarkGray : Color;
        static DarkGreen : Color;
        static DarkKhaki : Color;
        static DarkMagenta : Color;
        static DarkOliveGreen : Color;
        static DarkOrange : Color;
        static DarkOrchid : Color;
        static DarkRed : Color;
        static DarkSalmon : Color;
        static DarkSeaGreen : Color;
        static DarkSlateBlue : Color;
        static DarkSlateGray : Color;
        static DarkTurquoise : Color;
        static DarkViolet : Color;
        static DeepPink : Color;
        static DeepSkyBlue : Color;
        static DimGray : Color;
        static DodgerBlue : Color;
        static FireBrick : Color;
        static FloralWhite : Color;
        static ForestGreen : Color;
        static Fuchsia : Color;
        static Gainsboro : Color;
        static GhostWhite : Color;
        static Gold : Color;
        static Goldenrod : Color;
        static Gray : Color;
        static Green : Color;
        static GreenYellow : Color;
        static Honeydew : Color;
        static HotPink : Color;
        static IndianRed : Color;
        static Indigo : Color;
        static Ivory : Color;
        static Khaki : Color;
        static Lavender : Color;
        static LavenderBlush : Color;
        static LawnGreen : Color;
        static LemonChiffon : Color;
        static LightBlue : Color;
        static LightCoral : Color;
        static LightCyan : Color;
        static LightGoldenrodYellow : Color;
        static LightGreen : Color;
        static LightGray : Color;
        static LightPink : Color;
        static LightSalmon : Color;
        static LightSeaGreen : Color;
        static LightSkyBlue : Color;
        static LightSlateGray : Color;
        static LightSteelBlue : Color;
        static LightYellow : Color;
        static Lime : Color;
        static LimeGreen : Color;
        static Linen : Color;
        static Magenta : Color;
        static Maroon : Color;
        static MediumAquamarine : Color;
        static MediumBlue : Color;
        static MediumOrchid : Color;
        static MediumPurple : Color;
        static MediumSeaGreen : Color;
        static MediumSlateBlue : Color;
        static MediumSpringGreen : Color;
        static MediumTurquoise : Color;
        static MediumVioletRed : Color;
        static MidnightBlue : Color;
        static MintCream : Color;
        static MistyRose : Color;
        static Moccasin : Color;
        static NavajoWhite : Color;
        static Navy : Color;
        static OldLace : Color;
        static Olive : Color;
        static OliveDrab : Color;
        static Orange : Color;
        static OrangeRed : Color;
        static Orchid : Color;
        static PaleGoldenrod : Color;
        static PaleGreen : Color;
        static PaleTurquoise : Color;
        static PaleVioletRed : Color;
        static PapayaWhip : Color;
        static PeachPuff : Color;
        static Peru : Color;
        static Pink : Color;
        static Plum : Color;
        static PowderBlue : Color;
        static Purple : Color;
        static Red : Color;
        static RosyBrown : Color;
        static RoyalBlue : Color;
        static SaddleBrown : Color;
        static Salmon : Color;
        static SandyBrown : Color;
        static SeaGreen : Color;
        static Seashell : Color;
        static Sienna : Color;
        static Silver : Color;
        static SkyBlue : Color;
        static SlateBlue : Color;
        static SlateGray : Color;
        static Snow : Color;
        static SpringGreen : Color;
        static SteelBlue : Color;
        static Tan : Color;
        static Teal : Color;
        static Thistle : Color;
        static Tomato : Color;
        static Turquoise : Color;
        static Violet : Color;
        static Wheat : Color;
        static White : Color;
        static WhiteSmoke : Color;
        static Yellow : Color;
        static YellowGreen : Color;
    }
    enum ContentAlignment {
        BottomCenter = 0,
        BottomLeft = 1,
        BottomRight = 2,
        MiddleCenter = 3,
        MiddleLeft = 4,
        MiddleRight = 5,
        TopCenter = 6,
        TopLeft = 7,
        TopRight = 8,
    }
    class Font {
        constructor(familyName: string, emSize: number);
        public m_familyName: string;
        public m_emSize: number;
        public Bold : boolean;
        public FontFamily : FontFamily;
        public Height : number;
        public Italic : boolean;
        public Name : string;
        public Size : number;
        public SizeInPoints : number;
        public Strikeout : boolean;
        public Underline : boolean;
        public ToHTML : string;
    }
    class FontFamily {
        constructor(familyName: string);
        public m_familyName: string;
        public GetName(language: number): string;
        public Name : string;
    }
    enum FontStyle {
        Bold = 1,
        Italic = 2,
        Regular = 0,
        Strikeout = 8,
        Underline = 4,
    }
    class Point {
        constructor(x: number, y: number);
        public m_x: number;
        public m_y: number;
        static Empty: Point;
        public IsEmpty : boolean;
        public X : number;
        public Y : number;
    }
    class Rectangle {
        constructor(left: number, top: number, right: number, bottom: number);
        public m_left: number;
        public m_top: number;
        public m_right: number;
        public m_bottom: number;
        static Empty: Rectangle;
        public Contains(rect: Rectangle): boolean;
        public ContainsPoint(pt: Point): boolean;
        static FromLTRB(left: number, top: number, right: number, bottom: number): Rectangle;
        public Inflate(width: number, height: number): void;
        static Inflate(rect: Rectangle, width: number, height: number): Rectangle;
        public Bottom : number;
        public Height : number;
        public IsEmpty : boolean;
        public Left : number;
        public Right : number;
        public Size : Size;
        public Top : number;
        public Width : number;
        public X : number;
        public Y : number;
    }
    class Size {
        constructor(width: number, height: number);
        public m_width: number;
        public m_height: number;
        static Empty: Size;
        static Ceiling(value: Size): Size;
        static Round(value: Size): Size;
        public Height : number;
        public IsEmpty : boolean;
        public Width : number;
    }
    class StringFormat {
        public m_alignment: StringAlignment;
        public m_linealignment: StringAlignment;
        public m_trimming: StringTrimming;
        public Alignment : StringAlignment;
        public LineAlignment : StringAlignment;
        public Trimming : StringTrimming;
        public ToSVGTextAnchor : string;
        public ToCSSAlignment : string;
        public ToCSSLineAlign : string;
    }
    enum StringAlignment {
        Center = 0,
        Far = 1,
        Near = 2,
    }
    enum StringFormatFlags {
        DirectionRightToLeft = 0,
        DirectionVertical = 1,
        DisplayFormatControl = 2,
        FitBlackBox = 3,
        LineLimit = 4,
        MeasureTrailingSpaces = 5,
        NoClip = 6,
        NoFontFallback = 7,
        NoWrap = 8,
    }
    enum StringTrimming {
        Character = 0,
        EllipsisCharacter = 1,
        EllipsisPath = 2,
        EllipsisWord = 3,
        None = 4,
        Word = 5,
    }
    enum StringUnit {
        Display = 0,
        Document = 1,
        Em = 2,
        Inch = 3,
        Millimeter = 4,
        Pixel = 5,
        Point = 6,
        World = 7,
    }
    class SystemColors {
        static Window : Color;
        static WindowFrame : Color;
        static WindowText : Color;
        static Highlight : Color;
        static HighlightText : Color;
    }
}

///----------------------------------------------------------------
/// (from treeMap\tmUtils.d.ts)
///----------------------------------------------------------------
declare module vp.internal.Microsoft.Treemap.Util {
    var TextHeightMultiplier: number;
    class FontForRectangle {
        constructor(sFamily: string, fEmSize: number, displayRoot: vue_object);
        public CanFitInRectangle(sText: string, oRectangle: System.Drawing.Rectangle, displayRoot: vue_object): boolean;
        public CanFitInRectangleTruncate(sText: string, oRectangle: System.Drawing.Rectangle, displayRoot: vue_object): string;
        public Font : System.Drawing.Font;
        public TruncateText(sText: string): string;
        public AssertValid(): void;
        static MinTruncatableTextLength: number;
        public m_oFont: System.Drawing.Font;
    }
    interface IFontMapper {
        NodeToFont(oNode: Generator.Node, oRect: System.Drawing.Rectangle, iNodeLevel: number, sTextToDraw: string): System.Drawing.Font;
    }
    interface ILayoutEngine {
        CalculateNodeRectangles(oNodes: Generator.Nodes, oParentRectangle: System.Drawing.Rectangle, oParentNode: Generator.Node, eEmptySpaceLocation: Generator.EmptySpaceLocation): void;
        SetNodeRectanglesToEmpty(oNode: Generator.Node): void;
        SetNodesRectanglesToEmpty(oNodes: Generator.Nodes, bRecursive: boolean): void;
    }
    interface ITextDrawer {
        DrawTextForAllNodes(displayRoot: vue_object, iLeftRightPaddingPx: number, iPaddingDecrementPerLevelPx: number, oNodes: Generator.Nodes): void;
        DrawTextForSelectedNode(oSelectedNode: Generator.Node): void;
    }
    interface IContentDrawer {
        SetDrawingContext(sFontFamily: string, fFontSizePt: number, oTextColor: System.Drawing.Color, oSelectedFontColor: System.Drawing.Color, oSelectedBackColor: System.Drawing.Color): void;
        GetTopHeight(displayRoot: vue_object): number;
        DisplayContent(displayRoot: vue_object, elem: vue_object, oRectClient: System.Drawing.Rectangle, oNode: Generator.Node, bIsLeaf: boolean, iNodeLevel: number): vue_object;
        ShowSelected(elem: vue_object, oNode: Generator.Node, fSelected: boolean): void;
    }
    class MaximizingFontMapper implements IFontMapper {
        constructor(sFamily: string, fMinSizePt: number, fMaxSizePt: number, fIncrementPt: number, displayRoot: vue_object);
        public NodeToFont(oNode: Generator.Node, oRect: System.Drawing.Rectangle, iNodeLevel: number, sTextToDraw: string): System.Drawing.Font;
        static ValidateSizeRange(fMinSizePt: number, fMaxSizePt: number, fIncrementPt: number, sCaller: string): void;
        public AssertValid(): void;
        public m_oFontForRectangles: FontForRectangle[];
        public m_displayRoot: vue_object;
    }
    class PerLevelFontMapper implements IFontMapper {
        constructor(sFamily: string, oTreemapRectangle: System.Drawing.Rectangle, fTreemapRectangleDivisor: number, fPerLevelDivisor: number, fMinimumFontSize: number, displayRoot: vue_object);
        public NodeToFont(oNode: Generator.Node, oRect: System.Drawing.Rectangle, iNodeLevel: number, sTextToDraw: string): System.Drawing.Font;
        public AssertValid(): void;
        public m_oFontForRectangles: FontForRectangle[];
        public m_displayRoot: vue_object;
    }
    class LayoutEngineBase implements ILayoutEngine {
        constructor();
        public CalculateNodeRectangles(oNodes: Generator.Nodes, oParentRectangle: System.Drawing.Rectangle, oParentNode: Generator.Node, eEmptySpaceLocation: Generator.EmptySpaceLocation): void;
        public SetNodeRectanglesToEmpty(oNode: Generator.Node): void;
        public SetNodesRectanglesToEmpty(oNodes: Generator.Nodes, bRecursive: boolean): void;
        public SetANodeRectanglesToEmpty(aoNodes: Generator.Node[], iIndexOfFirstNodeToSet: number, iIndexOfLastNodeToSet: number): void;
        public SetNodeRectangleToEmpty(oNode: Generator.Node): void;
    }
    class SquarifiedLayoutEngine extends LayoutEngineBase {
        constructor(bBottomWeighted: boolean);
        public CalculateNodeRectangles(oNodes: Generator.Nodes, oParentRectangle: System.Drawing.Rectangle, oParentNode: Generator.Node, eEmptySpaceLocation: Generator.EmptySpaceLocation): void;
        public CalculateSquarifiedNodeRectangles(aoSortedNodes: Generator.Node[], oParentRectangle: System.Drawing.Rectangle, dAreaPerSizeMetric: number): void;
        public InsertNodesInRectangle(aoSortedNodes: Generator.Node[], oParentRectangle: System.Drawing.Rectangle, iIndexOfFirstNodeToInsert: number, iIndexOfLastNodeToInsert: number, dSizeMetricSum: number, dAreaPerSizeMetric: number): void;
        public SaveInsertedRectangles(aoNodes: Generator.Node[], iIndexOfFirstInsertedNode: number, iIndexOfLastInsertedNode: number): void;
        public RestoreInsertedRectangles(aoNodes: Generator.Node[], iIndexOfFirstInsertedNode: number, iIndexOfLastInsertedNode: number): void;
        public GetAreaPerSizeMetric(oNodes: Generator.Nodes, oParentRectangle: System.Drawing.Rectangle, oParentNode: Generator.Node): number;
        public GetRemainingEmptySpace(aoNodes: Generator.Node[], oParentRectangle: System.Drawing.Rectangle, iIndexOfFirstInsertedNode: number, iIndexOfLastInsertedNode: number): System.Drawing.Rectangle;
        public m_bBottomWeighted: boolean;
    }
    class BottomWeightedSquarifiedLayoutEngine extends SquarifiedLayoutEngine {
        constructor();
    }
    class TopWeightedSquarifiedLayoutEngine extends SquarifiedLayoutEngine {
        constructor();
    }
    class TextDrawerBase implements ITextDrawer {
        constructor(eNodeLevelsWithText: Generator.NodeLevelsWithText, iMinNodeLevelWithText: number, iMaxNodeLevelWithText: number, fAnimDuration: number);
        public m_eNodeLevelsWithText: Generator.NodeLevelsWithText;
        public m_iMinNodeLevelWithText: number;
        public m_iMaxNodeLevelWithText: number;
        public m_fAnimDuration: number;
        public AssertValid(): void;
        public DrawTextForAllNodes(displayRoot: vue_object, iLeftRightPaddingPx: number, iPaddingDecrementPerLevelPx: number, oNodes: Generator.Nodes): void;
        public DrawTextForSelectedNode(oSelectedNode: Generator.Node): void;
        public TextShouldBeDrawnForNode(oNode: Generator.Node, iNodeLevel: number): boolean;
    }
    class CenterCenterTextDrawer extends TextDrawerBase {
        constructor(eNodeLevelsWithText: Generator.NodeLevelsWithText, iMinNodeLevelWithText: number, iMaxNodeLevelWithText: number, sFontFamily: string, fFontNormSizePt: number, fFontMinSizePt: number, fFontMaxSizePt: number, fFontIncrementPt: number, oFontSolidColor: System.Drawing.Color, iFontMinAlpha: number, iFontMaxAlpha: number, iFontAlphaIncrementPerLevel: number, oSelectedFontColor: System.Drawing.Color, fAnimDuration: number);
        public m_sFontFamily: string;
        public m_fFontNormSizePt: number;
        public m_fFontMinSizePt: number;
        public m_fFontMaxSizePt: number;
        public m_fFontIncrementPt: number;
        public m_oFontSolidColor: System.Drawing.Color;
        public m_iFontMinAlpha: number;
        public m_iFontMaxAlpha: number;
        public m_iFontAlphaIncrementPerLevel: number;
        public m_oSelectedFontColor: System.Drawing.Color;
        public m_fAnimDuration: number;
        public AssertValid(): void;
        public CreateFontMapper(displayRoot: vue_object): IFontMapper;
        public CreateStringFormat(): System.Drawing.StringFormat;
        public CreateTransparentBrushMapper(): GraphicsLib.TransparentBrushMapper;
        public DrawTextForAllNodes(displayRoot: vue_object, iLeftRightPaddingPx: number, iPaddingDecrementPerLevelPx: number, oNodes: Generator.Nodes): void;
        public DrawTextForNodes(oNodes: Generator.Nodes, displayRoot: vue_object, oFontMapper: IFontMapper, oStringFormat: System.Drawing.StringFormat, oTransparentBrushMapper: GraphicsLib.TransparentBrushMapper, iNodeLevel: number, fAnimDuration: number): void;
        public DrawTextForSelectedNode(oSelectedNode: Generator.Node): void;
    }
    class TopTextDrawer extends TextDrawerBase {
        constructor(eNodeLevelsWithText: Generator.NodeLevelsWithText, iMinNodeLevelWithText: number, iMaxNodeLevelWithText: number, sFontFamily: string, fFontNormSizePt: number, fFontMinSizePt: number, iMinimumTextHeight: number, oTextColor: System.Drawing.Color, oSelectedFontColor: System.Drawing.Color, oSelectedBackColor: System.Drawing.Color, fAnimDuration: any);
        public m_sFontFamily: string;
        public m_fFontNormSizePt: number;
        public m_fFontMinSizePt: number;
        public m_iMinimumTextHeight: number;
        public m_oSelectedBackColor: System.Drawing.Color;
        public m_oSelectedFontColor: System.Drawing.Color;
        public m_oTextColor: System.Drawing.Color;
        public AssertValid(): void;
        public CreateStringFormat(bLeafNode: boolean, iTextHeight: number): System.Drawing.StringFormat;
        public DrawTextForAllNodes(displayRoot: vue_object, iLeftRightPaddingPx: number, iPaddingDecrementPerLevelPx: number, oNodes: Generator.Nodes): void;
        public DrawTextForNode(displayRoot: vue_object, oNode: Generator.Node, oFontForRectangle: FontForRectangle, oFontForLeaf: FontForRectangle, iTextHeight: number, oTextBrush: System.Drawing.Color, oBackgroundBrush: System.Drawing.Color, oNonLeafStringFormat: System.Drawing.StringFormat, oLeafStringFormat: System.Drawing.StringFormat, iNodeLevel: number): void;
        public DrawTextForNodes(oNodes: Generator.Nodes, displayRoot: vue_object, oFontForRectangle: FontForRectangle, oFontForLeaf: FontForRectangle, iTextHeight: number, oTextBrush: System.Drawing.Color, oBackgroundBrush: System.Drawing.Color, oNonLeafStringFormat: System.Drawing.StringFormat, oLeafStringFormat: System.Drawing.StringFormat, iNodeLevel: number): void;
        public DrawTextForSelectedNode(oSelectedNode: Generator.Node): void;
        static GetTextHeight(displayRoot: vue_object, sFontFamily: string, fFontSizePt: number, iMinimumTextHeight: number): number;
        static GetTextHeight2(displayRoot: vue_object, oFont: System.Drawing.Font, iMinimumTextHeight: number): number;
    }
    class OwnerDrawDrawer extends TextDrawerBase {
        constructor(ownerDraw: IContentDrawer, eNodeLevelsWithText: Generator.NodeLevelsWithText, iMinNodeLevelWithText: number, iMaxNodeLevelWithText: number, sFontFamily: string, fFontSizePt: number, oTextColor: System.Drawing.Color, oSelectedFontColor: System.Drawing.Color, oSelectedBackColor: System.Drawing.Color, fAnimDuration: number);
        public m_ownerDraw: IContentDrawer;
        public m_sFontFamily: string;
        public m_fFontSizePt: number;
        public m_oTextColor: System.Drawing.Color;
        public m_oSelectedBackColor: System.Drawing.Color;
        public m_oSelectedFontColor: System.Drawing.Color;
        public AssertValid(): void;
        public DrawTextForAllNodes(displayRoot: vue_object, iLeftRightPaddingPx: number, iPaddingDecrementPerLevelPx: number, oNodes: Generator.Nodes): void;
        private DrawContentForNodes(displayRoot, oNodes, iLeftRightPaddingPx, iPaddingDecrementPerLevelPx, iNodeLevel);
        private DrawContentForNode(displayRoot, oNode, iTextHeight, iLeftRightPaddingPx, iPaddingDecrementPerLevelPx, iNodeLevel);
        public DrawTextForSelectedNode(oSelectedNode: Generator.Node): void;
    }
}
declare module vp.visuals {
    /** Builds an HTML table that displays the rows & cols in "data".  returns the control that can be used
    to configure properties and hook events.  The root HTML element can be accessed thru "control.element()". */
    class dataGridClass extends dom.singleWrapperSuperClass<dataGridClass> {
        public ctr: string;
        private _showHdr;
        private _showAltLines;
        private _showDividers;
        private _boldFirstCol;
        private _isHeaderLocked;
        private _data;
        private _columnNames;
        private _rootElement;
        private _root;
        private _buildNeeded;
        private _timer;
        private _dividerColor;
        private _headerRow;
        private _lockedHeaderRow;
        private _divTableHolder;
        private _fillCellCallback;
        constructor();
        public build(): void;
        public buildHeader(colNames: string[], table: HTMLElement): void;
        public scheduleResize(): void;
        public addHeaderCol(headerRow: HTMLElement, colName: string): void;
        public resizeHeaderColsAndTable(): void;
        public buildNow: () => void;
        public rootElement: () => any;
        public data(): any[];
        public data(value: any[]): dataGridClass;
        public markRebuildNeeded: () => void;
        public showHeader: (value: any) => any;
        public showAltLines: (value: any) => any;
        public showDividers: (value: any) => any;
        public boldFirstColumn: (value: any) => any;
        public isHeaderLocked: (value: any) => any;
        public columnNames: (value: any) => any;
        public fillCellCallback: (value: any) => any;
        public addDataGridCol: (row: any, record: any, dataItem: any, showDividers: any, rowNum: any, colNum: any, boldFirstCol: any) => void;
    }
    function createDataGrid(): dataGridClass;
}

///----------------------------------------------------------------
/// (from visuals\fastDataGrid.d.ts)
///----------------------------------------------------------------
declare module vp.visuals {
    /** Builds a Canvas-based virtual data grid that displays the data found in a JSON array of records.  returns the control that can be used
    to configure properties and hook events.  The root HTML element can be accessed thru "control.element()". */
    class fastDataGridClass extends dom.singleWrapperSuperClass<fastDataGridClass> {
        public ctr: string;
        private _showHeader;
        private _showAltLines;
        private _showColDividers;
        private _showRowDividers;
        private _boldFirstCol;
        private _useMaxColWidths;
        private _maxColWidth;
        private _colInfo;
        private _data;
        public _rootElement: HTMLElement;
        public _root: any;
        public _canvasDiv: HTMLElement;
        public _canvas: HTMLCanvasElement;
        public _scrollBar: any;
        public _buildNeeded: boolean;
        public _timer: any;
        public _ctx: CanvasRenderingContext2D;
        public _textHeight: number;
        public _charWidth: number;
        public _topRow: number;
        public _numRowsVisible: number;
        public _canvasWidth: number;
        public _canvasHeight: number;
        public _divWidth: number;
        public _buildTimer: any;
        public _ignoreScrollBarChanges: boolean;
        public _padding: number;
        public _drawTimer: any;
        public _usingVerticalScroll: boolean;
        constructor();
        public onScrollChange(): void;
        public markBuildNeeded(): void;
        public computeX(left: number, right: number, spacing: number, align: string): number;
        public drawGridRow(ctx: CanvasRenderingContext2D, maxRight: number, y: number, isOdd: boolean, record: any): void;
        public draw(): void;
        public layoutControls(canvasWidth?: number, omitCalcCols?: boolean): void;
        /** Called primarily after RESIZE of dataGrid control has occured. */
        public build(): void;
        public markDrawNeeded(): void;
        public configScrollbar(): void;
        public onNewData(): void;
        public setTopRow(value: number): void;
        public setUpColInfo(): void;
        /** calc the largest string for hdr/data rows of col "index". */
        public getMaxColWidth(index: number): number;
        public calcColumnWidths(clientWidth: number): void;
        public rootElement: () => any;
        public data(): any[];
        public data(value: any[]): fastDataGridClass;
        public showHeader: (value: any) => any;
        public showAltLines: (value: any) => any;
        public showColumnDividers: (value: any) => any;
        public showRowDividers: (value: any) => any;
        public boldFirstColumn: (value: any) => any;
        public useMaxColumnWidths: (value: any) => any;
        public maxColumnWidth: (value: any) => any;
        public columnInfo: (value: any) => any;
    }
    interface IFastColumnInfo {
        hdrName: string;
        dataName: string;
        hdrAlign: string;
        dataAlign: string;
        requestedWidth: number;
        actualWidth: number;
    }
    function createFastDataGrid(): fastDataGridClass;
}

///----------------------------------------------------------------
/// (from visuals\gridContainer.d.ts)
///----------------------------------------------------------------
declare module vp.visuals {
    class gridContainerClass extends dom.singleWrapperSuperClass<gridContainerClass> {
        public ctr: string;
        private _layout;
        private _rootElement;
        private _root;
        private _timer;
        private _colCount;
        private _rowCount;
        private _cellMargin;
        constructor(rootElem?: HTMLElement);
        private layout();
        private initialBuild();
        private nodeAddOrDelete(e);
        private markLayoutNeeded();
        public colCount(): number;
        public colCount(value: number): gridContainerClass;
        public rowCount(): number;
        public rowCount(value: number): gridContainerClass;
        public cellMargin(): any;
        public cellMargin(value: any): gridContainerClass;
    }
    /** returns a grid container object that can host multiple controls in a N x M container of grid cells. */
    function createGridContainer(rootElem?: HTMLElement): gridContainerClass;
}

///----------------------------------------------------------------
/// (from visuals\plot.d.ts)
///----------------------------------------------------------------
declare module vp.visuals {
    /** implements a standard chart, with support for this._title, legend, axes, and ribbon. */
    class plotClass extends dom.singleWrapperSuperClass<plotClass> {
        public ctr: string;
        public _layers: layers.baseLayer[];
        public _plotId: number;
        public _isAnimEnabled: boolean;
        public _animDuration: number;
        public _isUiEnabled: boolean;
        public _isHoverEnabled: boolean;
        public _isSelectionEnabled: boolean;
        public _isTooltipEnabled: boolean;
        public _isXAxisVisible: boolean;
        public _isXGridVisible: boolean;
        public _isYAxisVisible: boolean;
        public _isYGridVisible: boolean;
        public _isTitleVisible: boolean;
        public _isAxisBoxVisible: boolean;
        public _xLabelFit: LabelFit;
        public _onError: any;
        public _gridLineType: number;
        public _showBoxTicks: boolean;
        public _drawTicksOnInside: boolean;
        public _isLegendVisible: any;
        public _isLegendBoxVisible: boolean;
        public _useLayersForLegend: boolean;
        public _legendLabels: any[];
        public _shapesEnterFromBottom: any;
        public _showRibbon: boolean;
        public _title: string;
        public _xLimit: any;
        public _yLimit: any;
        public _titleSize: number;
        public _ribbonBar: any;
        public _frameMargins: any;
        public _selectCallback: any;
        public _rebuildCallback: any;
        public _tooltip: any;
        public _chartFrame: any;
        public _plotShapes: any;
        public _useStdTooltips: boolean;
        public _rcShapes: any;
        public _htmlShapesGroup: any;
        public _postCreateCallback: any;
        public _hoverCallback: any;
        public _nextDataId: number;
        public _rootElement: any;
        public _rootDiv: any;
        public _svgDoc: any;
        public _chartFrameGroup: any;
        public _shapesGroup: any;
        public _tooltipDiv: any;
        public _uiStateMgr: any;
        public _chartType: any;
        public _xScale: any;
        public _yScale: any;
        public _timer: any;
        public _xMin: number;
        public _xMax: number;
        public _yMin: number;
        public _yMax: number;
        constructor();
        public rootElement(): any;
        public getNextDataId(): number;
        public clearLayers(): void;
        public append(strOrLayer: any): any;
        public appendLayer(strOrLayer: any): any;
        public removeLayer(layer: layers.baseLayer): void;
        public layers(): layers.baseLayer[];
        public showRibbon(value?: boolean): any;
        public shapesEnterFromBottom(value?: boolean): any;
        public title(): string;
        public title(value: string): plotClass;
        public isAnimEnabled(): boolean;
        public isAnimEnabled(value: boolean): plotClass;
        public animDuration(): number;
        public animDuration(value: number): plotClass;
        private onAnimationOrLayersChanged();
        public onToolTipsChanged(): void;
        public useStdTooltips(value?: boolean): any;
        public postCreateCallback(value?: any): any;
        public uiStateMgr(value: any): any;
        public isUiEnabled(value?: boolean): any;
        /** optional callback to record errors and return corrected values, when applicable. */
        public onError(value?: any): any;
        public isHoverEnabled(value?: boolean): any;
        public isSelectionEnabled(value?: boolean): any;
        public isTooltipEnabled(value?: boolean): any;
        public xLimit(value?: any): any;
        public yLimit(value?: any): any;
        public isXAxisVisible(value?: boolean): any;
        public isYAxisVisible(value?: boolean): any;
        public gridLineType(value?: number): any;
        public isXGridVisible(value?: boolean): any;
        public isYGridVisible(value: any): any;
        public isTitleVisible(value?: boolean): any;
        public drawTicksOnInside(value?: boolean): any;
        public showBoxTicks(value?: boolean): any;
        public isAxisBoxVisible(value?: boolean): any;
        public isLegendVisible(value?: boolean): any;
        public isLegendBoxVisible(value?: boolean): any;
        public useLayersForLegend(value?: boolean): any;
        public legendLabels(value?: string[]): any;
        public xLabelFit(value?: LabelFit): any;
        public titleSize(value?: any): any;
        public onShareNameChanged(): void;
        public selectByKeys(keys: any): void;
        public onFilterChanged(): void;
        public markRebuildNeeded(): void;
        public initialBuild(): void;
        public shapesDoc(): any;
        public plotBounds(): any;
        public shapesGroup(): any;
        public svgRoot(): any;
        public updateShapeVisuals(selectionCount: any): void;
        private getUnmappedData(attr, length);
        private buildRecordDescriptors(layer);
        private calcByRange(descRecords, scaleName, stat, layer);
        private calcPlotRange(descRecords, scaleName, stat, stackType, layer);
        private getColumnBarRange(descRecords, thisMin, thisMax, stackType, itemCount);
        private getNormalLayerRange(descRecords, thisMin, thisMax, stackType, itemCount);
        private calcXYRanges();
        private getScaleTypeForData(dd);
        public adjustScale(attribute: scales.attributeClass, myData: any, limit: any, dataMin: any, dataMax: any, seriesCount: number, scaleName: string): scales.baseScale;
        public updateAutoRangeScale(scale: scales.baseScale, scaleName: string): void;
        public adjustScales(layer: layers.baseLayer): void;
        public getStackType(layer: any): any;
        public rebuildChart(): void;
        public attachClipPathToShapesGroup(): void;
        public addOrUpdateClipPath(group: any, width: any, height: any): void;
        public drawLayers(): void;
        public drawLayer(layer: any): void;
        public addDrawnShapes(layer: any, shapes: any, seriesIndex: any): void;
        public buildChartTypeCombo(group: any): void;
        public makeGroupCheckbox(group: any, text: any, isEnabled: any, clickFunc: any): any;
        public buildRibbon(chartType: any): void;
        public printChart(includeRibbon: boolean): void;
        public onChartTypeChanged(e: any): void;
        public onMouseOver(e: any): void;
        public onMouseOut(e: any): void;
        public onKeyChanged(): void;
        public onKey2Changed(): void;
        public formatCol(record: any, colName: any, layer: any, seriesIndex: any): any;
        public expandColumns(str: any, record: any, layer: any, seriesIndex: any): string;
        public buildToolTipHelper(elem: any): boolean;
        public buildToolTip(elem: any, layer: any, seriesIndex: any): boolean;
        public frameMargins(value: any): any;
        public selectCallback(value: any): any;
        public hoverCallback(value: any): any;
        public rebuildCallback(value: any): any;
    }
    function createPlot(): plotClass;
}

///----------------------------------------------------------------
/// (from visuals\slider.d.ts)
///----------------------------------------------------------------
declare module vp.visuals {
    /** A slider control.  The slider slides between min and max values, by increment. */
    class sliderClass extends dom.singleWrapperSuperClass<sliderClass> {
        public ctr: string;
        private _min;
        private _max;
        private _increment;
        private _value;
        private _domElement;
        private _sliderTrack;
        private _sliderThumb;
        private _isVertical;
        private _cbMouseUp;
        private _cbMouseMove;
        private _changeListeners;
        private _toggleListeners;
        private _mouseDownX;
        private _mouseDownY;
        private _isMovingThumb;
        private _isMouseDown;
        private _mouseDownTime;
        private _lastMouseDoc;
        private _movedByUser;
        private _valueChangedDuringTouch;
        private _trackHeight;
        private _trackWidth;
        private _thumbWidth;
        private _thumbHeight;
        private _timer;
        private _changingSizes;
        private _isEnabled;
        constructor(isVertical: boolean);
        public update(): void;
        private build();
        public element(): HTMLElement;
        public sliderThumb(): any;
        public sliderTrack(): any;
        private setValue(newValue, force);
        private markUpdateNeeded();
        private onChange();
        private onToggle();
        public attach(eventName: string, callback: any, useCapture?: boolean): sliderClass;
        public detach(eventName: any, callback: any): sliderClass;
        private onMouseMove(e);
        private onMouseUp(e);
        private onMouseDown(e);
        private setThumbSize(width, height);
        private setTrackHeight(value);
        private setTrackWidth(value);
        private onBoundariesChanged();
        private onSizesChanged();
        public min(value: any): any;
        public max(value: any): any;
        public value(): string;
        public value(actualValue: string): sliderClass;
        public value(actualValue: number): sliderClass;
        public increment(value: any): any;
        public isEnabled(value: any): any;
        public trackHeight(value: any): any;
        public trackWidth(value: any): any;
        public thumbWidth(value: any): any;
        public thumbHeight(value: any): any;
    }
    function createVerticalSlider(): sliderClass;
    function createHorizontalSlider(): sliderClass;
}

///----------------------------------------------------------------
/// (from visuals\timeSlicer.d.ts)
///----------------------------------------------------------------
declare module vp.visuals {
    /** Creates a control to cut data into "slices" that can be scrolled thru or played back. */
    class timeSlicerClass extends dom.singleWrapperSuperClass<timeSlicerClass> {
        public ctr: string;
        private _timeColumn;
        private _data;
        private _rootElement;
        private _root;
        private _image;
        private _slider;
        private _keySpan;
        private _buildNeeded;
        private _buildTimer;
        private _padding;
        private _onChangeCallback;
        private _slices;
        private _sliceIndex;
        private _dataSlice;
        private _sliceKey;
        private _ignoreSliderChanges;
        private _sliceDuration;
        private _playTimer;
        private _stoppedImage;
        private _playingImage;
        constructor();
        public onSliderChanged(): void;
        public togglePlay(): void;
        public play(): timeSlicerClass;
        public stop(): timeSlicerClass;
        public markBuildNeeded(): void;
        public hookOnChange(callback: any): timeSlicerClass;
        public getDataSlice(): any[];
        public getDataKey(): string;
        /** Called primarily after RESIZE of dataGrid control has occured. */
        public build(): void;
        public setDataSlice(index: number): void;
        public rootElement: () => any;
        public data(): any[];
        public data(value: any[]): timeSlicerClass;
        public timeColumn: (value: any) => any;
        public sliceDuration: (value: any) => any;
    }
    function createTimeSlicer(): timeSlicerClass;
}
declare module vp.stats {
    /** settings for an attribute (value, scaling, and legend data). */
    class statContourClass {
        public _contourCount: number;
        public _colCount: any;
        public _xColName: string;
        public _yColName: string;
        public _zColName: string;
        constructor();
        public contourCount(): number;
        public contourCount(value: number): statContourClass;
        public runStatOnData: (xCol: string, yCols: string[], data: any[], layer: layers.baseLayer) => {
            data: any[];
            xCol: any[];
            yCol: string[];
        };
        public isBetween(k: number, pt1: geom.Point3d, pt2: geom.Point3d): boolean;
        public zFactor(k: number, pt1: geom.Point3d, pt2: geom.Point3d): number;
        public addLine(lineRecords: any[], x1: number, y1: number, x2: number, y2: number): void;
        public lerp(percent: number, a: number, b: number): number;
        public addLineDataForLeftTriangle(lineRecords: any[], k: number, pt0: geom.Point3d, pt1: geom.Point3d, pt2: geom.Point3d): void;
        public addLineDataForRightTriangle(lineRecords: any[], k: number, pt0: geom.Point3d, pt1: geom.Point3d, pt2: geom.Point3d): void;
    }
    function createStatContour(): statContourClass;
}

///----------------------------------------------------------------
/// (from vvPlot\uiStateMgr.d.ts)
///----------------------------------------------------------------
declare module vp.events {
    class uiStateMgrClass {
        public ctr: string;
        private _highlight;
        private _selection;
        private _filter;
        private _plotShapes;
        private _changeAgent;
        private _selectionCount;
        private _shareName;
        private _isUiEnabled;
        private _isSelectionEnabled;
        private _rubberBand;
        private _container;
        private _shapeContainer;
        private _zoomBoxHelper;
        private _dragMode;
        private _isMouseDown;
        private _mouseX;
        private _mouseY;
        private _dragToKidsOffset;
        private _selectCallback;
        private _viewName;
        private _appName;
        private _updateVisualsCallback;
        private _filterChangedCallback;
        private _queryFromElementsInBounds;
        constructor(viewName: string, appName: string, dragContainer: any, kidsContainer: any, updateVisualsCallback: any, filterChangedCallback: any, queryFromElementsInBounds: any);
        private initBuild();
        private onDragModeChanged();
        private adjustBoundsToKidsContainer(rcBand);
        private initZoomIfNeeded();
        private initPanAndZoom();
        private initRubberBand();
        private selectByKeys(keys);
        private getElementsFromBounds(rcBand);
        private selectElementsFromBounds(elems, toggle);
        public shareName(): string;
        public shareName(value: string): uiStateMgrClass;
        private onShareInfoChanged();
        private onUiStateReceived(uiState, info);
        private applyQuery(query, matchAttribute);
        public resetFilter(): uiStateMgrClass;
        public invertFilter(): uiStateMgrClass;
        public hideFilter(): uiStateMgrClass;
        public isolateFilter(): uiStateMgrClass;
        public resetSelection(processSelection?: boolean, tellOthers?: boolean): uiStateMgrClass;
        public toggleSelection(): uiStateMgrClass;
        private getId(elem);
        public plotShapes(): any;
        public plotShapes(value: any): uiStateMgrClass;
        public isUiEnabled(): boolean;
        public isUiEnabled(value: boolean): uiStateMgrClass;
        public isSelectionEnabled(): boolean;
        public isSelectionEnabled(value: boolean): uiStateMgrClass;
        public dragMode(): string;
        public dragMode(value: string): uiStateMgrClass;
        public dragToKidsOffset(): geom.ILocation;
        public dragToKidsOffset(value: geom.ILocation): uiStateMgrClass;
        public highlightShape(elem: HTMLElement): uiStateMgrClass;
        public toggleSelectionOnShape(elem: any, processSelection: any, tellOthers: any): uiStateMgrClass;
        public setSelectionFromBoundsQuery(query: any): uiStateMgrClass;
        public selectShape(elem: any): uiStateMgrClass;
        private updateShapeVisuals();
        public resetHighlight(): void;
        public filter(): any;
        public selection(): any;
        private sendChangesToAgent();
        private onHighlightChanged();
        private onSelectionChanged(tellOthersAndUpdate?);
        public selectionCount(): number;
        private triggerSelectCallback();
        private onFilterChanged();
        private triggerFilterChangedCallback();
        public selectCallback(): any;
        public selectCallback(value: any): uiStateMgrClass;
    }
    function createUiStateMgr(viewName: string, appName: string, dragContainer: any, kidsContainer: any, updateVisualsCallback: any, filterChangedCallback: any, queryFromElementsInBounds?: any): uiStateMgrClass;
}
///-----------------------------------------------------------------------------------------------------------------
/// vpEnd.d.ts  Copyright (c) 2014 Microsoft Corporation.
///    - ending additions for what will be generated to VuePlotTypes.ts
///-----------------------------------------------------------------------------------------------------------------

//----- END OF typescript definitions for vuePlot ----

  
