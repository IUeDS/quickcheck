import data from './data/data';

Cypress.Commands.add('newLocalAssessment', () => {
    const url = data.urls.localRoot + data.urls.testEndpoints.newAssessment;
    const setName = data.sets.toBeDeleted.name;
    const subsetName = data.sets.toBeDeleted.subsets.group1;
    const qcName = data.sets.toBeDeleted.quickchecks.test;

    cy.request('POST', url, { setName, subsetName, qcName }).then((response) => {
      expect(response.status).to.eq(200);
    });
});

Cypress.Commands.add('newLocalSet', () => {
    const url = data.urls.localRoot + data.urls.testEndpoints.newSet;
    const name = data.sets.toBeDeleted.name;
    const description = data.sets.toBeDeleted.description;

    cy.request('POST', url, { name, description }).then((response) => {
      expect(response.status).to.eq(200);
    });
});

Cypress.Commands.add('refreshLocalDB', () => {
    const url = data.urls.localRoot + data.urls.testEndpoints.refresh;
    cy.request('POST', url).then((response) => {
      expect(response.status).to.eq(200);
    });
});




declare global {
  namespace Cypress {
    interface Chainable {
      newLocalAssessment(): Chainable<void>,
      newLocalSet(): Chainable<void>,
      refreshLocalDB(): Chainable<void>
    }
  }
}

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }