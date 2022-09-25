// ***********************************************
// This example commands.js shows you how to
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

Cypress.Commands.add("createRecommendation", (recommendation) => {
  cy.visit("http://localhost:3000/");
  cy.log(recommendation);

  cy.get('input[placeholder="Name"]').type(recommendation.name);
  cy.get('input[placeholder="https://youtu.be/..."]').type(
    recommendation.youtubeLink
  );

  cy.intercept("POST", "/recommendations").as("createRecommendation");

  cy.get("button").click();

  cy.wait("@createRecommendation");
});

// Cypress.Commands.add("resetDatabase", () => {
//   cy.request("POST", "http://localhost:4000/recommendations/e2e/reset");
// });

// // cypress/integration/fooBar.spec.js

// beforeEach(() => {
//   cy.resetDatabase();
// });
