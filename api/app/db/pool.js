import { Pool } from "pg";
import env from "../../env";

const databaseConfig = { connectionString: env.database_url };
const pool = new Pool(databaseConfig);

pool.on("connect", () => {
	console.log("connected to the db");
});

export default pool;
