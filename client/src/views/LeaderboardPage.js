import React, { useState } from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

import Hero from "components/hero/TwoColumnWithFeaturesAndTestimonialLeaderboard.js";
import LeaderboardList from "components/blogs/LeaderboardList.js";
import Footer from "components/footers/MiniCenteredFooter.js";
import LeaderboardShare from "components/forms/LeaderboardShare.js";
import LeaderboardInfo from "components/forms/LeaderboardInfo.js";
import LeaderboardSignIn from "components/forms/LeaderboardSignIn.js";
import LeaderboardNotFound from "components/forms/LeaderboardNotFound.js";
import LeaderboardChooseName from "components/forms/LeaderboardChooseName.js";

import ErrorAlert from "../alerts/ErrorAlert";

import {
	getLeaderboardByUUID,
	getLeaderboardParticipants,
} from "../controllers/leaderboardController";

const HighlightedText = tw.span`text-primary-500`;

const participants_def = [
	{
		//position: 1,
		user_full_name: "Ivo",
		user_mean: 123,
		user_variance: 1,
		image:
			"https://images.unsplash.com/photo-1546971587-02375cbbdade?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=641&q=80",
	},
	{
		//position: 2,
		user_full_name: "Gilda",
		user_mean: 98,
		user_variance: 1,
		image:
			"https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
	},
	{
		//position: 3,
		user_full_name: "Ciccio",
		user_mean: 46,
		user_variance: 1,
		image:
			"https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
	},
	{
		//position: 4,
		user_full_name: "Beppe",
		user_mean: 15,
		user_variance: 1,
		image:
			"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
	},
];

export default () => {
	const user = JSON.parse(localStorage.getItem("user"));
	const leaderboard_uuid = window.location.href.split("/").pop();
	const [leaderboard, setLeaderboard] = useState(null);
	// devono arrivare gia ordinati dal db!
	const [participants, setParticipants] = useState([]);
	const [loadParticipants, setLoadParticipants] = useState(true);
	//const [participants, setParticipants] = useState(participants_def);

	!leaderboard &&
		getLeaderboardByUUID(leaderboard_uuid)
			.then((e) => {
				if (e.status == "error") {
					throw new Error(e.error);
				}
				setLeaderboard(e.data[0]);
			})
			.catch((e) => {
				console.log(e);
			});

	loadParticipants &&
		getLeaderboardParticipants(leaderboard_uuid)
			.then((e) => {
				if (e.status == "error") {
					throw new Error(e.error);
				}
				setParticipants(e.data);
				setLoadParticipants(false);
			})
			.catch((e) => {
				console.log(e);
			});

	const userIsCreator =
		leaderboard && user && leaderboard.created_by == user.uuid;
	const userIsSignedIn = !!user;
	const userIsAlreadyPlaying =
		user && participants.some((e) => e.user_uuid === user.uuid);
	//const userIsCreator = leaderbaord.created_by == user.uuid;
	//const userIsSignedIn = !!user;
	//const userIsAlreadyPlaying = false || user;
	return (
		<AnimationRevealPage>
			<Hero />
			{leaderboard ? (
				<>
					<LeaderboardInfo
						leaderboard={leaderboard}
						setLeaderboard={setLeaderboard}
						isEditable={userIsCreator}
					/>
					{/** to be displayed only if the user is the creator */}
					{userIsAlreadyPlaying && <LeaderboardShare />}
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
							setLoadParticipants={setLoadParticipants}
						/>
					)}
					<LeaderboardList
						user={user}
						leaderboard={leaderboard}
						participants={participants}
						setParticipants={setParticipants}
						setLoadParticipants={setLoadParticipants}
					/>
				</>
			) : (
				<LeaderboardNotFound />
			)}
			<Footer />
		</AnimationRevealPage>
	);
};
