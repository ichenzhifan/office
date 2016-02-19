class AgaveHelper {

    /**
    * Set setting button icons(default, hover and press).
    */
    public static initSettingsBtn() {
        this.setBtnIcons("#toolbarSettings>img",
            {
                icon: Strings.buttonIcons.setting,
                hoverIcon: Strings.buttonIcons.settingHover,
                pressIcon: Strings.buttonIcons.settingPress
            });
    }

    /**
    * Set data button icons(default, hover and press).
    */
    public static initDataBtn() {
        this.setBtnIcons("#toolbarData>img",
            {
                icon: Strings.buttonIcons.data,
                hoverIcon: Strings.buttonIcons.dataHover,
                pressIcon: Strings.buttonIcons.dataPress
            });
    }

    /**
    * Set ChartType button icons(default, hover and press).
    */
    public static initChartTypeBtn() {
        this.setBtnIcons("#toolbarChartType>img",
            {
                icon: Strings.buttonIcons.chartType,
                hoverIcon: Strings.buttonIcons.chartTypeHover,
                pressIcon: Strings.buttonIcons.chartTypePress
            });
    }

    /**
    * Set back button icons(default, hover and press under ppt/excel, rtl and default direction).
    */
    public static initBackbtn() {
        var backs = $(".topBanner .back-icon");
        this.setBackDefaultIcon();
        backs.hover(this.backHoverHandle, this.setBackDefaultIcon)
            .focusin(this.backHoverHandle)
            .focusout(this.setBackDefaultIcon)
            .mousedown(this.backPressHandle)
            .mouseup(this.setBackDefaultIcon);
    }

    /**
    * Set back button icon in hover(ppt/excel, rtl and default direction).
    */
    private static backHoverHandle(e) {
        // Set default hover icon(excel ltr).
        var src = Strings.buttonIcons.backHover;
        var $target = $(e.target || e.srcElement);

        if (OfficeUtil.Util.isRtlLanguage()) {
            if (OfficeUtil.Util.isPresentationView()) {
                src = Strings.buttonIcons.backHoverRTLPPT;
            } else {
                src = Strings.buttonIcons.backHoverRTL;
            }
        } else if (OfficeUtil.Util.isPresentationView()) {
            src = Strings.buttonIcons.backHoverPPT;
        }

        $target.attr("src", src);
        return false;
    }

    /**
    * Set back button icon in press(ppt/excel, rtl and default direction).
    */
    private static backPressHandle(e) {
        var $target = $(e.target || e.srcElement);
        // Set default press icon(excel ltr).
        var src = Strings.buttonIcons.backPress;

        if (OfficeUtil.Util.isRtlLanguage()) {
            if (OfficeUtil.Util.isPresentationView()) {
                src = Strings.buttonIcons.backPressRTLPPT;
            } else {
                src = Strings.buttonIcons.backPressRTL;
            }
        } else if (OfficeUtil.Util.isPresentationView()) {
            src = Strings.buttonIcons.backPressPPT;
        }

        $target.attr("src", src);
        return false;
    }

    /**
    * Set back button icon in default(ppt/excel, rtl and default direction).
    */
    private static setBackDefaultIcon() {
        var defaultSrc = Strings.buttonIcons.back;
        if (OfficeUtil.Util.isRtlLanguage()) {
            if (OfficeUtil.Util.isPresentationView()) {
                defaultSrc = Strings.buttonIcons.backRTLPPT;
            } else {
                defaultSrc = Strings.buttonIcons.backRTL;
            }
        } else if (OfficeUtil.Util.isPresentationView()) {
            defaultSrc = Strings.buttonIcons.backPPT;
        }
        $(".topBanner .back-icon").attr("src", defaultSrc);
    }

    /**
    * Set button icon in default, hover in, hover out, mouse down and mouse up.
    */
    private static setBtnIcons(selector: string,
        icons: {
            icon: string;
            hoverIcon: string;
            pressIcon: string
        }) {
        var btn = $(selector);
        btn.attr("src", icons.icon);

        btn.hover((e) => {
                $(e.target || e.srcElement).attr("src", icons.hoverIcon);
                return false;
            }, (e) => {
                $(e.target || e.srcElement).attr("src", icons.icon);
                return false;
            }).focusin((e) => {
                $(e.target || e.srcElement).attr("src", icons.hoverIcon);
                return false;
            }).focusout((e) => {
                $(e.target || e.srcElement).attr("src", icons.icon);
                return false;
            }).mousedown((e) => {
                $(e.target || e.srcElement).attr("src", icons.pressIcon);
                return false;
            }).mouseup((e) => {
                $(e.target || e.srcElement).attr("src", icons.icon);
                return false;
            });
    }
} 