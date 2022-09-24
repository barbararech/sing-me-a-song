import { faker } from "@faker-js/faker";

export default function createRecommendationDataFactory() {
  const fakerString = faker.random.alpha(11);
  const  recommendation = {
    name: fakerString,
    youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO"
  };
  return recommendation
}
