import supertest from "supertest";
import app from "../src/app";
import  {prisma}  from "../src/database";
import recommendationFactory from "./factories/recommendationFactory";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`;
});

describe("Test POST /recommendations", () => {
  it("Should return 200 if post recommendation correctly", async () => {
    const music = await recommendationFactory();
    const result = await supertest(app).post(`/recommendations`).send(music);

    const createdMusic = await prisma.recommendation.findFirst({
      where: { name: music.name },
    });

    expect(result.status).toBe(201);
    expect(createdMusic).toBeInstanceOf(Object);
  });

  it("Should return 409 if registered a recommendation that already exists", async () => {
    const music = await recommendationFactory();

    await supertest(app).post(`/recommendations`).send(music);
    const result = await supertest(app).post(`/recommendations`).send(music);

    expect(result.status).toBe(409);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
