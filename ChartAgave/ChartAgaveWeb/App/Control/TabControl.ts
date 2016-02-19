class Tabs {
    // Tab control for Jquery object.
    public tabControl: JQuery;

    // Store all tab panels id.
    private tabIds: string[];

    // Current active tab.
    public currentTab: string;

    // tab click event, hit as long as tab was clicked.
    public tabClick: (text) => void;

    constructor(tabId: string) {
        // Get tabContol jquery object by id.
        this.tabControl = $(tabId);

        // Get all tab panels id.
        this.tabIds = this.getTabs();

        // Init tab control.
        this.init();
    }

    /**
    * Get all tab panels id by query "a" link property("href").
    * which linked to target panel.
    */
    private getTabs() {
        var tabs = [];
        this.tabControl.find("ul>li>a").each(function () {
            var href = $(this).attr("href");
            href && tabs.push(href);
        });

        return tabs;
    }

    /**
    * Set tab panel display to none to hide panel.
    */
    private hideTabs() {
        if (this.tabIds.length !== 0) {
            $.each(this.tabIds, function (index, id) {
                $(id).css("display", "none");
            })
         }
    }

    /**
    *  Show special tab panel by id.
    */
    private showTab(tabId: string) {
        if (tabId != null) {
            $(tabId).fadeIn();
        }

        return false;
    }

    /*
    * Init tab control.
    */
    private init() {
        // Define a veriable to refer to TabControl.
        var that = this;

        // Hide all tab panel by default.
        this.hideTabs();

        // Only show active tab panel.
        this.showTab($(".active-color").attr("href"));

        // Add click event for each tab link.
        this.tabControl.find("ul>li>a").click(function (e) {
            var $a = $(this);
            that.currentTab = $a.attr("href");

            // Get visibility tab.
            var visTab = $(".active-color").attr("href");

            // Fadeout original tab panel. and show target panel
            // in call back.
            $(visTab).fadeOut(100, function () {
                // Toggle active style.
                $(".settings-content>ul>li>a").removeClass("active-color");
                $a.addClass("active-color");

                // Show target tab panel.
                that.showTab($a.attr("href"));
                that.tabClick && that.tabClick($a.text());
            });

            return false;
        });
    }
} 