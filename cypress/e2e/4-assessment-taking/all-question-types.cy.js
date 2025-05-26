import { setPage } from '../../support/pages/setPage';
import data from '../../support/data/data';

describe('Taking an assessment with all question types', function() {
    before(() => {
        cy.newLocalAssessmentAllQuestionTypes();
    });

    beforeEach(function () {
        const url = data.urls.local.setPage;
        cy.visit(url);
        //TODO: click preview button and view in new tab
    });

    it('', function() {
       
    });
});