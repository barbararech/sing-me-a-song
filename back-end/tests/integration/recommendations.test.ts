import supertest from "supertest";
import { jest } from "@jest/globals";
import app from "../../src/app";
import { prisma } from "../../src/database";
import recommendationFactory from "./factories/recommendationFactory";
import recommendationDataFactory from "./factories/recommendationDataFactory";
import recommendationListFactory from "./factories/recommendationListFactory";
import isArraySorted from "./utils/isArraySorted";
import updateRecommendationList from "./utils/updateRecommendationList";

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
});

describe("Test POST /recommendations", () => {
  it("Should return 200 if post recommendation correctly", async () => {
    const recommendation = await recommendationDataFactory();
    const result = await supertest(app)
      .post(`/recommendations`)
      .send(recommendation);

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendation.name },
    });

    expect(result.status).toBe(201);
    expect(createdRecommendation).toBeInstanceOf(Object);
  });

  it("Should return 409 if registered a recommendation that already exists", async () => {
    const recommendation = await recommendationDataFactory();

    await supertest(app).post(`/recommendations`).send(recommendation);
    const result = await supertest(app)
      .post(`/recommendations`)
      .send(recommendation);

    expect(result.status).toBe(409);
  });
});

describe("Test POST /recommendations/:id/upvote", () => {
  it("Should return 200 if voting on the recommendation correctly", async () => {
    const createdRecommendation = await recommendationFactory();

    const result = await supertest(app)
      .post(`/recommendations/${createdRecommendation.id}/upvote`)
      .send();

    expect(result.status).toBe(200);
  });

  it("Should return 404 if voting for a recommendation that doesn't exist", async () => {
    const result = await supertest(app)
      .post(`/recommendations/${0}/upvote`)
      .send();

    expect(result.status).toBe(404);
  });
});

describe("Test POST /recommendations/:id/downvote", () => {
  it("Should return 200 if voting on the recommendation correctly if score is more than -5", async () => {
    const createdRecommendation = await recommendationFactory();

    const result = await supertest(app)
      .post(`/recommendations/${createdRecommendation.id}/downvote`)
      .send();

    expect(result.status).toBe(200);
  });

  it("Should return 200 if voting on the recommendation correctly if score is less than -5", async () => {
    const createdRecommendation = await recommendationFactory();

    await prisma.recommendation.update({
      where: { name: createdRecommendation.name },
      data: {
        score: -5,
      },
    });

    const result = await supertest(app)
      .post(`/recommendations/${createdRecommendation.id}/downvote`)
      .send();

    const findMusic = await prisma.recommendation.findFirst({
      where: { name: createdRecommendation.name },
    });

    expect(result.status).toBe(200);
    expect(findMusic).toBeNull();
  });

  it("Should return 404 if voting for a recommendation that doesn't exist", async () => {
    const result = await supertest(app)
      .post(`/recommendations/${0}/downvote`)
      .send();

    expect(result.status).toBe(404);
  });
});

describe("Test GET /recommendations", () => {
  it("Should return 200 if get recommendations correctly", async () => {
    await recommendationListFactory();

    const result = await supertest(app).get(`/recommendations`);
    const resultLength = result.body.length;

    expect(result.status).toBe(200);
    expect(resultLength).toBeLessThan(11);
    expect(result.body).toBeInstanceOf(Object);
  });
});

describe("Test GET /recommendations/:id", () => {
  it("Should return 200 if get the recommendation correctly", async () => {
    const createdRecommendation = await recommendationFactory();

    const result = await supertest(app)
      .get(`/recommendations/${createdRecommendation.id}`)
      .send();

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject(createdRecommendation);
  });

  it("Should return 404 if get a recommendation that doesn't exist", async () => {
    const result = await supertest(app).get(`/recommendations/${0}`).send();

    expect(result.status).toBe(404);
  });
});

describe("Test GET /recommendations/top/:amount", () => {
  it("Should return 200 if get recommendations correctly", async () => {
    const amount = 20;
    await recommendationListFactory();

    const result = await supertest(app).get(`/recommendations/top/${amount}`);
    const isResultArraySorted = isArraySorted(result.body);

    expect(isResultArraySorted).toBe(true);
    expect(result.body.length).toBeLessThanOrEqual(amount);
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });
});

describe("Test GET /recommendations/random", () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
  });

  it("Should return 200 if get the recommendation with score greater than 10 correctly", async () => {
    await recommendationListFactory();
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.4);

    const result = await supertest(app).get(`/recommendations/random`).send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
    expect(result.body.score).toBeGreaterThan(10);
  });

  it("Should return 200 if get the recommendation with score smaller than 10 correctly", async () => {
    await recommendationListFactory();
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.8);

    const result = await supertest(app).get(`/recommendations/random`).send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
    expect(result.body.score).toBeLessThanOrEqual(10);
  });

  it("Should return any if only exist recommendation with score greater than 10", async () => {
    await recommendationListFactory();
    updateRecommendationList(11);

    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.8);
    const result = await supertest(app).get(`/recommendations/random`).send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });

  it("Should return any if only exist recommendation with score smaller than 10", async () => {
    await recommendationListFactory();
    updateRecommendationList(1);

    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.4);
    const result = await supertest(app).get(`/recommendations/random`).send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });

  it("Should return 404 if get a recommendation that doesn't exist", async () => {
    const result = await supertest(app).get(`/recommendations/random`).send();

    expect(result.status).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
