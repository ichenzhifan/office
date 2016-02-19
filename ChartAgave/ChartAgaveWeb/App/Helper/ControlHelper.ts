interface HorizontalToggleOptions {
    showLeft: number;
    hideLeft: number;
}

interface IAgaveControl {
    isVisible?: boolean;
    isEnable?: boolean;
    $control?: JQuery;
    horizontalToggleOptions?: HorizontalToggleOptions;
    loaded?: () => void;
    leave?: () => void;
    disable?: () => void;
    enable?: () => void;
}

class ControlHelper {
    /** show the specified control */
    public static showControl(control: IAgaveControl, func?: (data?: any) => void, data?: any): void {
        if (!control.isVisible) {
            ControlHelper.toggleControl(control, func, data);
        }
    }

    /** hide the specified control */
    public static hideControl(control: IAgaveControl, func?: () => void, isAnimate = true): void {
        if (control.isVisible) {
            ControlHelper.toggleControl(control, null, null, func, isAnimate);
        }
    }

    /** toggle the visibility of specifed control */
    public static toggleControl(
        control: IAgaveControl,
        showCallback?: (data?: any) => void,
        data?: any,
        hideCallback?: () => void,
        isAnimate = true) {
        control.isVisible = !control.isVisible;
        var leftToMove = control.isVisible ? control.horizontalToggleOptions.showLeft : control.horizontalToggleOptions.hideLeft;

        if (control.isVisible) {           
            control.$control.show(10, () => {   
                control.loaded && control.loaded();            
                showCallback && showCallback(data);
            });
        }

        if (isAnimate) {
            control.$control.animate(
                { left: leftToMove },
                () => {
                    if (!control.isVisible) {
                        control.$control.hide(10, () => {
                            control.leave && control.leave();   
                            hideCallback && hideCallback();
                        });
                    }
                });
        }
        else {
            control.$control.css("left", leftToMove).hide();
            control.leave && control.leave();  
            hideCallback && hideCallback();
        }
    }
} 