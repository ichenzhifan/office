class CopyPaste {
    private pasteCallbacks: Array<(val: string, event: JQueryEventObject) => any>;

    private $textArea: JQuery;

    constructor() {
        this.init();
    }

    /**
    * Creates a textarea that stays hidden on the page and gets focused 
    * when user presses CTRL while not having a form input focused
    */
    private init() {
        this.pasteCallbacks = [];

        this.$textArea = $(".copyPaste");

        $(document).on("keydown", (event) => {
            if (ChartTableHelper.isEditing()) {
                return;
            }

            var isCtrlDown = false;
            if (event.ctrlKey) {
                isCtrlDown = true;
            }

            if (isCtrlDown) {
                this.selectTextArea();
                setTimeout(() => {
                    this.selectTextArea();
                }, 0);
            }

            // Ctrl + v
            if (isCtrlDown && event.keyCode === 86) {
                setTimeout(() => {
                    this.triggerPaste(event);
                }, 0);
            }
        });
    }

    /**
    * Select the textarea
    */
    private selectTextArea() {
        this.$textArea.select();
    }

    /**
    * Trigger registered paste callbacks
    */
    private triggerPaste(event: JQueryEventObject) {
        if (this.pasteCallbacks) {
            setTimeout(() => {
                var val = (<string>(this.$textArea.val())).replace(/^[\r\n]*/g, '').replace(/[\r\n]*$/g, '');
                for (var i = 0, ilen = this.pasteCallbacks.length; i < ilen; i++) {
                    this.pasteCallbacks[i](val, event);
                }
            }, 50);
        }
    }

    /*
     * Register paste callback
    */
    public onPaste(fn: (val: string, event: JQueryEventObject) => any) {
        this.pasteCallbacks.push(fn);
    }
}