import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { motion } from "framer-motion";
import { SectionHeading } from "components/misc/Headings.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";

import { createGame } from "../../controllers/gameController";

//import searchImage from "../../images/search-image.svg";
import searchImage from "../../images/logo.svg";

const Row = tw.div`flex flex-col lg:flex-row -mb-10`;
const HeadingRow = tw.div`flex flex-col lg:flex-row items-center`;
const Heading = tw(SectionHeading)`text-left lg:text-4xl xl:text-5xl`;
const HeadingButton = tw.button`text-left hover:underline cursor-pointer ml-auto lg:text-2xl xl:text-3xl`;

const GamesContainer = tw.div`mt-12 flex flex-col sm:flex-row sm:justify-between lg:justify-start`;
const UsersContainer = tw.div`mt-12 flex flex-col sm:flex-row sm:justify-between lg:justify-start`;
const Game = tw(
	motion.a
)`block sm:max-w-sm mb-16 last:mb-0 sm:mb-0 lg:mr-8 xl:mr-16`;
const User = styled(motion.a)((props) => [
	props.isLoggedUser
		? tw`bg-gray-500 bg-gray-400`
		: tw`bg-gray-300 bg-gray-200`,
]);
const Image = styled(motion.div)((props) => [
	`background-image: url("${props.imageSrc}");`,
	tw`h-64 bg-cover bg-center rounded`,
]);
const Player = tw.h5`mt-6 text-xl font-bold transition duration-300 group-hover:text-primary-500`;
const Position = tw.h5`mt-6 flex items-center text-xl font-bold transition duration-300 group-hover:text-primary-500`;
const Description = tw.p`mt-2 font-medium text-secondary-100 leading-loose text-sm`;
const AuthorInfo = tw.div`mt-6 flex items-center`;
const UserName = tw.div`mt-6 flex items-center`;
const Score = tw.div`mt-6 font-medium flex items-center`;
const InputName = tw.input` appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500`;
const AuthorImage = tw.img`w-12 h-12 rounded-full`;
const AuthorNameAndProfession = tw.div`ml-4`;
const GameScore = tw.h6`font-semibold text-lg`;
const GameDate = tw.h6`font-semibold text-lg`;
const AuthorProfile = tw.p`text-secondary-100 text-sm`;
const Table = tw.table`min-w-full divide-y divide-gray-200 mt-16 mr-20`;
const TableHead = tw.thead``;
const TableBody = tw.tbody`bg-white divide-y divide-gray-200`;
const TableRow = tw.tr``;
const TableHeadItem = tw.th`px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`;
const TableRowItem = tw.td`px-6 py-4 whitespace-no-wrap`;

const Win = tw.div`bg-green-400 hover:bg-green-500 hover:cursor-pointer text-white w-12 h-12 text-center font-bold rounded-full flex items-center justify-center`;
const Lose = tw.div`bg-red-400 hover:bg-red-500 hover:cursor-pointer text-white w-12 h-12 text-center font-bold rounded-full flex items-center justify-center`;
const NotPart = tw.div`bg-primary-100 hover:bg-primary-200 hover:cursor-pointer text-white w-12 h-12 text-center font-bold rounded-full flex items-center justify-center`;

const LeaderboardContainer = styled.div`
	${tw`lg:w-2/3 md:pr-20`}
	${UsersContainer} {
		${tw`flex flex-wrap lg:flex-col`}
	}
	${Image} {
		${tw`h-20 w-20 flex-shrink-0 mx-10`}
	}
	${User} {
		${tw`px-10 py-2 flex justify-start mb-4 shadow-md max-w-none w-full sm:w-1/2 lg:w-auto`}
	}
	${Position} {
		${tw`mt-3 text-base xl:text-lg mt-0 mr-4 lg:max-w-xs`}
	}
	${UserName} {
		${tw`mt-3 text-base xl:text-lg mt-0 mr-4 lg:max-w-xs`}
	}
	${Score} {
		${tw`mt-1 ml-auto text-sm text-primary-500 font-normal leading-none`}
	}
`;

const LastGamesContainer = styled.div`
	${tw`mt-24 lg:mt-0 lg:w-1/3`}
	${GamesContainer} {
		${tw`flex flex-wrap lg:flex-col`}
	}
	${Game} {
		${tw`flex justify-between hover:bg-gray-300 bg-gray-200 px-10 py-2 mb-4 shadow-md max-w-none w-full sm:w-1/2 lg:w-auto mr-0`}
	}
	${Player} {
		${tw`text-base xl:text-lg mt-0 lg:max-w-xs`}
	}
	${GameScore} {
		${tw`mt-3 text-sm text-secondary-100 font-normal leading-none`}
	}
	${GameDate} {
		${tw`mt-5 text-sm text-secondary-100 font-normal leading-none`}
	}
`;

const GameTextContainer = tw.div``;

const recentGames = [
	{
		date: "Sat Oct 24 2020",
		player1: "Gilda",
		score1: "+10",
		player2: "Beppe",
		score2: "-5",
	},
	{
		date: "Sat Oct 24 2020",
		player1: "Gilda",
		score1: "+10",
		player2: "Beppe",
		score2: "-5",
	},
	{
		date: "Sat Oct 24 2020",
		player1: "Gilda",
		score1: "+10",
		player2: "Beppe",
		score2: "-5",
	},
	{
		date: "Sat Oct 24 2020",
		player1: "Gilda",
		score1: "+10",
		player2: "Beppe",
		score2: "-5",
	},
];

export default ({
	user,
	leaderboard,
	participants,
	setParticipants,
	setLoadParticipants,
}) => {
	const [newGameMode, setNewGameMode] = useState(false);
	const [winList, setWinList] = useState([]);
	const [loseList, setLoseList] = useState([]);

	const handleWinBtn = (user_uuid) => {
		setWinList(winList.filter((e) => e != user_uuid));
		setLoseList([user_uuid]);
		// decommentare per le squadre
		//setLoseList([...loseList, user_uuid]);
	};
	const handleLoseBtn = (user_uuid) => {
		setLoseList(loseList.filter((e) => e != user_uuid));
	};
	const handleNoPartBtn = (user_uuid) => {
		winList.length == 0 ? setWinList([user_uuid]) : setLoseList([user_uuid]);
		// decommentare per le squadre
		//setWinList([...winList, user_uuid]);
	};

	const handleNewGameBtnClick = () => {
		setWinList([]);
		setLoseList([]);
		setNewGameMode(!newGameMode);
	};

	const handleSaveBtnClick = () => {
		createGame(leaderboard.uuid, winList, loseList)
			.then((e) => {
				if (e.status == "error") {
					throw new Error(e.error);
				}
				setLoadParticipants(true);
			})
			.catch((e) => {
				console.log(e);
			});
		setNewGameMode(!newGameMode);
	};

	// This setting is for animating the Game background image on hover
	const gameBackgroundSizeAnimation = {
		rest: {
			backgroundSize: "100%",
		},
		hover: {
			backgroundSize: "110%",
		},
	};

	return (
		<Container>
			<ContentWithPaddingXl>
				<Row>
					<LeaderboardContainer>
						<HeadingRow>
							<Heading>Leaderboard</Heading>
							{!newGameMode ? (
								<HeadingButton
									onClick={() => {
										handleNewGameBtnClick();
									}}
								>
									New Game
								</HeadingButton>
							) : (
								<HeadingButton
									onClick={() => {
										handleSaveBtnClick();
									}}
									disabled={
										winList.length == 0 || loseList.length == 0
									}
								>
									Save
								</HeadingButton>
							)}
						</HeadingRow>
						<UsersContainer>
							{participants.map((part, index) => (
								<User
									key={index}
									isLoggedUser={part.user_uuid == user.uuid}
								>
									<Position>{index + 1}</Position>
									<Image
										imageSrc={
											part.image ? part.image : searchImage //"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80"
										}
									/>
									<UserName>{part.user_full_name}</UserName>
									<Score>
										{!newGameMode ? (
											part.user_mean
										) : winList.includes(part.user_uuid) ? (
											<Win
												onClick={() => {
													handleWinBtn(part.user_uuid);
												}}
											>
												W
											</Win>
										) : loseList.includes(part.user_uuid) ? (
											<Lose
												onClick={() => {
													handleLoseBtn(part.user_uuid);
												}}
											>
												L
											</Lose>
										) : (
											<NotPart
												onClick={() => {
													handleNoPartBtn(part.user_uuid);
												}}
											/>
										)}
									</Score>
								</User>
							))}
						</UsersContainer>
					</LeaderboardContainer>
					<LastGamesContainer>
						<Heading>Last Games</Heading>
						<GamesContainer>
							{recentGames.map((game, index) => (
								<Game key={index} className="group">
									<GameTextContainer>
										<GameDate>{game.date}</GameDate>
									</GameTextContainer>
									<GameTextContainer>
										<Player>{game.player1}</Player>
										<GameScore>{game.score1}</GameScore>
									</GameTextContainer>
									<GameTextContainer>
										<Player>{game.player1}</Player>
										<GameScore>{game.score2}</GameScore>
									</GameTextContainer>
								</Game>
							))}
						</GamesContainer>
					</LastGamesContainer>
				</Row>
			</ContentWithPaddingXl>
		</Container>
	);
};
