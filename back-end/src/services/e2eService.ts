import * as e2eRepository from "../repositories/e2eRepository.js";

export async function truncate() {
  await e2eRepository.truncate();
}

export async function getByName(name: string) {
  return await e2eRepository.findByName(name);
}
