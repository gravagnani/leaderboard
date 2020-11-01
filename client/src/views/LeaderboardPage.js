import React, { useState } from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

import Hero from "components/hero/TwoColumnWithFeaturesAndTestimonialLeaderboard.js";
import LeaderboardList from "components/blogs/LeaderboardList.js";
import Footer from "components/footers/MiniCenteredFooter.js";
import LeaderboardShare from "components/forms/LeaderboardShare.js";
import LeaderboardSignIn from "components/forms/LeaderboardSignIn.js";
import LeaderboardNotFound from "components/forms/LeaderboardNotFound.js";
import LeaderboardChooseName from "components/forms/LeaderboardChooseName.js";

import { getLeaderboardByUUID } from "../controllers/leaderboardController";

const HighlightedText = tw.span`text-primary-500`;

export default () => {
	const user = JSON.parse(localStorage.getItem("user"));
	const leaderboard_uuid = window.location.href.split("/").pop();
	const [leaderboard, setLeaderboard] = useState(null);
	//const [userIsCreator, setUserIsCreator] = useState(null);
	//const [userIsSignedIn, setUserIsSignedIn] = useState(null);
	//const [userIsAlreadyPlaying, setUserIsAlreadyPlaying] = useState(null);
	const participants_def = [
		{
			//position: 1,
			name: "Ivo",
			score: 123,
			image:
				"https://images.unsplash.com/photo-1546971587-02375cbbdade?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=641&q=80",
		},
		{
			//position: 2,
			name: "Gilda",
			score: 98,
			image:
				"https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
		},
		{
			//position: 3,
			name: "Ciccio",
			score: 46,
			image:
				"https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
		},
		{
			//position: 4,
			name: "Beppe",
			score: 15,
			image:
				"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
		},
	];
	const [participants, setParticipants] = useState(participants_def);

	getLeaderboardByUUID(leaderboard_uuid)
		.then((e) => {
			if (e.status == "error") {
				throw new Error(e.error);
			}
			!leaderboard && setLeaderboard(e.data[0]);
		})
		.catch((e) => {
			console.log(e.message);
		});

	const userIsCreator =
		leaderboard && user && leaderboard.created_by == user.uuid;
	const userIsSignedIn = !!user;
	const userIsAlreadyPlaying = null; // todo: cercare tra i partecipanti

	//const userIsCreator = leaderbaord.created_by == user.uuid;
	//const userIsSignedIn = !!user;
	//const userIsAlreadyPlaying = false || user;

	return (
		<AnimationRevealPage>
			<Hero />
			{leaderboard ? (
				<>
					{/** to be displayed only if the user is the creator */}
					{userIsCreator && userIsAlreadyPlaying && <LeaderboardShare />}
					{/** to be displayed only if the user is not signed up */}
					{!userIsSignedIn && (
						<LeaderboardSignIn leaderboardUUID={leaderboard_uuid} />
					)}
					{/** to be displayed only if the user is not signed up */}
					{!userIsAlreadyPlaying && !!userIsSignedIn && (
						<LeaderboardChooseName
							user={user}
							leaderboard={leaderboard}
							participants={participants}
							setParticipants={setParticipants}
						/>
					)}
					<LeaderboardList
						user={user}
						leaderboard={leaderboard}
						participants={participants}
						setParticipants={setParticipants}
					/>
				</>
			) : (
				<LeaderboardNotFound />
			)}
			<Footer />
		</AnimationRevealPage>
	);
};
