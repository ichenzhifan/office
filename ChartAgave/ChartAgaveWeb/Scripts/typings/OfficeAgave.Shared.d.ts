declare module OfficeAgave.Shared.Localization {
    interface IOptions {
        rootFolder?: string;
        resourceFileName?: string;
        success?: (data: any) => void;
    }
    class Resources {
        private static resourceObject;
        private static format(object, ...params);
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
        static apply(selector?: string): void;
        /**
        * Get the specific resource string by resource name
        *
        * @param {string} resourceName Resource name
        * @return {string} Resource string
        */
        static getResourceString(resourceName: string): string;
        /**
        * Load the resource file, resource file should be json type
        *
        * @param {IOptions} option localization options, it contains those settings:
        *  - rootFolder: the folder which contains different resource language folders
        *  - resourceFileName: the resource file name, it should be same name in different resource language folders
        *  - success: success callback, will be invoked after resource loaded
        */
        static initialize(option?: IOptions): void;
        private static buildCommonAjaxSettings(url, successCallback?, nextTrialSettings?);
    }
}
declare module OfficeAgave.Shared.Utility {
    interface IAccessibilityOption {
        selector: string;
        tabIndex: string;
    }
    class Util {
        /**
        * Check whether agave is luanching on PPT application.
        */
        static isPresentationView(): boolean;
        /**
        * Retrieve office display language and check whether it is rtl language.
        */
        static isRtlLanguage(): boolean;
        /**
        * Check whether it is consumer mode(Notes, this method only available on PPT application).
        * @param {() => void} consumeCallback will be called if current document is consumer mode.
        * @param {() => void} authoringCallback will be called if current document is non-consumer mode.
        */
        static isPresentationConsumerMode(consumeCallback?: () => void, authoringCallback?: () => void): void;
        /**
        * Detect background-image attribute to check whether it is high constrast.
        */
        static isHighContrast(): boolean;
    }
    class Accessibility {
        /**
        * Add tab index to specified controls.
        */
        static addKeyboardTabAccess(selector?: string, options?: IAccessibilityOption[]): void;
    }
    class Keyboards {
        /**
        * Add keyboard event to specified DOM.
        * @param {string} selector Jquery selector, the target used to bind keyboard event.
        * @param {number[]} keyCodes Keyboard keycode, using this code to check whether hit keyboard event.
        * @param {(e) => void, keyEvent?: string} handler will be invoked when event hit.
        */
        static addKeyEvent(selector: string, keyCodes: number[], handler: (e: any) => void, keyEvent?: string): void;
        /**
        * Add ctrl combine keys(i.e. ctrl + F2) event.
        * @param {string} selector Jquery selector, the target used to bind keyboard event.
        * @param {number[]} keyCodes Keyboard keycode, using this code to check whether hit keyboard event.
        * @param {(e) => void, keyEvent?: string} handler will be invoked when event hit.
        */
        static addCtrlKeyEvent(selector: string, keyCodes: number[], handler: (e: any) => void): void;
        /**
        * Add shift combine(i.e. shift + F2) event.
        * @param {string} selector Jquery selector, the target used to bind keyboard event.
        * @param {number[]} keyCodes Keyboard keycode, using this code to check whether hit keyboard event.
        * @param {(e) => void, keyEvent?: string} handler will be invoked when event hit.
        */
        static addShiftKeyEvent(selector: string, keyCodes: number[], handler: (e: any) => void): void;
        /**
        * Add alt combine(i.e. alt + F2) event.
        * @param {string} selector Jquery selector, the target used to bind keyboard event.
        * @param {number[]} keyCodes Keyboard keycode, using this code to check whether hit keyboard event.
        * @param {(e) => void, keyEvent?: string} handler will be invoked when event hit.
        */
        static addAltKeyEvent(selector: string, keyCodes: number[], handler: (e: any) => void): void;
        /**
        * Add key board combine key event.
        */
        private static addCombineKeyEvent(selector, firstKeyCode, secondKeyCodes, handler);
    }
    class Strings {
        static documentExtensions: {
            presentation: string;
            workBook: string;
        };
        static rtlLanguageCodes: string[];
        static keyCodes: {
            enter: number;
            space: number;
            left: number;
            up: number;
            right: number;
            down: number;
            esc: number;
            home: number;
            end: number;
            pgUp: number;
            pgDn: number;
            tab: number;
            del: number;
            shift: number;
            ctrl: number;
            alt: number;
            f2: number;
            f6: number;
        };
    }
}
