import moment from "moment";

import dbQuery from "../db/dbQuery";

import { isEmpty, generateUUID } from "../helpers/validation";

import { errorMessage, successMessage, status } from "../helpers/status";

/**
 * Create A Leaderboard
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createLeaderboard = async (req, res) => {

	const {
		title,
		place,
		note,
		min_users,
		max_users,
		start_date,
		end_date,
		flag_public,
	} = req.body;


	const flag_active = 1;
	const created_at = moment(new Date());
	const modified_at = moment(new Date());
	// from header
	const created_by = req.user.email;
	const modified_by = req.user.email;

	// TODO: sistema le costanti
	const min_users_check = min_users ? min_users : 1;
	const max_users_check = max_users ? max_users : 99;
	const start_date_check = start_date ? start_date : moment(new Date());
	const flag_public_check = flag_public ? flag_public : 1;

	if (isEmpty(title)) {
		errorMessage.error = "Title must not be empty";
		return res.status(status.bad).send(errorMessage);
	}

	const leaderboard_uuid = generateUUID(title + created_by);

	const createLeaderboardQuery = `INSERT INTO
		leaderboard(uuid, title, place, note, min_users, max_users
			, start_date , end_date, flag_public, flag_active
			, created_at , created_by, modified_at, modified_by)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      returning *`;
	const values = [
		leaderboard_uuid,
		title,
		place,
		note,
		min_users_check,
		max_users_check,
		start_date_check,
		end_date,
		flag_public_check,
		flag_active,
		created_at,
		created_by,
		modified_at,
		modified_by,
	];

	try {
		const { rows } = await dbQuery.query(createLeaderboardQuery, values);
		const dbResponse = rows[0];
		successMessage.data = dbResponse;

		return res.status(status.created).send(successMessage);
	} catch (error) {
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "Create Leaderboard internal error";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

export { createLeaderboard };
