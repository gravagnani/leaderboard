import env from "../../env.js";

import mailjet_client from "node-mailjet";

const mailjet = mailjet_client.connect(
	env.mj_apikey_public,
	env.mj_apikey_private
);

const FROM_EMAIL = "giuseppe.ravagnani@gmail.com";
const FROM_NAME = "Cleverboard";

const signUpEmail = (user) => {
	const request = mailjet.post("send", { version: "v3.1" }).request({
		Messages: [
			{
				From: {
					Email: FROM_EMAIL,
					Name: FROM_NAME,
				},
				To: [
					{
						Email: user.email,
						Name: user.full_name,
					},
				],
				TemplateID: 2070190,
				TemplateLanguage: true,
				Subject: "Welcome to Cleverboard",
				Variables: {
					name: user.full_name,
				},
			},
		],
	});
	request
		.then((result) => {
			console.log(result.body);
		})
		.catch((err) => {
			console.log(err.statusCode);
		});
};

const newLeaderboard = (user, leaderboard, leaderboard_url) => {
	const request = mailjet.post("send", { version: "v3.1" }).request({
		Messages: [
			{
				From: {
					Email: FROM_EMAIL,
					Name: FROM_NAME,
				},
				To: [
					{
						Email: user.email,
						Name: user.full_name,
					},
				],
				TemplateID: 2070822,
				TemplateLanguage: true,
				Subject: "Your new Cleverboard",
				Variables: {
					leaderboard_name: leaderboard.title,
					leaderboard_url: leaderboard_url,
				},
			},
		],
	});
	request
		.then((result) => {
			console.log(result.body);
		})
		.catch((err) => {
			console.log(err.statusCode);
		});
};

export { signUpEmail, newLeaderboard };
