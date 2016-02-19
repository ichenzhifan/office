/**
* This module contains the basic definitions, helpers for parameter validation
*/
declare module DataViz.Validate {
    /**
    * This is a helper to validate parameters.
    *
    * Sample usage:
    * <code>
    * function foo(bar1: number, bar2: string, bar3: boolean, bar4: any)
    * {
    *     // Any failed validation will throw an exception
    *     DataViz.Validate.Validator.ensures(bar1).isGreaterThan(10).isLessThan(20);
    *     DataViz.Validate.Validator.ensures(bar2).isNotEmpty();
    *     DataViz.Validate.Validator.ensures(bar3).isTrue();
    *     DataViz.Validate.Validator.ensures(bar4).isNotNull();
    *     ...
    * }
    * </code>
    *
    */
    class Validator {
        private static invalidParameterTypeError;
        private static parameterIsNullError;
        private static parameterIsZeroError;
        private static parameterIsEmptyError;
        private static parameterIsNotPositiveError;
        private static parameterIsNotTrueError;
        private static parameterRangeError;
        private static parameterIsNotEqualToError;
        private param;
        private source;
        /**
        * Builds a validator that will validate the given parameter
        * @param {any} param The parameter to be validated
        * @returns {Validator} A validator instance to do the actual validation
        */
        static ensures(param: any): Validator;
        private static assertAndThrowIfNeeded(isValid, errorName, message?);
        /**
        * @param {any} param The parameter to be validated
        */
        constructor(param: any);
        /**
        * The information provided by caller
        * @param {string} source This parameter contains the information of the caller.
        * @returns {Validator} The validator instance used to do chain validation
        */
        public from(source: string): Validator;
        /**
        * Checks whether the parameter is not null nor undefined
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isNotNull(): Validator;
        /**
        * Checks whether the parameter is of a certain type. Will also validate against non-null.
        * @param {string} typeName The name of the expected type of the parameter
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isOfType(typeName: string): Validator;
        /**
        * Checks whether the parameter is a number. Will also validate against non-null.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isNumber(): Validator;
        /**
        * Checks whether the parameter is a string. Will also validate against non-null.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isString(): Validator;
        /**
        * Checks whether the parameter is a boolean. Will also validate against non-null.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isBool(): Validator;
        /**
        * Checks whether the parameter is a non-zero number. Will also validate against non-null and isNumber.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isNotZero(): Validator;
        /**
        * Checks whether the parameter is a non-empty ("") string. Will also validate against non-null and isString.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isNotEmpty(): Validator;
        /**
        * Checks whether the parameter is true. Will also validate against non-null and isBool.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isTrue(): Validator;
        /**
        * Checks whether the parameter is a positive number. Will also validate against non-null and isNumber.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isPositive(): Validator;
        /**
        * Checks whether the parameter is greater than or equal to the given value. Will also validate against non-null and isNumber.
        * @param {number} value The value compares to.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isGreaterThanOrEqualTo(value: number): Validator;
        /**
        * Checks whether the parameter is greater than the given value. Will also validate against non-null and isNumber.
        * @param {number} value The value compares to.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isGreaterThan(value: number): Validator;
        /**
        * Checks whether the parameter is less than or equal to the given value. Will also validate against non-null and isNumber.
        * @param {number} value The value compares to.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isLessThanOrEqualTo(value: number): Validator;
        /**
        * Checks whether the parameter is less than the given value. Will also validate against non-null and isNumber.
        * @param {number} value The value compares to.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isLessThan(value: number): Validator;
        /**
        * Checks whether the parameter is equal to the given value (including null or undefined).
        * @param {number} value The value compares to.
        * @returns {Validator} The validator instance used to do chain validation if this validation passes
        */
        public isEqualTo(value: any): Validator;
    }
}
/**
* This module contains the basic definitions implementations of the tools
*/
declare module DataViz.Tools {
    /**
    * This interface defines the general behavior of a tool
    */
    interface ITool {
        /**
        * Resets the tool
        */
        resetTool(): void;
    }
    /**
    * This interface defines a generic "pausable" behavior
    */
    interface IPausable {
        /**
        * Pauses the operation
        */
        pause(): void;
        /**
        * Resumes the operation
        */
        resume(): void;
        /**
        * Checks whether the operation is paused.
        * @returns {boolean} true if paused; false otherwise
        */
        isPaused(): boolean;
    }
    /**
    * A reusable implementation of the {@link IPausable}
    */
    class Pausable implements IPausable {
        private paused;
        constructor();
        /**
        * Implementing {@link IPausable#Pause}
        */
        public pause(): void;
        /**
        * Implementing {@link IPausable#Resume}
        */
        public resume(): void;
        /**
        * Implementing {@link IPausable#IsPaused}
        */
        public isPaused(): boolean;
    }
    /**
    * A tool class factory helper
    */
    class ToolsFactory {
        private static toolsPool;
        /**
        * Builds a particular tool with a given class name.
        * @param {string} className The fully qualified class name of the tool
        * @returns {any} The tool instance or null if fails to build
        */
        static buildTool(className: string): any;
    }
}
/**
* This module contains some helper functions
*/
declare module DataViz.Utils {
    /**
    * Get zoom ratio for the app to adjust some element size inside it
    * @returns number The zoom ratio to adjust element size
    */
    function getZoomRatioForApp(): number;
    /**
    * Get device zoom ratio
    * @returns number The zoom ratio of device
    */
    function getDeviceZoomRatio(): number;
    /**
    * Determines whether the application is running on a WAC environment.
    */
    function isOnWac(): boolean;
    /**
    * A module to handle events according to differnt browers.
    */
    module BrowserHelper {
        /**
        * Determines whether the browser is IE.
        * @returns True if the browser is IE, false otherwise.
        */
        function isIE(): boolean;
        /**
        * Determines whether the browser is IE9.
        * @returns True if the browser is IE9, false otherwise.
        */
        function isIE9(): boolean;
        /**
        * Get a svg element's width
        * @param {SVGSVGElement} node A svg node we need to get its width
        * @returns {number} The svg element's width
        */
        function getSvgElementWidth(node: SVGSVGElement): number;
        /**
        * Get a svg element's height
        * @param {SVGSVGElement} node A svg node we need to get its height
        * @returns {number} The svg element's height
        */
        function getSvgElementHeight(node: SVGSVGElement): number;
    }
    /**
    * Removes a particular item from an array. If there are multiple matches in the array, all will be removed.
    * @param {any[]} array The array to remove the item from
    * @param {any} item The item to remove
    * @returns True if succeeded; false otherwise (no such item)
    */
    function removeItemFromArray(array: any[], item: any): boolean;
    /**
    * Formats a number into a string with thousand separators. For example, 1234567 will becom 1,234,567; 1234567.12345 will become 1,234,567.12345
    * Only support non-negative float numbers.
    * @param {string} value The value to format
    * @returns {string} The formatted string, or the original string if it's not a non-negative float number
    */
    function formatNumberWithThousandSeparators(value: string): string;
    /**
    * Make the buttons of a certain pane tapped in circle
    * @param {string} paneId The target getting focused pane's id
    * @param {string} firstTabId The first getting focused element's id
    * @param {string} lastTabId The last getting focused element's id
    */
    function setTabFocus(paneId: string, firstTabId: string, lastTabId: string): void;
    /**
    * Replace all the specific sub-strings which contain a number and curly brace like "{1}" with meaningful strings.
    * @param {any[]} ...parameters The parameter[0] is the origin string and others are the replacing strings.
    * @returns {string} The replaced string.
    */
    function stringFormat(...parameters: any[]): string;
}
/**
* This modules contains basic definitions, interfaces and base classes related to configurations
*/
declare module DataViz.Config {
    /**
    * The well known configuration keys used in this app
    */
    var wellKnownKeys: {
        theme: string;
        shape: string;
        layout: string;
        sku: string;
    };
    /**
    * This interface defines the behavior of the configuration change listener, which will be notified when any configuration value is changed
    */
    interface IConfigurationChangeListener {
        /**
        * The event when a certain configuration value is changed.
        * @param {string} key The key of the configuration value that is changing
        * @param {any} value The actual configuration value that is changing
        */
        onConfigurationChanged(key: string, value: any): void;
    }
    /**
    * This interface defines the behavior of the configurator, which reads/saves configurations from/to the host document
    */
    interface IConfigurator extends Tools.ITool, IConfigurationChangeListener {
        /**
        * Loads all the values from the specified configuration
        * @param {Configuration} configuration The configuration to load
        */
        loadAll(configuration: Configuration): void;
        /**
        * Saves a configuration value specified by a particular key
        * @param {string} key The key of the configuration value to save
        * @param {any} value The value of the configuration
        */
        save(key: string, value: any): void;
    }
    /**
    * A configuration contains a set of key/value pairs (which normally represents user settings, etc.)
    */
    class Configuration {
        private settings;
        private changeListeners;
        private keys;
        private configurator;
        /**
        * @param {string[]} keys The keys of supported values in this configuration
        * @param {IConfigurator} configurator The configurator that can be actually used to load/save the configuration from/to host document
        */
        constructor(keys: string[], configurator: IConfigurator);
        /**
        * Resets the configuration
        */
        public reset(): void;
        /**
        * Registers a configuration change listener. This method can be called for multiple times to register multiple listeners.
        * @param {IConfigurationChangeListener} listener A configuration change listener to be registered.
        */
        public registerListener(listener: IConfigurationChangeListener): void;
        /**
        * Unregisters a configuration change listener.
        * @param {@link IConfigurationChangeListener} listener: A configuration change listener to be unregistered.
        */
        public unregisterListener(listener: IConfigurationChangeListener): void;
        /**
        * Loads all the configurations
        */
        public loadAll(): void;
        /**
        * Clears all the configuration values
        */
        public clear(): void;
        /**
        * Get a list of the keys of the supported configuration values
        * @returns {string[]} The keys of the supported configuration values
        */
        public Keys : string[];
        /**
        * Gets a configuration value with the specified key
        * @param {string} key The key of the configuration value to get
        * @returns {any} The configuration value retrieved
        */
        public get(key: string): any;
        /**
        * Sets a configuration value with the specified key
        * @param {string} key The key of the configuration value to set
        * @param {any} value The configuration value to set
        */
        public set(key: string, value: any): void;
    }
}
/**
* This module contains the basic definitions, constants, and base-classes of data related tasks
*/
declare module DataViz.Data {
    /**
    * The binding name used by the app
    */
    var DefaultBindingName: string;
    /**
    * The raw data format we get from Excel APIs
    */
    class RawData {
        /**
        * The formatted data gotted from Excel APIs
        */
        public formatted: any;
        /**
        * The unformatted data gotted from Excel APIs
        */
        public unformatted: any;
    }
    /**
    * This interface defines the behavior of the data change listener, which will get notified for data related events
    */
    interface IDataChangeListener {
        /**
        * The event when the bound data is being changed
        * @param {any} data The new data
        */
        onDataChanged(data: any): void;
        /**
        * The event when the binder is binding to a different target
        */
        onDataBindingTargetChanged(): void;
    }
    /**
    * This interface defines the behavior of the data convertor, which can convert the raw data (normally from host document) to the data of a particular form.
    * For example, the people bar data convertor can convert the raw data to data in key/value pairs
    */
    interface IDataConvertor extends Tools.ITool, Config.IConfigurationChangeListener {
        /**
        * Converts the raw data
        * @param {any} data The raw data to convert
        * @returns {any} The converted data
        */
        convert(data: any): any;
    }
    /**
    * This interface defines the behavior of the data binder, which can:
    *  - Get/set data from/to the host application
    *  - Bind data in the host application
    *  - Listen to data changes of the bound data
    */
    interface IDataBinder extends Tools.ITool {
        /**
        * Registers a data change listener. This method can be called for multiple times to register multiple listeners.
        * @param {IDataChangeListener} listener A data change listener to be registered.
        */
        registerDataChangeListener(listener: IDataChangeListener): void;
        /**
        * Unregisters a data change listener.
        * @param {@link IDataChangeListener} listener: A data change listener to be unregistered.
        */
        unregisterDataChangeListener(listener: IDataChangeListener): void;
        /**
        * Binds data by prompt
        * @param {(result: any) => any} [callback] The callback that will be called after the data binding is done. Optional.
        */
        bindByPrompt(callback?: (result: any) => any): void;
        /**
        * Binds the currently selected data
        * @param {(result: any) => any} [callback] The callback that will be called after the data binding is done. Optional.
        */
        bindBySelection(callback?: (result: any) => any): void;
        /**
        * Rebinds data directly using the default bind name
        * @param {() => any} [callback] The callback that will be called after the data binding is done. Optional.
        */
        rebind(callback?: () => any): void;
        /**
        * unbind data directly using the default bind name
        * @param {() => any} [callback] The callback that will be called after the data unbinding is done. Optional.
        */
        unbind(callback?: () => any): void;
        /**
        * Determines whether the binder is currently bound to any data
        * @returns {boolean} true if bound; false otherwise.
        */
        isBound(): boolean;
        /**
        * Retrieves the values of the bound data
        * @param {(data: any) => any} [callback] The callback that will be called after the values are retrieved. Required.
        */
        getData(callback: (data: any) => any): void;
        /**
        * Retrieves the values of the currently selected data
        * @param {(data: any) => any} [callback] The callback that will be called after the values are retrieved. Optional.
        */
        getSelectedData(callback: (data: any) => any): void;
    }
}
/**
* This module contains the basic definitions, constants and base-classes of layout related tasks
*/
declare module DataViz.Chart {
    /**
    * This represents a single HTML attribute name/value pair in the layout HTML element
    */
    class Attribute {
        /**
        * The name of the attribute
        */
        public name: string;
        /**
        * The value of the attribute
        */
        public value: any;
    }
    /**
    * This  represents a single CSS style item in the layout HTML element
    */
    class Style {
        /**
        * The name of the style item
        */
        public name: string;
        /**
        * The value of the style item
        */
        public value: string;
    }
    /**
    * This represents a single HTML element in the layout definition
    */
    class LayoutElement {
        /**
        * The id of the element
        */
        public id: string;
        /**
        * The tag name of the element (e.g. "text", "line", "rect", etc.)
        */
        public element: string;
        /**
        * The name of the CSS class for this element
        */
        public cssClass: string;
        /**
        * A list of HTML attributes of this element. @see Attribute
        */
        public attributes: Attribute[];
        /**
        * A list of CSS styles of this element. @see Style
        */
        public styles: Style[];
    }
    /**
    * This represents the layout definition, which contains a set of element definitions
    */
    class Layout {
        /**
        * The id of the layout
        */
        public id: string;
        /**
        * The HTML elements contained in this layout. @see LayoutElement
        */
        public elements: LayoutElement[];
    }
    /**
    * This interface defines the behavior of the layout chage listener
    */
    interface ILayoutChangeListener {
        /**
        * The event when the whole layout is being changed
        * @param {Layout} layout The layout that is being changed
        */
        onLayoutChanged(layout: Layout): void;
        /**
        * The event when a particular element is being changed
        * @param {LayoutElement} layoutElement The layout element that is being changed
        */
        onLayoutElementChanged(layoutElement: LayoutElement): void;
        /**
        * The event when a particular element instance is being changed
        * @param {LayoutElement} layoutElement The layout element whose value is being changed
        * @param {any} value The new value of the layout element
        */
        onLayoutElementInstanceChanged(layoutElement: LayoutElement, value: any): void;
    }
    /**
    * A layout element instance contains a particular layout element definition and its value. Normally it represents a concrete HTML element on the canvas
    */
    class LayoutElementInstance {
        public layoutElement: LayoutElement;
        public value: any;
        /**
        * @param {LayoutElement} layoutElement The layout element
        * @param {any} value The value of this instance
        */
        constructor(layoutElement: LayoutElement, value: any);
    }
    /**
    * A layout instance contains a set of layout element instances. It represents all the definitions of the HTML elements and the values for a concrete layout on the canvas
    */
    class LayoutInstance implements Config.IConfigurationChangeListener {
        private static Prefix;
        private changeListeners;
        private storage;
        private layout;
        private reentryFlag;
        /**
        * @param {Layout} layout The layout definitino
        * @param {Config.IConfigurator} configurator The configurator used to load element instance values from host document
        */
        constructor(layout: Layout, configurator: Config.IConfigurator);
        /**
        * Resets the layout instance
        */
        public reset(): void;
        /**
        * Loads all the element instance values from the configuration
        */
        public loadAll(): void;
        /**
        * Registers a layout chnage listener. This method can be called for multiple times to register multiple listeners.
        * @param {ILayoutChangeListener} listener A layout change listener to be registered.
        */
        public registerListener(listener: ILayoutChangeListener): void;
        /**
        * Unregisters a layout change listener.
        * @param {@link ILayoutChangeListener} listener: A layout change listener to be unregistered.
        */
        public unregisterListener(listener: ILayoutChangeListener): void;
        /**
        * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
        */
        public onConfigurationChanged(key: string, value: any): void;
        /**
        * Sets the value of a layout element with the specified id
        * @param {string} layoutElementId The id of the layout element
        * @param {any} value The value to set into the layout element
        */
        public setValue(layoutElementId: string, value: any): void;
        /**
        * Gets the value of a layout element with the specified id
        * @param {string} layoutElementId The id of the layout element
        * @returns {any} The value of the layout element instance
        */
        public getValue(layoutElementId: string): any;
        private notifyChange(layoutElementId, value);
    }
    /**
    * The layout provider that takes care of the following tasks
    *  - Loads the pre-defined layouts into memory
    *  - Returns all the loaded layouts
    *  - Tracks (via listening to configuration changes) and returns the currently selected layout
    */
    class LayoutProvider implements Config.IConfigurationChangeListener {
        private static theInstance;
        private static version;
        private layouts;
        private currentLayoutId;
        static Instance : LayoutProvider;
        /**
        * Loads all the pre-defined layouts. This has to be called before calling any other methods of this class.
        * @param {() => any} callback The callback function that will be called after the loading is finished
        */
        public loadAll(callback: () => any): void;
        /**
        * Gets all the loaded layouts.
        * @returns {Layout[]} All the loaded layouts
        */
        public Layouts : Layout[];
        /**
        * Returns the default layout
        * @returns {Layout} The default layout (normally the first layout in the list)
        */
        public Default : Layout;
        /**
        * Returns the id of current layout
        * @returns {string} The id of current layout
        */
        /**
        * Sets the current layout id
        * @param {string} id The layout id
        */
        public CurrentLayoutId : string;
        /**
        * Returns the current layout
        * @returns {Layout} The current layout (if at least one is selected) or the default layout (if none is selected)
        */
        public CurrentLayout : Layout;
        /**
        * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
        */
        public onConfigurationChanged(key: string, value: any): void;
        private getLayoutById(id);
    }
}
/**
* This module contains the basic definitions, constants and base-classes of customizable decorations related tasks
*/
declare module DataViz.Decoration {
    /**
    * The base class of a single definition in the customizable decoration
    */
    class Customizable {
        /**
        * The id of the item
        */
        public id: string;
        /**
        * The thumbnail image URL of the item
        */
        public thumbnail: string;
    }
    /**
    * This class represents a single theme definition
    */
    class Theme extends Customizable {
        /**
        * The ID of the SKU that uses this theme. Empty (null/""/undefined) if this theme is SKU-neutral.
        */
        public sku: string;
        /**
        * The CSS URL of this theme
        */
        public css: string;
    }
    /**
    * This class represents a single shape definition
    */
    class Shape extends Customizable {
        /**
        * The ID of the SKU that uses this shape. Empty (null/""/undefined) if this shape is SKU-neutral.
        */
        public sku: string;
        /**
        * The data of the SVG <path> definition of this shape
        */
        public path: string;
        /**
        * The original width of this shape
        */
        public width: number;
        /**
        * The original height of this shape
        */
        public height: number;
    }
    /**
    * The theme provider that takes care of the following tasks
    *  - Loads the pre-defined themes into memory
    *  - Returns all the loaded themes
    *  - Returns the themes for a particular SKU
    *  - Tracks (via listening to configuration changes) and returns the currently selected theme
    */
    class ThemeProvider implements Config.IConfigurationChangeListener {
        private static theInstance;
        private static version;
        private definitions;
        private currentThemeId;
        static Instance : ThemeProvider;
        /**
        * Loads all the pre-defined themes. This has to be called before calling any other methods of this class.
        * @param {() => any} callback The callback function that will be called after the loading is finished
        */
        public loadAll(callback: () => any): void;
        /**
        * Gets all the loaded themes.
        * @returns {Theme[]} All the loaded themes
        */
        public Themes : Theme[];
        /**
        * Enumerates all the themes for a particular SKU
        * @param {string} skuId The id of SKU
        * @returns {Theme[]} All the themes for a particular SKU, including all the SKU-neutral themes
        */
        public enumerateForSku(skuId: string): Theme[];
        /**
        * Returns the default theme
        * @returns {Theme} The default theme (normally the first theme in the list)
        */
        public Default : Theme;
        /**
        * Returns the id of current theme
        * @returns {string} The id of current theme
        */
        /**
        * Sets the current theme id
        * @param {string} id The theme id
        */
        public CurrentThemeId : string;
        /**
        * Returns the current theme
        * @returns {Theme} The current theme (if at least one is selected) or the default theme (if none is selected)
        */
        public CurrentTheme : Theme;
        /**
        * Returns the CSS URL for the current theme
        * @returns {string} The CSS URL for the current theme
        */
        public CurrentThemeCssUrl : string;
        /**
        * Gets the theme with the given id
        * @param {string} id The id the theme to get
        * @returns {Theme} The theme with the given id or null if not found
        */
        public getThemeById(id: string): Theme;
        /**
        * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
        */
        public onConfigurationChanged(key: string, value: any): void;
    }
    /**
    * The shape provider that takes care of the following tasks
    *  - Loads the pre-defined shapes into memory
    *  - Returns all the loaded shapes
    *  - Returns the shapes for a particular SKU
    *  - Tracks (via listening to configuration changes) and returns the currently selected shape
    */
    class ShapeProvider implements Config.IConfigurationChangeListener {
        private static theInstance;
        private static version;
        private definitions;
        private currentShapeId;
        static Instance : ShapeProvider;
        /**
        * Loads all the pre-defined shapes. This has to be called before calling any other methods of this class.
        * @param {() => any} callback The callback function that will be called after the loading is finished
        */
        public loadAll(callback: () => any): void;
        /**
        * Gets all the loaded shapes.
        * @returns {Shape[]} All the loaded shapes
        */
        public Shapes : Shape[];
        /**
        * Enumerates all the shapes for a particular SKU
        * @param {string} skuId The id of SKU
        * @returns {Shape[]} All the shapes for a particular SKU, including all the SKU-neutral shapes
        */
        public enumerateForSku(skuId: string): Shape[];
        /**
        * Returns the default shape
        * @returns {Shape} The default shape (normally the first shape in the list)
        */
        public Default : Shape;
        /**
        * Returns the id of current shape
        * @returns {string} The id of current shape
        */
        /**
        * Sets the current shape id
        * @param {string} id The shape id
        */
        public CurrentShapeId : string;
        /**
        * Returns the current shape
        * @returns {Shape} The current shape (if at least one is selected) or the default shape (if none is selected)
        */
        public CurrentShape : Shape;
        /**
        * Gets the shape with the given id
        * @param {string} id The id the shape to get
        * @returns {Shape} The shape with the given id or null if not found
        */
        public getShapeById(id: string): Shape;
        /**
        * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
        */
        public onConfigurationChanged(key: string, value: any): void;
    }
}

/**
* This module contains the basic definitions, constants and base-classes of SKU related tasks
*/
declare module DataViz.SKUs {
    /**
    * The SKU definition
    */
    class SKUDefinition extends Decoration.Customizable {
        /**
        * The plotter class name
        */
        public plotter: string;
        /**
        * The layouter class name
        */
        public layouter: string;
        /**
        * The data binder class name
        */
        public dataBinder: string;
        /**
        * The data convertor class name
        */
        public dataConvertor: string;
        /**
        * The configurator class name
        */
        public configurator: string;
        /**
        * The id of the default theme
        */
        public defaultTheme: string;
        /**
        * The id of the default shape
        */
        public defaultShape: string;
        /**
        * The id of the default layout
        */
        public defaultLayout: string;
        /**
        * The sample data
        */
        public sampleData: any;
    }
    /**
    * This represents an SKU instance, with all tools instantiated
    */
    class SKUInstance {
        private id;
        private plotter;
        private layouter;
        private dataBinder;
        private dataConvertor;
        private configurator;
        private visualizer;
        private controller;
        private themeId;
        private shapeId;
        private layoutId;
        private sampleData;
        /**
        * Creates an SKU instance from the SKU definition
        * @param {SKUDefinition} definition The SKU definition
        * @returns {SKUInstance} An SKU instance created or null if the creation fails
        */
        static fromDefinition(definition: SKUDefinition): SKUInstance;
        /**
        * Gets the id of the SKU
        * @returns {string} the id of the SKU
        */
        public Id : string;
        /**
        * Gets the plotter used in this SKU
        * @returns {DataViz.Chart.IPlotter} The plotter instance
        */
        public Plotter : Chart.IPlotter;
        /**
        * Gets the layouter used in this SKU
        * @returns {DataViz.Chart.ILayouter} The layouter instance
        */
        public Layouter : Chart.ILayouter;
        /**
        * Gets the data binder used in this SKU
        * @returns {DataViz.Data.IDataBinder} The data binder instance
        */
        public DataBinder : Data.IDataBinder;
        /**
        * Gets the data convertor used in this SKU
        * @returns {DataViz.Data.IDataConvertor} The data convertor instance
        */
        public DataConvertor : Data.IDataConvertor;
        /**
        * The configurator used in the SKU
        * @returns {DataViz.Config.IConfigurator} The configurator instance
        */
        public Configurator : Config.IConfigurator;
        /**
        * Gets the visualizer in the SKU
        * @returns {DataViz.Chart.Visualizer} The visualizer instance
        */
        public Visualizer : Chart.Visualizer;
        /**
        * Gets the controller in the SKU
        * @returns {DataViz.Control.Controller} The controller instance
        */
        public Controller : Control.Controller;
        /**
        * Gets the id of the default them of the SKU
        * @returns {string} The id of the default theme
        */
        public ThemeId : string;
        /**
        * Gets the id of the default shape of the SKU
        * @returns {string} The id of the default shape
        */
        public ShapeId : string;
        /**
        * Gets the id of the default layout of the SKU
        * @returns {string} The id of the default layout
        */
        public LayoutId : string;
        /**
        * Gets the sample data of the SKU
        * @returns {any} The sample data
        */
        public SampleData : any;
        /**
        * Resets the SKU (basically resets all the tools in the SKU)
        */
        public reset(): void;
    }
    /**
    * The SKU provider that takes care of the following tasks
    *  - Loads the pre-defined SKUs into memory
    *  - Returns all the loaded SKUs
    *  - Tracks (via listening to configuration changes) and returns the currently selected SKU
    */
    class SKUProvider implements Config.IConfigurationChangeListener {
        private static theInstance;
        private static version;
        private definitions;
        private currentSKUId;
        static Instance : SKUProvider;
        /**
        * Loads all the pre-defined SKUs. This has to be called before calling any other methods of this class.
        * @param {(succeeded: bool) => any} callback The callback function that will be called after the loading is finished
        */
        public loadAll(preDefines: SKUDefinition[], callback: () => any): void;
        /**
        * Gets (lazy loading) all the loaded SKUs.
        * @returns {SKUDefinition[]} All the loaded SKUs
        */
        public SKUs : SKUDefinition[];
        /**
        * Returns the default SKU
        * @returns {SKUDefinition} The default SKU (normally the first SKU in the list)
        */
        public Default : SKUDefinition;
        /**
        * Returns the id of current SKU
        * @returns {string} The id of current SKU
        */
        /**
        * Sets the current SKU id
        * @param {string} id The SKU id
        */
        public CurrentSKUId : string;
        /**
        * Returns the current SKU
        * @returns {SKUDefinition} The current SKU (if at least one is selected) or the default SKU (if none is selected)
        */
        public CurrentSKU : SKUDefinition;
        /**
        * Returns the current SKU instance
        * @returns {SKUInstance} The current SKU instance (if at least one is selected) or null (if none is selected)
        */
        public CurrentSKUInstance : SKUInstance;
        /**
        * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
        */
        public onConfigurationChanged(key: string, value: any): void;
        private getSKUById(id);
    }
}
/**
* This module contains the basic definitions, constants and base-classes related to rendering
*/
declare module DataViz.Chart {
    /**
    * The ID of the root-most SVG element of the canvas
    */
    var defaultSVGRootId: string;
    /**
    * The ID of the root SVG element of the main chart (chart excluding stuffs like title, backdrop, separator and other decorations)
    */
    var defaultChartRootId: string;

    var isWindowBand: boolean;

    /**
    * This interface defines the layouter behavior, which takes care of the rendering/positioning/styling of non-quantitative elements on the chart.
    * Non-quantitative elements normally are things like title, backdrop, separator or some other decorative elements that are not bound to any particular data
    */
    interface ILayouter extends Tools.ITool, ILayoutChangeListener, Tools.IPausable {
        /**
        * Renders the layout.
        * @param {any} data The bound data to be visualized. The actual layouter might not need the data at all but we just provide it here just in case...
        */
        layout(data: any): void;
    }
    /**
    * This interface defines the plotter behavior, which takes care of the rendering/positioning/styling of quantitative elements on the chart.
    * Quantitiative elements include those such as labels, numbers, and shapes representing the data being bounded.
    */
    interface IPlotter extends Tools.ITool, Tools.IPausable {
        /**
        * Plots the data to the chart.
        * @param {any} data The bound data to be plotterd.
        */
        plot(data: any): void;
    }
    /**
    * This interface defines the behavior of the visualization listener, which will be notified for events of the visualization life-cycle.
    */
    interface IVisualizationListener {
        /**
        * The event when the visualization is being started
        */
        onStartVisualizing(): void;
        /**
        * The event when the visualization has been ended
        */
        onEndVisualizing(): void;
    }
    /**
    * A class that takes care of the visualization.
    */
    class Visualizer implements Tools.ITool {
        private layouter;
        private plotter;
        private visualizationRequestPending;
        private cachedData;
        private visualizationListeners;
        /**
        * @param {@link ILayouter} layouter The layouter instance that will do the actual layout actions
        * @param {@link IPlotter} plotter The plotter instance that will do the actual plotting operations
        */
        constructor(layouter: ILayouter, plotter: IPlotter);
        /**
        * Visualizes the data to the chart
        @param {any} data The data to be visualized
        */
        public visualize(data: any): void;
        /**
        * Registers a visualization listener. This method can be called for multiple times to register multiple listeners.
        * @param {IVisualizationListener} listener A visualization listener to be registered.
        */
        public registerListener(listener: IVisualizationListener): void;
        /**
        * Unregisters a visualization listener.
        * @param {@link IVisualizationListener} listener: A visualization listener to be unregistered.
        */
        public unregisterListener(listener: IVisualizationListener): void;
        /**
        * Implementing {@link ITool#resetTool}
        */
        public resetTool(): void;
        private revisualize();
    }
}
/**
* This module contains the controller implementation
*/
declare module DataViz.Control {
    /**
    * The controller behaves like a bridge or a middle man connecting several other components.
    * In general, it listens to certain events from some components and triggers certain operations of other components
    */
    class Controller implements Data.IDataChangeListener, Config.IConfigurationChangeListener {
        private visualizer;
        private dataBinder;
        private dataConvertor;
        private cachedData;
        private isRevisualizeOnThemeChange;
        /**
        * @param {Visualizer} visualizer The visualizer that will be used to do visualization
        * @param {IDataBinder} dataBinder The data binder that will be used to do data binding
        * @param {IDataConvertor} visualizer The data convertor that will be used to convert raw data
        */
        constructor(visualizer: Chart.Visualizer, dataBinder: Data.IDataBinder, dataConvertor: Data.IDataConvertor);
        /**
        * Binds data by prompt (delegate to the data binder)
        * @param {(result: any) => any} [callback] The callback that will be called after the data binding is done. Optional.
        */
        public bindDataByPrompt(callback?: (result: any) => any): void;
        /**
        * Binds data by selection (delegate to the data binder)
        * @param {(result: any) => any} [callback] The callback that will be called after the data binding is done. Optional.
        */
        public bindDataBySelection(callback?: (result: any) => any): void;
        /**
        * Rebinds data directly using the default bind name (delegate to the data binder)
        * @param {() => any} [callback] The callback that will be called after the data binding is done. Optional.
        */
        public rebindData(callback?: () => any): void;
        /**
        * Tries to bind the currently selected data (delegate to the data binder)
        * @param {(result: any) => any} [callback] The callback that will be called after the data binding is done. Optional.
        */
        public tryBindSelection(callback?: (result: any) => any): void;
        /**
        * Visualizes the given data (delegate to the visualizer)
        * @param {any} rawData The raw data to be visualized
        */
        public visualizeData(rawData: any): void;
        /**
        * Revisualizes the cached data (if any)
        */
        public revisualize(): void;
        /**
        * Whether revisualize on theme change
        * @param {boolean} isRevisualize set to true if revisualize on theme change
        */
        public revisualizeOnThemeChange(isRevisualize: boolean): void;
        /**
        * Implementing {@link IDataChangeListener#onDataChanged}
        */
        public onDataChanged(rawData: any): void;
        /**
        * Implementing {@link IDataChangeListener#onDataBindingTargetChanged}
        */
        public onDataBindingTargetChanged(): void;
        /**
        * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
        */
        public onConfigurationChanged(key: string, value: any): void;
    }
}
/**
* This module contains the implementation of the People Bar specific data covnertor
*/
declare module DataViz.Data.PeopleBar {
    /**
    * This is the data used by the People Bar plotter
    */
    class KeyValueData {
        private threshold;
        private rawData;
        private keyColumnIndex;
        private valueColumnIndex;
        private hasHeader;
        /**
        * Instantiates a {@link KeyValueData} instance from the raw data
        * @param {DataViz.Data.RawData} data The raw data
        * @param {number} [keyColumnIndex = 0] The index of the column used as keys
        * @param {number} [valueColumnIndex = 0] The index of the column used as values
        * @param {boolean} [hasHeader = false] Indicating whether the data has header
        * @returns {KeyValueData} The converted data
        */
        static from(data: RawData, keyColumnIndex?: number, valueColumnIndex?: number, hasHeader?: boolean): KeyValueData;
        /**
        * Determines whether the give raw data is in valid form for People Bar
        * @param {string[][]} data The raw data
        * @param {number} [keyColumnIndex = 0] The index of the column used as keys
        * @param {number} [valueColumnIndex = 0] The index of the column used as values
        * @param {boolean} [hasHeader = false] Indicating whether the data has header
        * @returns {boolean} True if the data is valid; false otherwise
        */
        static isValidKeyValueData(data: string[][], keyColumnIndex?: number, valueColumnIndex?: number, hasHeader?: boolean): boolean;
        /**
        * @param {DataViz.Data.RawData} data The raw data
        * @param {number} [keyColumnIndex = 0] The index of the column used as keys
        * @param {number} [valueColumnIndex = 0] The index of the column used as values
        * @param {boolean} [hasHeader = false] Indicating whether the data has header
        */
        constructor(rawData: RawData, keyColumnIndex?: number, valueColumnIndex?: number, hasHeader?: boolean);
        /**
        * Gets the index of the column used as keys
        * @returns {number} The key column index
        */
        /**
        * Sets the index of the column used as keys
        * @param {number} index The key column index
        */
        public KeyColumnIndex : number;
        /**
        * Gets the index of the column used as values
        * @returns {number} The value column index
        */
        /**
        * Sets the index of the column used as values
        * @param {number} index The value column index
        */
        public ValueColumnIndex : number;
        /**
        * Gets the flag indicating whether the data has a header
        * @returns {boolean} True if it has header; false otherwise
        */
        /**
        * Sets the flag indicating whether the data has a header
        * @param {boolean} hasHeader True if it has header; false otherwise
        */
        public HasHeader : boolean;
        /**
        * Gets the headers of all columns
        * @returns {string[]} The headers of all columns
        */
        public Headers : string[];
        /**
        * Gets all the keys
        * @returns {string[]} All the keys
        */
        public Keys : string[];
        /**
        * Gets all the formatted values
        * @returns {string[]} All the formatted value series
        */
        public FormattedValueSeries : string[];
        /**
        * Gets the normalized value series. Normalized means all values are non negative numbers
        * @returns {number[]} The normalized value series
        */
        public NormalizedValueSeries : number[];
        /**
        * Sets the threshold of the data
        * @param {number} threshold The threshold of the data
        */
        public setThreshold(threshold: number): void;
        /**
        * Resets  the threshold of the data
        */
        public resetThreshold(): void;
        /**
        * Gets a copy of the data with a threshold. Anything beyond the threshold will be discarded from the returned copy
        * @returns {KeyValueData} The data copy with eveything below the threshold
        */
        public withThreshold(threshold: number): KeyValueData;
        private startRow;
        private endRow;
    }
    /**
    * This is a People Bar specific data convertor implementation
    */
    class KeyValueDataConvertor implements IDataConvertor {
        private rawData;
        private keyColumnIndex;
        private valueColumnIndex;
        /**
        * @param {string[][]} data The raw data
        * @param {number} [keyColumnIndex = 0] The index of the column used as keys
        * @param {number} [valueColumnIndex = 0] The index of the column used as values
        */
        constructor(keyColumnIndex?: number, valueColumnIndex?: number);
        /**
        * Implementing {@link ITool#resetTool}
        */
        public resetTool(): void;
        /**
        * Gets the index of the column used as keys
        * @returns {number} The key column index
        */
        /**
        * Sets the index of the column used as keys
        * @param {number} index The key column index
        */
        public KeyColumnIndex : number;
        /**
        * Gets the index of the column used as values
        * @returns {number} The value column index
        */
        /**
        * Sets the index of the column used as values
        * @param {number} index The value column index
        */
        public ValueColumnIndex : number;
        /**
        * Implementing {@link IDataConvertor#Convert}
        */
        public convert(data: RawData): KeyValueData;
        /**
        * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
        */
        public onConfigurationChanged(key: string, value: any): void;
    }
}
declare var d3: any;
/**
* This modules contains the implementations of the base class for People Bar plotters
*/
declare module DataViz.Chart.D3 {
    /**
    * This is a helper class to calculate the optimal plotter parameters. Here "optimal" means the best/ideal plotter parameters to render the data onto the chart
    */
    class OptimalPlotterParameter {
        private shapeWidth;
        private shapeHeight;
        private bandHeight;
        private bandCount;
        private basePlotterVariables;
        constructor(basePlotterVariables: any);
        /**
        * Gets the optimal shape width
        * @returns {number} The optimal shape width
        */
        public ShapeWidth : number;
        /**
        * Gets the optimal shape height
        * @returns {number} The optimal shape height
        */
        public ShapeHeight : number;
        /**
        * Gets the optimal band height. "Band" means the bar-like elements group (shape icons + text label + number label, etc.) representing a single value of the selected data.
        * @returns {number} The optimal band height
        */
        public BandHeight : number;
        /**
        * Gets the optimal count of bands that can be rendered in the visible canvas
        * @returns {number} The optimal band count
        */
        public BandCount : number;
        /**
        * Optimizes the plotter parameters
        * @param {number} maxValue The maximum value among the all the values in the bound data
        * @param {number} bandwidth The width of the band area (chart area excluding the spaces used up by labels, etc. - That is, the space used to render shape icons)
        * @param {number} boardHeight The height of the board used to render the chart
        * @param {number} originalShapeWidth The original width of the shape
        * @param {number} originalShapeHeight The original height of the shape
        * @param {number} preferredShapeHeight The preferred height of the shape
        * @param {number} minimalShapeHeight The minimal height of the shape
        * @param {(shapeHeight: number) => number} bandHeightCalculatingFunction The chart-type-specific function to calculate the band height
        * @param {(bandHeight: number) => number} totalHeightCalculatingFunction The chart-type-specific function to calculate the total height
        * @param {(bandHeight: number) => number} bandCountCalculatingFunction The chart-type-specific function to calculate the band count
        */
        public optimize(maxValue: number, bandWidth: number, boardHeight: number, originalShapeWidth: number, originalShapeHeight: number, preferredShapeHeight: number, minimalShapeHeight: number, bandHeightCalculatingFunction: (shapeHeight: number) => number, totalHeightCalculatingFunction: (bandHeight: number) => number, bandCountCalculatingFunction: (bandHeight: number) => number): void;
        private canAllDataFitInOneCanvasWithGivenIconSize(maxValue, bandWidth, boardHeight, shapeWidth, shapeHeight, bandHeightCalculatingFunction, totalHeightCalculatingFunction);
    }
    /**
    * This class contains some plotter variables that are may change due to factors like canvas size, shape size, etc.
    */
    class PeopleBarPlottertVolatileVariables {
        private boardWidth;
        private boardHeight;
        private bandWidth;
        private maximalShapesPerBand;
        private basePlotterVariables;
        constructor(basePlotterVariables: any);
        /**
        * Gets the board width
        * @returns {number} The board width
        */
        public BoardWidth : number;
        /**
        * Gets the board height
        * @returns {number} The board height
        */
        public BoardHeight : number;
        /**
        * Gets the band width, which is the width of the band (board width excluding label widths etc., if any)
        * @returns {number} The band width
        */
        public BandWidth : number;
        /**
        * Gets the maximal count of shapes per band
        * @returns {number} The maximal count of shapes per band
        */
        public MaximalShapesPerBand : number;
        /**
        * Refreshes the variables given external factors
        * @param {SVGRect} svgViewport The viewport information of the chart root SVG
        * @param {KeyValueData} data The data to be plotted
        * @param {(data: Data.PeopleBar.KeyValueData, boardWidth: number) => number} bandWidthCalculatingCallback The function to calculate band width
        */
        public refresh(svgElement: SVGSVGElement, data: Data.PeopleBar.KeyValueData, bandWidthCalculatingCallback: (data: Data.PeopleBar.KeyValueData, boardWidth: number) => number): void;
    }
    /**
    * This is the base class of all other People Bar plotters
    */
    class PeopleBarBasePlotter extends Tools.Pausable implements IPlotter {
        /**
        * The volatile plotter variables
        */
        public volatilePlotterVariables: PeopleBarPlottertVolatileVariables;
        public volatilePlotterVariablesSpecific: any;
        public volatileSpecificStatic: any;
        private zoomRatio;
        private basePlotterVariables;
        private timeoutId;
        constructor();
        public ZoomRatio : number;
        public BasePlotterVariables : any;
        /**
        * Implementing {@link ITool#resetTool}
        */
        public resetTool(): void;
        /**
        * Implementing {@link IPlotter#plot}
        */
        public plot(data: Data.PeopleBar.KeyValueData): void;
        /**
        * This is a overridable method. Subclasses might override it to add their own plotter code
        * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        * @param {KeyValueData} data The data to render
        * @param {number} maxValue The max value among all the values in the data
        * @param {number} magnitude The magnitude applied to the values
        * @param {Shape} shape The currently selected shape definition
        */
        public plotWithMagnitude(data: Data.PeopleBar.KeyValueData, maxValue: number, magnitude: number, shape: Decoration.Shape): void;
        /**
        * This is a overridable method. Subclasses might override it to add their own calculation logic
        * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        * @param {KeyValueData} data The data to be plotted
        * @param {number} boardWidth The width of the board that will be used to render the whole chart (area including label widths, if any)
        * @returns {number} The width of the band that will be used to render the shape icons (area excluding label widths, if any)
        */
        public calculateBandWidth(data: Data.PeopleBar.KeyValueData, boardWidth: number): number;
        /**
        * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        * @param {opt} The optimal parameter for plotter.
        * @param {data} data The data to be plotted.
        */
        public notifyResizeWindow(opt: OptimalPlotterParameter, data: Data.PeopleBar.KeyValueData): void;
        public refreshFontSizeAndGap(rowCount: number): void;
        public handleVolatilePlotterVariablesInHDPI(volatilePlotterVariables: any): void;
        private calculateLayout(data);
    }
}
declare var d3: any;

/**
* This module contains the implementation of the People Bar D3 plotter for the "classic" type
*/
declare module DataViz.Chart.D3 {
    /**
    * The People Bar D3 plotter for the "classic" type
    */
    class PeopleBarClassicPlotterD3 extends PeopleBarBasePlotter {
        private maxLabelWidth;
        private maxValueLabelHeight;
        private maxLabelHeight;
        private valueLabelWidths;
        private labelWidths;
        private plotterVariables;
        constructor();
        /**
        * Overriding {@link PeopleBarBasePlotter#plotWithMagnitude}
        */
        public plotWithMagnitude(data: Data.PeopleBar.KeyValueData, maxValue: number, magnitude: number, shape: Decoration.Shape): void;
        /**
        * Overriding {@link PeopleBarBasePlotter#calculateBandWidth}
        */
        public calculateBandWidth(data: Data.PeopleBar.KeyValueData, boardWidth: number): number;
    }
}
declare var d3: any;

/**
* This module contains the implementation of the People Bar D3 plotter for the "callout" type
*/
declare module DataViz.Chart.D3 {
    /**
    * The People Bar D3 plotter for the "callout" type
    */
    class PeopleBarCalloutPlotterD3 extends PeopleBarBasePlotter {
        private maxLabelWidth;
        private maxValueLabelHeight;
        private maxLabelHeight;
        private valueLabelWidths;
        private labelWidths;
        private plotterVariables;
        constructor();
        /**
        * Overriding {@link PeopleBarBasePlotter#plotWithMagnitude}
        */
        public plotWithMagnitude(data: Data.PeopleBar.KeyValueData, maxValue: number, magnitude: number, shape: Decoration.Shape): void;
        /**
        * Overriding {@link PeopleBarBasePlotter#calculateBandWidth}
        */
        public calculateBandWidth(data: Data.PeopleBar.KeyValueData, boardWidth: number): number;
    }
}
declare var d3: any;

/**
* This module contains the implementation of the People Bar D3 plotter for the "giant" type
*/
declare module DataViz.Chart.D3 {
    /**
    * The People Bar D3 plotter for the "giant" type
    */
    class PeopleBarGiantPlotterD3 extends PeopleBarBasePlotter {
        private maxValueLabelWidth;
        private maxValueLabelHeight;
        private maxLabelHeight;
        private valueLabelWidths;
        private plotterVariables;
        constructor();
        /**
        * Overriding {@link PeopleBarBasePlotter#plotWithMagnitude}
        */
        public plotWithMagnitude(data: Data.PeopleBar.KeyValueData, maxValue: number, magnitude: number, shape: Decoration.Shape): void;
        /**
        * Overriding {@link PeopleBarBasePlotter#calculateBandWidth}
        */
        public calculateBandWidth(data: Data.PeopleBar.KeyValueData, boardWidth: number): number;
    }
}
declare var d3: any;

/**
* This module contains the implementation of the base layouter
*/
declare module DataViz.Chart.D3 {
    /**
    * The base class of all layouters based on D3
    */
    class BaseLayouter extends Tools.Pausable implements ILayouter {
        private zoomRatio;
        private cachedLayoutElementInstance;
        constructor();
        public ZoomRatio : number;
        /**
        * Implementing {@link ITool#resetTool}
        */
        public resetTool(): void;
        /**
        * Implementing {@link ILayouter#Layout}
        */
        public layout(data: any): void;
        /**
        * Implementing {@link ILayoutChangeListener#onLayoutChanged}
        */
        public onLayoutChanged(layout: Layout): void;
        /**
        * Implementing {@link ILayoutChangeListener#onLayoutElementChanged}
        */
        public onLayoutElementChanged(layoutElement: LayoutElement): void;
        /**
        * Implementing {@link ILayoutChangeListener#onLayoutElementInstanceChanged}
        */
        public onLayoutElementInstanceChanged(layoutElement: LayoutElement, value: any): void;
        /**
        * The width and height settings for an inner SVG are not working properly. It always becomes "auto x auto".
        * Here is a workaround helper to inject a placeholder rect into the inner SVG.
        * In addition, this actually ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        * @param {any} innserSVG The inner SVG node
        * @param {any} width The width of the placeholder (the expected width of the inner SVG)
        * @param {any} height The height of the placeholder (the expected height of the inner SVG)
        */
        public injectPlaceholderForInnerSVG(innerSVG: any, width: any, height: any): void;
        /**
        * This is an overridable method that mostly should be used by sub classes to do extra layout
        * It actually ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        */
        public layoutExtra(): void;
        /**
        * This is a helper method mostly should be used by sub classes to get title height
        * It actually ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        */
        public getTitleHeight(title: any): number;
        private relayout();
        private layoutOneElement(layoutElement);
        private layoutOneElementInstance(layoutElement, value);
        private ensureDefinitions();
    }
}
declare var d3: any;

/**
* This module contains the implementation of the layouter for the People Bar "giant" type
*/
declare module DataViz.Chart.D3 {
    /**
    * The layouter for the People Bar "giant" type
    */
    class GiantLayouter extends BaseLayouter {
        private static cxBoardMargin;
        private static cyBoardMargin;
        private static cyTitleGap;
        private static cySeparatorGap;
        private cxBoardMargin;
        private cyBoardMargin;
        private cyTitleGap;
        private cySeparatorGap;
        constructor();
        /**
        * Overriding {@link BaseLayout#layoutExtra}
        */
        public layoutExtra(): void;
    }
}
declare var d3: any;

/**
* This module contains the implementation of the layouter for the People Bar "callout" type
*/
declare module DataViz.Chart.D3 {
    /**
    * The layouter for the People Bar "callout" type
    */
    class CalloutLayouter extends BaseLayouter {
        private static cyBoardMargin;
        private static cyTitleGap;
        private cyBoardMargin;
        private cyTitleGap;
        constructor();
        /**
        * Overriding {@link BaseLayout#layoutExtra}
        */
        public layoutExtra(): void;
    }
}
declare var d3: any;

/**
* This module contains the implementation of the layouter for the People Bar "classic" type
*/
declare module DataViz.Chart.D3 {
    /**
    * The layouter for the People Bar "classic" type
    */
    class ClassicLayouter extends BaseLayouter {
        private static cyBoardMargin;
        private static cyTitleGap;
        private cyBoardMargin;
        private cyTitleGap;
        constructor();
        /**
        * Overriding {@link BaseLayout#layoutExtra}
        */
        public layoutExtra(): void;
    }
}
/**
* This module contains the implementation of the app's specific data binder
*/
declare module DataViz.Data.Agave {
    /**
    * This is the app's specific data binder
    */
    class DataBinder implements IDataBinder {
        private isDataBound;
        private bindingName;
        private dataChangeListeners;
        private dataChangeHandler;
        constructor();
        /**
        * Implementing {@link ITool#resetTool}
        */
        public resetTool(): void;
        /**
        * Implementing {@link IDataBinder#registerDataChangeListener}
        */
        public registerDataChangeListener(listener: IDataChangeListener): void;
        /**
        * Implementing {@link IDataBinder#unregisterDataChangeListener}
        */
        public unregisterDataChangeListener(listener: IDataChangeListener): void;
        /**
        * Implementing {@link IDataBinder#bindByPrompt}
        */
        public bindByPrompt(callback?: (result: any) => any): void;
        /**
        * Implementing {@link IDataBinder#bindBySelection}
        */
        public bindBySelection(callback?: (result: any) => any): void;
        /**
        * Implementing {@link IDataBinder#Rebind}
        */
        public rebind(callback?: () => any): void;
        /**
        * Implementing {@link IDataBinder#unbind}
        */
        public unbind(callback?: () => any): void;
        /**
        * Implementing {@link IDataBinder#getSelectedData}
        */
        public getSelectedData(callback: (data: any) => any): void;
        /**
        * Implementing {@link IDataBinder#IsBound}
        */
        public isBound(): boolean;
        /**
        * Implementing {@link IDataBinder#getData}
        */
        public getData(callback: (data: RawData) => any): void;
        private bind(prompt, callback?);
        private bindInternal(prompt, callback?);
        private attachHandler(callback?);
        private detachHandler(callback?);
        private notifyDataChange();
        private notifyBindingTargetChange();
    }
}
/**
* This module contains the implementation of the app's specific configurator
*/
declare module DataViz.Config.Agave {
    var MaxRowNumber: number;
    var MaxColumnNumber: number;
    /**
    * This is the app's specific configurator
    */
    class Configurator implements IConfigurator {
        private reentryFlag;
        constructor();
        /**
        * Implementing {@link ITool#resetTool}
        */
        public resetTool(): void;
        /**
        * Implementing {@link IConfigurator#loadAll}
        */
        public loadAll(configuration: Configuration): void;
        /**
        * Implementing {@link IConfigurator#Save}
        */
        public save(key: string, value: any): void;
        /**
        * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
        */
        public onConfigurationChanged(key: string, value: any): void;
    }
}
/**
* This module contains the pre-defined SKU configs
*/
declare module DataViz.SKUs {
    class Predefines {
        private static instance;
        static Instance : Predefines;
        /**
        * Get all the definitions of SKUs
        * @returns {DataViz.SKUs.SKUDefinition[]} SKU definitions
        */
        public getAll(): SKUDefinition[];
        private getGiantDefinition();
        private getCalloutDefinition();
        private getClassicDefinition();
    }
}
declare var ScriptsResources: any;
declare module DataViz.Resources {
    class UI {
        static backButtonTitle : string;
        static floatMenuDataTitle : string;
        static floatMenuSettingTitle : string;
        static editTitle : string;
    }
    class DataPane {
        static header : string;
        static selectButtonText : string;
        static editTitleLabel : string;
    }
    class SettingPane {
        static header : string;
        static typeTab : string;
        static typeTitles : string[];
        static themeTab : string;
        static themeTitles : string[];
        static shapeTab : string;
        static shapeTitles : string[];
    }
    class Notification {
        static dontShowAgain : string;
        static extendAppToShowMore : string;
    }
    class SampleDataGaint {
        static title : string;
        static row1 : string;
        static row2 : string;
        static row3 : string;
    }
    class SampleDataCallout {
        static title : string;
        static row1 : string;
        static row2 : string;
        static row3 : string;
    }
    class SampleDataClassic {
        static title : string;
        static row1 : string;
        static row2 : string;
        static row3 : string;
    }
    class Pluralization {
        static rows : string;
        static columns : string;
    }
    class BindingPane {
        static infoNormal : string;
        static infoMaxRow : string;
        static infoMaxColumn : string;
        static infoMaxRowAndColumn : string;
        static infoDataSetTooLarge : string;
        static infoFirstRowEmpty : string;
        static infoFirstColumnEmpty : string;
        static infoSelectData : string;
        static infoSelectTwoColumns : string;
        static infoSecondColumnContainNumber : string;
        static title : string;
        static subtitle : string;
        static buttonOKText : string;
        static buttonCancelText : string;
    }
}


declare module DataViz.UX {
    var infoColors: {
        red: string;
        green: string;
    };
    /**
    * This class is the Data Binding Dialog UI.
    */
    class BindingPane {
        private static bindingPaneStyle;
        private static sampleDataMaxRowNumber;
        private static defaultArgs;
        private selectionChangeHandler;
        private resizeHandler;
        private args;
        private bindingPaneElementsStyle;
        private selectedData;
        private bindingPaneDim;
        private bindingPane;
        private titleSpan;
        private subtitle;
        private sampleDataPane;
        private infoText;
        private buttonGroup;
        private buttonCancel;
        private buttonOk;
        private td;
        private zoomRatio;
        /**
        * Constructor
        */
        constructor();
        /**
        * Use new arguments to update the Data Binding UI and its event handlers.
        * @param {BindingPaneArgs} args The arguments used to update the binding pane
        */
        public updateBindingPane(args: BindingPaneArgs): BindingPane;
        public zoomBindingPane(): BindingPane;
        /**
        * Show the Data Binding UI.
        */
        public show(): void;
        /**
        * Hide the Data Binding UI.
        */
        public hide(): void;
        /**
        * Identify whether the string is numeric
        * @param {string} str The string need to be identified
        * @returns True if the string is numeric; false otherwise
        */
        public setInfoTextAndButton(text: string, textColor: string, buttonEnable: boolean): void;
        public bindingData : any;
        public handleDataSelection(): void;
        private updateArgs(args);
        private handleArgs();
        private setEventHandler(funcOK?, funcCancel?);
        private setSampleData(sampleData?);
        private resetPaneContentPosition();
        private handleStyleInHDPI(elementId, classNameArray);
    }
    interface BindingPaneArgs {
        sampleData?: any;
        handleDataSelection?: any;
        buttonOKCallback?: any;
        buttonCancelCallback?: any;
        title?: any;
        subtitle?: any;
        infoText?: any;
        buttonOKText?: any;
        buttonCancelText?: any;
    }
}


declare module DataViz.UX {
    class BindingPaneSpecific extends BindingPane {
        private static instance;
        /**
        * Get the singleton instance.
        */
        static getInstance(): BindingPaneSpecific;
        public handleDataSelection(): void;
        private isFirstColumnNonEmpty(value);
        private isSecondColumnHasNumber(value);
        private isFirstRowNonEmpty(value);
        private isDataValid(data);
        private getPluralString(combinedStr, count);
    }
}

/**
* This modules contains the implementation of the galleries
*/
declare module DataViz.UX.Shared {
    /**
    * This defines the basic styles of an thumbnail icon in the gallery
    */
    interface IconStyle {
        /**
        * The left margin
        */
        marginLeft: number;
        /**
        * The top margin
        */
        marginTop: number;
        /**
        * The width
        */
        width: number;
        /**
        * The height
        */
        height: number;
    }
    /**
    * The base class of all the gallery classes
    */
    class BaseGallery implements Config.IConfigurationChangeListener {
        public icons: Decoration.Customizable[];
        public currentIconId: string;
        private parentId;
        private reentryFlag;
        private iconStyle;
        private configurationKey;
        constructor(parentId: string, iconStyle: IconStyle, configurationKey: string);
        /**
        * Sets up the listeners
        */
        public setupListener(): void;
        /**
        * Populates the gallery
        */
        public populate(iconNames: string[], hostSelector): void;
        /**
        * Refreshes the list of the backed customizable items
        * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        */
        public refreshList(): void;
        /**
        * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
        */
        public onConfigurationChanged(key: string, value: any): void;
        private updatePaneBorder(iconId);
        private setIconClickListener(iconId, index);
        private iconClickAction(event, index);
        private apply(iconId);
    }
    /**
    * The theme gallery
    */
    class ThemeGallery extends BaseGallery {
        /**
        * Builds and returns a theme gallery instance
        * @returns {ThemeGallery} A theme gallery instance
        */
        static build(): ThemeGallery;
        constructor(parentId: string, iconStyle: IconStyle, configurationKey: string);
        /**
        * Overriding {@link BaseGallery#refreshList}
        */
        public refreshList(): void;
    }
    /**
    * The shape gallery
    */
    class ShapeGallery extends BaseGallery {
        /**
        * Builds and returns a shape gallery instance
        * @returns {ShapeGallery} A shape gallery instance
        */
        static build(): ShapeGallery;
        constructor(parentId: string, iconStyle: IconStyle, configurationKey: string);
        /**
        * Overriding {@link BaseGallery#refreshList}
        */
        public refreshList(): void;
    }
    /**
    * The chart type (SKU) gallery
    */
    class TypeGallery extends BaseGallery {
        /**
        * Builds and returns a chart type (SKU) gallery instance
        * @returns {TypeGallery} A chart type gallery instance
        */
        static build(): TypeGallery;
        constructor(parentId: string, iconStyle: IconStyle, configurationKey: string);
        /**
        * Overriding {@link BaseGallery#refreshList}
        */
        public refreshList(): void;
    }
}

declare module DataViz.UX {
    interface MenuButtonMap {
        buttonId: string;
        paneId: string;
    }
    class SettingPane {
        private static theInstance;
        private currentButtonId;
        private menuButtonMap;
        private buttonMap;
        private typeGallery;
        private themeGallery;
        private shapeGallery;
        constructor();
        public setupListeners(): void;
        static Instance : SettingPane;
        public show(): void;
        public hide(): void;
        public populate(options): void;
        private setMenuClickListener();
        private menuClickAction(event);
        private showInternalPane(paneId);
    }
}

declare module DataViz.UX {
    class DataPane implements Chart.ILayoutChangeListener {
        private static theInstance;
        private reentryFlag;
        private titleChanged;
        private timeoutId;
        constructor();
        static Instance : DataPane;
        public onLayoutChanged(layout: Chart.Layout): void;
        public onLayoutElementChanged(layoutElement: Chart.LayoutElement): void;
        public onLayoutElementInstanceChanged(layoutElement: Chart.LayoutElement, value: any): void;
        public setupListeners(): void;
        public show(isFocusOnTitle: boolean): void;
        public hide(): void;
        private init();
        private setText();
        private setEventHandlers();
    }
}

declare module DataViz.UX {
    class MainUX {
        constructor();
        public init(): void;
        public setupListeners(): void;
        private setText();
        private showFloatMenu();
        private hideFloatMenu();
    }
}

declare module DataViz.UX {
    /**
    * This class is the base class for notification and warning UI.
    */
    class BaseNotification {
        private static textInnerHeight;
        private messageText;
        private notificationButton;
        private closeButton;
        private notificationPanel;
        /**
        * Constructor
        */
        constructor();
        /**
        * Set a button for the panel. By default there exists no button on the panel.
        */
        public setButton(text: string, func?: any): BaseNotification;
        /**
        * Set the message for the panel.
        */
        public setText(text: string): BaseNotification;
        /**
        * Show the panel.
        */
        public show(): void;
        /**
        * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        * Button get method.
        */
        public Button : any;
        /**
        * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        * CloseButton get method.
        */
        public Close : any;
        /**
        * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        * Message text get method.
        */
        public Text : any;
        /**
        * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        * Panel get method.
        */
        public Panel : any;
        /**
        * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
        * Set the panel Height. Dynamically changed by resizing window.
        */
        public setHeight(): void;
        private setEventHandler(func);
        private resizePanel();
    }
}
/**
* This module contains the cookie implementation
*/
declare module DataViz.Cookie {
    /**
    * check if there already exists this cookie.
    */
    function checkCookie(cookieName: string): boolean;
    /**
    * set the cookie.
    */
    function setCookie(cookieName: string, cookieValue: string, effectiveTime?: number): void;
}
declare module DataViz.UX {
    /**
    * This class is the Notification UI class.
    */
    class Notification extends BaseNotification {
        private timeCounter;
        private timeDisplay;
        private timeDisapper;
        /**
        * Constructor
        */
        constructor();
        /**
        * Set the panel's display time.
        * @param {number} timeOut The time the display can last if you don't hover it.
        * @param {number} timeDisapper The time the display can last after you hover the panel.
        */
        public setDisplayTime(timeOut?: number, timeDisapper?: number): void;
        /**
        * Show the notification UI.
        */
        public show(): void;
        /**
        * Hide the notification panel.
        */
        public hide(): void;
        /**
        * This method is taken as a protected method.
        */
        public setDefaultConfiguration(): void;
    }
    /**
    * This class is the notification UI with a never show button on it. Such kind of class is always used.
    */
    class NotificationWithNeverShowBtn extends Notification {
        private dontShowAgainKey;
        private dontShowAgainValue;
        private static instance;
        /**
        * Get the single instance.
        */
        static getInstance(): NotificationWithNeverShowBtn;
        /**
        * Constructor.
        */
        constructor();
        /**
        * Set the key for cookie.
        */
        public setKey(dontShowAgainKey: string): NotificationWithNeverShowBtn;
        /**
        * Show the UI.
        */
        public show(): void;
        private setNeverShwoBtn();
    }
}


/**
* This is the main module containing the entry point of the app.
*/
declare module DataViz {
    /**
    * The main app instance
    */
    var mainApp: App;
    /**
    * This class represents the primary entry-point and workflow of the app
    */
    class App implements Config.IConfigurationChangeListener, Chart.IVisualizationListener {
        private static configurationKeys;
        private mainUX;
        private currentSKU;
        private configuration;
        private layoutInstance;
        private reentryFlag;
        private bindingPane;
        private timeoutId;
        public onConfigurationChangedCallback: (key: string, value: any) => void;
        constructor();
        /**
        * Gets the current SKU instance
        * @returns {DataViz.SKUs.SKUInstance} The current SKU instance
        */
        public CurrentSKU : SKUs.SKUInstance;
        /**
        * Gets the configuration instance
        * @returns {Config.Configuration} The configuration instance
        */
        public Configuration : Config.Configuration;
        /**
        * Gets the layout instance
        * @returns {DataViz.Chart.LayoutInstance} The layout instance
        */
        public LayoutInstance : Chart.LayoutInstance;
        /**
        * Initializes the app
        */
        public init(reason: string, callback: (sku: DataViz.SKUs.SKUInstance) => void): void;
        /**
        * Binds to the selected cells (by prompt)
        */
        public bindData(): void;
        public onConfigurationChanged(key: string, value: any): void;
        public onStartVisualizing(): void;
        public onEndVisualizing(): void;
        private tearDownCurrentSKU();
        private setupNewSKU();
    }
}
