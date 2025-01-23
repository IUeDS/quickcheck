export class NavComponent {
    get homeLink() {
      return cy.get('.qc-nav-home a');
    }
  
    get resultsLink() {
      return cy.get('.qc-nav-results a');
    }
  
    get setsLink() {
      return cy.get('.qc-nav-sets a');
    }
  
    goToHome() {
      this.homeLink.click();
    }
  
    goToResults() {
      this.resultsLink.click();
    }
  
    goToSets() {
      this.setsLink.click();
    }
  }
  
  export const nav = new NavComponent();