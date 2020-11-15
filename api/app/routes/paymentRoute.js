import express from "express";

import {
	createPayment,
	successPayment,
	cancelPayment,
} from "../controllers/paymentController";
import verifyAuth from "../middlewares/verifyAuth";

const router = express.Router();

export default router;
