import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { css } from "styled-components/macro"; //eslint-disable-line
import {
	SectionHeading,
	Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import userEvent from "@testing-library/user-event";

import { joinLeaderboard } from "../../controllers/leaderboardController";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto pt-20 md:pt-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)((props) => [
	tw` mt-16 md:mt-0`,
	props.textOnLeft
		? tw`md:mr-12 lg:mr-16 md:order-first`
		: tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const Image = styled.div((props) => [
	`background-image: url("${props.imageSrc}");`,
	tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-center`;

const Subheading = tw(SubheadingBase)`text-center md:text-center`;
const Heading = tw(
	SectionHeading
)`mt-4 font-black text-center text-3xl sm:text-4xl lg:text-5xl text-center md:text-center leading-tight`;
const Description = tw.p`mt-4 mb-4 text-center md:text-center text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const Input = tw.input`w-6/12 border-2 px-5 py-3 rounded focus:outline-none font-medium transition duration-300 hocus:border-primary-500`;

const SubmitButton = tw(PrimaryButtonBase)`inline-block lg:ml-6 mt-6 sm:mt-3`;

const heading = (
	<>
		Choose your <span tw="text-primary-500">name</span> and join the
		competition
		<wbr />.
	</>
);
const description =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const submitButtonText = "Join";
const textOnLeft = true;

export default ({
	user,
	leaderboard,
	setLoadParticipants,
}) => {
	const history = useHistory;
	const [errorMessage, setErrorMessage] = useState(null);
	// The textOnLeft boolean prop can be used to display either the text on left or right side of the image.
	const handleJoinBtnClick = () => {
		var user_full_name = document.getElementById("user-full-name-input")
			.value;
		joinLeaderboard(user.uuid, leaderboard.uuid, user_full_name)
			.then((e) => {
				if (e.status == "error") {
					throw new Error(e.error);
				}
				// todo: probabilmente in questo caso basta fare setLoadParticipants(true);
				setLoadParticipants(true);
				/*setParticipants(
					[
						...participants,
						{
							position: null,
							user_full_name: e.data.user_full_name,
							user_mean: e.data.user_mean,
							user_variance: e.data.user_variance,
							image:
								"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80",
						},
						// ordina per media crescente. se media uguale allora per varianza decrescente
					].sort((a, b) =>
						a.user_mean > b.user_mean
							? 1
							: a.user_mean < b.user_mean
							? -1
							: a.user_variance < b.user_variance
							? 1
							: -1
					)
				);*/
			})
			.catch((e) => {
				setErrorMessage(e);
			});
	};

	return (
		<Container>
			<TwoColumn>
				<TextColumn textOnLeft={textOnLeft}>
					<TextContent>
						<Heading>{heading}</Heading>
						<Description>{description}</Description>
						<Input
							type="text"
							id="user-full-name-input"
							defaultValue={
								user && user.full_name
									? user.full_name
									: "User Full Name"
							}
						/>
						<SubmitButton
							onClick={() => {
								handleJoinBtnClick();
							}}
						>
							{submitButtonText}
						</SubmitButton>
					</TextContent>
				</TextColumn>
			</TwoColumn>
		</Container>
	);
};
