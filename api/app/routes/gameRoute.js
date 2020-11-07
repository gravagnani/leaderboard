import express from "express";

import { createGame } from "../controllers/gameController";
import verifyAuth from "../middlewares/verifyAuth";

const router = express.Router();

router.post("/leaderboard/:uuid/game", verifyAuth, createGame);


export default router;
