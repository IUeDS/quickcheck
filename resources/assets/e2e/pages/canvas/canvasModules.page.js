var CanvasModulesPage = function(browserRef) {
    var page = this,
        EC = protractor.ExpectedConditions;
    page.browser = browserRef;
    page.includes = require('../../common/includes.js');

    page.common = new page.includes.Common(page.browser);
    page.maxWait = 10000;

    //elements
    page.addModuleBtn = page.browser.element(by.css('.add_module_link'));
    page.addModuleItemBtn = page.browser.element.all(by.css('.add_module_item_link')).first();
    page.moduleItemTitleInput = page.browser.element(by.css('#external_tool_create_title'));
    page.moduleItemTypeInput = page.browser.element(by.css('#add_module_item_select'));
    page.moduleNameInput = page.browser.element(by.css('#context_module_name'));
    page.modulePublishBtn = page.browser.element(by.css('.module .icon-unpublish'));
    page.moduleItemPublishBtn = page.browser.element(by.css('.context_module_item .icon-unpublish'));
    page.saveModuleBtn = page.browser.element(by.css('.ui-dialog .submit_button'));
    page.saveModuleItemBtn = page.browser.element(by.css('.ui-dialog-buttonset .add_item_button'));
    page.toolLink = page.browser.element(by.css('#context_external_tools_select')).element(by.partialLinkText(page.common.toolEmbedName));

    //functions
    page.addModule = addModule;
    page.addExternalToolLink = addExternalToolLink;
    page.publishModuleItem = publishModuleItem;
    page.saveExternalTool = saveExternalTool;
    page.selectItemByLinkText = selectItemByLinkText;
    page.setExternalToolTitle = setExternalToolTitle;

    async function addExternalToolLink() {
        var optionText = 'External Tool';
        await page.addModuleItemBtn.click();
        await page.browser.wait(EC.presenceOf(page.moduleItemTypeInput), page.maxWait);
        await page.browser.wait(EC.textToBePresentInElement(page.moduleItemTypeInput, optionText), page.maxWait);
        await page.moduleItemTypeInput.sendKeys(optionText);
        await page.browser.wait(EC.elementToBeClickable(page.toolLink), page.maxWait);
        await page.toolLink.click();
    }

    async function addModule(moduleName) {
        await page.browser.wait(EC.elementToBeClickable(page.addModuleBtn), page.maxWait);
        //I reeeeeeally hate to do this, but even though it was clickable, the button would not respond,
        //guess Canvas was still loading something up. frustrating... sleep for just a sec
        await page.browser.sleep(1000);
        await page.addModuleBtn.click();
        await page.browser.wait(EC.visibilityOf(page.moduleNameInput), page.maxWait);
        await page.moduleNameInput.sendKeys(moduleName);
        await page.saveModuleBtn.click();
        await page.browser.wait(EC.invisibilityOf(page.saveModuleBtn), page.maxWait);
        //once again: errors with some other element receiving the click, even when I was waiting for
        //the condition that the publish button be clickable. real helpful, that function is...
        await page.browser.sleep(1000);
        await page.modulePublishBtn.click();
    }

    async function publishModuleItem() {
        await page.browser.wait(EC.elementToBeClickable(page.moduleItemPublishBtn), page.maxWait);
        await page.moduleItemPublishBtn.click();
    }

    async function saveExternalTool() {
        await page.browser.sleep(1000);
        await page.saveModuleItemBtn.click();
        await page.browser.sleep(1000);
    }

    async function selectItemByLinkText(text) {
        var link = page.browser.element(by.partialLinkText(text));
        await page.browser.wait(EC.elementToBeClickable(link), page.maxWait);
        await link.click();
    }

    async function setExternalToolTitle(title) {
        await page.browser.sleep(1000);
        await page.moduleItemTitleInput.clear();
        await page.moduleItemTitleInput.sendKeys(title);
    }
};

module.exports = CanvasModulesPage;