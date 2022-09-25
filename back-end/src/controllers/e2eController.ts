import { Request, Response } from "express";
import * as e2eService from "../services/e2eService.js";

async function reset(req: Request, res: Response) {
  await e2eService.truncate();
  res.sendStatus(200);
}

async function findByName(req: Request, res: Response) {
  const name = req.params.name;
 const recommendation =  await e2eService.getByName(name);
  res.send(recommendation)
}

export { reset, findByName };
