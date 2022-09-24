import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import musicDataFactory from "./factories/recommendationDataFactory";

describe("Test POST /recommendations", () => {
  it("Should return 200 if post recommendation correctly", async () => {
    const music = await musicDataFactory();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(music);
    expect(recommendationRepository.create).toBeCalled();
  });

  it("Should return 409 if registered a recommendation that already exists", async () => {
    const music = await musicDataFactory();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return { name: music.name, youtubeLink: music.youtubeLink };
      });

    const result = recommendationService.insert(music);
    expect(result).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict",
    });
  });
});

describe("Test POST /recommendations/:id/upvote", () => {
  it("Should return 200 if voting on the recommendation correctly", async () => {
    const music = await musicDataFactory();
    const id = 1;

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return { id, name: music.name, youtubeLink: music.youtubeLink };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should return 404 if voting for a recommendation that doesn't exist", async () => {
    const music = await musicDataFactory();
    const id = 1;

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.upvote(id);
    expect(result).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});

describe("Test POST /recommendations/:id/downvote", () => {
  it("Should return 200 if voting on the recommendation with score greater than -5 correctly", async () => {
    const music = await musicDataFactory();
    const updatedRecommendation = {
      id: 1,
      score: 10,
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          id: updatedRecommendation.id,
          name: music.name,
          youtubeLink: music.youtubeLink,
          score: updatedRecommendation.score,
        };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return {
          id: updatedRecommendation.id,
          name: music.name,
          youtubeLink: music.youtubeLink,
          score: updatedRecommendation.score,
        };
      });

    await recommendationService.downvote(updatedRecommendation.id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });
  it("Should return 200 if voting on the recommendation with score smaller than -5 correctly", async () => {
    const music = await musicDataFactory();
    const updatedRecommendation = {
      id: 1,
      score: -6,
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return {
          id: updatedRecommendation.id,
          name: music.name,
          youtubeLink: music.youtubeLink,
          score: updatedRecommendation.score,
        };
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return {
          id: updatedRecommendation.id,
          name: music.name,
          youtubeLink: music.youtubeLink,
          score: updatedRecommendation.score,
        };
      });

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(updatedRecommendation.id);

    expect(recommendationRepository.remove).toBeCalled();
  });
});
