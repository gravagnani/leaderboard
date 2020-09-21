import moment from "moment";

import dbQuery from "../db/dbQuery";

import {
	hashPassword,
	comparePassword,
	isValidEmail,
	validatePassword,
	isEmpty,
	generateUUID,
	generateUserToken,
} from "../helpers/validation";

import { errorMessage, successMessage, status } from "../helpers/status";

/**
 * Create A User
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createUser = async (req, res) => {
	const { email, full_name, password } = req.body;

	const flag_active = 1;
	const created_at = null; // moment(new Date());
	const modified_at = null; // moment(new Date());
	const modified_by = null;

	if (
		isEmpty(email) ||
		isEmpty(full_name) ||
		isEmpty(password)
	) {
		errorMessage.error =
			"Email, password, and full name field cannot be empty";
		return res.status(status.bad).send(errorMessage);
	}
	if (!isValidEmail(email)) {
		errorMessage.error = "Please enter a valid Email";
		return res.status(status.bad).send(errorMessage);
	}
	if (!validatePassword(password)) {
		errorMessage.error = "Password must be more than five(5) characters";
		return res.status(status.bad).send(errorMessage);
	}

	const hashed_password = hashPassword(password);
	const user_uuid = generateUUID(email + full_name);

	const createUserQuery = `INSERT INTO users 
	   (uuid, email, full_name, password, flag_active, created_at, modified_at, modified_by) 
		VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning *`;
	const values = [
		user_uuid,
		email,
		full_name,
		hashed_password,
		flag_active,
		created_at,
		modified_at,
		modified_by,
	];

	try {
		const { rows } = await dbQuery.query(createUserQuery, values);
		const dbResponse = rows[0];
		delete dbResponse.password;

		const token = generateUserToken(
			dbResponse.id,
			dbResponse.uuid,
			dbResponse.email,
			dbResponse.full_name
		);
		successMessage.data = dbResponse;
		successMessage.data.token = token;
		return res.status(status.created).send(successMessage);
	} catch (error) {
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "User with that EMAIL already exist";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		errorMessage.stacktrace = error;
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Signin
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */
const siginUser = async (req, res) => {
	const { email, password } = req.body;

	if (isEmpty(email) || isEmpty(password)) {
		errorMessage.error = "Email or Password detail is missing";
		return res.status(status.bad).send(errorMessage);
	}

	if (!isValidEmail(email) || !validatePassword(password)) {
		errorMessage.error = "Please enter a valid Email or Password";
		return res.status(status.bad).send(errorMessage);
	}

	const signinUserQuery = `SELECT * FROM users WHERE email = $1`;

	try {
		const { rows } = await dbQuery.query(signinUserQuery, [email]);
		const dbResponse = rows[0];

		if (!dbResponse) {
			errorMessage.error = "User with this email does not exist";
			return res.status(status.notfound).send(errorMessage);
		}
		if (!comparePassword(dbResponse.password, password)) {
			errorMessage.error = "The password you provided is incorrect";
			return res.status(status.bad).send(errorMessage);
		}

		const token = generateUserToken(
			dbResponse.id,
			dbResponse.email,
			dbResponse.uuid,
			dbResponse.full_name,
		);

		delete dbResponse.password;

		successMessage.data = dbResponse;
		successMessage.data.token = token;

		return res.status(status.success).send(successMessage);
	} catch (error) {
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

export { createUser, siginUser };
