import createRecommendationDataFactory from "./factories/createRecommendationDataFactory";

beforeEach( () => {
  cy.request("POST", "http://localhost:4000/e2e/reset", {});
});

describe("Route /", () => {
  it("Testa se cadastra um usuário com sucesso", () => {
    const recommendation = createRecommendationDataFactory();
    cy.createRecommendation(recommendation);
    cy.contains(recommendation.name).should("be.visible");
  });
});
