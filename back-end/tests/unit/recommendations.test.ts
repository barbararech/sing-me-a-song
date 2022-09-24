import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import createMusicDataFactory from "./factories/createRecommendationDataFactory";
import musicDataFactory from "./factories/recommendationDataFactory";
import musicListFactory from "./factories/recommendationListFactory";
import { notFoundError } from "../../src/utils/errorUtils";
import { prisma } from "../../src/database";

// beforeEach(() => {
//   jest.resetAllMocks();
//   jest.clearAllMocks();
// });

describe("Test POST /recommendations", () => {
  it("Should return 200 if post recommendation correctly", async () => {
    const recommendation = await createMusicDataFactory();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.create).toBeCalled();
  });

  it("Should return 409 if registered a recommendation that already exists", async () => {
    const recommendation = await createMusicDataFactory();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => {
        return { name: recommendation.name, youtubeLink: recommendation.youtubeLink };
      });

    const result = recommendationService.insert(recommendation);
    expect(result).rejects.toEqual({
      message: "Recommendations names must be unique",
      type: "conflict",
    });
  });
});

describe("Test POST /recommendations/:id/upvote", () => {
  it("Should return 200 if voting on the recommendation correctly", async () => {
    const recommendation = await musicDataFactory();

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(recommendation.id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should return 404 if voting for a recommendation that doesn't exist", async () => {
    const recommendation = await musicDataFactory();

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.upvote(recommendation.id);
    expect(result).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});

describe("Test POST /recommendations/:id/downvote", () => {
  it("Should return 200 if voting on the recommendation with score greater than -5 correctly", async () => {
    const recommendation = await musicDataFactory();

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("Should return 200 if voting on the recommendation with score smaller than -5 correctly", async () => {
    const recommendation = await musicDataFactory();
    recommendation.score = -6;

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {
        return recommendation;
      });

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(recommendation.id);

    expect(recommendationRepository.remove).toBeCalled();
  });

  it("Should return 404 if voting for a recommendation that doesn't exist", async () => {
    const recommendation = await musicDataFactory();

    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => {});

    const result = recommendationService.downvote(recommendation.id);
    expect(result).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});

describe("Test GET /recommendations", () => {
  it("Should return 200 if get recommendations correctly", async () => {
    const recommendationList = await musicListFactory();
    console.log(recommendationList)
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return recommendationList;
      });

    const result = recommendationService.get();
    expect(result).toBeInstanceOf(Object);
  });
});

describe("Test GET /recommendations/top/:amount", () => {
  it("Should return 200 if get recommendations correctly", async () => {
    const musicList = await musicListFactory();
    const amount = 3;

    const musicListSorted = musicList
      .sort((a, b) => {
        return b.score - a.score;
      })
      .splice(0, amount);

    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => {
        return musicListSorted;
      });

    const result = recommendationService.getTop(amount);
    expect(result).toBeInstanceOf(Object);
  });
});

describe("Test GET /recommendations/random", () => {
  it("Should return 200 if get the recommendation with score greater than 10 correctly", async () => {
    const musicList = await musicListFactory();
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.4);

    const recommendations = musicList.filter((el: any) => {
      return el.score > 10;
    });

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return recommendations;
      });

    const result = await recommendationService.getRandom();
    console.log(result);
    expect(result).toBeInstanceOf(Object);
    expect(result.score).toBeGreaterThanOrEqual(10);
  });
});
