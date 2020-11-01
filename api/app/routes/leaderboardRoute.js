import express from "express";

import {
	createLeaderboard,
	getAllLeaderboards,
	getLeaderboardByUUID,
	getLeaderboardByTitle,
	modifyLeaderboard,
	joinLeaderboard,
} from "../controllers/leaderboardController";
import verifyAuth from "../middlewares/verifyAuth";

const router = express.Router();

// TODO: valutare se ricercare solamente se flag_public = 1
router.get("/leaderboard/", getAllLeaderboards);
router.get("/leaderboard/uuid/:uuid", getLeaderboardByUUID);
router.get("/leaderboard/title/:title", getLeaderboardByTitle);

router.post("/leaderboard/", verifyAuth, createLeaderboard);

router.post("/leaderboard/join/", verifyAuth, joinLeaderboard);

router.put("/leaderboard/", verifyAuth, modifyLeaderboard);

export default router;
