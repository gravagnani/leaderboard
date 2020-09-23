import express from "express";

import {
	createUser,
	siginUser,
	modifyUser,
	deleteUser,
	getUserByUUID,
} from "../controllers/userController";
import verifyAuth from "../middlewares/verifyAuth";

const router = express.Router();

router.post("/auth/signup", createUser);
router.post("/auth/signin", siginUser);

router.get("/user/:uuid", verifyAuth, getUserByUUID);

router.put("/user/:uuid", verifyAuth, modifyUser);

router.delete("/user/:uuid", verifyAuth, deleteUser);

export default router;
