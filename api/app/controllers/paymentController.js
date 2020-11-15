import moment from "moment";

import dbQuery from "../db/dbQuery";

import { isEmpty, generateUUID } from "../helpers/validation";

import { errorMessage, successMessage, status } from "../helpers/status";

import {
	PRICING_BASIC,
	PRICING_MEDIUM,
	PRICING_LARGE,
	MIN_USERS_BASIC,
	MIN_USERS_MEDIUM,
	MIN_USERS_LARGE,
	MAX_USERS_BASIC,
	MAX_USERS_MEDIUM,
	MAX_USERS_LARGE,
	DEFAULT_CLASSIC_MEAN,
	DEFAULT_CLASSIC_VARIANCE,
	DEFAULT_TRUESKILL_MEAN,
	DEFAULT_TRUESKILL_VARIANCE,
} from "../constants";

const createPayment = async (req, res) => {};

const successPayment = async (req, res) => {};

const cancelPayment = async (req, res) => {};

export { createPayment, successPayment, cancelPayment };
