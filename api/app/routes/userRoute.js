import express from "express";

import {
	createUser,
	siginUser,
	logoutUser,
	modifyUser,
	deleteUser,
	getUserByUUID,
	getUsersOfLeaderboardUUID,
} from "../controllers/userController.js";
import verifyAuth from "../middlewares/verifyAuth.js";

const router = express.Router();

router.post("/auth/signup", createUser);
router.post("/auth/signin", siginUser);
router.post("/auth/logout", logoutUser);

router.get("/user/uuid/:uuid", verifyAuth, getUserByUUID);
router.get("/user/leaderboard/:uuid", verifyAuth, getUsersOfLeaderboardUUID);

router.put("/user", verifyAuth, modifyUser);

router.delete("/user", verifyAuth, deleteUser);

export default router;
