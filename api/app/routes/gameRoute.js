import express from "express";

import { createGame, deleteLastGame, getLeaderboardGames } from "../controllers/gameController";
import verifyAuth from "../middlewares/verifyAuth";

const router = express.Router();

router.post("/leaderboard/:uuid/game", verifyAuth, createGame);

router.get("/leaderboard/:uuid/game/:N", getLeaderboardGames);

router.delete("/leaderboard/:uuid/game", verifyAuth, deleteLastGame);


export default router;
