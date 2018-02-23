var CanvasLogin = function(browserRef) {
    var page = this,
        EC = protractor.ExpectedConditions;
    page.browser = browserRef;
    page.rootUrl = 'https://iu.instructure.com/courses/1588031';

    page.includes = require('../../common/includes.js');
    page.data = page.includes.data;

    //selectors (elements would not work because of NoSuchElementError across multiple pages;
    //I could make separate page objects for each, but considering we nede to do like ONE THING
    //on each of these pages, it just makes more sense to keep it in one, even if a touch clunkier)
    page.canvasNav = '#section-tabs';
    page.casPasswordField = '#password';
    page.casSubmitBtn = '.button--submit';
    page.casUserNameField = '#username';
    page.iFrame = '#tool_content';
    page.loginBtn = 'Log-in';

    //functions
    page.getNavItems = getNavItems;
    page.login = login;

    function getNavItems() {
        page.browser.driver.wait(EC.presenceOf(page.browser.element(by.css(page.canvasNav))));
        return page.browser.driver.findElement(by.css(page.canvasNav)).getText();
    }

    function login(username, password) {
        page.browser.driver.get(page.rootUrl);
        page.browser.driver.findElement(by.linkText(page.loginBtn)).click();
        page.browser.driver.findElement(by.css(page.casUserNameField)).sendKeys(username);
        page.browser.driver.findElement(by.css(page.casPasswordField)).sendKeys(password);
        page.browser.driver.findElement(by.css(page.casSubmitBtn)).click();
    }
};

module.exports = CanvasLogin;