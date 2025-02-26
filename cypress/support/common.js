export class Common {
    constructor() {
        this.browserWidth = 1200;
        this.browserHeight = 1000;
        this.randomizedOptionOrder = [];
        this.tinyMce = '#tinymce'; //css reference to get text in tinymce editor
        this.toolEmbedName = 'Quick Check (reg)';
        this.toolName = 'Quick Check (reg)';
    }

    acceptAlert() {
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Alert text');
        });
    }

    areOptionsRandomized() {
        let randomized = false;
        this.randomizedOptionOrder[0].forEach((options) => {
            if (options[0] !== this.randomizedOptionOrder[1][0] || options[0] !== this.randomizedOptionOrder[2][0]) {
                randomized = true;
            }
            if (options[1] !== this.randomizedOptionOrder[1][1] || options[1] !== this.randomizedOptionOrder[2][1]) {
                randomized = true;
            }
            if (options[2] !== this.randomizedOptionOrder[1][2] || options[2] !== this.randomizedOptionOrder[2][2]) {
                randomized = true;
            }
            if (options[3] !== this.randomizedOptionOrder[1][3] || options[3] !== this.randomizedOptionOrder[2][3]) {
                randomized = true;
            }
        });
        return randomized;
    }

    closeTab() {
        cy.close();
    }

    dragAndDrop(elem1, elem2) {
        cy.get(elem1).trigger('mousedown', { which: 1 });
        cy.get(elem2).trigger('mousemove').trigger('mouseup', { force: true });
    }

    enterAngularPage() {
        cy.wait(2000);
        cy.window().then((win) => {
            win.angular.resumeBootstrap();
        });
    }

    enterNonAngularPage() {
        cy.window().then((win) => {
            win.angular.pauseBootstrap();
        });
    }

    enterTinyMceIframeInElement(elem) {
        this.getTinyMceIframeFromElement(elem, true).then((frame) => {
            cy.wrap(frame).its('0.contentDocument.body').should('not.be.empty');
        });
    }

    enterTinyMceText(text, questionElement) {
        const viewButton = questionElement.find('.tox-menubar button').eq(2);
        viewButton.click();

        const sourceCodeButton = cy.contains('.tox-collection__item', 'Source code');
        sourceCodeButton.click();

        const textarea = cy.get('.tox-dialog__body textarea');
        textarea.type('<p>' + text + '</p>');
        const saveBtn = cy.contains('button', 'Save');
        saveBtn.click();
    }

    getSelectedText(select) {
        return select.find('option:selected').invoke('text');
    }

    getTinyMceIframeFromElement(elem, wait = false) {
        const frame = elem.find('.tox-edit-area iframe').first();
        if (wait) {
            frame.should('be.visible');
        }
        return frame;
    }

    getTinyMceText(elem) {
        return this.getTinyMceIframeFromElement(elem, true).then((frame) => {
            return cy.wrap(frame).its('0.contentDocument.body').invoke('text').then((text) => {
                return text;
            });
        });
    }

    goToQuickCheck() {
        cy.contains('a', this.toolName).click();
        this.switchTab(1);
        this.enterAngularPage();
    }

    leaveStudentView() {
        cy.get('.leave_student_view').click();
    }

    leaveTinyMceIframe() {
        cy.window().then((win) => {
            win.document.defaultView.frameElement = null;
        });
    }

    refresh() {
        cy.reload();
    }

    saveOptionList(options) {
        let optionList = [];
        options.each((index, mcOption) => {
            cy.wrap(mcOption).invoke('text').then((text) => {
                optionList.push(text);
            });
        });
        this.randomizedOptionOrder.push(optionList);
    }

    scrollToElement(element) {
        cy.get(element).scrollIntoView();
    }

    setBrowserSize(width, height) {
        if (!width) {
            width = this.browserWidth;
        }
        if (!height) {
            height = this.browserHeight;
        }
        cy.viewport(width, height);
    }

    switchTab(tabIndex) {
        cy.window().then((win) => {
            win.open('', '_self').close();
            cy.window().then((win) => {
                win.focus();
            });
        });
    }

    switchToCanvas() {
        this.enterNonAngularPage();
        cy.window().then((win) => {
            win.document.defaultView.frameElement = null;
        });
    }

    switchToLtiTool() {
        cy.get('#tool_content').then(($iframe) => {
            const $body = $iframe.contents().find('body');
            cy.wrap($body);
        });
    }

    switchToLtiToolEmbed() {
        cy.wait(5000);
        cy.get('#resource_selection_iframe').then(($iframe) => {
            const $body = $iframe.contents().find('body');
            cy.wrap($body);
        });
        cy.wait(2000);
    }

    waitForAngular() {
        cy.window().then((win) => {
            return new Cypress.Promise((resolve) => {
                const checkAngular = () => {
                    if (win.angular) {
                        resolve();
                    } else {
                        setTimeout(checkAngular, 100);
                    }
                };
                checkAngular();
            });
        });
    }

    waitForTinyMce(questionElement) {
        const wordCount = questionElement.find('.tox-statusbar__wordcount');
        wordCount.should('be.visible');
    }
}

export const common = new Common();