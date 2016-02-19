/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    /**
    * This module contains the basic definitions, helpers for parameter validation
    */
    (function (Validate) {
        "use strict";

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
        var Validator = (function () {
            /**
            * @param {any} param The parameter to be validated
            */
            function Validator(param) {
                this.param = param;
                this.source = "";
            }
            /**
            * Builds a validator that will validate the given parameter
            * @param {any} param The parameter to be validated
            * @returns {Validator} A validator instance to do the actual validation
            */
            Validator.ensures = function (param) {
                return new Validator(param);
            };

            Validator.assertAndThrowIfNeeded = function (isValid, errorName, message) {
                if (isValid) {
                    return;
                }

                throw new Error(errorName + (message ? (": " + message) : ""));
            };

            /**
            * The information provided by caller
            * @param {string} source This parameter contains the information of the caller.
            * @returns {Validator} The validator instance used to do chain validation
            */
            Validator.prototype.from = function (source) {
                this.source = source;
                return this;
            };

            /**
            * Checks whether the parameter is not null nor undefined
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isNotNull = function () {
                Validator.assertAndThrowIfNeeded((this.param !== null) && (this.param !== undefined), Validator.parameterIsNullError, this.source);

                return this;
            };

            /**
            * Checks whether the parameter is of a certain type. Will also validate against non-null.
            * @param {string} typeName The name of the expected type of the parameter
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isOfType = function (typeName) {
                this.isNotNull();

                Validator.assertAndThrowIfNeeded((typeof (this.param) === typeName), Validator.invalidParameterTypeError, "Expecting a " + typeName + " but actually a " + typeof (this.param) + " source:" + this.source);

                return this;
            };

            /**
            * Checks whether the parameter is a number. Will also validate against non-null.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isNumber = function () {
                this.isNotNull();

                var sample = 0;
                return this.isOfType(typeof (sample));
            };

            /**
            * Checks whether the parameter is a string. Will also validate against non-null.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isString = function () {
                this.isNotNull();

                var sample = "";
                return this.isOfType(typeof (sample));
            };

            /**
            * Checks whether the parameter is a boolean. Will also validate against non-null.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isBool = function () {
                this.isNotNull();

                var sample = true;
                return this.isOfType(typeof (sample));
            };

            /**
            * Checks whether the parameter is a non-zero number. Will also validate against non-null and isNumber.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isNotZero = function () {
                this.isNotNull();
                this.isNumber();

                Validator.assertAndThrowIfNeeded((this.param !== 0), Validator.parameterIsZeroError, this.source);

                return this;
            };

            /**
            * Checks whether the parameter is a non-empty ("") string. Will also validate against non-null and isString.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isNotEmpty = function () {
                this.isNotNull();
                this.isString();

                Validator.assertAndThrowIfNeeded((this.param !== ""), Validator.parameterIsEmptyError, this.source);

                return this;
            };

            /**
            * Checks whether the parameter is true. Will also validate against non-null and isBool.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isTrue = function () {
                this.isNotNull();
                this.isBool();

                Validator.assertAndThrowIfNeeded(this.param === true, Validator.parameterIsNotTrueError, this.source);

                return this;
            };

            /**
            * Checks whether the parameter is a positive number. Will also validate against non-null and isNumber.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isPositive = function () {
                this.isNotNull();
                this.isNumber();

                Validator.assertAndThrowIfNeeded((this.param > 0), Validator.parameterIsNotPositiveError, this.source);

                return this;
            };

            /**
            * Checks whether the parameter is greater than or equal to the given value. Will also validate against non-null and isNumber.
            * @param {number} value The value compares to.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isGreaterThanOrEqualTo = function (value) {
                this.isNotNull();
                this.isNumber();

                Validator.assertAndThrowIfNeeded(this.param >= value, Validator.parameterRangeError, "Must be greater than or equal to " + value + ", actual is " + this.param + " source:" + this.source);

                return this;
            };

            /**
            * Checks whether the parameter is greater than the given value. Will also validate against non-null and isNumber.
            * @param {number} value The value compares to.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isGreaterThan = function (value) {
                this.isNotNull();
                this.isNumber();

                Validator.assertAndThrowIfNeeded(this.param > value, Validator.parameterRangeError, "Must be greater than " + value + ", actual is " + this.param + " source:" + this.source);

                return this;
            };

            /**
            * Checks whether the parameter is less than or equal to the given value. Will also validate against non-null and isNumber.
            * @param {number} value The value compares to.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isLessThanOrEqualTo = function (value) {
                this.isNotNull();
                this.isNumber();

                Validator.assertAndThrowIfNeeded(this.param <= value, Validator.parameterRangeError, "Must be less than or equal to " + value + ", actual is " + this.param + " source:" + this.source);

                return this;
            };

            /**
            * Checks whether the parameter is less than the given value. Will also validate against non-null and isNumber.
            * @param {number} value The value compares to.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isLessThan = function (value) {
                this.isNotNull();
                this.isNumber();

                Validator.assertAndThrowIfNeeded(this.param < value, Validator.parameterRangeError, "Must be less than " + value + ", actual is " + this.param + " source:" + this.source);

                return this;
            };

            /**
            * Checks whether the parameter is equal to the given value (including null or undefined).
            * @param {number} value The value compares to.
            * @returns {Validator} The validator instance used to do chain validation if this validation passes
            */
            Validator.prototype.isEqualTo = function (value) {
                Validator.assertAndThrowIfNeeded(this.param === value, Validator.parameterIsNotEqualToError, "Expecting: " + value + ", Actual: " + this.param + " source:" + this.source);

                return this;
            };
            Validator.invalidParameterTypeError = "Invalid parameter type";
            Validator.parameterIsNullError = "Parameter cannot be null";
            Validator.parameterIsZeroError = "Parameter cannot be zero";
            Validator.parameterIsEmptyError = "Parameter cannot be empty";
            Validator.parameterIsNotPositiveError = "Parameter must be positive";
            Validator.parameterIsNotTrueError = "Parameter must be true";
            Validator.parameterRangeError = "Parameter must be in the expected range";
            Validator.parameterIsNotEqualToError = "Parameter must be equal to the expected value";
            return Validator;
        })();
        Validate.Validator = Validator;
    })(DataViz.Validate || (DataViz.Validate = {}));
    var Validate = DataViz.Validate;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    ///<reference path="validate.ts"/>
    /**
    * This module contains the basic definitions implementations of the tools
    */
    (function (Tools) {
        "use strict";

        

        

        /**
        * A reusable implementation of the {@link IPausable}
        */
        var Pausable = (function () {
            function Pausable() {
                this.paused = false;
            }
            /**
            * Implementing {@link IPausable#Pause}
            */
            Pausable.prototype.pause = function () {
                this.paused = true;
            };

            /**
            * Implementing {@link IPausable#Resume}
            */
            Pausable.prototype.resume = function () {
                this.paused = false;
            };

            /**
            * Implementing {@link IPausable#IsPaused}
            */
            Pausable.prototype.isPaused = function () {
                return this.paused;
            };
            return Pausable;
        })();
        Tools.Pausable = Pausable;

        /**
        * A tool class factory helper
        */
        var ToolsFactory = (function () {
            function ToolsFactory() {
            }
            /**
            * Builds a particular tool with a given class name.
            * @param {string} className The fully qualified class name of the tool
            * @returns {any} The tool instance or null if fails to build
            */
            ToolsFactory.buildTool = function (className) {
                DataViz.Validate.Validator.ensures(className).from("ToolsFactory::buildTool").isNotNull().isNotEmpty();

                var existingTool = ToolsFactory.toolsPool[className];
                if (existingTool) {
                    return existingTool;
                }

                var toolClass = eval(className);
                if (!toolClass) {
                    return null;
                }

                var newTool = new toolClass;
                ToolsFactory.toolsPool[className] = newTool;
                return newTool;
            };
            ToolsFactory.toolsPool = {};
            return ToolsFactory;
        })();
        Tools.ToolsFactory = ToolsFactory;
    })(DataViz.Tools || (DataViz.Tools = {}));
    var Tools = DataViz.Tools;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    ///<reference path="validate.ts"/>
    /**
    * This module contains some helper functions
    */
    (function (Utils) {
        /**
        * Get zoom ratio for the app to adjust some element size inside it
        * @returns number The zoom ratio to adjust element size
        */
        function getZoomRatioForApp() {
            // No need to zoom in or zoom out as the app size will not change on WAC not matter what's the devicePixelRatio.
            if (DataViz.Utils.isOnWac()) {
                return 1;
            } else {
                return getDeviceZoomRatio();
            }
        }
        Utils.getZoomRatioForApp = getZoomRatioForApp;

        /**
        * Get device zoom ratio
        * @returns number The zoom ratio of device
        */
        function getDeviceZoomRatio() {
            // For IE10, IE11, Firefox
            if (window.screen.deviceXDPI && window.screen.logicalXDPI) {
                return window.screen.deviceXDPI / window.screen.logicalXDPI;
            } else if (window.devicePixelRatio) {
                return window.devicePixelRatio;
            } else {
                return 1;
            }
        }
        Utils.getDeviceZoomRatio = getDeviceZoomRatio;

        /**
        * Determines whether the application is running on a WAC environment.
        */
        function isOnWac() {
            return window["OSF"].DDA.ExcelWebAppDocument !== undefined;
        }
        Utils.isOnWac = isOnWac;

        /**
        * A module to handle events according to differnt browers.
        */
        (function (BrowserHelper) {
            var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > 0;

            /**
            * Determines whether the browser is IE.
            * @returns True if the browser is IE, false otherwise.
            */
            function isIE() {
                return navigator.userAgent.toLowerCase().indexOf("trident") > 0;
            }
            BrowserHelper.isIE = isIE;

            /**
            * Determines whether the browser is IE9.
            * @returns True if the browser is IE9, false otherwise.
            */
            function isIE9() {
                var userAgent = navigator.userAgent.toLowerCase();
                return userAgent.indexOf("trident/5.0") > 0 || userAgent.indexOf("msie 9.0") > 0;
            }
            BrowserHelper.isIE9 = isIE9;

            /**
            * Get a svg element's width
            * @param {SVGSVGElement} node A svg node we need to get its width
            * @returns {number} The svg element's width
            */
            function getSvgElementWidth(node) {
                if (isFirefox) {
                    return node.getBBox().width;
                } else {
                    return node.clientWidth;
                }
            }
            BrowserHelper.getSvgElementWidth = getSvgElementWidth;

            /**
            * Get a svg element's height
            * @param {SVGSVGElement} node A svg node we need to get its height
            * @returns {number} The svg element's height
            */
            function getSvgElementHeight(node) {
                if (isFirefox) {
                    return node.getBBox().height;
                } else {
                    return node.clientHeight;
                }
            }
            BrowserHelper.getSvgElementHeight = getSvgElementHeight;
        })(Utils.BrowserHelper || (Utils.BrowserHelper = {}));
        var BrowserHelper = Utils.BrowserHelper;

        /**
        * Removes a particular item from an array. If there are multiple matches in the array, all will be removed.
        * @param {any[]} array The array to remove the item from
        * @param {any} item The item to remove
        * @returns True if succeeded; false otherwise (no such item)
        */
        function removeItemFromArray(array, item) {
            DataViz.Validate.Validator.ensures(array).from("Utils.removeItemFromArray [array]").isNotNull();
            DataViz.Validate.Validator.ensures(item).from("Utils.removeItemFromArray [item]").isNotNull();

            var index;
            var removed = false;
            while ((index = array.indexOf(item)) !== -1) {
                array.splice(index, 1);
                removed = true;
            }

            return removed;
        }
        Utils.removeItemFromArray = removeItemFromArray;

        /**
        * Formats a number into a string with thousand separators. For example, 1234567 will becom 1,234,567; 1234567.12345 will become 1,234,567.12345
        * Only support non-negative float numbers.
        * @param {string} value The value to format
        * @returns {string} The formatted string, or the original string if it's not a non-negative float number
        */
        function formatNumberWithThousandSeparators(value) {
            DataViz.Validate.Validator.ensures(value).from("Utils.formatNumberWithThousandSeparators").isNotNull();

            // If it's not a non-negative float number, then don't add comma separator
            if (/^[0-9]+(\.[0-9]+)?$/.test(value)) {
                var decimalPointPosition = value.indexOf(".") >= 0 ? value.indexOf(".") : value.length;
                var result = value.substr(decimalPointPosition);
                var startPos = value.indexOf("-") + 1;
                var index = decimalPointPosition;

                while (index - 3 > startPos) {
                    result = "," + value.substr(index - 3, 3) + result;
                    index -= 3;
                }

                return value.substr(0, index) + result;
            } else {
                return value;
            }
        }
        Utils.formatNumberWithThousandSeparators = formatNumberWithThousandSeparators;

        /**
        * Make the buttons of a certain pane tapped in circle
        * @param {string} paneId The target getting focused pane's id
        * @param {string} firstTabId The first getting focused element's id
        * @param {string} lastTabId The last getting focused element's id
        */
        function setTabFocus(paneId, firstTabId, lastTabId) {
            $("#" + paneId).off("keydown");
            $("#" + paneId).on("keydown", function (event) {
                if (event.keyCode && event.keyCode === 9) {
                    var firstButton = $("#" + firstTabId)[0];
                    var lastButton = $("#" + lastTabId)[0];
                    if (firstButton && lastButton) {
                        if (event.target === lastButton && !event.shiftKey) {
                            event.preventDefault();
                            firstButton.focus();
                        } else if (event.target === firstButton && event.shiftKey) {
                            event.preventDefault();
                            lastButton.focus();
                        }
                    }
                }
            });
        }
        Utils.setTabFocus = setTabFocus;

        /**
        * Replace all the specific sub-strings which contain a number and curly brace like "{1}" with meaningful strings.
        * @param {any[]} ...parameters The parameter[0] is the origin string and others are the replacing strings.
        * @returns {string} The replaced string.
        */
        function stringFormat() {
            var parameters = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                parameters[_i] = arguments[_i + 0];
            }
            var args = arguments;
            var source = args[0];
            return source.replace(/{(\d+)}/gm, function (match, number) {
                var index = parseInt(number, 10) + 1;
                return index >= args.length ? match : (args[index] === null || typeof (args[index]) == 'undefined' ? '' : args[index]);
            });
        }
        Utils.stringFormat = stringFormat;
        ;
    })(DataViz.Utils || (DataViz.Utils = {}));
    var Utils = DataViz.Utils;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    ///<reference path="utils.ts"/>
    ///<reference path="tool.ts"/>
    ///<reference path="validate.ts"/>
    /**
    * This modules contains basic definitions, interfaces and base classes related to configurations
    */
    (function (Config) {
        /**
        * The well known configuration keys used in this app
        */
        Config.wellKnownKeys = {
            theme: "theme",
            shape: "shape",
            layout: "layout",
            sku: "sku"
        };

        

        

        /**
        * A configuration contains a set of key/value pairs (which normally represents user settings, etc.)
        */
        var Configuration = (function () {
            /**
            * @param {string[]} keys The keys of supported values in this configuration
            * @param {IConfigurator} configurator The configurator that can be actually used to load/save the configuration from/to host document
            */
            function Configuration(keys, configurator) {
                DataViz.Validate.Validator.ensures(keys).from("Configuration::ctor [keys]").isNotNull();
                DataViz.Validate.Validator.ensures(configurator).from("Configuration::ctor [configurator]").isNotNull();

                this.keys = keys;
                this.configurator = configurator;
                this.settings = [];
                this.changeListeners = [];
                this.registerListener(this.configurator);
            }
            /**
            * Resets the configuration
            */
            Configuration.prototype.reset = function () {
                this.changeListeners.length = 0;
                this.settings.length = 0;
            };

            /**
            * Registers a configuration change listener. This method can be called for multiple times to register multiple listeners.
            * @param {IConfigurationChangeListener} listener A configuration change listener to be registered.
            */
            Configuration.prototype.registerListener = function (listener) {
                DataViz.Validate.Validator.ensures(listener).from("Configuration::registerListener").isNotNull();
                if (this.changeListeners.indexOf(listener) === -1) {
                    this.changeListeners.push(listener);
                }
            };

            /**
            * Unregisters a configuration change listener.
            * @param {@link IConfigurationChangeListener} listener: A configuration change listener to be unregistered.
            */
            Configuration.prototype.unregisterListener = function (listener) {
                DataViz.Validate.Validator.ensures(listener).from("Configuration::unregisterListener").isNotNull();
                DataViz.Utils.removeItemFromArray(this.changeListeners, listener);
            };

            /**
            * Loads all the configurations
            */
            Configuration.prototype.loadAll = function () {
                this.configurator.loadAll(this);
            };

            /**
            * Clears all the configuration values
            */
            Configuration.prototype.clear = function () {
                this.settings.length = 0;
            };

            Object.defineProperty(Configuration.prototype, "Keys", {
                /**
                * Get a list of the keys of the supported configuration values
                * @returns {string[]} The keys of the supported configuration values
                */
                get: function () {
                    return this.keys;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Gets a configuration value with the specified key
            * @param {string} key The key of the configuration value to get
            * @returns {any} The configuration value retrieved
            */
            Configuration.prototype.get = function (key) {
                DataViz.Validate.Validator.ensures(key).from("Configuration::get").isNotNull();
                return this.settings[key];
            };

            /**
            * Sets a configuration value with the specified key
            * @param {string} key The key of the configuration value to set
            * @param {any} value The configuration value to set
            */
            Configuration.prototype.set = function (key, value) {
                DataViz.Validate.Validator.ensures(key).from("Configuration::set [key]").isNotNull();
                DataViz.Validate.Validator.ensures(value).from("Configuration::set [key]=" + key + " [value]").isNotNull();

                if (this.settings[key] === value) {
                    // Same value, prevent re-updating
                    return;
                }

                this.settings[key] = value;

                this.changeListeners.forEach(function (listener, index, array) {
                    listener.onConfigurationChanged(key, value);
                });
            };
            return Configuration;
        })();
        Config.Configuration = Configuration;
    })(DataViz.Config || (DataViz.Config = {}));
    var Config = DataViz.Config;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    ///<reference path="tool.ts"/>
    ///<reference path="config.ts"/>
    /**
    * This module contains the basic definitions, constants, and base-classes of data related tasks
    */
    (function (Data) {
        "use strict";

        /**
        * The binding name used by the app
        */
        Data.DefaultBindingName = "dataVizBinding";

        /**
        * The raw data format we get from Excel APIs
        */
        var RawData = (function () {
            function RawData() {
            }
            return RawData;
        })();
        Data.RawData = RawData;

        

        

        
    })(DataViz.Data || (DataViz.Data = {}));
    var Data = DataViz.Data;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="config.ts"/>
///<reference path="validate.ts"/>

var DataViz;
(function (DataViz) {
    /**
    * This module contains the basic definitions, constants and base-classes of layout related tasks
    */
    (function (Chart) {
        "use strict";

        /**
        * This represents a single HTML attribute name/value pair in the layout HTML element
        */
        var Attribute = (function () {
            function Attribute() {
            }
            return Attribute;
        })();
        Chart.Attribute = Attribute;

        /**
        * This  represents a single CSS style item in the layout HTML element
        */
        var Style = (function () {
            function Style() {
            }
            return Style;
        })();
        Chart.Style = Style;

        /**
        * This represents a single HTML element in the layout definition
        */
        var LayoutElement = (function () {
            function LayoutElement() {
            }
            return LayoutElement;
        })();
        Chart.LayoutElement = LayoutElement;

        /**
        * This represents the layout definition, which contains a set of element definitions
        */
        var Layout = (function () {
            function Layout() {
            }
            return Layout;
        })();
        Chart.Layout = Layout;

        

        /**
        * A layout element instance contains a particular layout element definition and its value. Normally it represents a concrete HTML element on the canvas
        */
        var LayoutElementInstance = (function () {
            /**
            * @param {LayoutElement} layoutElement The layout element
            * @param {any} value The value of this instance
            */
            function LayoutElementInstance(layoutElement, value) {
                DataViz.Validate.Validator.ensures(layoutElement).from("LayoutElementInstance::ctor [layoutElement]").isNotNull();
                DataViz.Validate.Validator.ensures(value).from("LayoutElementInstance::ctor [value]").isNotNull();

                this.layoutElement = layoutElement;
                this.value = value;
            }
            return LayoutElementInstance;
        })();
        Chart.LayoutElementInstance = LayoutElementInstance;

        /**
        * A layout instance contains a set of layout element instances. It represents all the definitions of the HTML elements and the values for a concrete layout on the canvas
        */
        var LayoutInstance = (function () {
            /**
            * @param {Layout} layout The layout definitino
            * @param {Config.IConfigurator} configurator The configurator used to load element instance values from host document
            */
            function LayoutInstance(layout, configurator) {
                DataViz.Validate.Validator.ensures(layout).from("LayoutInstance::ctor [layout]").isNotNull();
                DataViz.Validate.Validator.ensures(configurator).from("LayoutInstance::ctor [configurator]").isNotNull();

                this.layout = layout;
                this.changeListeners = [];
                this.reentryFlag = false;

                var keys = layout.elements.map(function (val, index, array) {
                    return LayoutInstance.Prefix + val.id;
                });
                this.storage = new DataViz.Config.Configuration(keys, configurator);
                this.storage.registerListener(this);
            }
            /**
            * Resets the layout instance
            */
            LayoutInstance.prototype.reset = function () {
                this.changeListeners.length = 0;
            };

            /**
            * Loads all the element instance values from the configuration
            */
            LayoutInstance.prototype.loadAll = function () {
                this.storage.loadAll();
            };

            /**
            * Registers a layout chnage listener. This method can be called for multiple times to register multiple listeners.
            * @param {ILayoutChangeListener} listener A layout change listener to be registered.
            */
            LayoutInstance.prototype.registerListener = function (listener) {
                DataViz.Validate.Validator.ensures(listener).from("LayoutInstance::registerListener").isNotNull();

                if (this.changeListeners.indexOf(listener) === -1) {
                    this.changeListeners.push(listener);
                }
            };

            /**
            * Unregisters a layout change listener.
            * @param {@link ILayoutChangeListener} listener: A layout change listener to be unregistered.
            */
            LayoutInstance.prototype.unregisterListener = function (listener) {
                DataViz.Validate.Validator.ensures(listener).from("LayoutInstance::unregisterListener").isNotNull();

                DataViz.Utils.removeItemFromArray(this.changeListeners, listener);
            };

            /**
            * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
            */
            LayoutInstance.prototype.onConfigurationChanged = function (key, value) {
                DataViz.Validate.Validator.ensures(key).from("LayoutInstance::onConfigurationChanged [key]").isNotNull().isNotEmpty();
                DataViz.Validate.Validator.ensures(value).from("LayoutInstance::onConfigurationChanged [key]=" + key + " [value]").isNotNull();

                if (key.indexOf(LayoutInstance.Prefix) === -1) {
                    return;
                }

                if (this.reentryFlag) {
                    return;
                }

                this.reentryFlag = true;

                var id = key.substring(LayoutInstance.Prefix.length);
                this.notifyChange(id, value);

                this.reentryFlag = false;
            };

            /**
            * Sets the value of a layout element with the specified id
            * @param {string} layoutElementId The id of the layout element
            * @param {any} value The value to set into the layout element
            */
            LayoutInstance.prototype.setValue = function (layoutElementId, value) {
                DataViz.Validate.Validator.ensures(layoutElementId).from("LayoutInstance::setValue [layoutElementId]").isNotNull().isNotEmpty();
                DataViz.Validate.Validator.ensures(value).from("LayoutInstance::setValue [layoutElementId]=" + layoutElementId + " [value]").isNotNull();

                this.storage.set(LayoutInstance.Prefix + layoutElementId, value);
            };

            /**
            * Gets the value of a layout element with the specified id
            * @param {string} layoutElementId The id of the layout element
            * @returns {any} The value of the layout element instance
            */
            LayoutInstance.prototype.getValue = function (layoutElementId) {
                DataViz.Validate.Validator.ensures(layoutElementId).from("LayoutInstance::getValue").isNotNull().isNotEmpty();

                return this.storage.get(LayoutInstance.Prefix + layoutElementId);
            };

            LayoutInstance.prototype.notifyChange = function (layoutElementId, value) {
                var matchedElement = this.layout.elements.filter(function (element, index, array) {
                    return element.id === layoutElementId;
                });

                if (matchedElement.length <= 0) {
                    return;
                }

                this.changeListeners.forEach(function (listener, index, array) {
                    listener.onLayoutElementInstanceChanged(matchedElement[0], value);
                });
            };
            LayoutInstance.Prefix = "layout-element-";
            return LayoutInstance;
        })();
        Chart.LayoutInstance = LayoutInstance;

        /**
        * The layout provider that takes care of the following tasks
        *  - Loads the pre-defined layouts into memory
        *  - Returns all the loaded layouts
        *  - Tracks (via listening to configuration changes) and returns the currently selected layout
        */
        var LayoutProvider = (function () {
            function LayoutProvider() {
                this.currentLayoutId = "";
            }
            Object.defineProperty(LayoutProvider, "Instance", {
                get: function () {
                    if (!LayoutProvider.theInstance) {
                        LayoutProvider.theInstance = new LayoutProvider;
                    }

                    return LayoutProvider.theInstance;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Loads all the pre-defined layouts. This has to be called before calling any other methods of this class.
            * @param {() => any} callback The callback function that will be called after the loading is finished
            */
            LayoutProvider.prototype.loadAll = function (callback) {
                DataViz.Validate.Validator.ensures(callback).from("LayoutInstance::loadAll").isNotNull();

                if (this.layouts) {
                    callback();
                    return;
                }

                var thisProvider = this;
                $.ajax({
                    type: "get",
                    url: "../PeopleAssets/Layouts/Layouts.json?ver=" + LayoutProvider.version,
                    data: null,
                    success: function (data) {
                        thisProvider.layouts = data;
                    },                   
                    complete: function (jqXHR, textStatus) {
                        callback();
                    },
                    dataType: "json"
                });
            };

            Object.defineProperty(LayoutProvider.prototype, "Layouts", {
                /**
                * Gets all the loaded layouts.
                * @returns {Layout[]} All the loaded layouts
                */
                get: function () {
                    DataViz.Validate.Validator.ensures(this.layouts).from("LayoutInstance::Layouts").isNotNull();

                    return this.layouts;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LayoutProvider.prototype, "Default", {
                /**
                * Returns the default layout
                * @returns {Layout} The default layout (normally the first layout in the list)
                */
                get: function () {
                    return this.Layouts[0];
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LayoutProvider.prototype, "CurrentLayoutId", {
                /**
                * Returns the id of current layout
                * @returns {string} The id of current layout
                */
                get: function () {
                    return this.currentLayoutId;
                },
                /**
                * Sets the current layout id
                * @param {string} id The layout id
                */
                set: function (id) {
                    DataViz.Validate.Validator.ensures(id).from("LayoutInstance::CurrentLayoutId").isNotNull().isNotEmpty();
                    this.currentLayoutId = id;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LayoutProvider.prototype, "CurrentLayout", {
                /**
                * Returns the current layout
                * @returns {Layout} The current layout (if at least one is selected) or the default layout (if none is selected)
                */
                get: function () {
                    return this.getLayoutById(this.CurrentLayoutId);
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
            */
            LayoutProvider.prototype.onConfigurationChanged = function (key, value) {
                DataViz.Validate.Validator.ensures(key).from("LayoutInstance::onConfigurationChanged [key]").isNotNull().isNotEmpty();
                DataViz.Validate.Validator.ensures(value).from("LayoutInstance::onConfigurationChanged [key]=" + key + " [value]").isNotNull();

                if (key === DataViz.Config.wellKnownKeys.layout) {
                    this.currentLayoutId = value;
                }
            };

            LayoutProvider.prototype.getLayoutById = function (id) {
                var match = this.Layouts.filter(function (value, index, array) {
                    return (value.id === id);
                });

                return (match.length > 0) ? match[0] : this.Default;
            };
            LayoutProvider.theInstance = null;
            LayoutProvider.version = 3;
            return LayoutProvider;
        })();
        Chart.LayoutProvider = LayoutProvider;
    })(DataViz.Chart || (DataViz.Chart = {}));
    var Chart = DataViz.Chart;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataViz;
(function (DataViz) {
    ///<reference path="config.ts"/>
    ///<reference path="validate.ts"/>
    /**
    * This module contains the basic definitions, constants and base-classes of customizable decorations related tasks
    */
    (function (Decoration) {
        "use strict";

        /**
        * The base class of a single definition in the customizable decoration
        */
        var Customizable = (function () {
            function Customizable() {
            }
            return Customizable;
        })();
        Decoration.Customizable = Customizable;

        /**
        * This class represents a single theme definition
        */
        var Theme = (function (_super) {
            __extends(Theme, _super);
            function Theme() {
                _super.apply(this, arguments);
            }
            return Theme;
        })(Customizable);
        Decoration.Theme = Theme;

        /**
        * This class represents a single shape definition
        */
        var Shape = (function (_super) {
            __extends(Shape, _super);
            function Shape() {
                _super.apply(this, arguments);
            }
            return Shape;
        })(Customizable);
        Decoration.Shape = Shape;

        /**
        * The theme provider that takes care of the following tasks
        *  - Loads the pre-defined themes into memory
        *  - Returns all the loaded themes
        *  - Returns the themes for a particular SKU
        *  - Tracks (via listening to configuration changes) and returns the currently selected theme
        */
        var ThemeProvider = (function () {
            function ThemeProvider() {
                this.definitions = null;
                this.currentThemeId = "";
            }
            Object.defineProperty(ThemeProvider, "Instance", {
                get: function () {
                    if (!ThemeProvider.theInstance) {
                        ThemeProvider.theInstance = new ThemeProvider;
                    }

                    return ThemeProvider.theInstance;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Loads all the pre-defined themes. This has to be called before calling any other methods of this class.
            * @param {() => any} callback The callback function that will be called after the loading is finished
            */
            ThemeProvider.prototype.loadAll = function (callback) {
                DataViz.Validate.Validator.ensures(callback).from("ThemeProvider::loadAll").isNotNull();

                if (this.definitions) {
                    callback();
                    return;
                }

                // TODO: Consider split and delay loading
                var thisProvider = this;
                $.ajax({
                    type: "get",
                    url: "../PeopleAssets/Themes/themes.json?ver=" + ThemeProvider.version,
                    data: null,
                    success: function (data) {
                        thisProvider.definitions = data;
                    },
                    complete: function (jqXHR, textStatus) {
                        callback();
                    },
                    dataType: "json"
                });
            };

            Object.defineProperty(ThemeProvider.prototype, "Themes", {
                /**
                * Gets all the loaded themes.
                * @returns {Theme[]} All the loaded themes
                */
                get: function () {
                    DataViz.Validate.Validator.ensures(this.definitions).from("ThemeProvider::Themes").isNotNull();

                    return this.definitions;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Enumerates all the themes for a particular SKU
            * @param {string} skuId The id of SKU
            * @returns {Theme[]} All the themes for a particular SKU, including all the SKU-neutral themes
            */
            ThemeProvider.prototype.enumerateForSku = function (skuId) {
                DataViz.Validate.Validator.ensures(skuId).from("ThemeProvider::enumerateForSku").isNotNull().isNotEmpty();

                return this.Themes.filter(function (theme, index, array) {
                    return (theme.sku === skuId) || (theme.sku === "") || (!theme.sku);
                });
            };

            Object.defineProperty(ThemeProvider.prototype, "Default", {
                /**
                * Returns the default theme
                * @returns {Theme} The default theme (normally the first theme in the list)
                */
                get: function () {
                    return this.Themes[0];
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ThemeProvider.prototype, "CurrentThemeId", {
                /**
                * Returns the id of current theme
                * @returns {string} The id of current theme
                */
                get: function () {
                    return this.currentThemeId;
                },
                /**
                * Sets the current theme id
                * @param {string} id The theme id
                */
                set: function (id) {
                    DataViz.Validate.Validator.ensures(id).from("ThemeProvider::CurrentThemeId").isNotNull().isNotEmpty();
                    this.currentThemeId = id;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ThemeProvider.prototype, "CurrentTheme", {
                /**
                * Returns the current theme
                * @returns {Theme} The current theme (if at least one is selected) or the default theme (if none is selected)
                */
                get: function () {
                    var theme = this.getThemeById(this.currentThemeId);
                    return theme ? theme : this.Default;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ThemeProvider.prototype, "CurrentThemeCssUrl", {
                /**
                * Returns the CSS URL for the current theme
                * @returns {string} The CSS URL for the current theme
                */
                get: function () {
                    return this.CurrentTheme.css + "?ver=" + ThemeProvider.version;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Gets the theme with the given id
            * @param {string} id The id the theme to get
            * @returns {Theme} The theme with the given id or null if not found
            */
            ThemeProvider.prototype.getThemeById = function (id) {
                var match = this.Themes.filter(function (value, index, array) {
                    return (value.id === id);
                });

                return (match.length > 0) ? match[0] : null;
            };

            /**
            * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
            */
            ThemeProvider.prototype.onConfigurationChanged = function (key, value) {
                DataViz.Validate.Validator.ensures(key).from("ThemeProvider::onConfigurationChanged [key]").isNotNull().isNotEmpty();
                DataViz.Validate.Validator.ensures(value).from("ThemeProvider::onConfigurationChanged [key]=" + key + " [value]").isNotNull();

                if (key === DataViz.Config.wellKnownKeys.theme) {
                    this.currentThemeId = value;
                }
            };
            ThemeProvider.theInstance = null;
            ThemeProvider.version = 2;
            return ThemeProvider;
        })();
        Decoration.ThemeProvider = ThemeProvider;

        /**
        * The shape provider that takes care of the following tasks
        *  - Loads the pre-defined shapes into memory
        *  - Returns all the loaded shapes
        *  - Returns the shapes for a particular SKU
        *  - Tracks (via listening to configuration changes) and returns the currently selected shape
        */
        var ShapeProvider = (function () {
            function ShapeProvider() {
                this.definitions = null;
                this.currentShapeId = "";
            }
            Object.defineProperty(ShapeProvider, "Instance", {
                get: function () {
                    if (!ShapeProvider.theInstance) {
                        ShapeProvider.theInstance = new ShapeProvider;
                    }

                    return ShapeProvider.theInstance;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Loads all the pre-defined shapes. This has to be called before calling any other methods of this class.
            * @param {() => any} callback The callback function that will be called after the loading is finished
            */
            ShapeProvider.prototype.loadAll = function (callback) {
                DataViz.Validate.Validator.ensures(callback).from("ShapeProvider::loadAll").isNotNull();

                if (this.definitions) {
                    callback();
                    return;
                }

                // TODO: Consider split and delay loading
                var thisProvider = this;
                $.ajax({
                    type: "get",
                    url: "../PeopleAssets/Shapes/shapes.json?ver=" + ShapeProvider.version,
                    data: null,
                    success: function (data) {
                        thisProvider.definitions = data;
                    },
                    complete: function (jqXHR, textStatus) {
                        callback();
                    },
                    dataType: "json"
                });
            };

            Object.defineProperty(ShapeProvider.prototype, "Shapes", {
                /**
                * Gets all the loaded shapes.
                * @returns {Shape[]} All the loaded shapes
                */
                get: function () {
                    DataViz.Validate.Validator.ensures(this.definitions).from("ShapeProvider::Shapes").isNotNull();

                    return this.definitions;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Enumerates all the shapes for a particular SKU
            * @param {string} skuId The id of SKU
            * @returns {Shape[]} All the shapes for a particular SKU, including all the SKU-neutral shapes
            */
            ShapeProvider.prototype.enumerateForSku = function (skuId) {
                DataViz.Validate.Validator.ensures(skuId).from("ShapeProvider::enumerateForSku").isNotNull().isNotEmpty();

                return this.Shapes.filter(function (shape, index, array) {
                    return (shape.sku === skuId) || (shape.sku === "") || (!shape.sku);
                });
            };

            Object.defineProperty(ShapeProvider.prototype, "Default", {
                /**
                * Returns the default shape
                * @returns {Shape} The default shape (normally the first shape in the list)
                */
                get: function () {
                    return this.Shapes[0];
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ShapeProvider.prototype, "CurrentShapeId", {
                /**
                * Returns the id of current shape
                * @returns {string} The id of current shape
                */
                get: function () {
                    return this.currentShapeId;
                },
                /**
                * Sets the current shape id
                * @param {string} id The shape id
                */
                set: function (id) {
                    DataViz.Validate.Validator.ensures(id).from("ShapeProvider::CurrentShapeId").isNotNull().isNotEmpty();
                    this.currentShapeId = id;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ShapeProvider.prototype, "CurrentShape", {
                /**
                * Returns the current shape
                * @returns {Shape} The current shape (if at least one is selected) or the default shape (if none is selected)
                */
                get: function () {
                    var shape = this.getShapeById(this.currentShapeId);
                    return shape ? shape : this.Default;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Gets the shape with the given id
            * @param {string} id The id the shape to get
            * @returns {Shape} The shape with the given id or null if not found
            */
            ShapeProvider.prototype.getShapeById = function (id) {
                var match = this.Shapes.filter(function (value, index, array) {
                    return (value.id === id);
                });

                return (match.length > 0) ? match[0] : null;
            };

            /**
            * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
            */
            ShapeProvider.prototype.onConfigurationChanged = function (key, value) {
                DataViz.Validate.Validator.ensures(key).from("ShapeProvider::onConfigurationChanged [key]").isNotNull().isNotEmpty();
                DataViz.Validate.Validator.ensures(value).from("ShapeProvider::onConfigurationChanged [key]=" + key + " [value]").isNotNull();

                if (key === DataViz.Config.wellKnownKeys.shape) {
                    this.currentShapeId = value;
                }
            };
            ShapeProvider.theInstance = null;
            ShapeProvider.version = 1;
            return ShapeProvider;
        })();
        Decoration.ShapeProvider = ShapeProvider;
    })(DataViz.Decoration || (DataViz.Decoration = {}));
    var Decoration = DataViz.Decoration;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="tool.ts"/>
///<reference path="chart.ts"/>
///<reference path="data.ts"/>
///<reference path="config.ts"/>
///<reference path="controller.ts"/>
///<reference path="decoration.ts"/>
///<reference path="tool.ts"/>
///<reference path="validate.ts"/>

var DataViz;
(function (DataViz) {
    /**
    * This module contains the basic definitions, constants and base-classes of SKU related tasks
    */
    (function (SKUs) {
        "use strict";

        /**
        * The SKU definition
        */
        var SKUDefinition = (function (_super) {
            __extends(SKUDefinition, _super);
            function SKUDefinition() {
                _super.apply(this, arguments);
            }
            return SKUDefinition;
        })(DataViz.Decoration.Customizable);
        SKUs.SKUDefinition = SKUDefinition;

        /**
        * This represents an SKU instance, with all tools instantiated
        */
        var SKUInstance = (function () {
            function SKUInstance() {
            }
            /**
            * Creates an SKU instance from the SKU definition
            * @param {SKUDefinition} definition The SKU definition
            * @returns {SKUInstance} An SKU instance created or null if the creation fails
            */
            SKUInstance.fromDefinition = function (definition) {
                DataViz.Validate.Validator.ensures(definition).from("SKUInstance::fromDefinition").isNotNull();

                var instance = new SKUInstance;

                instance.id = definition.id;
                instance.themeId = definition.defaultTheme;
                instance.shapeId = definition.defaultShape;
                instance.layoutId = definition.defaultLayout;
                instance.sampleData = definition.sampleData;

                instance.plotter = DataViz.Tools.ToolsFactory.buildTool(definition.plotter);
                instance.layouter = DataViz.Tools.ToolsFactory.buildTool(definition.layouter);
                instance.dataBinder = DataViz.Tools.ToolsFactory.buildTool(definition.dataBinder);
                instance.dataConvertor = DataViz.Tools.ToolsFactory.buildTool(definition.dataConvertor);
                instance.configurator = DataViz.Tools.ToolsFactory.buildTool(definition.configurator);

                if ((!instance.plotter) || (!instance.layouter) || (!instance.dataBinder) || (!instance.dataConvertor) || (!instance.configurator)) {
                    return null;
                }

                instance.visualizer = new DataViz.Chart.Visualizer(instance.layouter, instance.plotter);
                instance.controller = new DataViz.Control.Controller(instance.visualizer, instance.dataBinder, instance.dataConvertor);

                return instance;
            };

            Object.defineProperty(SKUInstance.prototype, "Id", {
                /**
                * Gets the id of the SKU
                * @returns {string} the id of the SKU
                */
                get: function () {
                    return this.id;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "Plotter", {
                /**
                * Gets the plotter used in this SKU
                * @returns {DataViz.Chart.IPlotter} The plotter instance
                */
                get: function () {
                    return this.plotter;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "Layouter", {
                /**
                * Gets the layouter used in this SKU
                * @returns {DataViz.Chart.ILayouter} The layouter instance
                */
                get: function () {
                    return this.layouter;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "DataBinder", {
                /**
                * Gets the data binder used in this SKU
                * @returns {DataViz.Data.IDataBinder} The data binder instance
                */
                get: function () {
                    return this.dataBinder;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "DataConvertor", {
                /**
                * Gets the data convertor used in this SKU
                * @returns {DataViz.Data.IDataConvertor} The data convertor instance
                */
                get: function () {
                    return this.dataConvertor;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "Configurator", {
                /**
                * The configurator used in the SKU
                * @returns {DataViz.Config.IConfigurator} The configurator instance
                */
                get: function () {
                    return this.configurator;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "Visualizer", {
                /**
                * Gets the visualizer in the SKU
                * @returns {DataViz.Chart.Visualizer} The visualizer instance
                */
                get: function () {
                    return this.visualizer;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "Controller", {
                /**
                * Gets the controller in the SKU
                * @returns {DataViz.Control.Controller} The controller instance
                */
                get: function () {
                    return this.controller;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "ThemeId", {
                /**
                * Gets the id of the default them of the SKU
                * @returns {string} The id of the default theme
                */
                get: function () {
                    return this.themeId;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "ShapeId", {
                /**
                * Gets the id of the default shape of the SKU
                * @returns {string} The id of the default shape
                */
                get: function () {
                    return this.shapeId;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "LayoutId", {
                /**
                * Gets the id of the default layout of the SKU
                * @returns {string} The id of the default layout
                */
                get: function () {
                    return this.layoutId;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUInstance.prototype, "SampleData", {
                /**
                * Gets the sample data of the SKU
                * @returns {any} The sample data
                */
                get: function () {
                    return this.sampleData;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Resets the SKU (basically resets all the tools in the SKU)
            */
            SKUInstance.prototype.reset = function () {
                this.plotter.resetTool();
                this.layouter.resetTool();
                this.dataBinder.resetTool();
                this.dataConvertor.resetTool();
                this.visualizer.resetTool();
            };
            return SKUInstance;
        })();
        SKUs.SKUInstance = SKUInstance;

        /**
        * The SKU provider that takes care of the following tasks
        *  - Loads the pre-defined SKUs into memory
        *  - Returns all the loaded SKUs
        *  - Tracks (via listening to configuration changes) and returns the currently selected SKU
        */
        var SKUProvider = (function () {
            function SKUProvider() {
                this.currentSKUId = "peoplebar-giant";
            }
            Object.defineProperty(SKUProvider, "Instance", {
                get: function () {
                    if (!SKUProvider.theInstance) {
                        SKUProvider.theInstance = new SKUProvider;
                    }

                    return SKUProvider.theInstance;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Loads all the pre-defined SKUs. This has to be called before calling any other methods of this class.
            * @param {(succeeded: bool) => any} callback The callback function that will be called after the loading is finished
            */
            SKUProvider.prototype.loadAll = function (preDefines, callback) {
                DataViz.Validate.Validator.ensures(callback).from("SKUProvider::loadAll").isNotNull();

                if (!this.definitions) {
                    this.definitions = preDefines;
                }

                callback();
            };

            Object.defineProperty(SKUProvider.prototype, "SKUs", {
                /**
                * Gets (lazy loading) all the loaded SKUs.
                * @returns {SKUDefinition[]} All the loaded SKUs
                */
                get: function () {
                    DataViz.Validate.Validator.ensures(this.definitions).from("SKUProvider::SKUs").isNotNull();

                    return this.definitions;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUProvider.prototype, "Default", {
                /**
                * Returns the default SKU
                * @returns {SKUDefinition} The default SKU (normally the first SKU in the list)
                */
                get: function () {
                    return this.SKUs[0];
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUProvider.prototype, "CurrentSKUId", {
                /**
                * Returns the id of current SKU
                * @returns {string} The id of current SKU
                */
                get: function () {
                    return this.currentSKUId;
                },
                /**
                * Sets the current SKU id
                * @param {string} id The SKU id
                */
                set: function (id) {
                    DataViz.Validate.Validator.ensures(id).from("SKUProvider::CurrentSKUId").isNotNull().isNotEmpty();
                    this.currentSKUId = id;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SKUProvider.prototype, "CurrentSKU", {
                /**
                * Returns the current SKU
                * @returns {SKUDefinition} The current SKU (if at least one is selected) or the default SKU (if none is selected)
                */
                get: function () {
                    return this.getSKUById(this.currentSKUId);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SKUProvider.prototype, "CurrentSKUInstance", {
                /**
                * Returns the current SKU instance
                * @returns {SKUInstance} The current SKU instance (if at least one is selected) or null (if none is selected)
                */
                get: function () {
                    var definition = this.CurrentSKU;
                    return definition ? SKUInstance.fromDefinition(definition) : null;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
            */
            SKUProvider.prototype.onConfigurationChanged = function (key, value) {
                DataViz.Validate.Validator.ensures(key).from("SKUProvider::onConfigurationChanged [key]").isNotNull().isNotEmpty();
                DataViz.Validate.Validator.ensures(value).from("SKUProvider::onConfigurationChanged [key]=" + key + " [value]").isNotNull();

                if (key === DataViz.Config.wellKnownKeys.sku) {
                    this.currentSKUId = value;
                }
            };

            SKUProvider.prototype.getSKUById = function (id) {
                var match = this.SKUs.filter(function (sku, index, array) {
                    return (sku.id === id);
                });

                return (match.length > 0) ? match[0] : this.Default;
            };
            SKUProvider.theInstance = null;
            SKUProvider.version = 2;
            return SKUProvider;
        })();
        SKUs.SKUProvider = SKUProvider;
    })(DataViz.SKUs || (DataViz.SKUs = {}));
    var SKUs = DataViz.SKUs;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    ///<reference path="data.ts"/>
    ///<reference path="tool.ts"/>
    ///<reference path="config.ts"/>
    ///<reference path="layout.ts"/>
    ///<reference path="skus.ts"/>
    ///<reference path="validate.ts"/>
    /**
    * This module contains the basic definitions, constants and base-classes related to rendering
    */
    (function (Chart) {
        "use strict";

        /**
        * The ID of the root-most SVG element of the canvas
        */
        Chart.defaultSVGRootId = "#canvas-root";

        /**
        * The ID of the root SVG element of the main chart (chart excluding stuffs like title, backdrop, separator and other decorations)
        */
        Chart.defaultChartRootId = "#chart-root";
       
        Chart.isWindowBand = true;

        

        

        /**
        * A class that takes care of the visualization.
        */
        var Visualizer = (function () {
            /**
            * @param {@link ILayouter} layouter The layouter instance that will do the actual layout actions
            * @param {@link IPlotter} plotter The plotter instance that will do the actual plotting operations
            */
            function Visualizer(layouter, plotter) {
                DataViz.Validate.Validator.ensures(layouter).from("Visualizer::ctor [layouter]").isNotNull();
                DataViz.Validate.Validator.ensures(plotter).from("Visualizer::ctor [plotter]").isNotNull();

                this.layouter = layouter;
                this.plotter = plotter;
                this.visualizationListeners = [];
                this.resetTool();
            }
            /**
            * Visualizes the data to the chart
            @param {any} data The data to be visualized
            */
            Visualizer.prototype.visualize = function (data) {
                this.cachedData = data;

                if (!data) {
                    this.resetTool();
                }

                this.revisualize();
            };

            /**
            * Registers a visualization listener. This method can be called for multiple times to register multiple listeners.
            * @param {IVisualizationListener} listener A visualization listener to be registered.
            */
            Visualizer.prototype.registerListener = function (listener) {
                DataViz.Validate.Validator.ensures(listener).from("Visualizer::registerListener").isNotNull();
                if (this.visualizationListeners.indexOf(listener) === -1) {
                    this.visualizationListeners.push(listener);
                }
            };

            /**
            * Unregisters a visualization listener.
            * @param {@link IVisualizationListener} listener: A visualization listener to be unregistered.
            */
            Visualizer.prototype.unregisterListener = function (listener) {
                DataViz.Validate.Validator.ensures(listener).from("Visualizer::unregisterListener").isNotNull();
                DataViz.Utils.removeItemFromArray(this.visualizationListeners, listener);
            };

            /**
            * Implementing {@link ITool#resetTool}
            */
            Visualizer.prototype.resetTool = function () {
                this.plotter.resetTool();
                this.layouter.resetTool();
                this.cachedData = null;
                this.visualizationRequestPending = false;
                this.visualizationListeners.length = 0;
            };

            Visualizer.prototype.revisualize = function () {
                var _this = this;
                this.visualizationRequestPending = true;

                var thisVisualizer = this;
                var delay = 100;
                setTimeout(function () {
                    // Repeatedly (< 100ms) invoked visualization requests will be merged into the last request to avoid waste of duplicate computing and rendering
                    if (!thisVisualizer.visualizationRequestPending) {
                        return;
                    }

                    _this.visualizationRequestPending = false;

                    if (thisVisualizer.cachedData) {
                        _this.visualizationListeners.forEach(function (listener, index, array) {
                            listener.onStartVisualizing();
                        });

                        thisVisualizer.layouter.layout(thisVisualizer.cachedData);
                        thisVisualizer.plotter.plot(thisVisualizer.cachedData);

                        _this.visualizationListeners.forEach(function (listener, index, array) {
                            listener.onEndVisualizing();
                        });
                    }
                }, delay);
            };
            return Visualizer;
        })();
        Chart.Visualizer = Visualizer;
    })(DataViz.Chart || (DataViz.Chart = {}));
    var Chart = DataViz.Chart;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    ///<reference path="data.ts"/>
    ///<reference path="chart.ts"/>
    ///<reference path="config.ts"/>
    ///<reference path="validate.ts"/>
    /**
    * This module contains the controller implementation
    */
    (function (Control) {
        "use strict";

        /**
        * The controller behaves like a bridge or a middle man connecting several other components.
        * In general, it listens to certain events from some components and triggers certain operations of other components
        */
        var Controller = (function () {
            /**
            * @param {Visualizer} visualizer The visualizer that will be used to do visualization
            * @param {IDataBinder} dataBinder The data binder that will be used to do data binding
            * @param {IDataConvertor} visualizer The data convertor that will be used to convert raw data
            */
            function Controller(visualizer, dataBinder, dataConvertor) {
                DataViz.Validate.Validator.ensures(visualizer).from("Controller::ctor [visualizer]").isNotNull();
                DataViz.Validate.Validator.ensures(dataBinder).from("Controller::ctor [dataBinder]").isNotNull();
                DataViz.Validate.Validator.ensures(dataConvertor).from("Controller::ctor [dataConvertor]").isNotNull();

                this.visualizer = visualizer;
                this.dataBinder = dataBinder;
                this.dataConvertor = dataConvertor;
                this.cachedData = null;
                this.isRevisualizeOnThemeChange = false;
                this.dataBinder.registerDataChangeListener(this);
            }
            /**
            * Binds data by prompt (delegate to the data binder)
            * @param {(result: any) => any} [callback] The callback that will be called after the data binding is done. Optional.
            */
            Controller.prototype.bindDataByPrompt = function (callback) {
                this.dataBinder.bindByPrompt(callback);
            };

            /**
            * Binds data by selection (delegate to the data binder)
            * @param {(result: any) => any} [callback] The callback that will be called after the data binding is done. Optional.
            */
            Controller.prototype.bindDataBySelection = function (callback) {
                this.dataBinder.bindBySelection(callback);
            };

            /**
            * Rebinds data directly using the default bind name (delegate to the data binder)
            * @param {() => any} [callback] The callback that will be called after the data binding is done. Optional.
            */
            Controller.prototype.rebindData = function (callback) {
                this.dataBinder.rebind(callback);
            };

            /**
            * Tries to bind the currently selected data (delegate to the data binder)
            * @param {(result: any) => any} [callback] The callback that will be called after the data binding is done. Optional.
            */
            Controller.prototype.tryBindSelection = function (callback) {
                var _this = this;
                this.dataBinder.getSelectedData(function (rawData) {
                    var data = _this.dataConvertor.convert(rawData);
                    if (data) {
                        _this.dataBinder.bindBySelection(callback);
                    } else {
                        if (callback) {
                            callback(null);
                        }
                    }
                });
            };

            /**
            * Visualizes the given data (delegate to the visualizer)
            * @param {any} rawData The raw data to be visualized
            */
            Controller.prototype.visualizeData = function (rawData) {
                this.cachedData = rawData;
                this.revisualize();
            };

            /**
            * Revisualizes the cached data (if any)
            */
            Controller.prototype.revisualize = function () {
                if (this.cachedData) {
                    this.visualizer.visualize(this.dataConvertor.convert(this.cachedData));
                }
            };

            /**
            * Whether revisualize on theme change
            * @param {boolean} isRevisualize set to true if revisualize on theme change
            */
            Controller.prototype.revisualizeOnThemeChange = function (isRevisualize) {
                this.isRevisualizeOnThemeChange = isRevisualize;
            };

            /**
            * Implementing {@link IDataChangeListener#onDataChanged}
            */
            Controller.prototype.onDataChanged = function (rawData) {
                this.visualizeData(rawData);
            };

            /**
            * Implementing {@link IDataChangeListener#onDataBindingTargetChanged}
            */
            Controller.prototype.onDataBindingTargetChanged = function () {
                this.dataConvertor.resetTool();
            };

            /**
            * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
            */
            Controller.prototype.onConfigurationChanged = function (key, value) {
                var _this = this;
                DataViz.Validate.Validator.ensures(key).from("Controller::onConfigurationChanged [key]").isNotNull().isNotEmpty();
                DataViz.Validate.Validator.ensures(value).from("Controller::onConfigurationChanged [key]=" + key + " [value]").isNotNull();

                switch (key) {
                    case DataViz.Config.wellKnownKeys.theme:
                         {
                            var stylesheetLink = $("link#chart-theme");
                            stylesheetLink.attr("href", DataViz.Decoration.ThemeProvider.Instance.CurrentThemeCssUrl);

                            if (this.isRevisualizeOnThemeChange) {
                                stylesheetLink.off("load");
                                $("link#chart-theme").on("load", function () {
                                    _this.revisualize();
                                });
                            }
                        }
                        break;

                    case DataViz.Config.wellKnownKeys.shape:
                         {
                            this.revisualize();
                        }
                        break;
                }
            };
            return Controller;
        })();
        Control.Controller = Controller;
    })(DataViz.Control || (DataViz.Control = {}));
    var Control = DataViz.Control;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    (function (Data) {
        ///<reference path="shared/data.ts"/>
        ///<reference path="shared/config.ts"/>
        ///<reference path="shared/validate.ts"/>
        /**
        * This module contains the implementation of the People Bar specific data covnertor
        */
        (function (PeopleBar) {
            "use strict";

            /**
            * This is the data used by the People Bar plotter
            */
            var KeyValueData = (function () {
                /**
                * @param {DataViz.Data.RawData} data The raw data
                * @param {number} [keyColumnIndex = 0] The index of the column used as keys
                * @param {number} [valueColumnIndex = 0] The index of the column used as values
                * @param {boolean} [hasHeader = false] Indicating whether the data has header
                */
                function KeyValueData(rawData, keyColumnIndex, valueColumnIndex, hasHeader) {
                    if (typeof keyColumnIndex === "undefined") { keyColumnIndex = 0; }
                    if (typeof valueColumnIndex === "undefined") { valueColumnIndex = 1; }
                    if (typeof hasHeader === "undefined") { hasHeader = false; }
                    DataViz.Validate.Validator.ensures(rawData).from("KeyValueData::ctor [rawData]").isNotNull();
                    DataViz.Validate.Validator.ensures(keyColumnIndex).from("KeyValueData::ctor [keyColumnIndex]").isGreaterThanOrEqualTo(0).isLessThan(rawData.unformatted[0].length);
                    DataViz.Validate.Validator.ensures(valueColumnIndex).from("KeyValueData::ctor [valueColumnIndex]").isGreaterThanOrEqualTo(0).isLessThan(rawData.unformatted[0].length);

                    this.rawData = rawData;
                    this.keyColumnIndex = keyColumnIndex;
                    this.valueColumnIndex = valueColumnIndex;
                    this.hasHeader = hasHeader;
                    this.threshold = this.rawData.unformatted.length;
                }
                /**
                * Instantiates a {@link KeyValueData} instance from the raw data
                * @param {DataViz.Data.RawData} data The raw data
                * @param {number} [keyColumnIndex = 0] The index of the column used as keys
                * @param {number} [valueColumnIndex = 0] The index of the column used as values
                * @param {boolean} [hasHeader = false] Indicating whether the data has header
                * @returns {KeyValueData} The converted data
                */
                KeyValueData.from = function (data, keyColumnIndex, valueColumnIndex, hasHeader) {
                    if (typeof keyColumnIndex === "undefined") { keyColumnIndex = 0; }
                    if (typeof valueColumnIndex === "undefined") { valueColumnIndex = 1; }
                    if (typeof hasHeader === "undefined") { hasHeader = false; }
                    return KeyValueData.isValidKeyValueData(data.unformatted, keyColumnIndex, valueColumnIndex, hasHeader) ? new KeyValueData(data, keyColumnIndex, valueColumnIndex, hasHeader) : null;
                };

                /**
                * Determines whether the give raw data is in valid form for People Bar
                * @param {string[][]} data The raw data
                * @param {number} [keyColumnIndex = 0] The index of the column used as keys
                * @param {number} [valueColumnIndex = 0] The index of the column used as values
                * @param {boolean} [hasHeader = false] Indicating whether the data has header
                * @returns {boolean} True if the data is valid; false otherwise
                */
                KeyValueData.isValidKeyValueData = function (data, keyColumnIndex, valueColumnIndex, hasHeader) {
                    if (typeof keyColumnIndex === "undefined") { keyColumnIndex = 0; }
                    if (typeof valueColumnIndex === "undefined") { valueColumnIndex = 1; }
                    if (typeof hasHeader === "undefined") { hasHeader = false; }
                    var dataNotALLEmpty = false;
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < data[i].length; j++) {
                            if (data[i][j] != "") {
                                dataNotALLEmpty = true;
                                break;
                            }
                        }
                    }

                    return (data) && (data.length >= (hasHeader ? 2 : 1)) && (data[0].length > Math.max(keyColumnIndex, valueColumnIndex)) && (dataNotALLEmpty);
                };


                Object.defineProperty(KeyValueData.prototype, "KeyColumnIndex", {
                    /**
                    * Gets the index of the column used as keys
                    * @returns {number} The key column index
                    */
                    get: function () {
                        return this.keyColumnIndex;
                    },
                    /**
                    * Sets the index of the column used as keys
                    * @param {number} index The key column index
                    */
                    set: function (index) {
                        DataViz.Validate.Validator.ensures(index).from("KeyValueData::KeyColumnIndex").isGreaterThanOrEqualTo(0).isLessThan(this.rawData.unformatted[0].length);

                        this.keyColumnIndex = index;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(KeyValueData.prototype, "ValueColumnIndex", {
                    /**
                    * Gets the index of the column used as values
                    * @returns {number} The value column index
                    */
                    get: function () {
                        return this.valueColumnIndex;
                    },
                    /**
                    * Sets the index of the column used as values
                    * @param {number} index The value column index
                    */
                    set: function (index) {
                        DataViz.Validate.Validator.ensures(index).from("KeyValueData::ValueColumnIndex").isGreaterThanOrEqualTo(0).isLessThan(this.rawData.unformatted[0].length);

                        this.valueColumnIndex = index;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(KeyValueData.prototype, "HasHeader", {
                    /**
                    * Gets the flag indicating whether the data has a header
                    * @returns {boolean} True if it has header; false otherwise
                    */
                    get: function () {
                        return this.hasHeader;
                    },
                    /**
                    * Sets the flag indicating whether the data has a header
                    * @param {boolean} hasHeader True if it has header; false otherwise
                    */
                    set: function (hasHeader) {
                        this.hasHeader = hasHeader;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(KeyValueData.prototype, "Headers", {
                    /**
                    * Gets the headers of all columns
                    * @returns {string[]} The headers of all columns
                    */
                    get: function () {
                        return this.rawData.formatted[0];
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(KeyValueData.prototype, "Keys", {
                    /**
                    * Gets all the keys
                    * @returns {string[]} All the keys
                    */
                    get: function () {
                        var keys = [];
                        for (var i = this.startRow; i < this.endRow; i++) {
                            keys.push(String(this.rawData.formatted[i][this.keyColumnIndex]));
                        }

                        return keys;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(KeyValueData.prototype, "FormattedValueSeries", {
                    /**
                    * Gets all the formatted values
                    * @returns {string[]} All the formatted value series
                    */
                    get: function () {
                        var series = [];
                        for (var i = this.startRow; i < this.endRow; i++) {
                            series.push(String(this.rawData.formatted[i][this.valueColumnIndex]));
                        }

                        return series;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(KeyValueData.prototype, "NormalizedValueSeries", {
                    /**
                    * Gets the normalized value series. Normalized means all values are non negative numbers
                    * @returns {number[]} The normalized value series
                    */
                    get: function () {
                        var series = [];
                        for (var i = this.startRow; i < this.endRow; i++) {
                            var value = Math.max(0, parseFloat(this.rawData.unformatted[i][this.valueColumnIndex]));
                            series.push(isNaN(value) ? 0 : value);
                        }

                        return series;
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Sets the threshold of the data
                * @param {number} threshold The threshold of the data
                */
                KeyValueData.prototype.setThreshold = function (threshold) {
                    DataViz.Validate.Validator.ensures(threshold).from("KeyValueData::setThreshold").isGreaterThanOrEqualTo(1);

                    this.threshold = threshold;
                };

                /**
                * Resets  the threshold of the data
                */
                KeyValueData.prototype.resetThreshold = function () {
                    this.threshold = this.rawData.unformatted.length;
                };

                /**
                * Gets a copy of the data with a threshold. Anything beyond the threshold will be discarded from the returned copy
                * @returns {KeyValueData} The data copy with eveything below the threshold
                */
                KeyValueData.prototype.withThreshold = function (threshold) {
                    DataViz.Validate.Validator.ensures(threshold).from("KeyValueData::withThreshold").isGreaterThanOrEqualTo(1);

                    var result = new KeyValueData(this.rawData, this.keyColumnIndex, this.valueColumnIndex, this.hasHeader);
                    result.setThreshold(threshold);

                    return result;
                };

                Object.defineProperty(KeyValueData.prototype, "startRow", {
                    get: function () {
                        return this.hasHeader ? 1 : 0;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(KeyValueData.prototype, "endRow", {
                    get: function () {
                        return Math.min(this.hasHeader ? (this.threshold + 1) : this.threshold, this.rawData.unformatted.length);
                    },
                    enumerable: true,
                    configurable: true
                });
                return KeyValueData;
            })();
            PeopleBar.KeyValueData = KeyValueData;

            /**
            * This is a People Bar specific data convertor implementation
            */
            var KeyValueDataConvertor = (function () {
                /**
                * @param {string[][]} data The raw data
                * @param {number} [keyColumnIndex = 0] The index of the column used as keys
                * @param {number} [valueColumnIndex = 0] The index of the column used as values
                */
                function KeyValueDataConvertor(keyColumnIndex, valueColumnIndex) {
                    if (typeof keyColumnIndex === "undefined") { keyColumnIndex = 0; }
                    if (typeof valueColumnIndex === "undefined") { valueColumnIndex = 1; }
                    this.keyColumnIndex = keyColumnIndex;
                    this.valueColumnIndex = valueColumnIndex;
                }
                /**
                * Implementing {@link ITool#resetTool}
                */
                KeyValueDataConvertor.prototype.resetTool = function () {
                    this.keyColumnIndex = 0;
                    this.valueColumnIndex = 1;
                };

                Object.defineProperty(KeyValueDataConvertor.prototype, "KeyColumnIndex", {
                    /**
                    * Gets the index of the column used as keys
                    * @returns {number} The key column index
                    */
                    get: function () {
                        return this.keyColumnIndex;
                    },
                    /**
                    * Sets the index of the column used as keys
                    * @param {number} index The key column index
                    */
                    set: function (index) {
                        this.keyColumnIndex = index;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(KeyValueDataConvertor.prototype, "ValueColumnIndex", {
                    /**
                    * Gets the index of the column used as values
                    * @returns {number} The value column index
                    */
                    get: function () {
                        return this.valueColumnIndex;
                    },
                    /**
                    * Sets the index of the column used as values
                    * @param {number} index The value column index
                    */
                    set: function (index) {
                        this.valueColumnIndex = index;
                    },
                    enumerable: true,
                    configurable: true
                });


                /**
                * Implementing {@link IDataConvertor#Convert}
                */
                KeyValueDataConvertor.prototype.convert = function (data) {
                    DataViz.Validate.Validator.ensures(data).from("KeyValueDataConvertor::convert [data]").isNotNull();
                    DataViz.Validate.Validator.ensures(data.unformatted).from("KeyValueDataConvertor::convert [data.unformatted]").isNotNull();
                    DataViz.Validate.Validator.ensures(data.unformatted[0]).from("KeyValueDataConvertor::convert [data.unformatted[0]]").isNotNull();
                    var hasHeader = isNaN(parseFloat(data.unformatted[0][1])) ? true : false;

                    return KeyValueData.from(data, this.keyColumnIndex, this.valueColumnIndex, hasHeader);
                };

                /**
                * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
                */
                KeyValueDataConvertor.prototype.onConfigurationChanged = function (key, value) {
                    // Do nothing.
                };
                return KeyValueDataConvertor;
            })();
            PeopleBar.KeyValueDataConvertor = KeyValueDataConvertor;
        })(Data.PeopleBar || (Data.PeopleBar = {}));
        var PeopleBar = Data.PeopleBar;
    })(DataViz.Data || (DataViz.Data = {}));
    var Data = DataViz.Data;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/chart.ts"/>
///<reference path="shared/decoration.ts"/>
///<reference path="data.convertor.peoplebar.ts"/>

var DataViz;
(function (DataViz) {
    (function (Chart) {
        /**
        * This modules contains the implementations of the base class for People Bar plotters
        */
        (function (D3) {
            "use strict";

            /**
            * This is a helper class to calculate the optimal plotter parameters. Here "optimal" means the best/ideal plotter parameters to render the data onto the chart
            */
            var OptimalPlotterParameter = (function () {
                function OptimalPlotterParameter(basePlotterVariables) {
                    this.basePlotterVariables = basePlotterVariables;
                }
                Object.defineProperty(OptimalPlotterParameter.prototype, "ShapeWidth", {
                    /**
                    * Gets the optimal shape width
                    * @returns {number} The optimal shape width
                    */
                    get: function () {
                        return this.shapeWidth;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(OptimalPlotterParameter.prototype, "ShapeHeight", {
                    /**
                    * Gets the optimal shape height
                    * @returns {number} The optimal shape height
                    */
                    get: function () {
                        return this.shapeHeight;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(OptimalPlotterParameter.prototype, "BandHeight", {
                    /**
                    * Gets the optimal band height. "Band" means the bar-like elements group (shape icons + text label + number label, etc.) representing a single value of the selected data.
                    * @returns {number} The optimal band height
                    */
                    get: function () {
                        return this.bandHeight;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(OptimalPlotterParameter.prototype, "BandCount", {
                    /**
                    * Gets the optimal count of bands that can be rendered in the visible canvas
                    * @returns {number} The optimal band count
                    */
                    get: function () {
                        return this.bandCount;
                    },
                    enumerable: true,
                    configurable: true
                });

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
                OptimalPlotterParameter.prototype.optimize = function (maxValue, bandWidth, boardHeight, originalShapeWidth, originalShapeHeight, preferredShapeHeight, minimalShapeHeight, bandHeightCalculatingFunction, totalHeightCalculatingFunction, bandCountCalculatingFunction) {
                    var preferredShapeWidth = originalShapeWidth * preferredShapeHeight / originalShapeHeight;
                    var minimalShapeWidth = originalShapeWidth * minimalShapeHeight / originalShapeHeight;
                    var maximalShapeWidth = (maxValue > 0) ? Math.max(minimalShapeWidth, Math.floor(bandWidth / maxValue)) : minimalShapeWidth;
                    maximalShapeWidth = Math.min(maximalShapeWidth, preferredShapeWidth * 1.3);

                    var canFitInAllWithPreferredSize = this.canAllDataFitInOneCanvasWithGivenIconSize(maxValue, bandWidth, boardHeight, preferredShapeWidth, preferredShapeHeight, bandHeightCalculatingFunction, totalHeightCalculatingFunction);

                    var canFitInAllWithMinimalSize = this.canAllDataFitInOneCanvasWithGivenIconSize(maxValue, bandWidth, boardHeight, minimalShapeWidth, minimalShapeHeight, bandHeightCalculatingFunction, totalHeightCalculatingFunction);

                    var optimalShapeWidth = maximalShapeWidth;
                    var optimalShapeHeight = originalShapeHeight * optimalShapeWidth / originalShapeWidth;
                    var start = minimalShapeWidth;
                    var end = maximalShapeWidth;

                    if (canFitInAllWithPreferredSize) {
                        optimalShapeWidth = preferredShapeWidth;
                        optimalShapeHeight = preferredShapeHeight;
                    } else if (!canFitInAllWithMinimalSize) {
                        optimalShapeWidth = minimalShapeWidth;
                        optimalShapeHeight = minimalShapeHeight;
                    } else {
                        var shapesPerRowInBand = Math.max(1, Math.floor(bandWidth / (preferredShapeWidth + this.basePlotterVariables.cxShapeGap)));
                        var rowsPerBand = (maxValue > 0) ? Math.ceil(maxValue / shapesPerRowInBand) : 1;
                        if (rowsPerBand === 1) {
                            optimalShapeWidth = minimalShapeWidth;
                            optimalShapeHeight = minimalShapeHeight;
                        } else {
                            var lastFitInAllShapeWidth = optimalShapeWidth;
                            var lastFitInAllShapeHeight = optimalShapeHeight;
                            var canFitInAllAtLeastOnce = false;

                            while (optimalShapeWidth > start) {
                                if (this.canAllDataFitInOneCanvasWithGivenIconSize(maxValue, bandWidth, boardHeight, optimalShapeWidth, optimalShapeHeight, bandHeightCalculatingFunction, totalHeightCalculatingFunction)) {
                                    canFitInAllAtLeastOnce = true;
                                    lastFitInAllShapeWidth = optimalShapeWidth;
                                    lastFitInAllShapeHeight = optimalShapeHeight;

                                    if (optimalShapeWidth >= end) {
                                        break;
                                    } else {
                                        var temp = optimalShapeWidth;
                                        optimalShapeWidth = Math.ceil((optimalShapeWidth + end) / 2);
                                        start = temp;
                                    }
                                } else {
                                    var temp = optimalShapeWidth;
                                    optimalShapeWidth = Math.floor((optimalShapeWidth + start) / 2);
                                    end = temp;
                                }

                                optimalShapeHeight = originalShapeHeight * optimalShapeWidth / originalShapeWidth;
                            }
                        }
                    }

                    this.shapeWidth = optimalShapeWidth;
                    this.shapeHeight = optimalShapeHeight;
                    var theShapesPerRowInBand = Math.max(1, Math.floor(bandWidth / (optimalShapeWidth + this.basePlotterVariables.cxShapeGap)));
                    this.bandHeight = bandHeightCalculatingFunction(this.shapeHeight);
                    this.bandCount = bandCountCalculatingFunction(this.bandHeight);
                };

                OptimalPlotterParameter.prototype.canAllDataFitInOneCanvasWithGivenIconSize = function (maxValue, bandWidth, boardHeight, shapeWidth, shapeHeight, bandHeightCalculatingFunction, totalHeightCalculatingFunction) {
                    var shapesPerRowInBand = Math.max(1, Math.floor(bandWidth / (shapeWidth + this.basePlotterVariables.cxShapeGap)));
                    var rowsPerBand = (maxValue > 0) ? Math.ceil(maxValue / shapesPerRowInBand) : 1;

                    if (rowsPerBand > 1) {
                        return false;
                    }

                    var bandHeight = bandHeightCalculatingFunction(shapeHeight);
                    var totalHeight = totalHeightCalculatingFunction(bandHeight);
                    return totalHeight <= boardHeight;
                };
                return OptimalPlotterParameter;
            })();
            D3.OptimalPlotterParameter = OptimalPlotterParameter;

            /**
            * This class contains some plotter variables that are may change due to factors like canvas size, shape size, etc.
            */
            var PeopleBarPlottertVolatileVariables = (function () {
                function PeopleBarPlottertVolatileVariables(basePlotterVariables) {
                    this.basePlotterVariables = basePlotterVariables;
                }
                Object.defineProperty(PeopleBarPlottertVolatileVariables.prototype, "BoardWidth", {
                    /**
                    * Gets the board width
                    * @returns {number} The board width
                    */
                    get: function () {
                        return this.boardWidth;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(PeopleBarPlottertVolatileVariables.prototype, "BoardHeight", {
                    /**
                    * Gets the board height
                    * @returns {number} The board height
                    */
                    get: function () {
                        return this.boardHeight;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(PeopleBarPlottertVolatileVariables.prototype, "BandWidth", {
                    /**
                    * Gets the band width, which is the width of the band (board width excluding label widths etc., if any)
                    * @returns {number} The band width
                    */
                    get: function () {
                        return this.bandWidth;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(PeopleBarPlottertVolatileVariables.prototype, "MaximalShapesPerBand", {
                    /**
                    * Gets the maximal count of shapes per band
                    * @returns {number} The maximal count of shapes per band
                    */
                    get: function () {
                        return this.maximalShapesPerBand;
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Refreshes the variables given external factors
                * @param {SVGRect} svgViewport The viewport information of the chart root SVG
                * @param {KeyValueData} data The data to be plotted
                * @param {(data: Data.PeopleBar.KeyValueData, boardWidth: number) => number} bandWidthCalculatingCallback The function to calculate band width
                */
                PeopleBarPlottertVolatileVariables.prototype.refresh = function (svgElement, data, bandWidthCalculatingCallback) {
                    this.boardHeight = svgElement.height.animVal.value - this.basePlotterVariables.cyChartMargin * 2;
                    this.boardWidth = svgElement.width.animVal.value - this.basePlotterVariables.cxChartMargin * 2;
                    this.bandWidth = bandWidthCalculatingCallback(data, this.boardWidth);

                    var shape = DataViz.Decoration.ShapeProvider.Instance.CurrentShape;
                    var minimalShapeWidth = shape.width * this.basePlotterVariables.minimalShapeHeight / shape.height;
                    var maximalShapesPerBandRow = Math.max(1, Math.floor(this.bandWidth / (minimalShapeWidth + this.basePlotterVariables.cxShapeGap)));
                    var maximalBoardWidth = maximalShapesPerBandRow * (minimalShapeWidth + this.basePlotterVariables.cxShapeGap);
                    this.maximalShapesPerBand = maximalShapesPerBandRow;
                };
                return PeopleBarPlottertVolatileVariables;
            })();
            D3.PeopleBarPlottertVolatileVariables = PeopleBarPlottertVolatileVariables;

            /**
            * This is the base class of all other People Bar plotters
            */
            var PeopleBarBasePlotter = (function (_super) {
                __extends(PeopleBarBasePlotter, _super);
                function PeopleBarBasePlotter() {
                    _super.call(this);
                    this.timeoutId = null;
                    var fixedBasePlotterVariables = {
                        minimalShapeHeight: 24,
                        preferredShapeHeight: 42,
                        cxLabelGap: 20,
                        cyLabelGap: 2,
                        cxShapeGap: 2,
                        cyShapeGap: 2,
                        cyBandGap: 30,
                        cxChartMargin: 10,
                        cyChartMargin: 15,
                        minimalShapeFraction: 0.2
                    };

                    this.zoomRatio = DataViz.Utils.getZoomRatioForApp();

                    this.basePlotterVariables = {
                        minimalShapeHeight: fixedBasePlotterVariables.minimalShapeHeight / this.zoomRatio,
                        preferredShapeHeight: fixedBasePlotterVariables.preferredShapeHeight / this.zoomRatio,
                        cxLabelGap: fixedBasePlotterVariables.cxLabelGap / this.zoomRatio,
                        cyLabelGap: fixedBasePlotterVariables.cyLabelGap / this.zoomRatio,
                        cxShapeGap: fixedBasePlotterVariables.cxShapeGap / this.zoomRatio,
                        cyShapeGap: fixedBasePlotterVariables.cyShapeGap / this.zoomRatio,
                        cyBandGap: fixedBasePlotterVariables.cyBandGap / this.zoomRatio,
                        cxChartMargin: fixedBasePlotterVariables.cxChartMargin / this.zoomRatio,
                        cyChartMargin: fixedBasePlotterVariables.cyChartMargin / this.zoomRatio,
                        minimalShapeFraction: fixedBasePlotterVariables.minimalShapeFraction
                    };

                    this.volatilePlotterVariables = new PeopleBarPlottertVolatileVariables(this.basePlotterVariables);
                }
                Object.defineProperty(PeopleBarBasePlotter.prototype, "ZoomRatio", {
                    get: function () {
                        return this.zoomRatio;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(PeopleBarBasePlotter.prototype, "BasePlotterVariables", {
                    get: function () {
                        return this.basePlotterVariables;
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Implementing {@link ITool#resetTool}
                */
                PeopleBarBasePlotter.prototype.resetTool = function () {
                    this.resume();

                    $(DataViz.Chart.defaultChartRootId).empty();
                };

                /**
                * Implementing {@link IPlotter#plot}
                */
                PeopleBarBasePlotter.prototype.plot = function (data) {
                    data.resetThreshold();

                    if (!this.calculateLayout(data)) {
                        return;
                    }

                    var maxValue = d3.max(data.NormalizedValueSeries);
                    var magnitude = 1;
                    var boundary = this.volatilePlotterVariables.MaximalShapesPerBand;
                    while ((maxValue / magnitude) > boundary) {
                        magnitude *= 10;
                    }

                    $(DataViz.Chart.defaultChartRootId).empty();
                    this.plotWithMagnitude(data, maxValue, magnitude, DataViz.Decoration.ShapeProvider.Instance.CurrentShape);
                };

                /**
                * This is a overridable method. Subclasses might override it to add their own plotter code
                * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                * @param {KeyValueData} data The data to render
                * @param {number} maxValue The max value among all the values in the data
                * @param {number} magnitude The magnitude applied to the values
                * @param {Shape} shape The currently selected shape definition
                */
                PeopleBarBasePlotter.prototype.plotWithMagnitude = function (data, maxValue, magnitude, shape) {
                    // Subclasses might override if needed
                };

                /**
                * This is a overridable method. Subclasses might override it to add their own calculation logic
                * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                * @param {KeyValueData} data The data to be plotted
                * @param {number} boardWidth The width of the board that will be used to render the whole chart (area including label widths, if any)
                * @returns {number} The width of the band that will be used to render the shape icons (area excluding label widths, if any)
                */
                PeopleBarBasePlotter.prototype.calculateBandWidth = function (data, boardWidth) {
                    // Subclasses might override if needed
                    return boardWidth;
                };

                /**
                * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                * @param {opt} The optimal parameter for plotter.
                * @param {data} data The data to be plotted.
                */
                PeopleBarBasePlotter.prototype.notifyResizeWindow = function (opt, data) {
                    var _this = this;
                    if (this.timeoutId) {
                        clearTimeout(this.timeoutId);
                    }

                    this.timeoutId = setTimeout(function () {
                        if (opt.BandCount < data.Keys.length) {
                            DataViz.UX.NotificationWithNeverShowBtn.getInstance().setKey("ResizeWindow").setText(DataViz.Resources.Notification.extendAppToShowMore).show();
                        }

                        _this.timeoutId = null;
                    }, 100);
                };

                PeopleBarBasePlotter.prototype.refreshFontSizeAndGap = function (rowCount) {
                    if (rowCount <= 2) {
                        this.handleVolatilePlotterVariablesInHDPI(this.volatileSpecificStatic[0]);
                    } else if (rowCount <= 5) {
                        this.handleVolatilePlotterVariablesInHDPI(this.volatileSpecificStatic[1]);
                    } else {
                        this.handleVolatilePlotterVariablesInHDPI(this.volatileSpecificStatic[2]);
                    }
                };

                PeopleBarBasePlotter.prototype.handleVolatilePlotterVariablesInHDPI = function (volatilePlotterVariables) {
                    this.volatilePlotterVariablesSpecific = {
                        cyBandGap: volatilePlotterVariables.cyBandGap / this.ZoomRatio,
                        valueLabelFontSize: parseFloat(volatilePlotterVariables.valueLabelFontSize) / this.ZoomRatio + "px",
                        labelFontSize: parseFloat(volatilePlotterVariables.labelFontSize) / this.ZoomRatio + "px"
                    };
                };

                PeopleBarBasePlotter.prototype.calculateLayout = function (data) {
                    var _this = this;
                    this.volatilePlotterVariables.refresh(($(DataViz.Chart.defaultChartRootId).get(0)), data, function (data, boardWidth) {
                        return _this.calculateBandWidth(data, boardWidth);
                    });
                    return ((this.volatilePlotterVariables.BandWidth > 0) && (this.volatilePlotterVariables.BoardHeight > 0));
                };
                return PeopleBarBasePlotter;
            })(DataViz.Tools.Pausable);
            D3.PeopleBarBasePlotter = PeopleBarBasePlotter;
        })(Chart.D3 || (Chart.D3 = {}));
        var D3 = Chart.D3;
    })(DataViz.Chart || (DataViz.Chart = {}));
    var Chart = DataViz.Chart;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/chart.ts"/>
///<reference path="shared/decoration.ts"/>
///<reference path="data.convertor.peoplebar.ts"/>
///<reference path="plotter.peoplebarbase.d3.ts"/>

var DataViz;
(function (DataViz) {
    (function (Chart) {
        /**
        * This module contains the implementation of the People Bar D3 plotter for the "classic" type
        */
        (function (D3) {
            "use strict";

            /**
            * The People Bar D3 plotter for the "classic" type
            */
            var PeopleBarClassicPlotterD3 = (function (_super) {
                __extends(PeopleBarClassicPlotterD3, _super);
                function PeopleBarClassicPlotterD3() {
                    _super.call(this);
                    var fixedPlotterVariables = {
                        cxLabelGap: 10,
                        cyLabelGap: 2,
                        preferredLabelWidthPercentage: 0.2,
                        maximalLabelWidthPercentage: 0.3
                    };

                    this.volatileSpecificStatic = [
                        {
                            cyBandGap: 10,
                            valueLabelFontSize: "28px",
                            labelFontSize: "14px"
                        },
                        {
                            cyBandGap: 10,
                            valueLabelFontSize: "20px",
                            labelFontSize: "12px"
                        },
                        {
                            cyBandGap: 10,
                            valueLabelFontSize: "14px",
                            labelFontSize: "10px"
                        }
                    ];

                    this.plotterVariables = {
                        cxLabelGap: fixedPlotterVariables.cxLabelGap / this.ZoomRatio,
                        cyLabelGap: fixedPlotterVariables.cyLabelGap / this.ZoomRatio,
                        preferredLabelWidthPercentage: fixedPlotterVariables.preferredLabelWidthPercentage,
                        maximalLabelWidthPercentage: fixedPlotterVariables.maximalLabelWidthPercentage
                    };
                }
                /**
                * Overriding {@link PeopleBarBasePlotter#plotWithMagnitude}
                */
                PeopleBarClassicPlotterD3.prototype.plotWithMagnitude = function (data, maxValue, magnitude, shape) {
                    var svgRoot = d3.select(DataViz.Chart.defaultChartRootId);
                    var thisPlotter = this;

                    this.refreshFontSizeAndGap(data.Keys.length);
                    var classicPreferedShapeHeight = this.maxValueLabelHeight + this.maxLabelHeight + this.plotterVariables.cyLabelGap;
                    var optimalPlotterParameter = new D3.OptimalPlotterParameter(thisPlotter.BasePlotterVariables);
                    optimalPlotterParameter.optimize(Math.ceil(maxValue / magnitude), this.volatilePlotterVariables.BandWidth, this.volatilePlotterVariables.BoardHeight, shape.width, shape.height, classicPreferedShapeHeight, this.BasePlotterVariables.minimalShapeHeight, function (shapeHeight) {
                        return Math.max(thisPlotter.maxLabelHeight + thisPlotter.maxValueLabelHeight + thisPlotter.plotterVariables.cyLabelGap, shapeHeight);
                    }, function (bandHeight) {
                        return (bandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) * data.NormalizedValueSeries.length - thisPlotter.volatilePlotterVariablesSpecific.cyBandGap;
                    }, function (bandHeight) {
                        return Math.max(1, Math.floor((thisPlotter.volatilePlotterVariables.BoardHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) / (bandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap)));
                    });

                    this.notifyResizeWindow(optimalPlotterParameter, data);
                    var scale = optimalPlotterParameter.ShapeHeight / shape.height;
                    var dataWithThreshold = data.withThreshold(optimalPlotterParameter.BandCount);
                    var formattedValuesWithThreshold = dataWithThreshold.FormattedValueSeries;
                    var normalizedValuesWithThreshold = dataWithThreshold.NormalizedValueSeries;
                    var keysWithThreshold = dataWithThreshold.Keys;

                    // Use this to vertically center-align the chart area
                    var chartOffsetY = (this.volatilePlotterVariables.BoardHeight - keysWithThreshold.length * (optimalPlotterParameter.BandHeight + this.volatilePlotterVariablesSpecific.cyBandGap) + this.volatilePlotterVariablesSpecific.cyBandGap) / 2;

                    var defs = d3.select(DataViz.Chart.defaultChartRootId).select("defs");

                    if (defs.empty()) {
                        defs = svgRoot.append("defs");
                    }

                    defs.selectAll("path#shape").remove();
                    defs.selectAll("path#shapePercentage").remove();

                    defs.append("path").attr("id", "shape").attr("d", shape.path).attr("class", "chart-shape").attr("transform", "scale(" + scale + ")");

                    defs.append("path").attr("id", "shapePercentage").attr("d", shape.path).attr("class", "chart-shape-percentage").attr("transform", "scale(" + scale + ")");

                    defs.selectAll("clipPath").remove();

                    normalizedValuesWithThreshold.forEach(function (originalValue, index, array) {
                        var value = originalValue / magnitude;
                        var fraction = Math.max(value - Math.floor(value), thisPlotter.BasePlotterVariables.minimalShapeFraction);

                        if (fraction > 0) {
                            defs.append("clipPath").attr("id", "shapeClip" + index).attr("clipPathUnits", "objectBoundingBox").append("rect").attr("x", 0).attr("y", 0).attr("height", 1).attr("width", fraction);
                        }

                        defs.append("clipPath").attr("id", "valueLabelClip" + index).attr("clipPathUnits", "objectBoundingBox").append("rect").attr("x", 0).attr("y", 0).attr("height", 1).attr("width", thisPlotter.maxLabelWidth / thisPlotter.valueLabelWidths[index]);

                        defs.append("clipPath").attr("id", "labelClip" + index).attr("clipPathUnits", "objectBoundingBox").append("rect").attr("x", 0).attr("y", 0).attr("height", 1).attr("width", thisPlotter.maxLabelWidth / thisPlotter.labelWidths[index]);
                    });

                    var chartValueLabels = svgRoot.selectAll("text.chart-value-label").data(formattedValuesWithThreshold);

                    var chartValueLabelX = function (value, index) {
                        return Math.max(0, thisPlotter.maxLabelWidth - thisPlotter.valueLabelWidths[index]) + thisPlotter.BasePlotterVariables.cxChartMargin;
                    };

                    var labelOffsetY = (optimalPlotterParameter.BandHeight - thisPlotter.volatilePlotterVariablesSpecific.cyBandGap - thisPlotter.maxValueLabelHeight - thisPlotter.maxLabelHeight - thisPlotter.plotterVariables.cyLabelGap) / 2;
                    var chartValueLabelY = function (value, index) {
                        return index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + labelOffsetY + thisPlotter.maxValueLabelHeight + chartOffsetY + thisPlotter.BasePlotterVariables.cyChartMargin;
                    };

                    var chartValueLabelClipPath = function (value, index) {
                        return "url(#valueLabelClip" + index + ")";
                    };

                    chartValueLabels.attr("class", "chart-value-label").attr("x", chartValueLabelX).attr("y", chartValueLabelY).style("clip-path", chartValueLabelClipPath).text(String);

                    chartValueLabels.enter().append("text").attr("class", "chart-value-label").attr("x", chartValueLabelX).attr("y", chartValueLabelY).style("clip-path", chartValueLabelClipPath).attr("text-anchor", "start").style("font-size", thisPlotter.volatilePlotterVariablesSpecific.valueLabelFontSize).text(String).style("fill-opacity", 1e-6).transition().duration(750).style("fill-opacity", 1);

                    chartValueLabels.exit().remove();

                    var chartLabels = svgRoot.selectAll("text.chart-label").data(keysWithThreshold);

                    var chartLabelX = function (value, index) {
                        return Math.max(0, thisPlotter.maxLabelWidth - thisPlotter.labelWidths[index]) + thisPlotter.BasePlotterVariables.cxChartMargin;
                    };

                    var chartLabelY = function (value, index) {
                        return index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + labelOffsetY + thisPlotter.maxValueLabelHeight + thisPlotter.maxLabelHeight + thisPlotter.plotterVariables.cyLabelGap + chartOffsetY + thisPlotter.BasePlotterVariables.cyChartMargin;
                    };

                    var chartLabelClipPath = function (value, index) {
                        return "url(#labelClip" + index + ")";
                    };

                    chartLabels.attr("class", "chart-label").attr("x", chartLabelX).attr("y", chartLabelY).style("clip-path", chartLabelClipPath).text(String);

                    chartLabels.enter().append("text").attr("class", "chart-label").attr("x", chartLabelX).attr("y", chartLabelY).style("clip-path", chartLabelClipPath).attr("text-anchor", "start").text(String).style("font-size", this.volatilePlotterVariablesSpecific.labelFontSize).style("fill-opacity", 1e-6).transition().duration(750).style("fill-opacity", 1);

                    chartLabels.exit().remove();

                    var thisPlotter = this;
                    var groups = svgRoot.selectAll("g").data(normalizedValuesWithThreshold);
                    var eachFunction = function (originalValue, index) {
                        var value = originalValue / magnitude;
                        var flooredValue = Math.floor(value);
                        var fraction = value - flooredValue;

                        var band = [];
                        for (var i = 0; i < flooredValue; i++) {
                            band.push(i);
                        }

                        var uses = d3.select(this).selectAll("use.shape").data(band);

                        var xCalculation = function (idx) {
                            return idx * (optimalPlotterParameter.ShapeWidth + thisPlotter.BasePlotterVariables.cxShapeGap) + thisPlotter.maxLabelWidth + thisPlotter.plotterVariables.cxLabelGap + thisPlotter.BasePlotterVariables.cxChartMargin;
                        };

                        var yCalculation = index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + (optimalPlotterParameter.BandHeight - optimalPlotterParameter.ShapeHeight) / 2 + chartOffsetY + thisPlotter.BasePlotterVariables.cyChartMargin;

                        var transform = function (d1, i1) {
                            var x = xCalculation(i1);
                            var y = yCalculation;
                            return "translate(" + x + ", " + y + ")";
                        };

                        uses.attr("xlink:href", "#shape").attr("transform", transform).style("clip-path", null);

                        uses.enter().append("use").attr("xlink:href", "#shape").attr("class", "shape chart-shape").attr("transform", transform).style("clip-path", null).style("fill-opacity", 1e-6).transition().duration(750).style("fill-opacity", 1);

                        uses.exit().remove();

                        d3.select(this).selectAll("use.shapePercentage").remove();
                        d3.select(this).selectAll("use.shapeFraction").remove();

                        if (fraction > 0) {
                            var x = xCalculation(flooredValue);
                            var y = yCalculation;

                            d3.select(this).append("use").attr("xlink:href", "#shapePercentage").attr("class", "shapePercentage chart-shape").attr("transform", "translate(" + x + ", " + y + ")").style("fill-opacity", 0.4);

                            d3.select(this).append("use").attr("xlink:href", "#shape").attr("class", "shapeFraction chart-shape").attr("transform", "translate(" + x + ", " + y + ")").style("clip-path", "url(#shapeClip" + index + ")").style("fill-opacity", 1);
                        }
                    };

                    groups.each(eachFunction);

                    groups.enter().append("g").each(eachFunction);

                    groups.exit().remove();
                };

                /**
                * Overriding {@link PeopleBarBasePlotter#calculateBandWidth}
                */
                PeopleBarClassicPlotterD3.prototype.calculateBandWidth = function (data, boardWidth) {
                    this.valueLabelWidths = [];
                    this.labelWidths = [];
                    this.refreshFontSizeAndGap(data.Keys.length);

                    var svgRoot = d3.select(DataViz.Chart.defaultChartRootId);
                    var values = data.FormattedValueSeries;
                    var labels = data.Keys;
                    var maxWidth = boardWidth * this.plotterVariables.preferredLabelWidthPercentage;
                    this.maxValueLabelHeight = 0;

                    var thisPlotter = this;

                    var calculationTextNode = svgRoot.append("text").attr("id", "temp-calculating-text-width").attr("class", "chart-value-label").attr("x", -100).attr("y", -100).attr("text-anchor", "start").style("fill-opacity", 0).style("font-size", this.volatilePlotterVariablesSpecific.valueLabelFontSize);

                    values.forEach(function (value, index, array) {
                        calculationTextNode.text(value);
                        thisPlotter.valueLabelWidths[index] = calculationTextNode.node().getBBox().width;
                        maxWidth = Math.max(maxWidth, thisPlotter.valueLabelWidths[index]);
                        thisPlotter.maxValueLabelHeight = Math.max(thisPlotter.maxValueLabelHeight, calculationTextNode.node().getBBox().height);
                    });

                    this.maxLabelHeight = 0;

                    calculationTextNode.attr("class", "chart-label").style("font-size", this.volatilePlotterVariablesSpecific.labelFontSize);
                    labels.forEach(function (label, index, array) {
                        calculationTextNode.text(label);
                        thisPlotter.labelWidths[index] = calculationTextNode.node().getBBox().width;
                        maxWidth = Math.max(maxWidth, thisPlotter.labelWidths[index]);
                        thisPlotter.maxLabelHeight = Math.max(thisPlotter.maxLabelHeight, calculationTextNode.node().getBBox().height);
                    });

                    calculationTextNode.remove();

                    this.maxLabelWidth = Math.min(boardWidth * this.plotterVariables.maximalLabelWidthPercentage, maxWidth);
                    return boardWidth - this.maxLabelWidth - this.plotterVariables.cxLabelGap - this.BasePlotterVariables.cxChartMargin;
                };
                return PeopleBarClassicPlotterD3;
            })(D3.PeopleBarBasePlotter);
            D3.PeopleBarClassicPlotterD3 = PeopleBarClassicPlotterD3;
        })(Chart.D3 || (Chart.D3 = {}));
        var D3 = Chart.D3;
    })(DataViz.Chart || (DataViz.Chart = {}));
    var Chart = DataViz.Chart;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/chart.ts"/>
///<reference path="shared/decoration.ts"/>
///<reference path="data.convertor.peoplebar.ts"/>
///<reference path="plotter.peoplebarbase.d3.ts"/>

var DataViz;
(function (DataViz) {
    (function (Chart) {
        /**
        * This module contains the implementation of the People Bar D3 plotter for the "callout" type
        */
        (function (D3) {
            "use strict";

            /**
            * The People Bar D3 plotter for the "callout" type
            */
            var PeopleBarCalloutPlotterD3 = (function (_super) {
                __extends(PeopleBarCalloutPlotterD3, _super);
                function PeopleBarCalloutPlotterD3() {
                    _super.call(this);
                    var fixedPlotterVariables = {
                        cxLabelGap: 10,
                        preferredLabelWidthPercentage: 0.2,
                        maximalLabelWidthPercentage: 0.3,
                        calloutPadding: 2,
                        calloutSkewWidth: 5,
                        calloutArrowHeight: 8,
                        calloutArrowWidth: 6,
                        calloutBoxOffset: 8
                    };

                    this.volatileSpecificStatic = [
                         {
                             cyBandGap: 10,
                             valueLabelFontSize: "28px",
                             labelFontSize: "14px"
                         },
                        {
                            cyBandGap: 10,
                            valueLabelFontSize: "20px",
                            labelFontSize: "12px"
                        },
                        {
                            cyBandGap: 10,
                            valueLabelFontSize: "14px",
                            labelFontSize: "10px"
                        }
                    ];

                    this.plotterVariables = {
                        cxLabelGap: fixedPlotterVariables.cxLabelGap / this.ZoomRatio,
                        preferredLabelWidthPercentage: fixedPlotterVariables.preferredLabelWidthPercentage,
                        maximalLabelWidthPercentage: fixedPlotterVariables.maximalLabelWidthPercentage,
                        calloutPadding: fixedPlotterVariables.calloutPadding / this.ZoomRatio,
                        calloutSkewWidth: fixedPlotterVariables.calloutSkewWidth / this.ZoomRatio,
                        calloutArrowHeight: fixedPlotterVariables.calloutArrowHeight / this.ZoomRatio,
                        calloutArrowWidth: fixedPlotterVariables.calloutArrowWidth / this.ZoomRatio,
                        calloutBoxOffset: fixedPlotterVariables.calloutBoxOffset / this.ZoomRatio
                    };
                }
                /**
                * Overriding {@link PeopleBarBasePlotter#plotWithMagnitude}
                */
                PeopleBarCalloutPlotterD3.prototype.plotWithMagnitude = function (data, maxValue, magnitude, shape) {
                    var svgRoot = d3.select(DataViz.Chart.defaultChartRootId);
                    var thisPlotter = this;

                    thisPlotter.refreshFontSizeAndGap(data.Keys.length);
                    var optimalPlotterParameter = new D3.OptimalPlotterParameter(thisPlotter.BasePlotterVariables);
                    optimalPlotterParameter.optimize(Math.ceil(maxValue / magnitude), thisPlotter.volatilePlotterVariables.BandWidth, thisPlotter.volatilePlotterVariables.BoardHeight, shape.width, shape.height, thisPlotter.BasePlotterVariables.preferredShapeHeight, thisPlotter.BasePlotterVariables.minimalShapeHeight, function (shapeHeight) {
                        return shapeHeight + thisPlotter.maxLabelHeight + thisPlotter.plotterVariables.calloutPadding * 2 + thisPlotter.plotterVariables.calloutArrowHeight;
                    }, function (bandHeight) {
                        return (bandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) * data.NormalizedValueSeries.length - thisPlotter.volatilePlotterVariablesSpecific.cyBandGap;
                    }, function (bandHeight) {
                        return Math.max(1, Math.floor((thisPlotter.volatilePlotterVariables.BoardHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) / (bandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap)));
                    });

                    this.notifyResizeWindow(optimalPlotterParameter, data);
                    var scale = optimalPlotterParameter.ShapeHeight / shape.height;
                    var dataWithThreshold = data.withThreshold(optimalPlotterParameter.BandCount);
                    var formattedValuesWithThreshold = dataWithThreshold.FormattedValueSeries;
                    var normalizedValuesWithThreshold = dataWithThreshold.NormalizedValueSeries;
                    var keysWithThreshold = dataWithThreshold.Keys;

                    // Use this to vertically center-align the chart area
                    var chartOffsetY = (this.volatilePlotterVariables.BoardHeight - keysWithThreshold.length * (optimalPlotterParameter.BandHeight + this.volatilePlotterVariablesSpecific.cyBandGap) + this.volatilePlotterVariablesSpecific.cyBandGap) / 2;

                    var defs = svgRoot.select("defs");

                    if (defs.empty()) {
                        defs = svgRoot.append("defs");
                    }

                    defs.selectAll("path#shape").remove();
                    defs.selectAll("path#shapePercentage").remove();

                    defs.append("path").attr("id", "shape").attr("d", shape.path).attr("class", "chart-shape").attr("transform", "scale(" + scale + ")");

                    defs.append("path").attr("id", "shapePercentage").attr("d", shape.path).attr("class", "chart-shape-percentage").attr("transform", "scale(" + scale + ")");

                    defs.selectAll("clipPath").remove();

                    normalizedValuesWithThreshold.forEach(function (originalValue, index, array) {
                        var value = originalValue / magnitude;
                        var fraction = Math.max(value - Math.floor(value), thisPlotter.BasePlotterVariables.minimalShapeFraction);

                        if (fraction > 0) {
                            defs.append("clipPath").attr("id", "shapeClip" + index).attr("clipPathUnits", "objectBoundingBox").append("rect").attr("x", 0).attr("y", 0).attr("height", 1).attr("width", fraction);
                        }

                        defs.append("clipPath").attr("id", "valueLabelClip" + index).attr("clipPathUnits", "objectBoundingBox").append("rect").attr("x", 0).attr("y", 0).attr("height", 1).attr("width", thisPlotter.maxLabelWidth / thisPlotter.valueLabelWidths[index]);
                    });

                    var chartValueLabels = svgRoot.selectAll("text.chart-value-label").data(formattedValuesWithThreshold);

                    var chartValueLabelX = function (value, index) {
                        return Math.max(0, thisPlotter.maxLabelWidth - thisPlotter.valueLabelWidths[index]) + thisPlotter.BasePlotterVariables.cxChartMargin;
                    };

                    var chartValueLabelY = function (value, index) {
                        return (index + 1) * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) - thisPlotter.volatilePlotterVariablesSpecific.cyBandGap - thisPlotter.BasePlotterVariables.cyShapeGap + chartOffsetY + thisPlotter.BasePlotterVariables.cyChartMargin;
                    };

                    var chartValueLabelClipPath = function (value, index) {
                        return "url(#valueLabelClip" + index + ")";
                    };

                    chartValueLabels.attr("class", "chart-value-label").attr("x", chartValueLabelX).attr("y", chartValueLabelY).style("clip-path", chartValueLabelClipPath).text(String);

                    chartValueLabels.enter().append("text").attr("class", "chart-value-label").attr("x", chartValueLabelX).attr("y", chartValueLabelY).attr("text-anchor", "start").style("clip-path", chartValueLabelClipPath).text(String).style("font-size", this.volatilePlotterVariablesSpecific.valueLabelFontSize).style("fill-opacity", 1e-6).transition().duration(750).style("fill-opacity", 1);

                    chartValueLabels.exit().remove();

                    var labelCallouts = svgRoot.selectAll("polygon.chart-label-callout").data(keysWithThreshold);

                    // Calculate and generate the series of points that compose the callout box and arrow
                    var points = function (label, index) {
                        if (label.trim().length === 0) {
                            return "";
                        }

                        var boxLeft = thisPlotter.maxLabelWidth + thisPlotter.plotterVariables.cxLabelGap;
                        +thisPlotter.BasePlotterVariables.cxChartMargin - thisPlotter.plotterVariables.calloutBoxOffset;
                        var boxRight = Math.max(boxLeft + thisPlotter.labelWidths[index] + thisPlotter.plotterVariables.calloutPadding * 2, thisPlotter.maxLabelWidth + thisPlotter.BasePlotterVariables.cxChartMargin + thisPlotter.plotterVariables.cxLabelGap + optimalPlotterParameter.ShapeWidth);
                        var boxBottom = index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + thisPlotter.maxLabelHeight + thisPlotter.plotterVariables.calloutPadding * 2 + chartOffsetY + thisPlotter.BasePlotterVariables.cyChartMargin;
                        var boxTop = boxBottom - thisPlotter.maxLabelHeight - thisPlotter.plotterVariables.calloutPadding * 2;
                        var arrowBottom = boxBottom + thisPlotter.plotterVariables.calloutArrowHeight;
                        var arrowCenter = thisPlotter.maxLabelWidth + thisPlotter.BasePlotterVariables.cxChartMargin + thisPlotter.plotterVariables.cxLabelGap + optimalPlotterParameter.ShapeWidth / 2;
                        return (boxLeft - thisPlotter.plotterVariables.calloutSkewWidth) + "," + boxBottom + " " + boxLeft + "," + boxTop + " " + (boxRight + thisPlotter.plotterVariables.calloutSkewWidth) + "," + boxTop + " " + boxRight + "," + boxBottom + " " + arrowCenter + "," + boxBottom + " " + arrowCenter + "," + arrowBottom + " " + (arrowCenter - thisPlotter.plotterVariables.calloutArrowWidth) + "," + boxBottom + " " + (boxLeft - thisPlotter.plotterVariables.calloutSkewWidth) + "," + boxBottom;
                    };

                    labelCallouts.attr("class", "chart-label-callout").attr("points", points);

                    labelCallouts.enter().append("polygon").attr("class", "chart-label-callout").attr("points", points).style("fill-opacity", 1e-6).transition().duration(750).style("fill-opacity", 1);

                    labelCallouts.exit().remove();

                    var chartLabels = svgRoot.selectAll("text.chart-label").data(keysWithThreshold);

                    var chartLabelX = function (value, index) {
                        return thisPlotter.maxLabelWidth + thisPlotter.plotterVariables.calloutPadding + thisPlotter.BasePlotterVariables.cxChartMargin + thisPlotter.plotterVariables.cxLabelGap - thisPlotter.plotterVariables.calloutBoxOffset;
                    };

                    var chartLabelY = function (label, index) {
                        return index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + thisPlotter.maxLabelHeight + chartOffsetY + thisPlotter.BasePlotterVariables.cyChartMargin - thisPlotter.plotterVariables.calloutPadding;
                    };

                    chartLabels.attr("class", "chart-label").attr("x", chartLabelX).attr("y", chartLabelY).text(String);

                    chartLabels.enter().append("text").attr("class", "chart-label").attr("x", chartLabelX).attr("y", chartLabelY).text(String).style("font-size", this.volatilePlotterVariablesSpecific.labelFontSize).attr("text-anchor", "start").style("fill-opacity", 1e-6).transition().duration(750).style("fill-opacity", 1);

                    chartLabels.exit().remove();

                    var thisPlotter = this;
                    var groups = svgRoot.selectAll("g.shapes").data(normalizedValuesWithThreshold);
                    var eachFunction = function (originalValue, index) {
                        var value = originalValue / magnitude;
                        var flooredValue = Math.floor(value);
                        var fraction = value - flooredValue;

                        var band = [];
                        for (var i = 0; i < flooredValue; i++) {
                            band.push(i);
                        }

                        var uses = d3.select(this).selectAll("use.shape").data(band);

                        var transform = function (d1, i1) {
                            var x = i1 * (optimalPlotterParameter.ShapeWidth + thisPlotter.BasePlotterVariables.cxShapeGap) + thisPlotter.maxLabelWidth + thisPlotter.plotterVariables.cxLabelGap + thisPlotter.BasePlotterVariables.cxChartMargin;
                            var y = index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + chartOffsetY + thisPlotter.maxLabelHeight + thisPlotter.plotterVariables.calloutPadding * 2 + thisPlotter.plotterVariables.calloutArrowHeight + thisPlotter.BasePlotterVariables.cyChartMargin;
                            return "translate(" + x + ", " + y + ")";
                        };

                        uses.attr("xlink:href", "#shape").attr("transform", transform).style("clip-path", null);

                        uses.enter().append("use").attr("xlink:href", "#shape").attr("class", "shape chart-shape").attr("transform", transform).style("clip-path", null).style("fill-opacity", 1e-6).transition().duration(750).style("fill-opacity", 1);

                        uses.exit().remove();

                        d3.select(this).selectAll("use.shapePercentage").remove();
                        d3.select(this).selectAll("use.shapeFraction").remove();

                        if (fraction > 0) {
                            var x = flooredValue * (optimalPlotterParameter.ShapeWidth + thisPlotter.BasePlotterVariables.cxShapeGap) + thisPlotter.maxLabelWidth + thisPlotter.plotterVariables.cxLabelGap + thisPlotter.BasePlotterVariables.cxChartMargin;
                            var y = index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + chartOffsetY + thisPlotter.maxLabelHeight + thisPlotter.plotterVariables.calloutPadding * 2 + thisPlotter.plotterVariables.calloutArrowHeight + thisPlotter.BasePlotterVariables.cyChartMargin;

                            d3.select(this).append("use").attr("xlink:href", "#shapePercentage").attr("class", "shapePercentage chart-shape").attr("transform", "translate(" + x + ", " + y + ")").style("fill-opacity", 0.4);

                            d3.select(this).append("use").attr("xlink:href", "#shape").attr("class", "shapeFraction chart-shape").attr("transform", "translate(" + x + ", " + y + ")").style("clip-path", "url(#shapeClip" + index + ")").style("fill-opacity", 1);
                        }
                    };

                    groups.each(eachFunction);

                    groups.enter().append("g").attr("class", "shapes").each(eachFunction);

                    groups.exit().remove();
                };

                /**
                * Overriding {@link PeopleBarBasePlotter#calculateBandWidth}
                */
                PeopleBarCalloutPlotterD3.prototype.calculateBandWidth = function (data, boardWidth) {
                    this.valueLabelWidths = [];
                    this.labelWidths = [];
                    this.refreshFontSizeAndGap(data.Keys.length);

                    var svgRoot = d3.select(DataViz.Chart.defaultChartRootId);
                    var values = data.FormattedValueSeries;
                    var labels = data.Keys;
                    var maxWidth = boardWidth * this.plotterVariables.preferredLabelWidthPercentage;
                    this.maxValueLabelHeight = 0;

                    var thisPlotter = this;

                    var calculationTextNode = svgRoot.append("text").attr("id", "temp-calculating-text-width").attr("class", "chart-value-label").attr("x", -100).attr("y", -100).attr("text-anchor", "start").style("fill-opacity", 0).style("font-size", this.volatilePlotterVariablesSpecific.valueLabelFontSize);

                    values.forEach(function (value, index, array) {
                        calculationTextNode.text(value);
                        thisPlotter.valueLabelWidths[index] = calculationTextNode.node().getBBox().width;
                        maxWidth = Math.max(maxWidth, thisPlotter.valueLabelWidths[index]);
                        thisPlotter.maxValueLabelHeight = Math.max(thisPlotter.maxValueLabelHeight, calculationTextNode.node().getBBox().height);
                    });

                    this.maxLabelHeight = 0;

                    calculationTextNode.attr("class", "chart-label").style("font-size", this.volatilePlotterVariablesSpecific.labelFontSize);
                    labels.forEach(function (label, index, array) {
                        calculationTextNode.text(label);
                        thisPlotter.labelWidths[index] = calculationTextNode.node().getBBox().width;
                        thisPlotter.maxLabelHeight = Math.max(thisPlotter.maxLabelHeight, calculationTextNode.node().getBBox().height);
                    });

                    calculationTextNode.remove();

                    this.maxLabelWidth = Math.min(boardWidth * this.plotterVariables.maximalLabelWidthPercentage, maxWidth);
                    return boardWidth - this.maxLabelWidth - this.plotterVariables.cxLabelGap - this.BasePlotterVariables.cxChartMargin;
                };
                return PeopleBarCalloutPlotterD3;
            })(D3.PeopleBarBasePlotter);
            D3.PeopleBarCalloutPlotterD3 = PeopleBarCalloutPlotterD3;
        })(Chart.D3 || (Chart.D3 = {}));
        var D3 = Chart.D3;
    })(DataViz.Chart || (DataViz.Chart = {}));
    var Chart = DataViz.Chart;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/chart.ts"/>
///<reference path="shared/decoration.ts"/>
///<reference path="data.convertor.peoplebar.ts"/>
///<reference path="plotter.peoplebarbase.d3.ts"/>

var DataViz;
(function (DataViz) {
    (function (Chart) {
        /**
        * This module contains the implementation of the People Bar D3 plotter for the "giant" type
        */
        (function (D3) {
            "use strict";

            /**
            * The People Bar D3 plotter for the "giant" type
            */
            var PeopleBarGiantPlotterD3 = (function (_super) {
                __extends(PeopleBarGiantPlotterD3, _super);
                function PeopleBarGiantPlotterD3() {
                    _super.call(this);
                    var fixedPlotterVariables = {
                        cxLabelGap: 12,
                        cyLabelGap: 6,
                        preferredLabelWidthPercentage: 0.2,
                        maximalLabelWidthPercentage: 0.5
                    };

                    this.volatileSpecificStatic = [
                        {
                            cyBandGap: 12,
                            valueLabelFontSize: "30px",
                            labelFontSize: "16px"
                        },
                        {
                            cyBandGap: 8,
                            valueLabelFontSize: "24px",
                            labelFontSize: "12px"
                        },
                        {
                            cyBandGap: 4,
                            valueLabelFontSize: "18px",
                            labelFontSize: "10px"
                        }
                    ];

                    this.plotterVariables = {
                        cxLabelGap: fixedPlotterVariables.cxLabelGap / this.ZoomRatio,
                        cyLabelGap: fixedPlotterVariables.cyLabelGap / this.ZoomRatio,
                        preferredLabelWidthPercentage: fixedPlotterVariables.preferredLabelWidthPercentage,
                        maximalLabelWidthPercentage: fixedPlotterVariables.maximalLabelWidthPercentage
                    };
                }
                /**
                * Overriding {@link PeopleBarBasePlotter#plotWithMagnitude}
                */
                PeopleBarGiantPlotterD3.prototype.plotWithMagnitude = function (data, maxValue, magnitude, shape) {
                    var svgRoot = d3.select(DataViz.Chart.defaultChartRootId);
                    var thisPlotter = this;

                    this.refreshFontSizeAndGap(data.Keys.length);
                    var optimalPlotterParameter = new D3.OptimalPlotterParameter(thisPlotter.BasePlotterVariables);
                    optimalPlotterParameter.optimize(Math.ceil(maxValue / magnitude), thisPlotter.volatilePlotterVariables.BandWidth, thisPlotter.volatilePlotterVariables.BoardHeight, shape.width, shape.height, thisPlotter.BasePlotterVariables.preferredShapeHeight, thisPlotter.BasePlotterVariables.minimalShapeHeight, function (shapeHeight) {
                        return Math.max(thisPlotter.maxValueLabelHeight, shapeHeight + thisPlotter.maxLabelHeight + thisPlotter.plotterVariables.cyLabelGap);
                    }, function (bandHeight) {
                        return (bandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) * data.NormalizedValueSeries.length - thisPlotter.volatilePlotterVariablesSpecific.cyBandGap;
                    }, function (bandHeight) {
                        return Math.max(1, Math.floor((thisPlotter.volatilePlotterVariables.BoardHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) / (bandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap)));
                    });

                    this.notifyResizeWindow(optimalPlotterParameter, data);
                    var scale = optimalPlotterParameter.ShapeHeight / shape.height;
                    var dataWithThreshold = data.withThreshold(optimalPlotterParameter.BandCount);
                    var formattedValuesWithThreshold = dataWithThreshold.FormattedValueSeries;
                    var normalizedValuesWithThreshold = dataWithThreshold.NormalizedValueSeries;
                    var keysWithThreshold = dataWithThreshold.Keys;

                    // Use this to vertically center-align the chart area
                    var chartOffsetY = (thisPlotter.volatilePlotterVariables.BoardHeight - keysWithThreshold.length * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) / 2;

                    var defs = svgRoot.select("defs");

                    if (defs.empty()) {
                        defs = svgRoot.append("defs");
                    }

                    defs.selectAll("path#shape").remove();
                    defs.selectAll("path#shapePercentage").remove();

                    defs.append("path").attr("id", "shape").attr("d", shape.path).attr("class", "chart-shape").attr("transform", "scale(" + scale + ")");

                    defs.append("path").attr("id", "shapePercentage").attr("d", shape.path).attr("class", "chart-shape-percentage").attr("transform", "scale(" + scale + ")");

                    defs.selectAll("clipPath").remove();

                    normalizedValuesWithThreshold.forEach(function (originalValue, index, array) {
                        var value = originalValue / magnitude;
                        var fraction = Math.max(value - Math.floor(value), thisPlotter.BasePlotterVariables.minimalShapeFraction);

                        if (fraction > 0) {
                            defs.append("clipPath").attr("id", "shapeClip" + index).attr("clipPathUnits", "objectBoundingBox").append("rect").attr("x", 0).attr("y", 0).attr("height", 1).attr("width", fraction);
                        }

                        defs.append("clipPath").attr("id", "valueLabelClip" + index).attr("clipPathUnits", "objectBoundingBox").append("rect").attr("x", 0).attr("y", 0).attr("height", 1).attr("width", thisPlotter.maxValueLabelWidth / thisPlotter.valueLabelWidths[index]);
                    });

                    var chartValueLabels = svgRoot.selectAll("text.chart-value-label").data(formattedValuesWithThreshold);

                    var chartValueLabelX = function (value, index) {
                        return Math.max(0, thisPlotter.maxValueLabelWidth - thisPlotter.valueLabelWidths[index]) + thisPlotter.BasePlotterVariables.cxChartMargin;
                    };

                    var chartValueLabelY = function (value, index) {
                        return index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + optimalPlotterParameter.ShapeHeight + chartOffsetY + thisPlotter.BasePlotterVariables.cyChartMargin;
                    };

                    var chartValueLabelClipPath = function (value, index) {
                        return "url(#valueLabelClip" + index + ")";
                    };

                    var chartValueLabelText = function (value, index) {
                        return DataViz.Utils.formatNumberWithThousandSeparators(value);
                    };

                    chartValueLabels.attr("class", "chart-value-label").attr("x", chartValueLabelX).attr("y", chartValueLabelY).style("clip-path", chartValueLabelClipPath).text(chartValueLabelText);

                    chartValueLabels.enter().append("text").attr("class", "chart-value-label").attr("x", chartValueLabelX).attr("y", chartValueLabelY).attr("text-anchor", "start").style("clip-path", chartValueLabelClipPath).text(chartValueLabelText).style("font-size", thisPlotter.volatilePlotterVariablesSpecific.valueLabelFontSize).style("fill-opacity", 1e-6).transition().duration(750).style("fill-opacity", 1);

                    chartValueLabels.exit().remove();

                    var chartLabels = svgRoot.selectAll("text.chart-label").data(keysWithThreshold);

                    var chartLabelX = function (value, index) {
                        return thisPlotter.maxValueLabelWidth + thisPlotter.plotterVariables.cxLabelGap + thisPlotter.BasePlotterVariables.cxChartMargin;
                    };

                    var chartLabelY = function (value, index) {
                        return index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + optimalPlotterParameter.ShapeHeight + chartOffsetY + thisPlotter.maxLabelHeight + thisPlotter.BasePlotterVariables.cyChartMargin;
                    };

                    chartLabels.attr("class", "chart-label").attr("x", chartLabelX).attr("y", chartLabelY).text(String);

                    chartLabels.enter().append("text").attr("class", "chart-label").attr("x", chartLabelX).attr("y", chartLabelY).attr("text-anchor", "start").text(String).style("font-size", thisPlotter.volatilePlotterVariablesSpecific.labelFontSize).style("fill-opacity", 1e-6).transition().duration(750).style("fill-opacity", 1);

                    chartLabels.exit().remove();

                    var groups = svgRoot.selectAll("g").data(normalizedValuesWithThreshold);
                    var eachFunction = function (originalValue, index) {
                        var value = originalValue / magnitude;
                        var flooredValue = Math.floor(value);
                        var fraction = value - flooredValue;

                        var band = [];
                        for (var i = 0; i < flooredValue; i++) {
                            band.push(i);
                        }

                        var uses = d3.select(this).selectAll("use.shape").data(band);

                        var transform = function (d1, i1) {
                            var x = i1 * (optimalPlotterParameter.ShapeWidth + thisPlotter.BasePlotterVariables.cxShapeGap) + thisPlotter.maxValueLabelWidth + thisPlotter.plotterVariables.cxLabelGap + thisPlotter.BasePlotterVariables.cxChartMargin;
                            var y = index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + chartOffsetY + thisPlotter.BasePlotterVariables.cyChartMargin;
                            return "translate(" + x + ", " + y + ")";
                        };

                        uses.attr("xlink:href", "#shape").attr("transform", transform).style("clip-path", null);

                        uses.enter().append("use").attr("xlink:href", "#shape").attr("class", "shape chart-shape").attr("transform", transform).style("clip-path", null).style("fill-opacity", 1e-6).transition().duration(750).style("fill-opacity", 1);

                        uses.exit().remove();

                        d3.select(this).selectAll("use.shapePercentage").remove();
                        d3.select(this).selectAll("use.shapeFraction").remove();

                        if (fraction > 0) {
                            var x = flooredValue * (optimalPlotterParameter.ShapeWidth + thisPlotter.BasePlotterVariables.cxShapeGap) + thisPlotter.maxValueLabelWidth + thisPlotter.plotterVariables.cxLabelGap + thisPlotter.BasePlotterVariables.cxChartMargin;
                            var y = index * (optimalPlotterParameter.BandHeight + thisPlotter.volatilePlotterVariablesSpecific.cyBandGap) + chartOffsetY + thisPlotter.BasePlotterVariables.cyChartMargin;

                            d3.select(this).append("use").attr("xlink:href", "#shapePercentage").attr("class", "shapePercentage chart-shape").attr("transform", "translate(" + x + ", " + y + ")").style("fill-opacity", 0.4);

                            d3.select(this).append("use").attr("xlink:href", "#shape").attr("class", "shapeFraction chart-shape").attr("transform", "translate(" + x + ", " + y + ")").style("clip-path", "url(#shapeClip" + index + ")").style("fill-opacity", 1);
                        }
                    };

                    groups.each(eachFunction);

                    groups.enter().append("g").each(eachFunction);

                    groups.exit().remove();
                };

                /**
                * Overriding {@link PeopleBarBasePlotter#calculateBandWidth}
                */
                PeopleBarGiantPlotterD3.prototype.calculateBandWidth = function (data, boardWidth) {
                    this.valueLabelWidths = [];
                    this.refreshFontSizeAndGap(data.Keys.length);

                    var svgRoot = d3.select(DataViz.Chart.defaultChartRootId);
                    var values = data.FormattedValueSeries;
                    var labels = data.Keys;
                    this.maxValueLabelWidth = boardWidth * this.plotterVariables.preferredLabelWidthPercentage;
                    this.maxValueLabelHeight = 0;
                    this.maxLabelHeight = 0;

                    var thisPlotter = this;

                    var calculationTextNode = svgRoot.append("text").attr("id", "temp-calculating-text-width").attr("class", "chart-value-label").attr("x", -100).attr("y", -100).attr("text-anchor", "start").style("fill-opacity", 0).style("font-size", thisPlotter.volatilePlotterVariablesSpecific.valueLabelFontSize);

                    values.forEach(function (value, index, array) {
                        calculationTextNode.text(DataViz.Utils.formatNumberWithThousandSeparators(value));
                        thisPlotter.valueLabelWidths[index] = calculationTextNode.node().getBBox().width;
                        thisPlotter.maxValueLabelWidth = Math.max(thisPlotter.maxValueLabelWidth, thisPlotter.valueLabelWidths[index]);
                        thisPlotter.maxValueLabelHeight = Math.max(thisPlotter.maxValueLabelHeight, calculationTextNode.node().getBBox().height);
                    });

                    this.maxValueLabelWidth = Math.min(boardWidth * this.plotterVariables.maximalLabelWidthPercentage, this.maxValueLabelWidth);

                    calculationTextNode.attr("class", "chart-label").style("font-size", this.volatilePlotterVariablesSpecific.labelFontSize);
                    labels.forEach(function (label, index, array) {
                        calculationTextNode.text(label);
                        thisPlotter.maxLabelHeight = Math.max(thisPlotter.maxLabelHeight, calculationTextNode.node().getBBox().height);
                    });

                    calculationTextNode.remove();

                    return boardWidth - this.maxValueLabelWidth - this.plotterVariables.cxLabelGap;
                };
                return PeopleBarGiantPlotterD3;
            })(D3.PeopleBarBasePlotter);
            D3.PeopleBarGiantPlotterD3 = PeopleBarGiantPlotterD3;
        })(Chart.D3 || (Chart.D3 = {}));
        var D3 = Chart.D3;
    })(DataViz.Chart || (DataViz.Chart = {}));
    var Chart = DataViz.Chart;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/chart.ts"/>
///<reference path="shared/layout.ts"/>
///<reference path="shared/decoration.ts"/>
///<reference path="data.convertor.peoplebar.ts"/>

var DataViz;
(function (DataViz) {
    (function (Chart) {
        /**
        * This module contains the implementation of the base layouter
        */
        (function (D3) {
            "use strict";

            /**
            * The base class of all layouters based on D3
            */
            var BaseLayouter = (function (_super) {
                __extends(BaseLayouter, _super);
                function BaseLayouter() {
                    _super.call(this);

                    this.zoomRatio = DataViz.Utils.getZoomRatioForApp();
                    this.cachedLayoutElementInstance = [];
                }
                Object.defineProperty(BaseLayouter.prototype, "ZoomRatio", {
                    get: function () {
                        return this.zoomRatio;
                    },
                    enumerable: true,
                    configurable: true
                });

                /**
                * Implementing {@link ITool#resetTool}
                */
                BaseLayouter.prototype.resetTool = function () {
                    this.cachedLayoutElementInstance.length = 0;
                    this.resume();
                };

                /**
                * Implementing {@link ILayouter#Layout}
                */
                BaseLayouter.prototype.layout = function (data) {
                    this.relayout();
                };

                /**
                * Implementing {@link ILayoutChangeListener#onLayoutChanged}
                */
                BaseLayouter.prototype.onLayoutChanged = function (layout) {
                };

                /**
                * Implementing {@link ILayoutChangeListener#onLayoutElementChanged}
                */
                BaseLayouter.prototype.onLayoutElementChanged = function (layoutElement) {
                };

                /**
                * Implementing {@link ILayoutChangeListener#onLayoutElementInstanceChanged}
                */
                BaseLayouter.prototype.onLayoutElementInstanceChanged = function (layoutElement, value) {
                    this.cachedLayoutElementInstance.push(new Chart.LayoutElementInstance(layoutElement, value));

                    if (!this.isPaused()) {
                        this.layoutOneElementInstance(layoutElement, value);
                    }
                };

                /**
                * The width and height settings for an inner SVG are not working properly. It always becomes "auto x auto".
                * Here is a workaround helper to inject a placeholder rect into the inner SVG.
                * In addition, this actually ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                * @param {any} innserSVG The inner SVG node
                * @param {any} width The width of the placeholder (the expected width of the inner SVG)
                * @param {any} height The height of the placeholder (the expected height of the inner SVG)
                */
                BaseLayouter.prototype.injectPlaceholderForInnerSVG = function (innerSVG, width, height) {
                    if (d3.select("rect#innerSVG-placeholder").empty()) {
                        innerSVG.append("rect").attr("id", "innerSVG-placeholder").attr("x", 0).attr("y", 0).attr("width", width).attr("height", height).style("opacity", 0);
                    }
                };

                /**
                * This is an overridable method that mostly should be used by sub classes to do extra layout
                * It actually ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                */
                BaseLayouter.prototype.layoutExtra = function () {
                    // Subclasses might override if needed
                };

                /**
                * This is a helper method mostly should be used by sub classes to get title height
                * It actually ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                */
                BaseLayouter.prototype.getTitleHeight = function (title) {
                    var titleHeight = title.node().getBBox().height;
                    if (title.text().trim() === "") {
                        title.attr("visibility", "hidden");
                        title.text("1");
                        titleHeight = title.node().getBBox().height;
                        title.text("");
                        title.attr("visibility", "visible");
                    }

                    return titleHeight;
                };

                BaseLayouter.prototype.relayout = function () {
                    var _this = this;
                    this.ensureDefinitions();

                    DataViz.Chart.LayoutProvider.Instance.CurrentLayout.elements.forEach(function (layoutElement, index, array) {
                        _this.layoutOneElement(layoutElement);
                    });

                    $("#title").css("font-size", 24 / this.zoomRatio + "pt");

                    this.cachedLayoutElementInstance.forEach(function (leInstance, index, array) {
                        _this.layoutOneElementInstance(leInstance.layoutElement, leInstance.value);
                    });

                    this.layoutExtra();
                };

                BaseLayouter.prototype.layoutOneElement = function (layoutElement) {
                    var root = d3.select(DataViz.Chart.defaultSVGRootId);
                    var element = root.select("#" + layoutElement.id);

                    if (element.empty()) {
                        element = root.append(layoutElement.element).attr("id", layoutElement.id);

                        if (layoutElement.cssClass) {
                            element.classed(layoutElement.cssClass, true);
                        }

                        layoutElement.attributes.forEach(function (attr, index, array) {
                            element.attr(attr.name, attr.value);
                        });

                        layoutElement.styles.forEach(function (style, index, array) {
                            element.style(style.name, style.value);
                        });
                    }
                };

                BaseLayouter.prototype.layoutOneElementInstance = function (layoutElement, value) {
                    var element = d3.select(DataViz.Chart.defaultSVGRootId).select("#" + layoutElement.id);
                    if (element.empty()) {
                        return;
                    }

                    if ((value !== null) && (value !== undefined)) {
                        element.text(value);
                    }
                };

                BaseLayouter.prototype.ensureDefinitions = function () {
                    var root = d3.select(DataViz.Chart.defaultSVGRootId);
                    var defs = root.select("defs");
                    if (defs.empty()) {
                        defs = root.append("defs");
                    }

                    if (defs.select("pattern#backgroundPattern").empty()) {
                        var pattern = defs.append("pattern").attr("id", "backgroundPattern").attr("x", 0).attr("y", 0).attr("width", 8).attr("height", 8).attr("patternUnits", "userSpaceOnUse");

                        pattern.append("rect").attr("class", "chart-background").attr("x", 0).attr("y", 0).attr("width", 8).attr("height", 8);

                        pattern.append("path").attr("d", "M8,8 8,7.717 7.717,8 Z M8,0 7.717,0 0,7.717 0,8 0.283,8 8,0.283 Z M0,0 0,0.283 0.283,0 Z").attr("class", "chart-background-path");
                    }
                };
                return BaseLayouter;
            })(DataViz.Tools.Pausable);
            D3.BaseLayouter = BaseLayouter;
        })(Chart.D3 || (Chart.D3 = {}));
        var D3 = Chart.D3;
    })(DataViz.Chart || (DataViz.Chart = {}));
    var Chart = DataViz.Chart;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/layout.ts"/>
///<reference path="layouter.base.d3.ts"/>

var DataViz;
(function (DataViz) {
    (function (Chart) {
        /**
        * This module contains the implementation of the layouter for the People Bar "giant" type
        */
        (function (D3) {
            "use strict";

            /**
            * The layouter for the People Bar "giant" type
            */
            var GiantLayouter = (function (_super) {
                __extends(GiantLayouter, _super);
                function GiantLayouter() {
                    _super.call(this);
                    this.cxBoardMargin = GiantLayouter.cxBoardMargin / this.ZoomRatio;
                    this.cyBoardMargin = GiantLayouter.cyBoardMargin / this.ZoomRatio;
                    this.cyTitleGap = GiantLayouter.cyTitleGap / this.ZoomRatio;
                    this.cySeparatorGap = GiantLayouter.cySeparatorGap / this.ZoomRatio;
                }
                /**
                * Overriding {@link BaseLayout#layoutExtra}
                */
                GiantLayouter.prototype.layoutExtra = function () {
                    var root = d3.select(DataViz.Chart.defaultSVGRootId);
                    var boardWidth = window.innerWidth || document.body.clientWidth;
                    var boardHeight = window.innerHeight || document.body.clientHeight;
                    
                    if (!DataViz.Chart.isWindowBand) {
                        boardWidth = $(DataViz.Chart.defaultSVGRootId).innerWidth();
                        boardHeight = $(DataViz.Chart.defaultSVGRootId).innerHeight();
                    }                     

                    var titleElement = root.select("#title");
                    if (titleElement.empty()) {
                        return;
                    }

                    var titleHeight = 0;
                    titleElement.attr("x", 0).attr("y", 0);
                    
                    var chartRoot = root.select(DataViz.Chart.defaultChartRootId);
                    if (chartRoot.empty()) {
                        return;
                    }

                    var chartY = 0;//this.cySeparatorGap;
                    chartRoot.attr("y", chartY).attr("height", boardHeight - chartY);                   

                    _super.prototype.injectPlaceholderForInnerSVG.call(this, chartRoot, "100%", boardHeight - chartY);
                };
                GiantLayouter.cxBoardMargin = 10;
                GiantLayouter.cyBoardMargin = 12;
                GiantLayouter.cyTitleGap = 24;
                GiantLayouter.cySeparatorGap = 8;
                return GiantLayouter;
            })(DataViz.Chart.D3.BaseLayouter);
            D3.GiantLayouter = GiantLayouter;
        })(Chart.D3 || (Chart.D3 = {}));
        var D3 = Chart.D3;
    })(DataViz.Chart || (DataViz.Chart = {}));
    var Chart = DataViz.Chart;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/layout.ts"/>
///<reference path="layouter.base.d3.ts"/>

var DataViz;
(function (DataViz) {
    (function (Chart) {
        /**
        * This module contains the implementation of the layouter for the People Bar "callout" type
        */
        (function (D3) {
            "use strict";

            /**
            * The layouter for the People Bar "callout" type
            */
            var CalloutLayouter = (function (_super) {
                __extends(CalloutLayouter, _super);
                function CalloutLayouter() {
                    _super.call(this);
                    this.cyBoardMargin = CalloutLayouter.cyBoardMargin / this.ZoomRatio;
                    this.cyTitleGap = CalloutLayouter.cyTitleGap / this.ZoomRatio;
                }
                /**
                * Overriding {@link BaseLayout#layoutExtra}
                */
                CalloutLayouter.prototype.layoutExtra = function () {
                    var root = d3.select(DataViz.Chart.defaultSVGRootId);
                    var boardHeight = (window.innerHeight || document.body.clientHeight) - 30;

                    if (!DataViz.Chart.isWindowBand) {
                        //boardWidth = $(DataViz.Chart.defaultSVGRootId).innerWidth();
                        boardHeight = $(DataViz.Chart.defaultSVGRootId).innerHeight();
                    }

                    //var titleElement = root.select("#title");
                    //if (titleElement.empty()) {
                    //    return;
                    //}

                    //var titleHeight = this.getTitleHeight(titleElement);
                    //titleElement.attr("y", this.cyBoardMargin + titleHeight);

                    var chartBackdrop = root.select("rect#chart-background");
                    if (chartBackdrop.empty()) {
                        return;
                    }

                    var chartY = 0; //this.cyBoardMargin  + this.cyTitleGap;
                    chartBackdrop.attr("x", 0).attr("y", chartY).attr("width", "100%").attr("height", boardHeight - this.cyTitleGap - this.cyBoardMargin * 2);

                    var chartRoot = root.select(DataViz.Chart.defaultChartRootId);
                    if (chartRoot.empty()) {
                        return;
                    }

                    chartRoot.attr("y", chartY).attr("height", boardHeight - chartY);

                    _super.prototype.injectPlaceholderForInnerSVG.call(this, chartRoot, "100%", boardHeight - chartY);
                };
                CalloutLayouter.cyBoardMargin = 0;
                CalloutLayouter.cyTitleGap = 16;
                return CalloutLayouter;
            })(DataViz.Chart.D3.BaseLayouter);
            D3.CalloutLayouter = CalloutLayouter;
        })(Chart.D3 || (Chart.D3 = {}));
        var D3 = Chart.D3;
    })(DataViz.Chart || (DataViz.Chart = {}));
    var Chart = DataViz.Chart;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/layout.ts"/>
///<reference path="layouter.base.d3.ts"/>

var DataViz;
(function (DataViz) {
    (function (Chart) {
        /**
        * This module contains the implementation of the layouter for the People Bar "classic" type
        */
        (function (D3) {
            "use strict";

            /**
            * The layouter for the People Bar "classic" type
            */
            var ClassicLayouter = (function (_super) {
                __extends(ClassicLayouter, _super);
                function ClassicLayouter() {
                    _super.call(this);
                    this.cyBoardMargin = ClassicLayouter.cyBoardMargin / this.ZoomRatio;
                    this.cyTitleGap = ClassicLayouter.cyTitleGap / this.ZoomRatio;
                }
                /**
                * Overriding {@link BaseLayout#layoutExtra}
                */
                ClassicLayouter.prototype.layoutExtra = function () {
                    var root = d3.select(DataViz.Chart.defaultSVGRootId);
                    var boardHeight = (window.innerHeight || document.body.clientHeight) - 30;

                    if (!DataViz.Chart.isWindowBand) {
                        //boardWidth = $(DataViz.Chart.defaultSVGRootId).innerWidth();
                        boardHeight = $(DataViz.Chart.defaultSVGRootId).innerHeight();
                    }

                    //var titleElement = root.select("#title");
                    //if (titleElement.empty()) {
                    //    return;
                    //}

                    //var titleHeight = this.getTitleHeight(titleElement);
                    //titleElement.attr("y", this.cyBoardMargin + titleHeight);

                    var chartBackdrop = root.select("rect#chart-background");
                    if (chartBackdrop.empty()) {
                        return;
                    }

                    var chartY = 0; //this.cyBoardMargin + this.cyTitleGap;
                    var chartHeight = boardHeight - this.cyTitleGap - this.cyBoardMargin * 2;
                    chartBackdrop.attr("x", 0).attr("y", chartY).attr("width", "100%").attr("height", chartHeight);

                    var chartRoot = root.select(DataViz.Chart.defaultChartRootId);
                    if (chartRoot.empty()) {
                        return;
                    }

                    chartRoot.attr("y", chartY).attr("height", chartHeight);

                    _super.prototype.injectPlaceholderForInnerSVG.call(this, chartRoot, "100%", chartHeight);
                };
                ClassicLayouter.cyBoardMargin = 8;
                ClassicLayouter.cyTitleGap = 24;
                return ClassicLayouter;
            })(DataViz.Chart.D3.BaseLayouter);
            D3.ClassicLayouter = ClassicLayouter;
        })(Chart.D3 || (Chart.D3 = {}));
        var D3 = Chart.D3;
    })(DataViz.Chart || (DataViz.Chart = {}));
    var Chart = DataViz.Chart;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/data.ts"/>
///<reference path="shared/utils.ts"/>

var DataViz;
(function (DataViz) {
    (function (Data) {
        /**
        * This module contains the implementation of the app's specific data binder
        */
        (function (Agave) {
            "use strict";

            /**
            * This is the app's specific data binder
            */
            var DataBinder = (function () {
                function DataBinder() {
                    var _this = this;
                    this.isDataBound = false;
                    this.bindingName = DataViz.Data.DefaultBindingName;
                    this.dataChangeListeners = [];
                    this.dataChangeHandler = function (eventArgs) {
                        _this.notifyDataChange();
                    };
                }
                /**
                * Implementing {@link ITool#resetTool}
                */
                DataBinder.prototype.resetTool = function () {
                    this.dataChangeListeners.length = 0;
                    this.detachHandler();
                    this.isDataBound = false;
                };

                /**
                * Implementing {@link IDataBinder#registerDataChangeListener}
                */
                DataBinder.prototype.registerDataChangeListener = function (listener) {
                    if (this.dataChangeListeners.indexOf(listener) === -1) {
                        this.dataChangeListeners.push(listener);
                    }
                };

                /**
                * Implementing {@link IDataBinder#unregisterDataChangeListener}
                */
                DataBinder.prototype.unregisterDataChangeListener = function (listener) {
                    DataViz.Utils.removeItemFromArray(this.dataChangeListeners, listener);
                };

                /**
                * Implementing {@link IDataBinder#bindByPrompt}
                */
                DataBinder.prototype.bindByPrompt = function (callback) {
                    this.bind(true, callback);
                };

                /**
                * Implementing {@link IDataBinder#bindBySelection}
                */
                DataBinder.prototype.bindBySelection = function (callback) {
                    this.bind(false, callback);
                };

                /**
                * Implementing {@link IDataBinder#Rebind}
                */
                DataBinder.prototype.rebind = function (callback) {
                    var _this = this;
                    Office.context.document.bindings.getByIdAsync(this.bindingName, function (result) {
                        if (result.status !== Office.AsyncResultStatus.Succeeded) {
                            if (callback) {
                                callback();
                            }

                            return;
                        }

                        if (DataViz.Utils.isOnWac()) {
                            _this.detachHandler();
                            _this.isDataBound = true;
                            _this.attachHandler(callback);
                        } else {
                            _this.detachHandler(function () {
                                _this.isDataBound = true;
                                _this.attachHandler(callback);
                            });
                        }
                        ;
                    });
                };

                /**
                * Implementing {@link IDataBinder#unbind}
                */
                DataBinder.prototype.unbind = function (callback) {
                    var _this = this;
                    if (DataViz.Utils.isOnWac()) {
                        this.detachHandler();
                        Office.context.document.bindings.releaseByIdAsync(this.bindingName, function (releaseBindResult) {
                            _this.isDataBound = false;

                            if (callback) {
                                callback();
                            }
                        });
                    } else {
                        this.detachHandler(function () {
                            Office.context.document.bindings.releaseByIdAsync(_this.bindingName, function (releaseBindResult) {
                                _this.isDataBound = false;

                                if (callback) {
                                    callback();
                                }
                            });
                        });
                    }
                };

                /**
                * Implementing {@link IDataBinder#getSelectedData}
                */
                DataBinder.prototype.getSelectedData = function (callback) {
                    Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix, { valueFormat: "unformatted", filterType: "onlyVisible" }, function (result) {
                        if (callback) {
                            callback(result.value);
                        }
                    });
                };

                /**
                * Implementing {@link IDataBinder#IsBound}
                */
                DataBinder.prototype.isBound = function () {
                    return this.isDataBound;
                };

                /**
                * Implementing {@link IDataBinder#getData}
                */
                DataBinder.prototype.getData = function (callback) {
                    DataViz.Validate.Validator.ensures(callback).from("DataBinder::getData").isNotNull();

                    var rawData = new DataViz.Data.RawData();
                    var selection = Office.select("bindings#" + this.bindingName, function (result) {
                        if (result.status !== Office.AsyncResultStatus.Succeeded) {
                            callback(null);
                        }
                    });

                    // get unformatted data first
                    selection.getDataAsync({ coercionType: Office.CoercionType.Matrix, valueFormat: Office.ValueFormat.Unformatted, filterType: Office.FilterType.OnlyVisible }, function (result) {
                        if (result.status === Office.AsyncResultStatus.Succeeded) {
                            rawData.unformatted = result.value;

                            // then get the formatted data
                            selection.getDataAsync({ coercionType: Office.CoercionType.Matrix, valueFormat: Office.ValueFormat.Formatted, filterType: Office.FilterType.OnlyVisible }, function (result) {
                                if (result.status === Office.AsyncResultStatus.Succeeded) {
                                    rawData.formatted = result.value;
                                    callback(rawData);
                                } else {
                                    callback(null);
                                }
                            });
                        } else {
                            callback(null);
                        }
                    });
                };

                DataBinder.prototype.bind = function (prompt, callback) {
                    var _this = this;
                    if (this.isDataBound) {
                        this.unbind(function () {
                            _this.bindInternal(prompt, callback);
                        });
                    } else {
                        this.bindInternal(prompt, callback);
                    }
                };

                DataBinder.prototype.bindInternal = function (prompt, callback) {
                    var _this = this;
                    var innerCallback = function (result) {
                        if (result.status !== Office.AsyncResultStatus.Succeeded) {
                            return;
                        }

                        _this.isDataBound = true;
                        _this.attachHandler(function () {
                            _this.notifyBindingTargetChange();

                            if (callback) {
                                callback(result);
                            }
                        });
                    };

                    if (prompt) {
                        Office.context.document.bindings.addFromPromptAsync(Office.BindingType.Matrix, { id: this.bindingName }, innerCallback);
                    } else {
                        Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Matrix, { id: this.bindingName }, innerCallback);
                    }
                };

                DataBinder.prototype.attachHandler = function (callback) {
                    //var _this = this;
                    //Office.select("bindings#" + this.bindingName).addHandlerAsync(Office.EventType.BindingDataChanged, this.dataChangeHandler, function (result) {
                    //    if (result.status !== Office.AsyncResultStatus.Succeeded) {
                    //        return;
                    //    }

                    //    _this.notifyDataChange();

                    //    if (callback) {
                    //        callback();
                    //    }
                    //});
                };

                DataBinder.prototype.detachHandler = function (callback) {
                    //Office.select("bindings#" + this.bindingName).removeHandlerAsync(Office.EventType.BindingDataChanged, { handler: this.dataChangeHandler }, function (removeHandlerResult) {
                    //    if (removeHandlerResult.status !== Office.AsyncResultStatus.Succeeded) {
                    //        // This is probably OK as it is possible that no handler has been previously attached
                    //    }

                    //    if (callback) {
                    //        callback();
                    //    }
                    //});
                };

                DataBinder.prototype.notifyDataChange = function () {
                    var _this = this;
                    this.getData(function (data) {
                        if (!data) {
                            return;
                        }

                        _this.dataChangeListeners.forEach(function (listener, index, array) {
                            listener.onDataChanged(data);
                        });
                    });
                };

                DataBinder.prototype.notifyBindingTargetChange = function () {
                    this.dataChangeListeners.forEach(function (listener, index, array) {
                        listener.onDataBindingTargetChanged();
                    });
                };
                return DataBinder;
            })();
            Agave.DataBinder = DataBinder;
        })(Data.Agave || (Data.Agave = {}));
        var Agave = Data.Agave;
    })(DataViz.Data || (DataViz.Data = {}));
    var Data = DataViz.Data;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/utils.ts"/>
///<reference path="shared/config.ts"/>

var DataViz;
(function (DataViz) {
    (function (Config) {
        /**
        * This module contains the implementation of the app's specific configurator
        */
        (function (Agave) {
            Agave.MaxRowNumber = 15;
            Agave.MaxColumnNumber = 2;

            /**
            * This is the app's specific configurator
            */
            var Configurator = (function () {
                function Configurator() {
                    this.reentryFlag = false;
                }
                /**
                * Implementing {@link ITool#resetTool}
                */
                Configurator.prototype.resetTool = function () {
                    // Do nothing.
                };

                /**
                * Implementing {@link IConfigurator#loadAll}
                */
                Configurator.prototype.loadAll = function (configuration) {
                    if (!Office.context.document.settings) {
                        return;
                    }

                    configuration.clear();

                    this.reentryFlag = true;
                    configuration.Keys.forEach(function (key, index, array) {
                        var value = Office.context.document.settings.get(key);
                        if ((value !== null) && (value !== undefined)) {
                            configuration.set(key, value);
                        }
                    });
                    this.reentryFlag = false;
                };

                /**
                * Implementing {@link IConfigurator#Save}
                */
                Configurator.prototype.save = function (key, value) {
                    if (Office.context.document.settings) {
                        Office.context.document.settings.set(key, value);
                        Office.context.document.settings.saveAsync();
                    }
                };

                /**
                * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
                */
                Configurator.prototype.onConfigurationChanged = function (key, value) {
                    if (!this.reentryFlag) {
                        this.save(key, value);
                    }
                };
                return Configurator;
            })();
            Agave.Configurator = Configurator;
        })(Config.Agave || (Config.Agave = {}));
        var Agave = Config.Agave;
    })(DataViz.Config || (DataViz.Config = {}));
    var Config = DataViz.Config;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    /**
    * This module contains the pre-defined SKU configs
    */
    (function (SKUs) {
        "use strict";

        var Predefines = (function () {
            function Predefines() {
            }
            Object.defineProperty(Predefines, "Instance", {
                get: function () {
                    if (!Predefines.instance) {
                        Predefines.instance = new Predefines;
                    }

                    return Predefines.instance;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Get all the definitions of SKUs
            * @returns {DataViz.SKUs.SKUDefinition[]} SKU definitions
            */
            Predefines.prototype.getAll = function () {
                var defs = new Array();
                defs.push(this.getGiantDefinition());
                defs.push(this.getCalloutDefinition());
                defs.push(this.getClassicDefinition());

                return defs;
            };

            Predefines.prototype.getGiantDefinition = function () {
                var def = new DataViz.SKUs.SKUDefinition();
                def.id = "peoplebar-giant";
                def.thumbnail = "../PeopleAssets/SKUs/peoplebar-giant.png";
                def.plotter = "DataViz.Chart.D3.PeopleBarGiantPlotterD3";
                def.layouter = "DataViz.Chart.D3.GiantLayouter";
                def.dataBinder = "DataViz.Data.Agave.DataBinder";
                def.dataConvertor = "DataViz.Data.PeopleBar.KeyValueDataConvertor";
                def.configurator = "DataViz.Config.Agave.Configurator";
                def.defaultTheme = "giant-redwhiteblack";
                def.defaultShape = "muscle-people";
                def.defaultLayout = "giant";

                var sampleData = {};
                sampleData["title"] = DataViz.Resources.SampleDataGaint.title;
                sampleData["data"] = [
                    [DataViz.Resources.SampleDataGaint.row1, "85000"],
                    [DataViz.Resources.SampleDataGaint.row2, "110000"],
                    [DataViz.Resources.SampleDataGaint.row3, "65000"]];
                def.sampleData = sampleData;

                return def;
            };

            Predefines.prototype.getCalloutDefinition = function () {
                var def = new DataViz.SKUs.SKUDefinition();
                def.id = "peoplebar-callout";
                def.thumbnail = "../PeopleAssets/SKUs/peoplebar-callout.png";
                def.plotter = "DataViz.Chart.D3.PeopleBarCalloutPlotterD3";
                def.layouter = "DataViz.Chart.D3.CalloutLayouter";
                def.dataBinder = "DataViz.Data.Agave.DataBinder";
                def.dataConvertor = "DataViz.Data.PeopleBar.KeyValueDataConvertor";
                def.configurator = "DataViz.Config.Agave.Configurator";
                def.defaultTheme = "callout-blackyellow";
                def.defaultShape = "muscle-people";
                def.defaultLayout = "callout";

                var sampleData = {};
                sampleData["title"] = DataViz.Resources.SampleDataCallout.title;
                sampleData["data"] = [
                    [DataViz.Resources.SampleDataCallout.row1, "150"],
                    [DataViz.Resources.SampleDataCallout.row2, "70"],
                    [DataViz.Resources.SampleDataCallout.row3, "90"]];
                def.sampleData = sampleData;

                return def;
            };

            Predefines.prototype.getClassicDefinition = function () {
                var def = new DataViz.SKUs.SKUDefinition();
                def.id = "peoplebar-classic";
                def.thumbnail = "../PeopleAssets/SKUs/peoplebar-classic.png";
                def.plotter = "DataViz.Chart.D3.PeopleBarClassicPlotterD3";
                def.layouter = "DataViz.Chart.D3.ClassicLayouter";
                def.dataBinder = "DataViz.Data.Agave.DataBinder";
                def.dataConvertor = "DataViz.Data.PeopleBar.KeyValueDataConvertor";
                def.configurator = "DataViz.Config.Agave.Configurator";
                def.defaultTheme = "classic-bluewhite";
                def.defaultShape = "muscle-people";
                def.defaultLayout = "classic";

                var sampleData = {};
                sampleData["title"] = DataViz.Resources.SampleDataClassic.title;
                sampleData["data"] = [
                    [DataViz.Resources.SampleDataClassic.row1, "160"],
                    [DataViz.Resources.SampleDataClassic.row2, "500"],
                    [DataViz.Resources.SampleDataClassic.row3, "948"]];
                def.sampleData = sampleData;

                return def;
            };
            Predefines.instance = null;
            return Predefines;
        })();
        SKUs.Predefines = Predefines;
    })(DataViz.SKUs || (DataViz.SKUs = {}));
    var SKUs = DataViz.SKUs;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */

var DataViz;
(function (DataViz) {
    (function (Resources) {
        "use strict";

        var UI = (function () {
            function UI() {
            }
            Object.defineProperty(UI, "backButtonTitle", {
                get: function () {
                	return OfficeLocalization.Resources.getResourceString("back");
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(UI, "floatMenuDataTitle", {
                get: function () {
                    return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(UI, "floatMenuSettingTitle", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(UI, "editTitle", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });
            return UI;
        })();
        Resources.UI = UI;

        var DataPane = (function () {
            function DataPane() {
            }
            Object.defineProperty(DataPane, "header", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DataPane, "selectButtonText", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DataPane, "editTitleLabel", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });
            return DataPane;
        })();
        Resources.DataPane = DataPane;

        var SettingPane = (function () {
            function SettingPane() {
            }
            Object.defineProperty(SettingPane, "header", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SettingPane, "typeTab", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SettingPane, "typeTitles", {
                get: function () {
                    return [
                        OfficeLocalization.Resources.getResourceString("type_1"),
                        OfficeLocalization.Resources.getResourceString("type_2"),
                        OfficeLocalization.Resources.getResourceString("type_3")
                    ];
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SettingPane, "themeTab", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SettingPane, "themeTitles", {
                get: function () {
                    return [
                        OfficeLocalization.Resources.getResourceString("theme_1"),
                        OfficeLocalization.Resources.getResourceString("theme_2"),
                        OfficeLocalization.Resources.getResourceString("theme_3"),
                        OfficeLocalization.Resources.getResourceString("theme_4"),
                        OfficeLocalization.Resources.getResourceString("theme_5"),
                        OfficeLocalization.Resources.getResourceString("theme_6"),
                        OfficeLocalization.Resources.getResourceString("theme_7")
                    ];
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SettingPane, "shapeTab", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SettingPane, "shapeTitles", {
                get: function () {
                    return [
                        OfficeLocalization.Resources.getResourceString("shape_1"),
                        OfficeLocalization.Resources.getResourceString("shape_2"),
                        OfficeLocalization.Resources.getResourceString("shape_3"),
                        OfficeLocalization.Resources.getResourceString("shape_4"),
                        OfficeLocalization.Resources.getResourceString("shape_5"),
                        OfficeLocalization.Resources.getResourceString("shape_6"),
                        OfficeLocalization.Resources.getResourceString("shape_7"),
                        OfficeLocalization.Resources.getResourceString("shape_8"),
                        OfficeLocalization.Resources.getResourceString("shape_9"),
                        OfficeLocalization.Resources.getResourceString("shape_10"),
                        OfficeLocalization.Resources.getResourceString("shape_11"),
                        OfficeLocalization.Resources.getResourceString("shape_12"),
                        OfficeLocalization.Resources.getResourceString("shape_13"),
                        OfficeLocalization.Resources.getResourceString("shape_14"),
                        OfficeLocalization.Resources.getResourceString("shape_15"),
                        OfficeLocalization.Resources.getResourceString("shape_16")
                    ];
                },
                enumerable: true,
                configurable: true
            });
            return SettingPane;
        })();
        Resources.SettingPane = SettingPane;

        var Notification = (function () {
            function Notification() {
            }
            Object.defineProperty(Notification, "dontShowAgain", {
                get: function () {
                	return OfficeLocalization.Resources.getResourceString("NotificationDontShowAgainButton");
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Notification, "extendAppToShowMore", {
                get: function () {
                	return OfficeLocalization.Resources.getResourceString("NotificationExtendAppToShowMore");
                },
                enumerable: true,
                configurable: true
            });
            return Notification;
        })();
        Resources.Notification = Notification;

        var SampleDataGaint = (function () {
            function SampleDataGaint() {
            }
            Object.defineProperty(SampleDataGaint, "title", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SampleDataGaint, "row1", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SampleDataGaint, "row2", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SampleDataGaint, "row3", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });
            return SampleDataGaint;
        })();
        Resources.SampleDataGaint = SampleDataGaint;

        var SampleDataCallout = (function () {
            function SampleDataCallout() {
            }
            Object.defineProperty(SampleDataCallout, "title", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SampleDataCallout, "row1", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SampleDataCallout, "row2", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SampleDataCallout, "row3", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });
            return SampleDataCallout;
        })();
        Resources.SampleDataCallout = SampleDataCallout;

        var SampleDataClassic = (function () {
            function SampleDataClassic() {
            }
            Object.defineProperty(SampleDataClassic, "title", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SampleDataClassic, "row1", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SampleDataClassic, "row2", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SampleDataClassic, "row3", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });
            return SampleDataClassic;
        })();
        Resources.SampleDataClassic = SampleDataClassic;

        var Pluralization = (function () {
            function Pluralization() {
            }
            Object.defineProperty(Pluralization, "rows", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Pluralization, "columns", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });
            return Pluralization;
        })();
        Resources.Pluralization = Pluralization;

        var BindingPane = (function () {
            function BindingPane() {
            }
            Object.defineProperty(BindingPane, "infoNormal", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "infoMaxRow", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "infoMaxColumn", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "infoMaxRowAndColumn", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "infoDataSetTooLarge", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "infoFirstRowEmpty", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "infoFirstColumnEmpty", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "infoSelectData", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "infoSelectTwoColumns", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "infoSecondColumnContainNumber", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "title", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "subtitle", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "buttonOKText", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BindingPane, "buttonCancelText", {
                get: function () {
                	return "";
                },
                enumerable: true,
                configurable: true
            });
            return BindingPane;
        })();
        Resources.BindingPane = BindingPane;
    })(DataViz.Resources || (DataViz.Resources = {}));
    var Resources = DataViz.Resources;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="../../logic/shared/utils.ts"/>

var DataViz;
(function (DataViz) {
    (function (UX) {
        UX.infoColors = {
            red: "#a80f22",
            green: "#217346"
        };

        /**
        * This class is the Data Binding Dialog UI.
        */
        var BindingPane = (function () {
            /**
            * Constructor
            */
            function BindingPane() {
                var _this = this;
                this.zoomRatio = 1;
                $("body").append($("<div/>", { id: "binding-pane-dim", "class": "binding-dim-style" })).append($("<div/>", { id: "binding-pane", "class": "binding-pane-style" }).append($("<span/>", { id: "binding-pane-title-span", "class": "binding-pane-title-style" })).append($("<div/>", { id: "subtitle", "class": "binding-pane-subtitle-style" })).append($("<div/>", { id: "sample-data-pane", "class": "sample-data-pane-style" })).append($("<div/>", { id: "binding-pane-info-text", "class": "binding-pane-info-text-style" })).append($("<div/>", { id: "button-group", "class": "button-group" }).append($("<button/>", { id: "binding-pane-cancel", "class": "button button-white binding-pane-cancel" })).append($("<button/>", { id: "binding-pane-ok", "class": "button button-green binding-pane-ok" }))));

                this.bindingPaneDim = $("#binding-pane-dim");
                this.bindingPane = $("#binding-pane");
                this.titleSpan = $("#binding-pane-title-span");
                this.subtitle = $("#subtitle");
                this.sampleDataPane = $("#sample-data-pane");
                this.infoText = $("#binding-pane-info-text");
                this.buttonGroup = $("#button-group");
                this.buttonCancel = $("#binding-pane-cancel");
                this.buttonOk = $("#binding-pane-ok");

                this.resizeHandler = function () {
                    _this.resetPaneContentPosition();
                };

                DataViz.Utils.setTabFocus("binding-pane-content", "binding-pane-cancel", "binding-pane-cancel");
                this.args = {};
            }
            /**
            * Use new arguments to update the Data Binding UI and its event handlers.
            * @param {BindingPaneArgs} args The arguments used to update the binding pane
            */
            BindingPane.prototype.updateBindingPane = function (args) {
                if (args) {
                    this.updateArgs(args);
                    this.handleArgs();
                }

                this.zoomBindingPane();
                return this;
            };

            BindingPane.prototype.zoomBindingPane = function () {
                this.zoomRatio = DataViz.Utils.getZoomRatioForApp();
                this.bindingPaneElementsStyle = {};
                this.handleStyleInHDPI("bindingPane", ["binding-pane-style"]), this.handleStyleInHDPI("title", ["binding-pane-title-style"]), this.handleStyleInHDPI("subtitle", ["binding-pane-subtitle-style"]), this.handleStyleInHDPI("sampleDataPane", ["sample-data-pane-style"]), this.handleStyleInHDPI("infoText", ["binding-pane-info-text-style"]), this.handleStyleInHDPI("buttonGroup", ["button-group"]), this.handleStyleInHDPI("cancel", ["button", "binding-pane-cancel"]), this.handleStyleInHDPI("ok", ["button", "binding-pane-ok"]), this.handleStyleInHDPI("td", ["td"]), this.bindingPane.css(this.bindingPaneElementsStyle.bindingPane);
                this.titleSpan.css(this.bindingPaneElementsStyle.title);
                this.subtitle.css(this.bindingPaneElementsStyle.subtitle);
                this.sampleDataPane.css(this.bindingPaneElementsStyle.sampleDataPane);
                this.infoText.css(this.bindingPaneElementsStyle.infoText);
                this.buttonGroup.css(this.bindingPaneElementsStyle.buttonGroup);
                this.buttonCancel.css(this.bindingPaneElementsStyle.cancel);
                this.buttonOk.css(this.bindingPaneElementsStyle.ok);

                if (this.td[0]) {
                    this.td.css(this.bindingPaneElementsStyle.td);
                }

                return this;
            };

            /**
            * Show the Data Binding UI.
            */
            BindingPane.prototype.show = function () {
                var _this = this;
                this.bindingData = null;
                $(window).on("resize", this.resizeHandler);
                this.bindingPaneDim.fadeIn("fast");
                this.buttonOk.attr("disabled", "disabled");
                if (this.selectionChangeHandler) {
                    this.selectionChangeHandler();
                    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, this.selectionChangeHandler);
                }

                this.resetPaneContentPosition();
                this.bindingPane.fadeIn("fast", function () {
                    _this.buttonCancel.focus();
                });
            };

            /**
            * Hide the Data Binding UI.
            */
            BindingPane.prototype.hide = function () {
                $(window).off("resize", this.resizeHandler);
                if (this.selectionChangeHandler) {
                    Office.context.document.removeHandlerAsync(Office.EventType.DocumentSelectionChanged, { handler: this.selectionChangeHandler });
                }

                this.bindingPane.fadeOut("fast");
                this.bindingPaneDim.fadeOut("fast");
            };

            /**
            * Identify whether the string is numeric
            * @param {string} str The string need to be identified
            * @returns True if the string is numeric; false otherwise
            */
            BindingPane.prototype.setInfoTextAndButton = function (text, textColor, buttonEnable) {
                this.infoText.text(text);
                this.infoText.css("color", textColor);
                if (buttonEnable) {
                    DataViz.Utils.setTabFocus("binding-pane", "binding-pane-cancel", "binding-pane-ok");
                    if (this.buttonOk.attr("disabled")) {
                        this.buttonOk.removeAttr("disabled");
                    }
                } else {
                    DataViz.Utils.setTabFocus("binding-pane", "binding-pane-cancel", "binding-pane-cancel");
                    if (!this.buttonOk.attr("disabled")) {
                        this.buttonOk.attr("disabled", "disabled");
                    }
                }
            };

            Object.defineProperty(BindingPane.prototype, "bindingData", {
                get: function () {
                    return this.selectedData;
                },
                set: function (data) {
                    this.selectedData = data;
                },
                enumerable: true,
                configurable: true
            });


            BindingPane.prototype.handleDataSelection = function () {
                // Implemented in sub-classes
            };

            BindingPane.prototype.updateArgs = function (args) {
                this.args.sampleData = args.sampleData ? args.sampleData : BindingPane.defaultArgs.sampleData;
                this.args.handleDataSelection = args.handleDataSelection ? args.handleDataSelection : BindingPane.defaultArgs.handleDataSelection;
                this.args.buttonOKCallback = args.buttonOKCallback ? args.buttonOKCallback : BindingPane.defaultArgs.buttonOKCallback;
                this.args.buttonCancelCallback = args.buttonCancelCallback ? args.buttonCancelCallback : BindingPane.defaultArgs.buttonCancelCallback;
                this.args.title = args.title ? args.title : BindingPane.defaultArgs.title;
                this.args.subtitle = args.subtitle ? args.subtitle : BindingPane.defaultArgs.subtitle;
                this.args.infoText = args.infoText ? args.infoText : BindingPane.defaultArgs.infoText;
                this.args.buttonOKText = args.buttonOKText ? args.buttonOKText : BindingPane.defaultArgs.buttonOKText;
                this.args.buttonCancelText = args.buttonCancelText ? args.buttonCancelText : BindingPane.defaultArgs.buttonCancelText;
            };

            BindingPane.prototype.handleArgs = function () {
                var _this = this;
                this.setSampleData(this.args.sampleData);
                this.titleSpan.text(this.args.title);
                this.subtitle.text(this.args.subtitle);
                this.infoText.text(this.args.infoText);
                this.buttonOk.text(this.args.buttonOKText);
                this.buttonCancel.text(this.args.buttonCancelText);

                if (this.args.handleDataSelection) {
                    this.selectionChangeHandler = function () {
                        _this.args.handleDataSelection();
                    };
                } else {
                    this.selectionChangeHandler = null;
                }

                this.setEventHandler(this.args.buttonOKCallback, this.args.buttonCancelCallback);
            };

            BindingPane.prototype.setEventHandler = function (funcOK, funcCancel) {
                var _this = this;
                this.buttonOk.off("click");
                this.buttonOk.click(function () {
                    _this.hide();

                    if (funcOK) {
                        funcOK(_this.bindingData);
                    }
                });

                this.buttonCancel.off("click");
                this.buttonCancel.click(function () {
                    _this.hide();
                });
            };

            BindingPane.prototype.setSampleData = function (sampleData) {
                if ($("#sample-table")[0]) {
                    $("#sample-table").remove();
                }

                if (sampleData) {
                    this.sampleDataPane.append($("<table/>", { id: "sample-table" }));
                    var rowNumber = Math.min(sampleData.length, BindingPane.sampleDataMaxRowNumber);
                    for (var i = 0; i < rowNumber; i++) {
                        $("<tr/>", { id: "tr" + i }).appendTo("#sample-table");
                        for (var j = 0; j < sampleData[0].length; j++) {
                            $("<td/>", { text: sampleData[i][j] }).appendTo("#tr" + i);
                        }
                    }

                    this.td = $("td");
                }
            };

            BindingPane.prototype.resetPaneContentPosition = function () {
                this.zoomBindingPane();
                this.bindingPane.css("top", (window.innerHeight - this.bindingPane.height()) / 2);
            };

            BindingPane.prototype.handleStyleInHDPI = function (elementId, classNameArray) {
                if (!classNameArray) {
                    return;
                }

                var elementStyle = {};
                for (var i = 0; i < classNameArray.length; i++) {
                    var styleArray = BindingPane.bindingPaneStyle[classNameArray[i]];
                    if (!styleArray || !styleArray[0]) {
                        return;
                    }

                    for (var j = 0; j < styleArray.length; j++) {
                        if (styleArray[j] && styleArray[j][0] && styleArray[j][1]) {
                            elementStyle[styleArray[j][0]] = (parseFloat(styleArray[j][1]) / this.zoomRatio).toFixed(2) + "px";
                        }
                    }

                    this.bindingPaneElementsStyle[elementId] = elementStyle;
                }
            };
            BindingPane.bindingPaneStyle = {
                "binding-pane-style": [["min-width", "400"]],
                "binding-pane-title-style": [["top", "17"], ["margin-left", "30"], ["font-size", "20"]],
                "binding-pane-subtitle-style": [["margin-top", "38"], ["margin-left", "30"], ["font-size", "12"]],
                "sample-data-pane-style": [["margin-top", "15"], ["margin-left", "30"], ["min-width", "180"]],
                "binding-pane-info-text-style": [["margin-top", "20"], ["margin-left", "30"], ["font-size", "12"], ["line-height", "12"]],
                "button-group": [["height", "30"], ["margin-top", "20"], ["margin-bottom", "20"]],
                "button": [["font-size", "14"], ["min-width", "80"], ["max-width", "200"], ["height", "30"], ["padding-left", "20"], ["padding-right", "20"], ["line-height", "14"]],
                "binding-pane-cancel": [["margin-right", "20"]],
                "binding-pane-ok": [["margin-right", "10"]],
                "td": [["font-size", "12"], ["height", "18"], ["padding-left", "10"], ["padding-right", "10"]]
            };
            BindingPane.sampleDataMaxRowNumber = 5;
            BindingPane.defaultArgs = {
                sampleData: null,
                handleDataSelection: null,
                buttonOKCallback: null,
                buttonCancelCallback: null,
                title: "Select your data to create a chart",
                subtitle: "SAMPLE DATA",
                infoText: "",
                buttonOKText: "Create",
                buttonCancelText: "Cancel"
            };
            return BindingPane;
        })();
        UX.BindingPane = BindingPane;
    })(DataViz.UX || (DataViz.UX = {}));
    var UX = DataViz.UX;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="shared/BindingPane.ts"/>
///<reference path="../logic/configurator.agave.ts"/>
///<reference path="../strings/stringadapter.ts"/>

var DataViz;
(function (DataViz) {
    (function (UX) {
        var BindingPaneSpecific = (function (_super) {
            __extends(BindingPaneSpecific, _super);
            function BindingPaneSpecific() {
                _super.apply(this, arguments);
            }
            /**
            * Get the singleton instance.
            */
            BindingPaneSpecific.getInstance = function () {
                if (!BindingPaneSpecific.instance) {
                    BindingPaneSpecific.instance = new BindingPaneSpecific();
                }

                return BindingPaneSpecific.instance;
            };

            BindingPaneSpecific.prototype.handleDataSelection = function () {
                var _this = this;
                Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix, { valueFormat: Office.ValueFormat.Unformatted, filterType: Office.FilterType.OnlyVisible }, function (result) {
                    if (result.status === Office.AsyncResultStatus.Succeeded) {
                        _this.bindingData = result.value;

                        if (result.value[0].length < 2) {
                            _this.setInfoTextAndButton(DataViz.Resources.BindingPane.infoSelectTwoColumns, DataViz.UX.infoColors.red, false);
                        } else if (!_this.isFirstColumnNonEmpty(result.value)) {
                            _this.setInfoTextAndButton(DataViz.Resources.BindingPane.infoFirstColumnEmpty, DataViz.UX.infoColors.red, false);
                        } else if (!_this.isSecondColumnHasNumber(result.value)) {
                            _this.setInfoTextAndButton(DataViz.Resources.BindingPane.infoSecondColumnContainNumber, DataViz.UX.infoColors.red, false);
                        } else if (!_this.isFirstRowNonEmpty(result.value)) {
                            _this.setInfoTextAndButton(DataViz.Resources.BindingPane.infoFirstRowEmpty, DataViz.UX.infoColors.red, false);
                        } else {
                            var rowCount = result.value.length;
                            var columnCount = result.value[0].length;
                            var rowString = _this.getPluralString(DataViz.Resources.Pluralization.rows, rowCount);
                            var columnString = _this.getPluralString(DataViz.Resources.Pluralization.columns, columnCount);
                            var maxRowString = _this.getPluralString(DataViz.Resources.Pluralization.rows, DataViz.Config.Agave.MaxRowNumber);
                            var maxColumnString = _this.getPluralString(DataViz.Resources.Pluralization.columns, DataViz.Config.Agave.MaxColumnNumber);

                            var infoString = "";
                            if (rowCount > DataViz.Config.Agave.MaxRowNumber && columnCount > DataViz.Config.Agave.MaxColumnNumber) {
                                infoString = DataViz.Utils.stringFormat(DataViz.Resources.BindingPane.infoMaxRowAndColumn, rowCount, rowString, columnCount, columnString, DataViz.Config.Agave.MaxRowNumber, maxRowString, DataViz.Config.Agave.MaxColumnNumber, maxColumnString);
                            } else if (rowCount > DataViz.Config.Agave.MaxRowNumber && columnCount <= DataViz.Config.Agave.MaxColumnNumber) {
                                infoString = DataViz.Utils.stringFormat(DataViz.Resources.BindingPane.infoMaxRow, rowCount, rowString, columnCount, columnString, DataViz.Config.Agave.MaxRowNumber, maxRowString);
                            } else if (rowCount <= DataViz.Config.Agave.MaxRowNumber && columnCount > DataViz.Config.Agave.MaxColumnNumber) {
                                infoString = DataViz.Utils.stringFormat(DataViz.Resources.BindingPane.infoMaxColumn, rowCount, rowString, columnCount, columnString, DataViz.Config.Agave.MaxColumnNumber, maxColumnString);
                            } else {
                                infoString = DataViz.Utils.stringFormat(DataViz.Resources.BindingPane.infoNormal, rowCount, rowString, columnCount, columnString);
                            }

                            _this.setInfoTextAndButton(infoString, DataViz.UX.infoColors.green, true);
                        }
                    } else if (result.error.code === 1008) {
                        _this.setInfoTextAndButton(DataViz.Resources.BindingPane.infoDataSetTooLarge, DataViz.UX.infoColors.red, false);
                    } else {
                        _this.setInfoTextAndButton(DataViz.Resources.BindingPane.infoSelectData, DataViz.UX.infoColors.red, false);
                    }
                });
            };

            BindingPaneSpecific.prototype.isFirstColumnNonEmpty = function (value) {
                if (!value) {
                    return false;
                }

                for (var i = 0; i < value.length; i++) {
                    if (value[i] && this.isDataValid(value[i][0])) {
                        return true;
                    }
                }

                return false;
            };

            BindingPaneSpecific.prototype.isSecondColumnHasNumber = function (value) {
                if (!value) {
                    return false;
                }

                for (var i = 0; i < value.length; i++) {
                    if (value[i] && this.isDataValid(value[i][1]) && !isNaN(parseFloat(value[i][1]))) {
                        return true;
                    }
                }

                return false;
            };

            BindingPaneSpecific.prototype.isFirstRowNonEmpty = function (value) {
                if (!value || !value[0]) {
                    return false;
                }

                for (var i = 0; i < value[0].length; i++) {
                    if (this.isDataValid(value[0][i])) {
                        return true;
                    }
                }

                return false;
            };

            BindingPaneSpecific.prototype.isDataValid = function (data) {
                return (data !== null) && (data !== undefined) && (data.toString().trim() !== "");
            };

            //This method is for en-us culture only.
            BindingPaneSpecific.prototype.getPluralString = function (combinedStr, count) {
                var pluralStringArray = combinedStr.split("||");
                if (pluralStringArray.length !== 2) {
                    throw "Error: Provided string variations do not match expected amount";
                }

                return count === 1 ? pluralStringArray[0] : pluralStringArray[1];
            };
            return BindingPaneSpecific;
        })(UX.BindingPane);
        UX.BindingPaneSpecific = BindingPaneSpecific;
    })(DataViz.UX || (DataViz.UX = {}));
    var UX = DataViz.UX;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="../../logic/shared/config.ts"/>
///<reference path="../../logic/shared/skus.ts"/>
///<reference path="../../logic/shared/decoration.ts"/>
///<reference path="../../app.ts"/>

var DataViz;
(function (DataViz) {
    (function (UX) {
        /**
        * This modules contains the implementation of the galleries
        */
        (function (Shared) {
            

            /**
            * The base class of all the gallery classes
            */
            var BaseGallery = (function () {
                function BaseGallery(parentId, iconStyle, configurationKey) {
                    this.parentId = parentId;
                    this.iconStyle = iconStyle;
                    this.configurationKey = configurationKey;
                    this.reentryFlag = false;
                }
                /**
                * Sets up the listeners
                */
                BaseGallery.prototype.setupListener = function () {
                    DataViz.mainApp.Configuration.registerListener(this);
                };

                /**
                * Populates the gallery
                */
                BaseGallery.prototype.populate = function (iconNames, hostSelector) {
                    this.refreshList();

                    var currentWidth = 0;
                    var marginTopFromParent = this.iconStyle.marginTop;

                    $(hostSelector + " > img").remove();

                    for (var index = 0; index < this.icons.length; index++) {
                        $(hostSelector).append("<img id=" + this.icons[index].id + " src=" + this.icons[index].thumbnail + " style= cursor: pointer; position:absolute'; class ='gallery-item';" + "alt='" + iconNames[index] + "' title='" + iconNames[index] + "' tabindex='1';/>");
                       
                        this.setIconClickListener(this.icons[index].id, index);
                    }

                    this.updatePaneBorder(this.currentIconId);
                };

                /**
                * Refreshes the list of the backed customizable items
                * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                */
                BaseGallery.prototype.refreshList = function () {
                    // Implement in sub-classes
                };

                /**
                * Implementing {@link IConfigurationChangeListener#onConfigurationChanged}
                */
                BaseGallery.prototype.onConfigurationChanged = function (key, value) {
                    if ((key === this.configurationKey) && !this.reentryFlag) {
                        this.currentIconId = value;
                    }
                };

                BaseGallery.prototype.updatePaneBorder = function (iconId) {
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

                BaseGallery.prototype.setIconClickListener = function (iconId, index) {
                    var _this = this;
                    $("#" + iconId).off("click");
                    $("#" + iconId).data("iconIndex", index).click(function (event) {
                        _this.iconClickAction(event, index);
                    }).keydown(function (event) {
                        if (event.which === 13) {
                            _this.iconClickAction(event, index);
                        }
                    });
                };

                BaseGallery.prototype.iconClickAction = function (event, index) {
                    var iconIndex = $(event.target).data("iconIndex");
                    var iconId = this.icons[iconIndex].id;
                    this.updatePaneBorder(iconId);
                    this.apply(iconId);
                };

                BaseGallery.prototype.apply = function (iconId) {
                    this.reentryFlag = true;
                    DataViz.mainApp.Configuration.set(this.configurationKey, iconId);
                    this.reentryFlag = false;
                };
                return BaseGallery;
            })();
            Shared.BaseGallery = BaseGallery;

            /**
            * The theme gallery
            */
            var ThemeGallery = (function (_super) {
                __extends(ThemeGallery, _super);
                /* private */ function ThemeGallery(parentId, iconStyle, configurationKey) {
                    _super.call(this, parentId, iconStyle, configurationKey);
                }
                /**
                * Builds and returns a theme gallery instance
                * @returns {ThemeGallery} A theme gallery instance
                */
                ThemeGallery.build = function () {
                    return new ThemeGallery("theme-pane", { marginLeft: 10, marginTop: 10, width: 90, height: 40 }, DataViz.Config.wellKnownKeys.theme);
                };

                /**
                * Overriding {@link BaseGallery#refreshList}
                */
                ThemeGallery.prototype.refreshList = function () {
                    this.icons = DataViz.Decoration.ThemeProvider.Instance.enumerateForSku(DataViz.SKUs.SKUProvider.Instance.CurrentSKUId);
                    this.currentIconId = DataViz.Decoration.ThemeProvider.Instance.CurrentThemeId;
                };
                return ThemeGallery;
            })(UX.Shared.BaseGallery);
            Shared.ThemeGallery = ThemeGallery;

            /**
            * The shape gallery
            */
            var ShapeGallery = (function (_super) {
                __extends(ShapeGallery, _super);
                /* private */ function ShapeGallery(parentId, iconStyle, configurationKey) {
                    _super.call(this, parentId, iconStyle, configurationKey);
                }
                /**
                * Builds and returns a shape gallery instance
                * @returns {ShapeGallery} A shape gallery instance
                */
                ShapeGallery.build = function () {
                    return new ShapeGallery("shape-pane", { marginLeft: 10, marginTop: 10, width: 40, height: 40 }, DataViz.Config.wellKnownKeys.shape);
                };

                /**
                * Overriding {@link BaseGallery#refreshList}
                */
                ShapeGallery.prototype.refreshList = function () {
                    this.icons = DataViz.Decoration.ShapeProvider.Instance.enumerateForSku(DataViz.SKUs.SKUProvider.Instance.CurrentSKUId);
                    this.currentIconId = DataViz.Decoration.ShapeProvider.Instance.CurrentShapeId;
                };
                return ShapeGallery;
            })(UX.Shared.BaseGallery);
            Shared.ShapeGallery = ShapeGallery;

            /**
            * The chart type (SKU) gallery
            */
            var TypeGallery = (function (_super) {
                __extends(TypeGallery, _super);
                /* private */ function TypeGallery(parentId, iconStyle, configurationKey) {
                    _super.call(this, parentId, iconStyle, configurationKey);
                }
                /**
                * Builds and returns a chart type (SKU) gallery instance
                * @returns {TypeGallery} A chart type gallery instance
                */
                TypeGallery.build = function () {
                    return new TypeGallery("type-pane", { marginLeft: 10, marginTop: 10, width: 190, height: 80 }, DataViz.Config.wellKnownKeys.sku);
                };

                /**
                * Overriding {@link BaseGallery#refreshList}
                */
                TypeGallery.prototype.refreshList = function () {
                    this.icons = DataViz.SKUs.SKUProvider.Instance.SKUs;
                    this.currentIconId = DataViz.SKUs.SKUProvider.Instance.CurrentSKUId;
                };
                return TypeGallery;
            })(UX.Shared.BaseGallery);
            Shared.TypeGallery = TypeGallery;
        })(UX.Shared || (UX.Shared = {}));
        var Shared = UX.Shared;
    })(DataViz.UX || (DataViz.UX = {}));
    var UX = DataViz.UX;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="../app.ts"/>
///<reference path="shared/Galleries.ts"/>

var DataViz;
(function (DataViz) {
    (function (UX) {
        var SettingPane = (function () {
            function SettingPane() {
                var _this = this;
                this.currentButtonId = "type-button";
                this.menuButtonMap = [
                    { buttonId: "type-button", paneId: "type-pane" },
                    { buttonId: "theme-button", paneId: "theme-pane" },
                    { buttonId: "shape-button", paneId: "shape-pane" }
                ];
                this.buttonMap = {
                    "type-button": "type-pane",
                    "theme-button": "theme-pane",
                    "shape-button": "shape-pane"
                };
                $("#setting-pane-title").text(DataViz.Resources.SettingPane.header);
                $("#type-button").text(DataViz.Resources.SettingPane.typeTab);
                $("#theme-button").text(DataViz.Resources.SettingPane.themeTab);
                $("#shape-button").text(DataViz.Resources.SettingPane.shapeTab);

                $("#setting-pane").off("click");
                $("#setting-pane").click(function () {
                    $("#back-button").focus();
                });

                var backButton = $("#back-button");
                backButton.attr("alt", DataViz.Resources.UI.backButtonTitle);
                backButton.attr("title", DataViz.Resources.UI.backButtonTitle);
                backButton.off("click");
                backButton.click(function () {
                    _this.hide();
                }).keydown(function (event) {
                    // Check the enter key.
                    if (event.which === 13) {
                        _this.hide();
                    }
                });

                this.typeGallery = UX.Shared.TypeGallery.build();
                this.themeGallery = UX.Shared.ThemeGallery.build();
                this.shapeGallery = UX.Shared.ShapeGallery.build();

                this.setMenuClickListener();

                this.showInternalPane("type-pane");
                $("#" + this.buttonMap[this.currentButtonId]).hide();
            }
            SettingPane.prototype.setupListeners = function () {
                this.typeGallery.setupListener();
                this.themeGallery.setupListener();
                this.shapeGallery.setupListener();
            };

            Object.defineProperty(SettingPane, "Instance", {
                get: function () {
                    if (!SettingPane.theInstance) {
                        SettingPane.theInstance = new SettingPane();
                    }

                    return SettingPane.theInstance;
                },
                enumerable: true,
                configurable: true
            });

            SettingPane.prototype.show = function () {
                //var _this = this;
                //$("#setting-pane").show();
                //$("#setting-pane").animate({ width: "220px", height: "100%", float: "right" }, "fast", null, function () {
                //    $("#" + _this.buttonMap[_this.currentButtonId]).fadeIn();
                //});
                //$("#" + this.currentButtonId).focus();
            };

            SettingPane.prototype.hide = function () {
                //if ($("#setting-pane")[0].style.width > "0 px") {
                //    $("#" + this.buttonMap[this.currentButtonId]).hide();
                //    $("#setting-pane").animate({ width: "0px", height: "100%", float: "right" }, "fast", null, function () {
                //        $("#setting-pane").hide();
                //    });
                //}
            };

            SettingPane.prototype.populate = function (options) {
                this.typeGallery.populate(DataViz.Resources.SettingPane.typeTitles, options.type);
                this.themeGallery.populate(DataViz.Resources.SettingPane.themeTitles, options.theme);
                this.shapeGallery.populate(DataViz.Resources.SettingPane.shapeTitles, options.shape);
            };

            SettingPane.prototype.setMenuClickListener = function () {
                var _this = this;
                var thisSettingPane = this;
                for (var index = 0; index < this.menuButtonMap.length; index++) {
                    $("#" + this.menuButtonMap[index].buttonId).off("click");
                    $("#" + this.menuButtonMap[index].buttonId).data("menuButtonIndex", index).mousedown(function (event) {
                        $(this).animate({
                            paddingTop: "1px"
                        }, "fast");
                        thisSettingPane.menuClickAction(event);
                    }).mouseup(function (event) {
                        $(this).animate({
                            paddingTop: "0"
                        }, "fast");
                    }).keydown(function (event) {
                        if (event.which === 13) {
                            _this.menuClickAction(event);
                        }
                    });
                }
            };

            SettingPane.prototype.menuClickAction = function (event) {
                var menuButtonIndex = $(event.target).data("menuButtonIndex");
                this.showInternalPane(this.menuButtonMap[menuButtonIndex].paneId);
            };

            SettingPane.prototype.showInternalPane = function (paneId) {
                var _this = this;
                for (var index = 0; index < this.menuButtonMap.length; index++) {
                    if (this.menuButtonMap[index].paneId === paneId) {
                        this.currentButtonId = this.menuButtonMap[index].buttonId;
                        $("#" + this.menuButtonMap[index].paneId).fadeIn("fast", function () {
                            $("#" + _this.currentButtonId).addClass("sub-title-click");
                            var lastItemId = $("#" + paneId).children().last().attr("id");
                            DataViz.Utils.setTabFocus("setting-pane", "back-button", lastItemId);
                        });
                    } else {
                        $("#" + this.menuButtonMap[index].paneId).hide();
                        $("#" + this.menuButtonMap[index].buttonId).removeClass("sub-title-click");
                    }
                }
            };
            return SettingPane;
        })();
        UX.SettingPane = SettingPane;
    })(DataViz.UX || (DataViz.UX = {}));
    var UX = DataViz.UX;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="../app.ts"/>

var DataViz;
(function (DataViz) {
    (function (UX) {
        var DataPane = (function () {
            function DataPane() {
                this.timeoutId = null;
                this.reentryFlag = false;

                this.init();
            }
            Object.defineProperty(DataPane, "Instance", {
                get: function () {
                    if (!DataPane.theInstance) {
                        DataPane.theInstance = new DataPane();
                    }

                    return DataPane.theInstance;
                },
                enumerable: true,
                configurable: true
            });

            DataPane.prototype.onLayoutChanged = function (layout) {
            };

            DataPane.prototype.onLayoutElementChanged = function (layoutElement) {
            };

            DataPane.prototype.onLayoutElementInstanceChanged = function (layoutElement, value) {
                if (this.reentryFlag) {
                    return;
                }

                switch (layoutElement.id) {
                    case "title":
                        $("#edit-title").text(value);
                        break;
                }
            };

            DataPane.prototype.setupListeners = function () {
                DataViz.mainApp.LayoutInstance.registerListener(this);
            };

            DataPane.prototype.show = function (isFocusOnTitle) {
                //$("#data-pane").show();
                //$("#data-pane").animate({ width: "220px", height: "100%", float: "right" }, "fast", null, function () {
                //    if (isFocusOnTitle && $("#edit-title")[0]) {
                //        try  {
                //            $("#edit-title")[0].select();
                //        } catch (e) {
                //            // do nothing
                //        }
                //    }

                //    $("#edit-title").focus();
                //});
            };

            DataPane.prototype.hide = function () {
                //if ($("#data-pane")[0].style.width > "0 px") {
                //    $("#data-pane").animate({ width: "0px", height: "100%", float: "right" }, "fast", null, function () {
                //        $("#data-pane").hide();
                //    });
                //}
            };

            DataPane.prototype.init = function () {
                //this.setText();
                //this.setEventHandlers();
                //DataViz.Utils.setTabFocus("data-pane", "data-back-button", "edit-title");
            };

            DataPane.prototype.setText = function () {
                //$("#data-back-button").attr("alt", DataViz.Resources.UI.backButtonTitle);
                //$("#data-back-button").attr("title", DataViz.Resources.UI.backButtonTitle);
                //$("#data-pane-title").text(DataViz.Resources.DataPane.header);
                //$("#select-data").text(DataViz.Resources.DataPane.selectButtonText);
                //$("#edit-title-label").text(DataViz.Resources.DataPane.editTitleLabel);
            };

            DataPane.prototype.setEventHandlers = function () {
                var _this = this;
                $("#data-back-button").off("click");
                $("#data-back-button").click(function () {
                    _this.hide();
                }).keydown(function (event) {
                    // Check the enter key.
                    if (event.which === 13) {
                        _this.hide();
                    }
                });

                $("#select-data").off("click");
                $("#select-data").click(function () {
                    DataViz.mainApp.bindData();
                }).keydown(function (event) {
                    // Check the enter key.
                    if (event.which === 13) {
                        DataViz.mainApp.bindData();
                    }
                });

                var inputHandler = function () {
                    _this.reentryFlag = true;
                    _this.titleChanged = true;
                    //var titleElement = $("#edit-title")[0];
                    //$("#title").text(titleElement.value);

                    if (_this.timeoutId) {
                        clearTimeout(_this.timeoutId);
                    }

                    _this.timeoutId = setTimeout(function () {
                        //DataViz.mainApp.LayoutInstance.setValue("title", titleElement.value);
                        _this.timeoutId = null;
                    }, 100);
                    _this.reentryFlag = false;
                };

                $("#edit-title").unbind("input");
                $("#edit-title").bind("input", inputHandler);

                // IE9 doesn't fire the input event when characters are deleted from a text field using the backspace or delete key
                if (DataViz.Utils.BrowserHelper.isIE9()) {
                    $("#edit-title").off("keydown");
                    $("#edit-title").on("keydown", function (event) {
                        // key code 46 is delete, key code 8 is backspace
                        if (event.keyCode && (event.keyCode === 46 || event.keyCode === 8)) {
                            inputHandler();
                        }
                    });
                }

                $("#edit-title").off("focusout");
                $("#edit-title").on("focusout", function () {
                    if (_this.titleChanged) {
                        _this.titleChanged = false;
                    }
                });
            };
            DataPane.theInstance = null;
            return DataPane;
        })();
        UX.DataPane = DataPane;
    })(DataViz.UX || (DataViz.UX = {}));
    var UX = DataViz.UX;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="../app.ts"/>
///<reference path="shared/Galleries.ts"/>
///<reference path="SettingPane.ts"/>
///<reference path="DataPane.ts"/>

var DataViz;
(function (DataViz) {
    (function (UX) {
        var MainUX = (function () {
            function MainUX() {
            }
            MainUX.prototype.init = function () {
                var _this = this;
                if (DataViz.Utils.BrowserHelper.isIE()) {
                    $(document).off("focusout");
                    $(document).focusout(function () {
                        _this.hideFloatMenu();
                    });

                    $(document).off("focusin");
                    $(document).focusin(function () {
                        _this.showFloatMenu();
                    });
                } else {
                    $(window).off("blur");
                    $(window).blur(function () {
                        _this.hideFloatMenu();
                    });

                    $(window).off("focus");
                    $(window).focus(function () {
                        _this.showFloatMenu();
                    });
                }

                $("#chart-setting-button").off("click");
                $("#chart-setting-button").click(function () {
                    DataViz.UX.DataPane.Instance.hide();
                    DataViz.UX.SettingPane.Instance.show();
                });

                $("#data-settings-button").off("click");
                $("#data-settings-button").click(function () {
                    DataViz.UX.SettingPane.Instance.hide();
                    DataViz.UX.DataPane.Instance.show(false);
                });

                this.setText();
                this.setupListeners();
            };

            MainUX.prototype.setupListeners = function () {
                DataViz.UX.SettingPane.Instance.setupListeners();
                DataViz.UX.DataPane.Instance.setupListeners();
            };

            MainUX.prototype.setText = function () {
                var dataButton = $("#data-settings-button");
                dataButton.attr("alt", DataViz.Resources.UI.floatMenuDataTitle);
                dataButton.attr("title", DataViz.Resources.UI.floatMenuDataTitle);

                var settingButton = $("#chart-setting-button");
                settingButton.attr("alt", DataViz.Resources.UI.floatMenuSettingTitle);
                settingButton.attr("title", DataViz.Resources.UI.floatMenuSettingTitle);
            };

            MainUX.prototype.showFloatMenu = function () {
                $("#float-menu").show();
            };

            MainUX.prototype.hideFloatMenu = function () {
                $("#float-menu").hide();
            };
            return MainUX;
        })();
        UX.MainUX = MainUX;
    })(DataViz.UX || (DataViz.UX = {}));
    var UX = DataViz.UX;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */

var DataViz;
(function (DataViz) {
    (function (UX) {
        /**
        * This class is the base class for notification and warning UI.
        */
        var BaseNotification = (function () {
            /**
            * Constructor
            */
            function BaseNotification() {
                var _this = this;
                if ($("#notification").length === 0) {
                    var content = '<div id = "notification" class = "notification-style" >' + '<p id="notification-text" class = "notification-text" > </p>' + '<div id="notification-close" class="notification-close" />' + '<button id="notification-button" class = "notification-button button-green" ></button>' + '</div >';
                    $('body').append(content);
                }
                this.messageText = $("#notification-text");
                this.notificationButton = $("#notification-button");
                this.closeButton = $("#notification-close");
                this.notificationPanel = $("#notification");

                this.notificationPanel.css({ "top": window.innerHeight });

                $(window).bind("resize", function () {
                    _this.resizePanel();
                });
            }
            /**
            * Set a button for the panel. By default there exists no button on the panel.
            */
            BaseNotification.prototype.setButton = function (text, func) {
                this.notificationButton.text(text);
                this.setEventHandler(func);
                this.notificationButton.show();
                return this;
            };

            /**
            * Set the message for the panel.
            */
            BaseNotification.prototype.setText = function (text) {
                this.messageText.text(text);
                return this;
            };

            /**
            * Show the panel.
            */
            BaseNotification.prototype.show = function () {
                this.notificationPanel.show();
                this.setHeight();
                this.notificationPanel.animate({ top: window.innerHeight }, 150);
                this.notificationPanel.animate({ top: window.innerHeight - this.notificationPanel.outerHeight() }, 50);
            };

            Object.defineProperty(BaseNotification.prototype, "Button", {
                /**
                * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                * Button get method.
                */
                get: function () {
                    return this.notificationButton;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BaseNotification.prototype, "Close", {
                /**
                * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                * CloseButton get method.
                */
                get: function () {
                    return this.closeButton;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BaseNotification.prototype, "Text", {
                /**
                * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                * Message text get method.
                */
                get: function () {
                    return this.messageText;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(BaseNotification.prototype, "Panel", {
                /**
                * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
                * Panel get method.
                */
                get: function () {
                    return this.notificationPanel;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * This ought to be "protected" but unfortunately TypeScript does not support "protected" memebers by now.
            * Set the panel Height. Dynamically changed by resizing window.
            */
            BaseNotification.prototype.setHeight = function () {
                if (this.notificationButton.css("display") != "none") {
                    var textBottom = this.messageText.position().top + this.messageText.height();
                    var buttonTop = this.notificationButton.position().top;
                    if (buttonTop > textBottom) {
                        this.closeButton.css({ top: 10 });
                        this.messageText.css({ "margin-bottom": "4px" });
                        this.notificationButton.css({ "margin-bottom": "27px", "right": "11px" });
                    } else {
                        this.closeButton.css({ top: 19 });
                        this.messageText.css({ "margin-bottom": "20px" });
                        //this.notificationButton.css({ "margin-bottom": "0", "right": "30px" });
                        this.notificationButton.css({ "margin-bottom": "0"});
                    }
                } else {
                    if (this.messageText.innerHeight() > BaseNotification.textInnerHeight)
                        this.closeButton.css({ top: 10 });
                    else
                        this.closeButton.css({ top: 19 });
                    this.messageText.css({ "margin-bottom": "20px" });
                }
            };

            BaseNotification.prototype.setEventHandler = function (func) {
                if (func) {
                    this.notificationButton.off("click");
                    this.notificationButton.click(function () {
                        func();
                    });
                }
            };

            BaseNotification.prototype.resizePanel = function () {
                if (this.notificationPanel.css("display") != "none")
                    this.notificationPanel.css({ "top": window.innerHeight - this.notificationPanel.outerHeight() });
                this.setHeight();
            };
            BaseNotification.textInnerHeight = 16;
            return BaseNotification;
        })();
        UX.BaseNotification = BaseNotification;
    })(DataViz.UX || (DataViz.UX = {}));
    var UX = DataViz.UX;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    /**
    * This module contains the cookie implementation
    */
    (function (Cookie) {
        /**
        * check if there already exists this cookie.
        */
        function checkCookie(cookieName) {
            if (document.cookie.indexOf(cookieName) !== -1) {
                return true;
            } else {
                return false;
            }
        }
        Cookie.checkCookie = checkCookie;

        /**
        * set the cookie.
        */
        function setCookie(cookieName, cookieValue, effectiveTime) {
            if (typeof effectiveTime === "undefined") { effectiveTime = 365; }
            var today = new Date();
            var endDay = new Date();
            endDay.setDate(today.getDate() + effectiveTime);
            document.cookie = cookieName + "=" + cookieValue + "; expires=" + endDay.toUTCString();
        }
        Cookie.setCookie = setCookie;
    })(DataViz.Cookie || (DataViz.Cookie = {}));
    var Cookie = DataViz.Cookie;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
var DataViz;
(function (DataViz) {
    ///<reference path="BaseNotification.ts"/>
    ///<reference path="../logic/shared/cookie.ts"/>
    (function (UX) {
        /**
        * This class is the Notification UI class.
        */
        var Notification = (function (_super) {
            __extends(Notification, _super);
            /**
            * Constructor
            */
            function Notification() {
                _super.call(this);
                this.Panel.hide();
            }
            /**
            * Set the panel's display time.
            * @param {number} timeOut The time the display can last if you don't hover it.
            * @param {number} timeDisapper The time the display can last after you hover the panel.
            */
            Notification.prototype.setDisplayTime = function (timeOut, timeDisapper) {
                if (typeof timeOut === "undefined") { timeOut = 3000; }
                if (typeof timeDisapper === "undefined") { timeDisapper = 3000; }
                this.timeDisplay = timeOut;
                this.timeDisapper = timeDisapper;
            };

            /**
            * Show the notification UI.
            */
            Notification.prototype.show = function () {
                var _this = this;
                _super.prototype.show.call(this);
                clearTimeout(this.timeCounter);
                this.timeCounter = setTimeout(function () {
                    _this.hide();
                }, this.timeDisplay);
            };

            /**
            * Hide the notification panel.
            */
            Notification.prototype.hide = function () {
                var _this = this;
                this.Panel.animate({ top: window.innerHeight }, "fast", function () {
                    _this.Panel.hide();
                    _this.Button.hide();
                    _this.Close.show();
                    _this.Panel.off("mouseenter");
                    _this.Panel.off("mouseleave");
                    clearTimeout(_this.timeCounter);
                });
            };

            /**
            * This method is taken as a protected method.
            */
            Notification.prototype.setDefaultConfiguration = function () {
                var _this = this;
                this.Close.hide();
                this.setDisplayTime();
                this.Panel.mouseenter(function () {
                    clearTimeout(_this.timeCounter);
                    _this.Close.show();
                });
                this.Panel.mouseleave(function () {
                    _this.timeCounter = setTimeout(function () {
                        _this.hide();
                    }, _this.timeDisapper);
                });
                this.Close.off("click");
                this.Close.click(function () {
                    _this.hide();
                });
            };
            return Notification;
        })(DataViz.UX.BaseNotification);
        UX.Notification = Notification;

        /**
        * This class is the notification UI with a never show button on it. Such kind of class is always used.
        */
        var NotificationWithNeverShowBtn = (function (_super) {
            __extends(NotificationWithNeverShowBtn, _super);
            /**
            * Constructor.
            */
            function NotificationWithNeverShowBtn() {
                _super.call(this);
                this.dontShowAgainValue = "NeverShowAgain";
            }
            /**
            * Get the single instance.
            */
            NotificationWithNeverShowBtn.getInstance = function () {
                if (!NotificationWithNeverShowBtn.instance) {
                    NotificationWithNeverShowBtn.instance = new NotificationWithNeverShowBtn();
                }

                NotificationWithNeverShowBtn.instance.setDefaultConfiguration();
                NotificationWithNeverShowBtn.instance.setNeverShwoBtn();

                return NotificationWithNeverShowBtn.instance;
            };

            /**
            * Set the key for cookie.
            */
            NotificationWithNeverShowBtn.prototype.setKey = function (dontShowAgainKey) {
                this.dontShowAgainKey = dontShowAgainKey;
                return this;
            };

            /**
            * Show the UI.
            */
            NotificationWithNeverShowBtn.prototype.show = function () {
                if (DataViz.Utils.isOnWac()) {
                    if (window.localStorage.getItem(this.dontShowAgainKey) !== this.dontShowAgainValue) {
                        _super.prototype.show.call(this);
                    }
                } else {
                    if (!DataViz.Cookie.checkCookie(this.dontShowAgainKey)) {
                        _super.prototype.show.call(this);
                    }
                }
            };

            NotificationWithNeverShowBtn.prototype.setNeverShwoBtn = function () {
                var _this = this;
                this.setButton(DataViz.Resources.Notification.dontShowAgain, function () {
                    if (DataViz.Utils.isOnWac()) {
                        window.localStorage.setItem(_this.dontShowAgainKey, _this.dontShowAgainValue);
                    } else {
                        DataViz.Cookie.setCookie(_this.dontShowAgainKey, _this.dontShowAgainValue);
                    }

                    _this.hide();
                });
            };
            return NotificationWithNeverShowBtn;
        })(Notification);
        UX.NotificationWithNeverShowBtn = NotificationWithNeverShowBtn;
    })(DataViz.UX || (DataViz.UX = {}));
    var UX = DataViz.UX;
})(DataViz || (DataViz = {}));
/* **************************************************************************************
Copyright (c) Microsoft Open Technologies, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
***************************************************************************************** */
///<reference path="logic/shared/controller.ts"/>
///<reference path="logic/shared/config.ts"/>
///<reference path="logic/shared/layout.ts"/>
///<reference path="logic/shared/skus.ts"/>
///<reference path="logic/shared/decoration.ts"/>
///<reference path="logic/shared/utils.ts"/>
///<reference path="logic/plotter.peoplebarclassic.d3.ts"/>
///<reference path="logic/plotter.peoplebarcallout.d3.ts"/>
///<reference path="logic/plotter.peoplebargiant.d3.ts"/>
///<reference path="logic/layouter.base.d3.ts"/>
///<reference path="logic/layouter.giant.d3.ts"/>
///<reference path="logic/layouter.callout.d3.ts"/>
///<reference path="logic/layouter.classic.d3.ts"/>
///<reference path="logic/data.binder.agave.ts"/>
///<reference path="logic/data.convertor.peoplebar.ts"/>
///<reference path="logic/configurator.agave.ts"/>
///<reference path="logic/predefinedSKUs.ts"/>
///<reference path="strings/stringadapter.ts"/>
///<reference path="UX/shared/BindingPane.ts"/>
///<reference path="UX/BindingPaneSpecific.ts"/>
///<reference path="UX/Home.ts"/>
///<reference path="UX/Notification.ts"/>

/**
* This is the main module containing the entry point of the app.
*/
var DataViz;
(function (DataViz) {
    "use strict";

    /**
    * The main app instance
    */
    DataViz.mainApp;

    Office.initialize = function (reason) {       
    };

    function loadResourcesAndInitApp(resourceUrl, reason) {
        var retryCount = 3;
        $.getScript(resourceUrl, function () {
            ensureDependancies(retryCount, function () {
                DataViz.mainApp.init(reason);
            });
        });
    }

    function ensureDependancies(retryCount, callback) {
        if (typeof (d3) !== "undefined") {
            callback();
        } else {
            reloadD3Library(retryCount, callback);
        }
    }

    function reloadD3Library(retryCount, callback) {
        if (retryCount > 0) {
            $.getScript("../scripts/opensource/d3/d3.v3.min.js?random=" + Math.floor(Math.random() * 10000000), function () {
                ensureDependancies(retryCount - 1, callback);
            }).fail(function () {
                reloadD3Library(retryCount - 1, callback);
            });
        }
    }

    /**
    * Define the sample data format
    */
    var SampleDataFormat = (function () {
        function SampleDataFormat() {
        }
        return SampleDataFormat;
    })();

    /**
    * This class represents the primary entry-point and workflow of the app
    */
    var App = (function () {
        function App() {
            this.timeoutId = null;
            this.mainUX = null;
            this.currentSKU = null;
            this.configuration = null;
            this.layoutInstance = null;
            this.reentryFlag = false;
            this.bindingPane = null;
        }
        Object.defineProperty(App.prototype, "CurrentSKU", {
            /**
            * Gets the current SKU instance
            * @returns {DataViz.SKUs.SKUInstance} The current SKU instance
            */
            get: function () {
                return this.currentSKU;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(App.prototype, "Configuration", {
            /**
            * Gets the configuration instance
            * @returns {Config.Configuration} The configuration instance
            */
            get: function () {
                return this.configuration;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(App.prototype, "LayoutInstance", {
            /**
            * Gets the layout instance
            * @returns {DataViz.Chart.LayoutInstance} The layout instance
            */
            get: function () {
                return this.layoutInstance;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Initializes the app
        */
        App.prototype.init = function (reason, callback) {
            var _this = this;
            var thisApp = this;
            thisApp.bindingPane = DataViz.UX.BindingPaneSpecific.getInstance();
            DataViz.SKUs.SKUProvider.Instance.loadAll(DataViz.SKUs.Predefines.Instance.getAll(), function () {
                DataViz.Chart.LayoutProvider.Instance.loadAll(function () {
                    DataViz.Decoration.ThemeProvider.Instance.loadAll(function () {
                        DataViz.Decoration.ShapeProvider.Instance.loadAll(function () {
                            thisApp.setupNewSKU();
                            callback && callback(_this.currentSKU);
                        });
                    });
                });
            });
        };

        /**
        * Binds to the selected cells (by prompt)
        */
        App.prototype.bindData = function () {
            this.bindingPane.zoomBindingPane().show();
        };

        // Implementing IConfigurationChangeListener
        App.prototype.onConfigurationChanged = function (key, value) {
            switch (key) {
                case DataViz.Config.wellKnownKeys.sku:
                    if (this.reentryFlag) {
                        return;
                    }

                    if ((!this.currentSKU) || (this.currentSKU.Id !== value)) {
                        this.tearDownCurrentSKU();

                        this.reentryFlag = true;
                        this.setupNewSKU();
                        this.reentryFlag = false;
                    }
                    break;
            }
            this.onConfigurationChangedCallback && this.onConfigurationChangedCallback(key, value);
        };

        // Implementing IVisualizationListener
        App.prototype.onStartVisualizing = function () {
            // Nothing special by now
        };

        // Implementing IVisualizationListener
        App.prototype.onEndVisualizing = function () {
            var _this = this;
            //$("#title").off("dblclick");
            //$("#title").on("dblclick", function () {
            //    DataViz.UX.SettingPane.Instance.hide();
            //    DataViz.UX.DataPane.Instance.show(true); // show data pane and focus into the title box
            //});

            var resizeHandler = function (event) {
                if (_this.timeoutId) {
                    clearTimeout(_this.timeoutId);
                }

                _this.timeoutId = setTimeout(function () {
                    var target = event.target;
                    var data = {
                        "ResizedWidth": target.innerWidth,
                        "ResizedHeight": target.innerHeight
                    };

                    _this.currentSKU.Controller.revisualize();
                    _this.timeoutId = null;
                }, 100);
            };

            $(window).off("resize", resizeHandler);
            $(window).on("resize", resizeHandler);

            // Browser will handle single click event even it is trying to trigger the double click event, so this is the workaround
            // If the two clicks happened less than 300 ms, it will not trigger single click actions, otherwise trigger single click
            // actions
            var clickNumber = 0;
            var delay = 300;
            $(DataViz.Chart.defaultSVGRootId).off("click");
            $(DataViz.Chart.defaultSVGRootId).on("click", function () {
                clickNumber++;
                setTimeout(function () {
                    if (clickNumber === 1) {
                        DataViz.UX.SettingPane.Instance.hide();
                        DataViz.UX.DataPane.Instance.hide();
                    }
                    clickNumber = 0;
                }, delay);
            });
        };

        App.prototype.tearDownCurrentSKU = function () {
            $(DataViz.Chart.defaultSVGRootId).empty();

            if (!this.currentSKU) {
                return;
            }

            this.currentSKU.reset();
            this.configuration.reset();
            this.layoutInstance.reset();
        };

        App.prototype.setupNewSKU = function () {
            var _this = this;
            this.currentSKU = DataViz.SKUs.SKUProvider.Instance.CurrentSKUInstance;

            DataViz.Chart.LayoutProvider.Instance.CurrentLayoutId = this.currentSKU.LayoutId;

            this.configuration = new DataViz.Config.Configuration(App.configurationKeys, this.currentSKU.Configurator);

            // Registers listeners for configuration changes. NOTE: ORDER MATTERS!
            this.configuration.registerListener(DataViz.Decoration.ShapeProvider.Instance);
            this.configuration.registerListener(DataViz.Decoration.ThemeProvider.Instance);
            this.configuration.registerListener(this.currentSKU.DataConvertor);
            this.configuration.registerListener(this.currentSKU.Controller);
            this.configuration.registerListener(DataViz.SKUs.SKUProvider.Instance);
            this.configuration.registerListener(this);
            this.currentSKU.Visualizer.registerListener(this);

            this.layoutInstance = new DataViz.Chart.LayoutInstance(DataViz.Chart.LayoutProvider.Instance.CurrentLayout, this.currentSKU.Configurator);
            this.layoutInstance.registerListener(this.currentSKU.Layouter);

            this.mainUX = new DataViz.UX.MainUX;
            this.mainUX.init();

            this.currentSKU.Layouter.pause();

            this.configuration.loadAll();
            this.layoutInstance.loadAll();

            this.currentSKU.Layouter.resume();

            var savedSkuId = this.configuration.get(DataViz.Config.wellKnownKeys.sku);
            if (!savedSkuId) {
                DataViz.mainApp.configuration.set(DataViz.Config.wellKnownKeys.sku, this.currentSKU.Id);
            }

            var savedThemeId = this.configuration.get(DataViz.Config.wellKnownKeys.theme);
            var savedTheme = DataViz.Decoration.ThemeProvider.Instance.getThemeById(savedThemeId);
            if ((!savedTheme) || ((savedTheme.sku !== "") && (savedTheme.sku !== this.currentSKU.Id))) {
                DataViz.mainApp.configuration.set(DataViz.Config.wellKnownKeys.theme, this.currentSKU.ThemeId);
            }

            var savedShapeId = this.configuration.get(DataViz.Config.wellKnownKeys.shape);
            var savedShape = DataViz.Decoration.ShapeProvider.Instance.getShapeById(savedShapeId);
            if ((!savedShape) || ((savedShape.sku !== "") && (savedShape.sku !== this.currentSKU.Id))) {
                this.configuration.set(DataViz.Config.wellKnownKeys.shape, this.currentSKU.ShapeId);
            }

            var options = {
                type: ".people-types",
                theme: ".people-theme",
                shape: ".sharp-list"
            };

            DataViz.UX.SettingPane.Instance.populate(options);

            var renderData = new DataViz.Data.RawData();

            if (_this.bindingPane.bindingData != null) {
                renderData.formatted = _this.bindingPane.bindingData;
                renderData.unformatted = _this.bindingPane.bindingData;
            } else {
                var sampleData = _this.currentSKU.SampleData;
                renderData.formatted = sampleData.data;
                renderData.unformatted = sampleData.data;
            }

            _this.currentSKU.Controller.visualizeData(renderData);
        };
        App.configurationKeys = [
            DataViz.Config.wellKnownKeys.theme,
            DataViz.Config.wellKnownKeys.shape,
            DataViz.Config.wellKnownKeys.sku
        ];
        return App;
    })();
    DataViz.App = App;
})(DataViz || (DataViz = {}));
//# sourceMappingURL=PeopleGraph.js.map
