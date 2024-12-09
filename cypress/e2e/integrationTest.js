describe('Authentication and Design Creation Flow', () => {
    beforeEach(() => {
        // visit the login page before each test
        cy.visit('/');
      });

    it('should display the sign in button when signed out', () => {
        cy.visit('/');
        cy.contains('Welcome').should('be.visible');
        cy.get('.sign-in-button').should('be.visible');
    });
    
    it('should navigate to the dashboard when logged in', () => {
        cy.mockLogin();
    
        cy.url().should('include', '/dashboard/mock-user-id');
    });

    it('should create and save a new design', () => {
        cy.mockLogin();

        cy.contains('New Design').should('be.visible').click();
    
        cy.url().should('include', '/residential-area/mock-user-id');
    
        cy.contains('Select a Residential Area').should('be.visible');

        cy.contains('Central').click();
    
        cy.url().should('include', '/building-selection/mock-user-id');
    
        cy.contains('Baker').click(); 

        cy.get('canvas').click(70, 51.30206298828125); // simulate canvas click because cypress cannot interact with canvas elements

        cy.contains('Create').click(); 

        cy.url().should('match', /\/editor\/mock-user-id\/[a-f0-9]+/);

        cy.debug();
    
        cy.contains('Save').click();

        cy.get('input[placeholder="Untitled Design"]')
        .should('be.visible')
        .invoke('val', 'XYZ');

        cy.contains('Save').click();

        cy.contains('Back').click();

        // cy.url().should('include', '/dashboard/mock-user-id');
    
        // cy.contains('My New Dorm Design').should('be.visible'); verify that the design appears in the dashboard
    });

    it('should log out successfully', () => {
        cy.mockLogin();
    
        cy.contains('Sign Out').should('be.visible').click();

        cy.url().should('eq', `${Cypress.config().baseUrl}/`);

        cy.contains('Welcome').should('be.visible');
    });
  });