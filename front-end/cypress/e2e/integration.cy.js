import createRecommendationDataFactory from "./factories/createRecommendationDataFactory";

beforeEach( () => {
  cy.resetDatabase()
});


describe("Create recommendation", () => {
  it("Tests if it creates a recommendation correctly", () => {
    const recommendation = createRecommendationDataFactory();
    cy.createRecommendation(recommendation);
  });
});

describe("Upvote recommendation", () => {
  it("tests if it upvote a recommendation correctly", () => {
    const recommendation = createRecommendationDataFactory();
    cy.upvoteRecommendation(recommendation);
  });
});