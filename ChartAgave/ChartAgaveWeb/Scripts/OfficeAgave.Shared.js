/// <reference path="../jquery.d.ts" />
/// <reference path="../office.d.ts" />
var OfficeAgave;
(function (OfficeAgave) {
    (function (Shared) {
        // This API relies on Office.js and Jquery.js
        (function (Localization) {
            var Office = Microsoft.Office.WebExtension;

            var Resources = (function () {
                function Resources() {
                }
                Resources.format = function (object) {
                    var params = [];
                    for (var _i = 0; _i < (arguments.length - 1) ; _i++) {
                        params[_i] = arguments[_i + 1];
                    }
                    if (!object || object.trim().length === 0) {
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
                * Apply the resource string to the Dom element, and the resource name is defined in specific attribute "data-resx",
                * the value is alike knockout.js (e.g. data-resx = "value: resourceName, title: resourceKey"),
                * any known Dom attribute will be replaced by the resource string.
                * Especially, we treat the "text" differently, we will set resource string by JQuery's .text() method.
                *
                * @param {string} selector A JQuery selector string, if a selector is provided,
                * all its descendants will be applied the resource string.
                * Otherwise, all the elements will be applied the resource string.
                */
                Resources.apply = function (selector) {
                    var elems = !selector || selector.length === 0 ? $("[data-resx]") : $(selector).find("[data-resx]");

                    elems.each(function () {
                        var ele = $(this);
                        var attrPairs = ele.attr("data-resx").split(',');
                        attrPairs.forEach(function (attrPair) {
                            var indexOfColon = attrPair.indexOf(':');
                            if (attrPair && attrPair.length > 0 && indexOfColon > 0) {
                                var attrName = $.trim(attrPair.substring(0, indexOfColon));
                                var attrValue = Resources.getResourceString($.trim(attrPair.substring(indexOfColon + 1)));
                                if (attrName.toLowerCase() === "text") {
                                    ele.text(attrValue);
                                } else {
                                    ele.attr(attrName, attrValue);
                                }
                            }
                        });
                    });
                };

                /**
                * Get the specific resource string by resource name
                *
                * @param {string} resourceName Resource name
                * @return {string} Resource string
                */
                Resources.getResourceString = function (resourceName) {
                    if (Resources.resourceObject !== undefined) {
                        if (resourceName.indexOf(' ') > 0) {
                            var resourceNames = resourceName.split(/\s+/g);
                            var resourceStrings = [];

                            resourceNames.forEach(function (name) {
                                resourceStrings.push(Resources.resourceObject[name]);
                            });

                            return resourceStrings.join(' ');
                        } else {
                            return Resources.resourceObject[resourceName];
                        }
                    }

                    return null;
                };

                /**
                * Load the resource file, resource file should be json type
                *
                * @param {IOptions} option localization options, it contains those settings:
                *  - rootFolder: the folder which contains different resource language folders
                *  - resourceFileName: the resource file name, it should be same name in different resource language folders
                *  - success: success callback, will be invoked after resource loaded
                */
                Resources.initialize = function (option) {
                    var language = Office.context.displayLanguage;

                    var resourceFolderPath = option != null && option.rootFolder ? option.rootFolder : "../Resources";
                    var resourceFileName = option != null && option.resourceFileName ? option.resourceFileName : "resources.json";

                    var resourcePath = resourceFolderPath + "/{0}/" + resourceFileName;
                    var resourcePathWithLanguage;

                    // try to get "en", if not found, throw exception
                    resourcePathWithLanguage = Resources.format(resourcePath, "en");
                    var ajaxSettings4 = Resources.buildCommonAjaxSettings(resourcePathWithLanguage, option.success);

                    // try to get "en-US", if not found, try to get "en"
                    resourcePathWithLanguage = Resources.format(resourcePath, "en-US");
                    var ajaxSettings3 = Resources.buildCommonAjaxSettings(resourcePathWithLanguage, option.success, ajaxSettings4);

                    // try to get the same language, if not found, try to get "en-US"
                    resourcePathWithLanguage = Resources.format(resourcePath, language.substring(0, language.indexOf('-')));
                    var ajaxSettings2 = Resources.buildCommonAjaxSettings(resourcePathWithLanguage, option.success, ajaxSettings3);

                    // try to get the exact match, if not found, try to get the same language
                    resourcePathWithLanguage = Resources.format(resourcePath, language);
                    var ajaxSettings1 = Resources.buildCommonAjaxSettings(resourcePathWithLanguage, option.success, ajaxSettings2);

                    $.ajax(ajaxSettings1);
                };

                Resources.buildCommonAjaxSettings = function (url, successCallback, nextTrialSettings) {
                    return {
                        url: url,
                        dataType: "json",
                        success: function (data) {
                            Resources.resourceObject = data;
                            successCallback && successCallback(data);
                        },
                        error: function (data) {
                            if (data.status === 404) {
                                if (nextTrialSettings !== undefined) {
                                    $.ajax(nextTrialSettings);
                                } else {
                                    throw "Fail to find a resource file";
                                }
                            } else {
                                throw "Fail to find a resource file: " + data.statusText;
                            }
                        }
                    };
                };
                return Resources;
            })();
            Localization.Resources = Resources;
        })(Shared.Localization || (Shared.Localization = {}));
        var Localization = Shared.Localization;
    })(OfficeAgave.Shared || (OfficeAgave.Shared = {}));
    var Shared = OfficeAgave.Shared;
})(OfficeAgave || (OfficeAgave = {}));
/// <reference path="../jquery.d.ts" />
/// <reference path="../office.d.ts" />
var OfficeAgave;
(function (OfficeAgave) {
    (function (Shared) {
        // This API relies on Office.js and Jquery.js
        (function (Utility) {
            var Office = Microsoft.Office.WebExtension;

            var Util = (function () {
                function Util() {
                }
                /**
                * Check whether agave is luanching on PPT application.
                */
                Util.isPresentationView = function () {
                    var documentExtension = Office.context.document.url.substring(Office.context.document.url.lastIndexOf(".") + 1);
                    return documentExtension === Strings.documentExtensions.presentation;
                };

                /**
                * Retrieve office display language and check whether it is rtl language.
                */
                Util.isRtlLanguage = function () {
                    var lang = Office.context.displayLanguage || Office.context.contentLanguage;
                    if (lang) {
                        var sep = lang.indexOf("-");
                        lang = sep !== -1 ? lang.substring(0, sep) : lang;

                        return Strings.rtlLanguageCodes.indexOf(lang.toLowerCase()) !== -1;
                    }

                    return false;
                };

                /**
                * Check whether it is consumer mode(Notes, this method only available on PPT application).
                * @param {() => void} consumeCallback will be called if current document is consumer mode.
                * @param {() => void} authoringCallback will be called if current document is non-consumer mode.
                */
                Util.isPresentationConsumerMode = function (consumeCallback, authoringCallback) {
                    // If this api is available, the view should presentation view.
                    if (Office.context.document.getActiveViewAsync) {
                        Office.context.document.getActiveViewAsync(function (result) {
                            if (result.status === Office.AsyncResultStatus.Succeeded) {
                                if (result.value.toLowerCase() === "read") {
                                    consumeCallback && consumeCallback();
                                } else {
                                    authoringCallback && authoringCallback();
                                }
                            }
                        });
                    } else {
                        authoringCallback && authoringCallback();
                    }
                };

                /**
                * Detect background-image attribute to check whether it is high constrast.
                */
                Util.isHighContrast = function () {
                    var defaults = {
                        id: "highContrastDetection",
                        image: "../icons/hack.png"
                    };

                    var hc = $("<div id=\"highContrastDetection\"></div>");
                    hc.css("background","url(" + defaults.image + ")").css("width", "0px").css("height", "0px");
                    hc.appendTo(document.body);

                    // Do we have a background image. if not, it should be high contrast mode.
                    var hasImage = hc.css("background-image") == "none";
                    $("#" + defaults.id).remove();

                    return hasImage;
                };
                return Util;
            })();
            Utility.Util = Util;

            var Accessibility = (function () {
                function Accessibility() {
                }
                /**
                * Add tab index to specified controls.
                */
                Accessibility.addKeyboardTabAccess = function (selector, options) {
                    if (options && options.length != 0) {
                        // Disable all tabindex first.
                        $("[tabindex]").attr("tabindex", "-1");

                        // Only enable speicfied tabindex.
                        options.forEach(function (item, index) {
                            if (selector) {
                                $(selector).find(item.selector).attr("tabindex", item.tabIndex);
                            } else {
                                $(item.selector).attr("tabindex", item.tabIndex);
                            }
                        });
                    }
                };
                return Accessibility;
            })();
            Utility.Accessibility = Accessibility;

            var Keyboards = (function () {
                function Keyboards() {
                }
                /**
                * Add keyboard event to specified DOM.
                * @param {string} selector Jquery selector, the target used to bind keyboard event.
                * @param {number[]} keyCodes Keyboard keycode, using this code to check whether hit keyboard event.
                * @param {(e) => void, keyEvent?: string} handler will be invoked when event hit.
                */
                Keyboards.addKeyEvent = function (selector, keyCodes, handler, keyEvent) {
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
                * @param {string} selector Jquery selector, the target used to bind keyboard event.
                * @param {number[]} keyCodes Keyboard keycode, using this code to check whether hit keyboard event.
                * @param {(e) => void, keyEvent?: string} handler will be invoked when event hit.
                */
                Keyboards.addCtrlKeyEvent = function (selector, keyCodes, handler) {
                    this.addCombineKeyEvent(selector, Strings.keyCodes.ctrl, keyCodes, handler);
                };

                /**
                * Add shift combine(i.e. shift + F2) event.
                * @param {string} selector Jquery selector, the target used to bind keyboard event.
                * @param {number[]} keyCodes Keyboard keycode, using this code to check whether hit keyboard event.
                * @param {(e) => void, keyEvent?: string} handler will be invoked when event hit.
                */
                Keyboards.addShiftKeyEvent = function (selector, keyCodes, handler) {
                    this.addCombineKeyEvent(selector, Strings.keyCodes.shift, keyCodes, handler);
                };

                /**
                * Add alt combine(i.e. alt + F2) event.
                * @param {string} selector Jquery selector, the target used to bind keyboard event.
                * @param {number[]} keyCodes Keyboard keycode, using this code to check whether hit keyboard event.
                * @param {(e) => void, keyEvent?: string} handler will be invoked when event hit.
                */
                Keyboards.addAltKeyEvent = function (selector, keyCodes, handler) {
                    this.addCombineKeyEvent(selector, Strings.keyCodes.alt, keyCodes, handler);
                };

                /**
                * Add key board combine key event.
                */
                Keyboards.addCombineKeyEvent = function (selector, firstKeyCode, secondKeyCodes, handler) {
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
                return Keyboards;
            })();
            Utility.Keyboards = Keyboards;

            var Strings = (function () {
                function Strings() {
                }
                Strings.documentExtensions = {
                    presentation: "pptx",
                    workBook: "xlsx"
                };

                Strings.rtlLanguageCodes = [
                    "ar",
                    "arc",
                    "dv",
                    "fa",
                    "ha",
                    "he",
                    "khw",
                    "ks",
                    "ku",
                    "ps",
                    "ur",
                    "yi"
                ];

                Strings.keyCodes = {
                    enter: 13,
                    space: 32,
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40,
                    esc: 27,
                    home: 36,
                    end: 35,
                    pgUp: 33,
                    pgDn: 34,
                    tab: 9,
                    del: 46,
                    shift: 16,
                    ctrl: 17,
                    alt: 18,
                    f2: 113,
                    f6: 117
                };
                return Strings;
            })();
            Utility.Strings = Strings;
        })(Shared.Utility || (Shared.Utility = {}));
        var Utility = Shared.Utility;
    })(OfficeAgave.Shared || (OfficeAgave.Shared = {}));
    var Shared = OfficeAgave.Shared;
})(OfficeAgave || (OfficeAgave = {}));
