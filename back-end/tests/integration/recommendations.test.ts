import supertest from "supertest";
import app from "../../src/app";
import  {prisma}  from "../../src/database";
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
  it("Should return 200 if post vote to recommendation correctly", async () => {
   const createdMusic = await musicFactory();

    const result = await supertest(app).post(`/recommendations/${createdMusic.id}/upvote`).send();

    expect(result.status).toBe(200);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
