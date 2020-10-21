import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { motion } from "framer-motion";
import { SectionHeading } from "components/misc/Headings.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";

const Row = tw.div`flex flex-col lg:flex-row -mb-10`;
const HeadingRow = tw.div`flex flex-col lg:flex-row items-center`;
const Heading = tw(SectionHeading)`text-left lg:text-4xl xl:text-5xl`;
const HeadingButton = tw.button`text-left hover:underline cursor-pointer ml-auto lg:text-2xl xl:text-3xl`;

const GamesContainer = tw.div`mt-12 flex flex-col sm:flex-row sm:justify-between lg:justify-start`;
const UsersContainer = tw.div`mt-12 flex flex-col sm:flex-row sm:justify-between lg:justify-start`;
const Game = tw(
	motion.a
)`block sm:max-w-sm mb-16 last:mb-0 sm:mb-0 lg:mr-8 xl:mr-16`;
const User = tw(motion.a)``;
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

const LeaderboardContainer = styled.div`
	${tw`lg:w-2/3 md:pr-20`}
	${UsersContainer} {
		${tw`flex flex-wrap lg:flex-col`}
	}
	${Image} {
		${tw`h-20 w-20 flex-shrink-0 mx-10`}
	}
	${User} {
		${tw`hover:bg-gray-300 bg-gray-200 px-10 py-2 flex justify-start mb-4 shadow-md max-w-none w-full sm:w-1/2 lg:w-auto`}
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

export default () => {
	// This setting is for animating the Game background image on hover
	const gameBackgroundSizeAnimation = {
		rest: {
			backgroundSize: "100%",
		},
		hover: {
			backgroundSize: "110%",
		},
	};

	//Recommended: Only 2 Items
	const popularGames = [
		{
			postImageSrc:
				"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=640&q=80",
			authorImageSrc:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80",
			title: "Tips on how to travel safely in foreign countries",
			description:
				"Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
			authorName: "Charlotte Delos",
			authorProfile: "Travel Advocate",
			url: "https://timerse.com",
		},
		{
			postImageSrc:
				"https://images.unsplash.com/photo-1563784462041-5f97ac9523dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=640&q=80",
			authorImageSrc:
				"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80",
			title: "Enjoying the beach life while on a vacation",
			description:
				"Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
			authorName: "Adam Cuppy",
			authorProfile: "Vlogger",
			url: "https://reddit.com",
		},
	];

	const recentGamesOld = [
		{
			postImageSrc:
				"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
			title: "Gilda (+10) Beppe (-15)",
			authorName: "10.10.2020 12:45",
			url: "https://reddit.com",
		},
		{
			postImageSrc:
				"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
			title: "Choosing the perfect Safaris in Africa",
			authorName: "Sam Phipphen",
			url: "https://reddit.com",
		},
		{
			postImageSrc:
				"https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
			title: "Hiking during the monsoon in Asia",
			authorName: "Tony Hawk",
			url: "https://timerse.com",
		},
		{
			postImageSrc:
				"https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
			title: "Must carry items while travelling to Thailand",
			authorName: "Himali Turn",
			url: "https://timerse.com",
		},
		{
			postImageSrc:
				"https://images.unsplash.com/photo-1546971587-02375cbbdade?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=641&q=80",
			title: "An extremely funny trip to the Swiss Alps",
			authorName: "Naomi Watts",
			url: "https://timerse.com",
		},
	];

	const recentGames = [
		{
			player1: "Gilda",
			score1: "+10",
			player2: "Beppe",
			score2: "-5",
		},
		{
			player1: "Gilda",
			score1: "+10",
			player2: "Beppe",
			score2: "-5",
		},
		{
			player1: "Gilda",
			score1: "+10",
			player2: "Beppe",
			score2: "-5",
		},
		{
			player1: "Gilda",
			score1: "+10",
			player2: "Beppe",
			score2: "-5",
		},
	];

	const participants = [
		{
			position: 1,
			name: "Ivo",
			score: 123,
			image:
				"https://images.unsplash.com/photo-1546971587-02375cbbdade?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=641&q=80",
		},
		{
			position: 2,
			name: "Gilda",
			score: 98,
			image:
				"https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
		},
		{
			position: 3,
			name: "Ciccio",
			score: 46,
			image:
				"https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
		},
		{
			position: 4,
			name: "Beppe",
			score: 15,
			image:
				"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
		},
	];

	return (
		<Container>
			<ContentWithPaddingXl>
				<Row>
					<LeaderboardContainer>
						<HeadingRow>
							<Heading>Leaderboard</Heading>
							<HeadingButton
								onClick={() => {
									console.log("ciao");
								}}
							>
								New Game
							</HeadingButton>
						</HeadingRow>
						<UsersContainer>
							{participants.map((user, index) => (
								<User key={index}>
									<Position>{user.position}</Position>
									<Image imageSrc={user.image} />
									<UserName>{user.name}</UserName>
									<Score>{user.score}</Score>
								</User>
							))}
							<User key={10}>
								{/*<Position>{10}</Position>*/}
								<Position>10</Position>
								<Image imageSrc={null} />
								<UserName>{"Test"}</UserName>
								<Score>{37}</Score>
							</User>
						</UsersContainer>
					</LeaderboardContainer>
					<LastGamesContainer>
						<Heading>Last Games</Heading>
						<GamesContainer>
							{recentGames.map((game, index) => (
								<Game key={index} className="group">
									<GameTextContainer>
										<GameDate>{new Date().toDateString()}</GameDate>
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
