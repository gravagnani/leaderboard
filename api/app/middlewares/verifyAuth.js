import jwt, { decode } from "jsonwebtoken";
import env from "../../env";
import { errorMessage, status } from "../helpers/status";

/**
 * Verify Auth
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object|void} response object
 */
const verifyAuth = async (req, res, next) => {
	// header called "token"
	const token = req.headers.token;

	if (!token) {
		errorMessage.error = "Token not provided";
		return res.status(status.bad).send(errorMessage);
	}

	try {
		const decoded = jwt.verify(token, env.secret);
		// TODO: change with user information
		req.user = {
			id: decoded.user_id,
			email: decoded.email,
			uuid: decoded.uuid,
			full_name: decoded.full_name,
			password: decoded.password,
		};
		next();
	} catch (error) {
		errorMessage.error = "Authentication Failed";
		return res.status(status.unauthorized).send(errorMessage);
	}
};

export default verifyAuth;
