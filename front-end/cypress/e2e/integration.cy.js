import createRecommendationDataFactory from "./factories/createRecommendationDataFactory";

describe("Route /", () => {
  it("Testa se cadastra um usuário com sucesso", () => {
    const recommendation = createRecommendationDataFactory();
    cy.createRecommendation(recommendation);
  });
});
