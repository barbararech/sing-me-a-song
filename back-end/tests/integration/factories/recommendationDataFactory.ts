import { faker } from "@faker-js/faker";

export default async function recommendationDataFactory() {
  const fakerString = faker.random.alpha(11);
  return {
    name: faker.music.songName(),
    youtubeLink: `https://youtu.be/${fakerString}`,
  };
}
