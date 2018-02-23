var CanvasAssignmentsPage = function(browserRef) {
    var page = this,
        EC = protractor.ExpectedConditions;
    page.browser = browserRef;
    page.includes = require('../../common/includes.js');

    page.common = new page.includes.Common(page.browser);
    page.maxWait = 10000;

    //elements
    page.assignmentsLink = page.browser.element(by.css('#section-tabs .assignments'));
    page.dueDate = page.browser.element(by.css('.DueDateInput'));
    page.embedBtn = page.browser.element(by.css('.ui-dialog-buttonset .add_item_button'));
    page.findExternalToolBtn = page.browser.element(by.css('#assignment_external_tool_tag_attributes_url_find'));
    page.ltiContent = page.browser.element(by.css('.tool_content_wrapper'));
    page.modulesLink = page.browser.element(by.css('#section-tabs .modules'));
    page.nameInput = page.browser.element(by.css('#assignment_name'));
    page.newAssignmentBtn = page.browser.element(by.css('.new_assignment'));
    page.pointsPossible = page.browser.element(by.css('#assignment_points_possible'));
    page.saveBtn = page.browser.element(by.css('.save_and_publish'));
    page.submissionType = page.browser.element(by.css('#assignment_submission_type'));
    page.toolLink = page.browser.element(by.css('#context_external_tools_select')).element(by.partialLinkText(page.common.toolEmbedName));

    //functions
    page.createAssignment = createAssignment;
    page.createAssignmentAndOpenEmbed = createAssignmentAndOpenEmbed;
    page.enterAssignmentName = enterAssignmentName;
    page.enterPointsPossible = enterPointsPossible;
    page.getAssignmentLink = getAssignmentLink;
    page.goToAssignments = goToAssignments;
    page.goToModules = goToModules;
    page.openAssignment = openAssignment;
    page.saveEmbed = saveEmbed;
    page.selectExternalTool = selectExternalTool;
    page.setDueDate = setDueDate;

    function createAssignment() {
        page.browser.wait(EC.presenceOf(page.newAssignmentBtn), page.maxWait);
        page.newAssignmentBtn.click();
    }

    function createAssignmentAndOpenEmbed(assignmentName, assignmentPoints, dueDate) {
        page.goToAssignments();
        page.createAssignment();
        page.enterAssignmentName(assignmentName);
        page.enterPointsPossible(assignmentPoints);
        page.setDueDate(dueDate);
        return page.selectExternalTool();
    }

    function enterAssignmentName(assignmentName) {
        page.browser.wait(EC.presenceOf(page.nameInput), page.maxWait);
        page.nameInput.sendKeys(assignmentName);
    }

    function enterPointsPossible(assignmentPoints) {
        page.pointsPossible.clear();
        page.pointsPossible.sendKeys(assignmentPoints);
    }

    function getAssignmentLink(assignmentName) {
        //assuming there won't be multiple links with the assignment name; could add
        //additional selectors in the future beyond just the link text if necessary
        var link = page.browser.element(by.partialLinkText(assignmentName));
        page.browser.wait(EC.presenceOf(link), page.maxWait);
        return link;
    }

    function goToAssignments() {
        page.browser.wait(EC.elementToBeClickable(page.assignmentsLink));
        page.assignmentsLink.click();
    }

    function goToModules() {
        page.browser.wait(EC.presenceOf(page.modulesLink), page.maxWait);
        page.modulesLink.click();
    }

    function openAssignment(assignmentName) {
        var link = page.getAssignmentLink(assignmentName);
        page.browser.wait(EC.elementToBeClickable(link));
        link.click();
        page.browser.wait(EC.presenceOf(page.ltiContent));
    }

    function saveEmbed() {
        //LET ME TELL YOU about this. Please, have a seat. Get comfortable. Words cannot describe the
        //buffoonery of this. Why have a switchToCanvas() function when that was already called in the
        //wrapper? To quote Pee-Wee Herman: "I DON'T KNOW!" Wouldn't it suffice just to have a single
        //call to this function in the wrapper, or here directly in the function? ONE WOULD THINK SO.
        //For hours, I got failed after failed test, saying that protractor was not able to sync up
        //to the page, because angular was not found on the window. This was AFTER I had already called
        //the switchToCanvas() function to turn off browser synchronization and prevent such errors. You
        //want to know the best part? IT WORKS ON THE FIRST ASSIGNMENT, BUT NOT ON ASSIGNMENTS 3 AND 4.
        //Protractor apparently is a quantum testing framework, the results always change! GAHHHHH
        page.common.switchToCanvas().then(function() {
            page.browser.sleep(1000); //and to top it all off, some sleep time due to inconsistencies
            page.embedBtn.click();
            page.saveBtn.click();
            page.browser.wait(EC.stalenessOf(page.saveBtn), page.maxWait); //wait until we're redirected
        });
    }

    function selectExternalTool() {
        page.submissionType.sendKeys('External');
        page.findExternalToolBtn.click();
        page.browser.wait(EC.presenceOf(page.toolLink), page.maxWait);
        //argh, sometimes the link is visible but when clicked, nothing opens, probably because
        //Canvas is still loading up components somewhere; so wait a couple extra seconds to
        //prevent tests inconsistently failing from time to time.
        page.browser.sleep(2000);
        return page.toolLink.click().then(function() { //I have no idea why, but would not work without then()
            return page.common.switchToLtiToolEmbed();
        });
    }

    function setDueDate(dueDate) {
        page.dueDate.clear();
        if (dueDate) {
            page.dueDate.sendKeys(dueDate);
        }
    }
}

module.exports = CanvasAssignmentsPage;