import express from "express";

import { createGame, getLeaderboardGames } from "../controllers/gameController";
import verifyAuth from "../middlewares/verifyAuth";

const router = express.Router();

router.post("/leaderboard/:uuid/game", verifyAuth, createGame);

router.get("/leaderboard/:uuid/game/:N", getLeaderboardGames);


export default router;
