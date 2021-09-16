import express from "express";
import "babel-polyfill";
import cors from "cors";

//import env from "./env";

import userRoute from "./app/routes/userRoute.js";
import leaderboardRoute from "./app/routes/leaderboardRoute.js";
import gameRoute from "./app/routes/gameRoute.js";

import env from "./env.js";

// const env = require("./env");

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.options("*", cors());
app.use("/api/v1", userRoute);
app.use("/api/v1", leaderboardRoute);
app.use("/api/v1", gameRoute);

app.listen(env.port).on("listening", () => {
	console.log(`🚀 are live on ${env.port}`);
});

export default app;
