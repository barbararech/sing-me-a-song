import createRecommendationDataFactory from "./factories/createRecommendationDataFactory";

beforeEach(() => {
  cy.resetDatabase();
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

describe("Downvote recommendation", () => {
  it("tests if it downvote a recommendation correctly if score is greater than -5", () => {
    const recommendation = createRecommendationDataFactory();

    cy.downvoteRecommendation(recommendation).then((el) => {
      cy.log(el)
       cy.get('[data-test-id="score"]').should("contain.text", `${el + 1}`);
    });
  });
});
