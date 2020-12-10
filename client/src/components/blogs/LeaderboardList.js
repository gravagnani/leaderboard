import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { motion } from "framer-motion";
import { SectionHeading } from "components/misc/Headings.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";

import { createGame, deleteLastGame } from "../../controllers/gameController";

import { WIN_TEAM, LOSE_TEAM, DRAW_TEAM } from "../../constants";

//import searchImage from "../../images/search-image.svg";
import searchImage from "../../images/logo.svg";

import ErrorAlert from "../../alerts/ErrorAlert";

const Row = tw.div`flex flex-col lg:flex-row -mb-10`;
const HeadingRow = tw.div`flex flex-col flex-row items-center`;
const Heading = tw(SectionHeading)`text-left text-2xl sm:text-4xl xl:text-5xl`;
const HeadingButton = tw.button`text-left hover:underline cursor-pointer ml-auto lg:text-2xl xl:text-3xl text-2xl`;
const HeadingButtonNoML = styled(HeadingButton)(() => [tw`ml-8`]);

const GamesContainer = tw.div`mt-12 flex flex-col sm:flex-row sm:justify-between lg:justify-start`;
const UsersContainer = tw.div`mt-12 flex flex-col sm:flex-row sm:justify-between lg:justify-start`;
const Game = tw(
	motion.a
)`block sm:max-w-sm mb-16 last:mb-0 sm:mb-0 lg:mr-8 xl:mr-16`;
const User = styled(motion.a)((props) => [
	tw`hover:bg-gray-300 bg-gray-200`,
	props.isLoggedUser ? tw`text-primary-500` : tw``,
	props.newGameMode ? tw`cursor-pointer` : tw``,
	props.gameState == WIN_TEAM
		? tw`bg-green-200 hover:bg-green-300`
		: props.gameState == LOSE_TEAM
		? tw`bg-red-200 hover:bg-red-300`
		: props.gameState == DRAW_TEAM
		? tw`bg-blue-200 hover:bg-blue-300`
		: tw``,
]);
const Image = styled(motion.div)((props) => [
	`background-image: url("${props.imageSrc}");`,
	tw`h-64 bg-cover bg-center rounded`,
]);
const Player = tw.h5`mt-6 text-xl font-bold transition duration-300 group-hover:text-primary-500`;
const Position = tw.h5`mt-6 w-1 flex items-center text-xl font-bold transition duration-300 group-hover:text-primary-500 select-none`;
const Description = tw.p`mt-2 font-medium text-secondary-100 leading-loose text-sm`;
const AuthorInfo = tw.div`mt-6 flex items-center`;
const UserName = tw.div`mt-6 flex items-center`;
const Score = tw.div`mt-6 font-medium flex items-center`;
const InputName = tw.input` appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500`;
const AuthorImage = tw.img`w-12 h-12 rounded-full`;
const AuthorNameAndProfession = tw.div`ml-4`;
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
const GameState = tw.div`text-white w-12 h-12 text-center font-bold flex items-center justify-center select-none`;

const GameScore = styled(motion.h6)((props) => [
	props.gameResult == WIN_TEAM
		? tw`text-green-500`
		: props.gameResult == LOSE_TEAM
		? tw`text-red-500`
		: props.gameResult == DRAW_TEAM
		? tw`text-blue-500`
		: tw``,
	tw`font-semibold text-lg my-1`,
]);

const LeaderboardContainer = styled.div`
	${tw`lg:w-2/3 lg:pr-8`}
	${UsersContainer} {
		${tw`flex flex-wrap lg:flex-col`}
	}
	${Image} {
		${tw`md:h-20 md:w-20 sm:h-20 sm:w-20 h-10 w-10 flex-shrink-0 mx-10`}
	}
	${User} {
		${tw`px-10 py-2 flex justify-start mb-4 shadow-md max-w-none w-full md:w-full lg:w-auto`}
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
	${tw`mt-24 lg:mt-0 lg:w-1/3 z-10`}
	${GamesContainer} {
		${tw`flex flex-wrap lg:flex-col`}
	}
	${Game} {
		${tw`flex justify-between items-center hover:bg-gray-300 bg-gray-200 xl:px-10 lg:px-5 px-10  py-2 mb-4 shadow-md max-w-none w-full lg:w-1/2 md:w-full lg:w-auto mr-0 cursor-default`}
	}
	${Player} {
		${tw`text-base xl:text-lg mt-0 lg:max-w-xs my-1`}
	}
	${GameScore} {
		${tw`text-sm font-normal leading-none`}
	}
	${GameDate} {
		${tw`text-sm text-secondary-100 font-normal leading-none`}
	}
`;

const GameTextContainer = styled(motion.div)((props) => [
	tw`my-auto text-center`,
	props.showDelete && tw`opacity-25`,
]);

const GameDeleteIcon = styled(motion.div)((props) => [
	tw`z-40 absolute inline-flex cursor-pointer font-bold text-white bg-red-500 hover:bg-red-700 p-2 rounded`,
]);

const GameComponent = ({
	number,
	game,
	leaderboard_uuid,
	setLoadParticipants,
	setLoadGames,
	setErrorMessageGame,
	userIsCreator,
}) => {
	const [showDelete, setShowDelete] = useState(false);

	return (
		<Game
			className="group"
			onHoverStart={() => {
				number == 0 && setShowDelete(true && userIsCreator);
			}}
			onHoverEnd={() => {
				number == 0 && setShowDelete(false);
			}}
			onClick={() => {
				number == 0 && setShowDelete(!showDelete);
			}}
		>
			<GameTextContainer showDelete={showDelete}>
				<GameDate>{game.date}</GameDate>
			</GameTextContainer>
			{game.users.map((user, index2) => (
				<GameTextContainer key={index2} showDelete={showDelete}>
					<Player>{user.user_full_name}</Player>
					<GameScore gameResult={user.user_team}>
						{user.user_delta}
					</GameScore>
				</GameTextContainer>
			))}
			{number == 0 && userIsCreator && showDelete && (
				<GameDeleteIcon
					onClick={() => {
						deleteLastGame(leaderboard_uuid)
							.then((e) => {
								if (e.status == "error") {
									throw new Error(e.error);
								}
								setLoadGames(true);
								setLoadParticipants(true);
							})
							.catch((e) => {
								setErrorMessageGame(e);
							});
					}}
				>
					Delete
				</GameDeleteIcon>
			)}
		</Game>
	);
};

export default ({
	user,
	leaderboard,
	participants,
	setParticipants,
	setLoadParticipants,
	games,
	setGames,
	setLoadGames,
	userIsCreator,
}) => {
	const [newGameMode, setNewGameMode] = useState(false);
	const [winList, setWinList] = useState([]);
	const [loseList, setLoseList] = useState([]);
	const [drawList, setDrawList] = useState([]);

	const [errorMessage, setErrorMessage] = useState(null);
	const [errorMessageGame, setErrorMessageGame] = useState(null);

	// none -> win -> lose -> draw -> none
	const handleWinBtn = (user_uuid) => {
		setWinList(winList.filter((e) => e != user_uuid));
		setLoseList([user_uuid]);
		// decommentare per le squadre
		//setLoseList([...loseList, user_uuid]);
	};
	const handleLoseBtn = (user_uuid) => {
		setDrawList([...new Set([...winList, ...loseList, user_uuid])]);
		setWinList([]);
		setLoseList([]);
	};
	const handleDrawBtn = (user_uuid) => {
		setDrawList(drawList.filter((e) => e != user_uuid));
	};
	const handleNoPartBtn = (user_uuid) => {
		//winList.length == 0 ? setWinList([user_uuid]) : setLoseList([user_uuid]);
		// MOLTO CONTORTO!!!! (MA IN QUALCHE MODO FUNZIONA)
		winList.length == 0 && drawList.length == 0
			? setWinList([user_uuid])
			: loseList == 0 && drawList.length == 0
			? setLoseList([user_uuid])
			: winList.length > 0 && loseList.length > 0
			? setLoseList([user_uuid])
			: setDrawList([user_uuid, drawList[0]]);
		// decommentare per le squadre
		//setWinList([...winList, user_uuid]);
	};

	const handleUserClick = (user_uuid) => {
		winList.includes(user_uuid)
			? handleWinBtn(user_uuid)
			: loseList.includes(user_uuid)
			? handleLoseBtn(user_uuid)
			: drawList.includes(user_uuid)
			? handleDrawBtn(user_uuid)
			: handleNoPartBtn(user_uuid);
	};

	const handleNewGameBtnClick = () => {
		setWinList([]);
		setLoseList([]);
		setDrawList([]);
		setNewGameMode(!newGameMode);
	};

	const handleCancelBtnClick = () => {
		setWinList([]);
		setLoseList([]);
		setDrawList([]);
		setNewGameMode(!newGameMode);
	};

	const handleSaveBtnClick = () => {
		createGame(leaderboard.uuid, winList, loseList, drawList)
			.then((e) => {
				if (e.status == "error") {
					throw new Error(e.error);
				}
				setLoadParticipants(true);
				setLoadGames(true);
			})
			.catch((e) => {
				setErrorMessage(e);
			});
		setNewGameMode();
		setTimeout(() => {
			setWinList([]);
			setLoseList([]);
			setDrawList([]);
		}, 2000);
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

	var leaderboard_start_date = new Date(leaderboard.start_date);
	var leaderboard_end_date = new Date(leaderboard.end_date);
	var current_date = new Date();

	const isStarted =
		current_date.getTime() - leaderboard_start_date.getTime() >= 0;
	const isEnded = current_date.getTime() - leaderboard_end_date.getTime() >= 0;

	return (
		<Container>
			<ContentWithPaddingXl>
				<Row>
					<LeaderboardContainer>
						<HeadingRow>
							<Heading>Leaderboard</Heading>
							{isStarted && !isEnded ? (
								userIsCreator &&
								(!newGameMode ? (
									<HeadingButton
										onClick={() => {
											handleNewGameBtnClick();
										}}
									>
										New Game
									</HeadingButton>
								) : (
									<>
										<HeadingButton
											onClick={() => {
												handleCancelBtnClick();
											}}
										>
											Cancel
										</HeadingButton>
										<HeadingButtonNoML
											onClick={() => {
												handleSaveBtnClick();
											}}
										>
											Save
										</HeadingButtonNoML>
									</>
								))
							) : (
								<HeadingButton>
									{isEnded
										? leaderboard_end_date.toLocaleString()
										: leaderboard_start_date.toLocaleString()}
								</HeadingButton>
							)}
						</HeadingRow>
						<UsersContainer>
							{errorMessage && (
								<ErrorAlert
									message={errorMessage}
									setMessage={setErrorMessage}
								/>
							)}
							{participants.map((part, index) => (
								<User
									key={index}
									isLoggedUser={user && part.user_uuid == user.uuid}
									newGameMode={newGameMode}
									gameState={
										winList.includes(part.user_uuid)
											? WIN_TEAM
											: loseList.includes(part.user_uuid)
											? LOSE_TEAM
											: drawList.includes(part.user_uuid)
											? DRAW_TEAM
											: null
									}
									onClick={() =>
										newGameMode && handleUserClick(part.user_uuid)
									}
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
										) : (
											<GameState>
												{winList.includes(part.user_uuid)
													? "W"
													: loseList.includes(part.user_uuid)
													? "L"
													: drawList.includes(part.user_uuid)
													? "D"
													: null}
											</GameState>
										)}
									</Score>
								</User>
							))}
						</UsersContainer>
					</LeaderboardContainer>
					<LastGamesContainer>
						<Heading>Last Games</Heading>
						<GamesContainer>
							{errorMessageGame && (
								<ErrorAlert
									message={errorMessageGame}
									setMessage={setErrorMessageGame}
								/>
							)}
							{games.map((game, index) => (
								/*<Game
									key={index}
									className="group"
									onClick={() => {
										console.log("click!");
										setShowDelete(!showDelete);
									}}
								>
									<GameTextContainer>
										{!showDelete ? (
											<GameDate>{game.date}</GameDate>
										) : (
											<GameDate>X</GameDate>
										)}
									</GameTextContainer>
									{game.users.map((user, index2) => (
										<GameTextContainer key={index2}>
											<Player>{user.user_full_name}</Player>
											<GameScore gameResult={user.user_team}>
												{user.user_delta}
											</GameScore>
										</GameTextContainer>
									))}
									</Game>*/
								<GameComponent
									key={index}
									number={index}
									game={game}
									leaderboard_uuid={leaderboard.uuid}
									setLoadGames={setLoadGames}
									setLoadParticipants={setLoadParticipants}
									setErrorMessageGame={setErrorMessageGame}
									userIsCreator={userIsCreator}
								/>
							))}
						</GamesContainer>
					</LastGamesContainer>
				</Row>
			</ContentWithPaddingXl>
		</Container>
	);
};
