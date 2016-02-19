class Switch {
    // Switch control container.
    private $switchContainer: JQuery;
    private instance: Switch;
    private isPPT : boolean = false;
    // Lable control in switch container, used to store switch value.
    private $label = $("<label class=\"\">on</label>");
    private $keyBoardSubContainer = $("<div class=\"keyboard-switch-container\"></div>");
    private $subContainer = $("<div class=\"switch-container\"></div>");

    // Slider control in switch container.
    private $sliderBar = $("<span class=\"slider-bar\"></span>");

    // Switch control.
    private $switch = $("<span class=\"switch\"></span>");

    // Color before mouse enter.
    private beforeMouseenterColor: string;

    // Define a chang method, it will occur as long as switch value changed.
    public change: (value: string) => void;

    // Define a variable to store switch value.
    public values = {
        on: "On",
        off: "Off"
    };

    // Class names for slider bar.
    private classes = {
        sliderBarOn: "sliderbar-on",
        switchOn: "on"
    };

    // Background colors for slider bar.
    // The colors schema are defined by redline.
    private styles = {
        silderOn: "#9FD5B7",
        silderOnHover: "#D3F0E0",
        silderOnPressed: "#86BFA0",
        silderOnPPt: "#FCCDB6",
        silderOnHoverPPt: "#FCE4DC",
        silderOnPressedPPt: "#F5BA9D",
        silderOff: "#B3B3B3",
        silderOffHover: "#D8D8D8",
        silderOffPressed: "#B3B3B3"
    };

    constructor(id: string) {
        this.$switchContainer = $(id);
        this.instance = this;
        this.init(this);
    }   

    /**
    * Check whether it is presentaion view.
    */
    private isPresentationView() {
        var lastIndex = Office.context.document.url.lastIndexOf(".");     
        if (lastIndex !== -1) {
            var documentExtension = Office.context.document.url.substring(lastIndex + 1).toLowerCase();
            return documentExtension === "pptx";
        }

        return false;
    }

    /**
     * Create switch control structure.
     */
    private createSwitch() {
        // Append label control to store switch value.
        // - "on": switch is turn on.
        // - "off": switch is turn off.       
        this.$switchContainer.append(this.$label);

        this.$keyBoardSubContainer.attr("tabindex", "1");
        this.$switchContainer.append(this.$keyBoardSubContainer);

        // Append sub container which will contain slider bar and switch.      
        this.$keyBoardSubContainer.append(this.$subContainer);

        // Append switch slider bar.
        this.$subContainer.append(this.$sliderBar);

        // Append switch control.
        this.$subContainer.append(this.$switch);

        // Add hover event for slider bar to change background color.
        this.$sliderBar.hover(
            (event) => {
                if (this.isPPT) {
                    this.beforeMouseenterColor = this.getBackgroundColor(event);
                    this.activedHandler(event, this.styles.silderOnHoverPPt);
                } else {
                    this.beforeMouseenterColor = this.getBackgroundColor(event);
                    this.activedHandler(event, this.styles.silderOnHover);
                }
            }, (event) => {
                this.activedHandler(event, this.beforeMouseenterColor);
            });

         // Add pressed event for slider bar to change background color.
        this.$sliderBar.on("mousedown", (event) => {
            if (this.isPPT) {
                this.activedHandler(event, this.styles.silderOnPressedPPt);            
            } else {
                this.activedHandler(event, this.styles.silderOnPressed);            
            }            
        });
    }

    /**
    * Set active style by adding background color.
    */
    private activedHandler(event, color) {
        var $target = $(event.target || event.srcElement);
        $target.css("background-color", color);
    }

   /**
   * Get background color.
   */
    private getBackgroundColor(event) {
        var $target = $(event.target || event.srcElement);
        return $target.css("background-color");
    }

    /**
    * Switch turn on.
    */
    public switchOn() {
        // Apply on style for sliderBar.
        this.$sliderBar.addClass(this.classes.sliderBarOn);

        // Move switch to right for turn on switch.       
        this.$switch.addClass(this.classes.switchOn)       

        // Set off to lable text.
        this.$label.text(OfficeLocalization.Resources.getResourceString("on"));

        // Call Chang method and pass "on" as param.
        this.change && this.change(this.values.on);

        if (this.isPPT) {
            this.$sliderBar.css("background-color", this.styles.silderOnPPt);
            this.beforeMouseenterColor = this.styles.silderOnPPt;
        } else {
            this.$sliderBar.css("background-color", this.styles.silderOn);
            this.beforeMouseenterColor = this.styles.silderOn;
        }
        
        // Add hover event for slider bar to change background color.
        this.$sliderBar.unbind("mouseenter mouseleave");
        this.$sliderBar.hover(
            (event) => {
                if (this.isPPT) {
                    this.beforeMouseenterColor = this.getBackgroundColor(event);
                    this.activedHandler(event, this.styles.silderOnHoverPPt);
                } else {
                    this.beforeMouseenterColor = this.getBackgroundColor(event);
                    this.activedHandler(event, this.styles.silderOnHover);
                }                
            }, (event) => {
                this.activedHandler(event, this.beforeMouseenterColor);
            });       

         // Add pressed event for slider bar to change background color.
        this.$sliderBar.off("mousedown");
        this.$sliderBar.on("mousedown", (event) => {
            if (this.isPPT) {
                this.activedHandler(event, this.styles.silderOnPressedPPt);
            } else {
                this.activedHandler(event, this.styles.silderOnPressed);
            }            
        });
    }

    /**
    * Switch turn off.
    */
    public switchOff() {
        // Apply off style for sliderBar.
        this.$sliderBar.removeClass(this.classes.sliderBarOn);

        // Move switch to left for turn off switch.       
        this.$switch.removeClass(this.classes.switchOn) 

        // Set off to lable text.
        this.$label.text(OfficeLocalization.Resources.getResourceString("off"));

        // Call Change method and pass "off" as param.
        this.change && this.change(this.values.off);
        
        this.$sliderBar.css("background-color", this.styles.silderOff);
        this.beforeMouseenterColor = this.styles.silderOff;

        // Add hover event for slider bar to change background color.
        this.$sliderBar.unbind("mouseenter mouseleave");
        this.$sliderBar.hover(
            (event) => {
                this.beforeMouseenterColor = this.getBackgroundColor(event);
                this.activedHandler(event, this.styles.silderOffHover);
            }, (event) => {
                this.activedHandler(event, this.beforeMouseenterColor);
            });       

        // Add pressed event for slider bar to change background color.
        this.$sliderBar.off("mousedown");
        this.$sliderBar.on("mousedown", (event) => {
            this.activedHandler(event, this.styles.silderOffPressed);
        });
    }

    private toggle($switch: Switch, $target: JQuery) { 
        if ($target.hasClass($switch.classes.sliderBarOn)) {
            $switch.switchOff();
        } else {
            $switch.switchOn();
        }
        // Prevent default click event.
        return false;
    }

    /**
    * Init switch control.
    *
    * @param {Switch} that Switch object references.
    */
    private init(that: Switch) {    
        that.isPPT = that.isPresentationView();  
         
        // Creat switch button.
        that.createSwitch();

        // Trun on by default.
        that.switchOn();     

        that.$sliderBar.on("click", function (e) {
            that.toggle(that, $(e.target));
        });

        that.$keyBoardSubContainer.on("keypress", (e) => {
             if (e.keyCode == OfficeUtil.Strings.keyCodes.space) {
                that.toggle(that, $(e.target).find(".slider-bar"));
            }
        });
    }
}