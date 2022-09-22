import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import musicFactory from "./factories/musicFactory";
import musicDataFactory from "./factories/musicDataFactory";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
});

describe("Test POST /recommendations", () => {
  it("Should return 200 if post recommendation correctly", async () => {
    const music = await musicDataFactory();
    const result = await supertest(app).post(`/recommendations`).send(music);

    const createdMusic = await prisma.recommendation.findFirst({
      where: { name: music.name },
    });

    expect(result.status).toBe(201);
    expect(createdMusic).toBeInstanceOf(Object);
  });

  it("Should return 409 if registered a recommendation that already exists", async () => {
    const music = await musicDataFactory();

    await supertest(app).post(`/recommendations`).send(music);
    const result = await supertest(app).post(`/recommendations`).send(music);

    expect(result.status).toBe(409);
  });
});

describe("Test POST /recommendations/:id/upvote", () => {
  it("Should return 200 if voting on the recommendation correctly", async () => {
    const createdMusic = await musicFactory();

    const result = await supertest(app)
      .post(`/recommendations/${createdMusic.id}/upvote`)
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
    const createdMusic = await musicFactory();

    const result = await supertest(app)
      .post(`/recommendations/${createdMusic.id}/downvote`)
      .send();

    expect(result.status).toBe(200);
  });

  it("Should return 200 if voting on the recommendation correctly if score is less than -5", async () => {
    const createdMusic = await musicFactory();

    await prisma.recommendation.update({
      where: { name: createdMusic.name },
      data: {
        score: -5,
      },
    });

    const result = await supertest(app)
      .post(`/recommendations/${createdMusic.id}/downvote`)
      .send();

    const findMusic = await prisma.recommendation.findFirst({
      where: { name: createdMusic.name },
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

afterAll(async () => {
  await prisma.$disconnect();
});
