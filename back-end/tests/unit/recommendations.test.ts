import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import musicDataFactory from "./factories/recommendationDataFactory";

describe("Test POST /recommendations", () => {
  it("Should return 200 if post recommendation correctl", async () => {
    const music = await musicDataFactory();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(music);
    expect(recommendationRepository.findByName).toBeCalled();
  });
});
