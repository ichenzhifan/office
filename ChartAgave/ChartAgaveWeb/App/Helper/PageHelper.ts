enum Page {
    ChartPage,
    ChartTypePage,
    DataPage
}

interface IAgavePage {
    page: Page;
    beforeLeave?: (data?: any) => void;
    beforeLoaded?: (data?: any) => void;
    afterLoaded?: (data?: any) => void;
}

class PageHelper {
    /**
    * Navigate to the specified page
    */
    public static navigateToPage(page: IAgavePage) {
        var $page: JQuery;

        switch (page.page) {
            case Page.ChartPage:
                $page = ChartAgave.$chartPage;
                break;
            case Page.ChartTypePage:
                $page = ChartAgave.$chartTypePage;
                break;
            case Page.DataPage:
                $page = ChartAgave.$dataPage;
                break;
            default:
                break;
        }

        if ($page !== undefined) {
            ChartAgave.currentPage && ChartAgave.currentPage.beforeLeave && ChartAgave.currentPage.beforeLeave();
            if (ChartAgave.toolbarControl !== undefined) {
                ControlHelper.hideControl(ChartAgave.toolbarControl, null, false);
            }
            page.beforeLoaded && page.beforeLoaded();
            $page.siblings().hide();
            $page.show();
            page.afterLoaded && page.afterLoaded();
            ChartAgave.currentPage = page;
        }
    }

    /** 
    * Back to chart page
    */
    public static backBtnHandler() {
        PageHelper.navigateToPage(ChartAgave.chartPage);
        // To avoid invoke toolbar
        return false;
    }
}