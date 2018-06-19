function Common(browserRef) {
    var common = this,
        EC = protractor.ExpectedConditions;

    common.browser = browserRef;
    common.browserWidth = 1200;
    common.browserHeight = 1000;
    common.randomizedOptionOrder = [];
    common.tinyMce = '#tinymce'; //css reference to get text in tinymce editor
    common.toolEmbedName = 'Quick Check (reg)';
    common.toolName = 'Quick Check (reg)';

    //functions
    common.acceptAlert = acceptAlert;
    common.areOptionsRandomized = areOptionsRandomized;
    common.closeTab = closeTab;
    common.enterAngularPage = enterAngularPage;
    common.enterNonAngularPage = enterNonAngularPage;
    common.enterTinyMceIframeInElement = enterTinyMceIframeInElement;
    common.enterTinyMceText = enterTinyMceText;
    common.getSelectedText = getSelectedText;
    common.getTinyMceIframeFromElement = getTinyMceIframeFromElement;
    common.getTinyMceText = getTinyMceText;
    common.goToQuickCheck = goToQuickCheck;
    common.leaveStudentView = leaveStudentView;
    common.leaveTinyMceIframe = leaveTinyMceIframe;
    common.refresh = refresh;
    common.saveOptionList = saveOptionList;
    common.setBrowserSize = setBrowserSize;
    common.switchTab = switchTab;
    common.switchToCanvas = switchToCanvas;
    common.switchToLtiTool = switchToLtiTool;
    common.switchToLtiToolEmbed = switchToLtiToolEmbed;

    function acceptAlert() {
        common.browser.driver.switchTo().alert().then(function (alert) {
            alert.accept();
        });
    }

    //this is specifically tied to the one randomized question we have, multiple choice, and its 4 options, so it
    //would be brittle if used elsewhere; not needed for now, but could be made more flexible if needed elsewhere
    function areOptionsRandomized() {
        var randomized = false;
        common.randomizedOptionOrder[0].forEach(function(options) {
            if (options[0] !== common.randomizedOptionOrder[1][0] || options[0] !== common.randomizedOptionOrder[2][0]) {
                randomized = true;
            }
            if (options[1] !== common.randomizedOptionOrder[1][1] || options[1] !== common.randomizedOptionOrder[2][1]) {
                randomized = true;
            }
            if (options[2] !== common.randomizedOptionOrder[1][2] || options[2] !== common.randomizedOptionOrder[2][2]) {
                randomized = true;
            }
            if (options[3] !== common.randomizedOptionOrder[1][3] || options[3] !== common.randomizedOptionOrder[2][3]) {
                randomized = true;
            }
        });
        return randomized;
    }

    function closeTab() {
        common.browser.close();
    }

    function enterAngularPage() {
        common.browser.driver.sleep(2000);
        common.browser.ignoreSynchronization = false;
        common.browser.waitForAngularEnabled(true);
    }

    function enterNonAngularPage() {
        common.browser.ignoreSynchronization = true;
        common.browser.waitForAngularEnabled(false);
    }

    function enterTinyMceIframeInElement(elem) {
        var frame = common.getTinyMceIframeFromElement(elem);
        common.browser.driver.switchTo().frame(frame.getWebElement());
        common.enterNonAngularPage();
    }

    function enterTinyMceText(text) {
        common.browser.driver.findElement(by.css(common.tinyMce)).sendKeys(text);
    }

    function getSelectedText(select) {
        return select.element(by.css('option:checked')).getText();
    }

    function getTinyMceIframeFromElement(elem) {
        return elem.all(by.css('.mce-edit-area iframe')).first();
    }

    function getTinyMceText() {
        return common.browser.driver.findElement(by.css(common.tinyMce)).getText();
    }

    function goToQuickCheck() {
        common.browser.driver.findElement(by.linkText(common.toolName)).click();
        return common.switchToLtiTool();
    }

    function leaveStudentView() {
        common.browser.driver.findElement(by.css('.leave_student_view')).click();
    }

    function leaveTinyMceIframe() {
        common.browser.driver.switchTo().defaultContent();
    }

    function refresh() {
        return common.browser.refresh();
    }

    function saveOptionList(options) {
        var optionList = [];
        options.each(function(mcOption) {
            mcOption.getText().then(function(text) {
                optionList.push(text);
            });
        });
        common.randomizedOptionOrder.push(optionList);
    }

    function setBrowserSize(width, height) {
        if (!width) {
            width = common.browserWidth;
        }
        if (!height) {
            height = common.browserHeight;
        }
        common.browser.driver.manage().window().setSize(width, height);
    }

    function switchTab(tabIndex) {
        common.browser.getAllWindowHandles().then(function (handles) {
            common.browser.switchTo().window(handles[tabIndex]);
        });
    }

    function switchToCanvas() {
        common.enterNonAngularPage();
        return common.browser.driver.switchTo().defaultContent();
    }

    function switchToLtiTool() {
        return common.browser.driver.switchTo().frame(common.browser.driver.findElement(by.css('#tool_content')));
    }

    function switchToLtiToolEmbed() {
        var iframe = '#resource_selection_iframe';
        //I really hate to use sleep(), but inconsistent errors with the iframe not showing up, and also was
        //getting errors with not finding bindings using EC since we are outside of an angular context
        common.browser.driver.sleep(5000);
        return common.browser.driver.switchTo().frame(common.browser.driver.findElement(by.css(iframe)));
    }
}

module.exports = Common;