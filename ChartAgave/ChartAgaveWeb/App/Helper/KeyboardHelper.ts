class KeyboardHelper {
   /**
   * Add keyboard event to specified DOM.
   */
    public addKeyEvent(selector: string, keyCodes: number[], handler: (e) => void, keyEvent?: string) {
        if (selector) {
            keyEvent = keyEvent ? keyEvent : "keypress";
            $(selector).off(keyEvent);

            $(selector).on(keyEvent, (e) => {
                if (keyCodes.indexOf(e.keyCode) !== -1) {
                    handler(e);
                    return false;
                }
            });
        }
    }

    /**
    * Add ctrl combine keys(i.e. ctrl + F2) event. 
    */
    public addCtrlKeyEvent(selector: string, keyCodes: number[], handler: (e) => void) {   
        this.addCombineKeyEvent(selector, OfficeUtil.Strings.keyCodes.ctrl, keyCodes, handler);
    }

    /**
    * Add shift combine(i.e. shift + F2) event. 
    */
    public addShiftKeyEvent(selector: string, keyCodes: number[], handler: (e) => void) {
        this.addCombineKeyEvent(selector, OfficeUtil.Strings.keyCodes.shift, keyCodes, handler);
    }

    /**
    * Add alt combine(i.e. alt + F2) event. 
    */
    public addAltKeyEvent(selector: string, keyCodes: number[], handler: (e) => void) {
        this.addCombineKeyEvent(selector, OfficeUtil.Strings.keyCodes.alt, keyCodes, handler);
    }

    /**
    * Add key board combine key event.
    */
    private addCombineKeyEvent(
        selector: string,
        firstKeyCode: number,
        secondKeyCodes: number[],
        handler: (e) => void) {

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
    }
} 