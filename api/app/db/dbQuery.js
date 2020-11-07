import pool from "./pool";

export default {
	/**
	 * DB Query
	 * @param {object} req
	 * @param {object} res
	 * @param {object} object
	 */

	query(queryText, params) {
		return new Promise((resolve, reject) => {
			pool
				.query(queryText, params)
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
	beginTransaction() {
		return new Promise((resolve, reject) => {
			pool
				.query('BEGIN')
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
	commitTransaction() {
		return new Promise((resolve, reject) => {
			pool
				.query('COMMIT')
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
	rollbackTransaction() {
		return new Promise((resolve, reject) => {
			pool
				.query('ROLLBACK')
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
};
