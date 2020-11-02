import React, { useState, useEffect } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import {
	SectionHeading,
	Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";

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
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
	SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;

const HeadingInput = tw.input`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;

const Description = tw.p`mt-4 mb-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;
const DescriptionInput = tw.input`mt-4 mb-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const Input = tw.input`w-6/12 border-2 px-5 py-3 rounded focus:outline-none font-medium transition duration-300 hocus:border-primary-500`;

const SubmitButton = tw(PrimaryButtonBase)`inline-block lg:ml-6 mt-6 sm:mt-3`;

// const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
const submitButtonText = "Copy";
const formMethod = "get";
const textOnLeft = true;

const formatHeading = (text) => {
	return (
		<>
			<span tw="text-primary-500">{text}</span>.
		</>
	);
};

export default ({ leaderboard }) => {
	// The textOnLeft boolean prop can be used to display either the text on left or right side of the image.
	const [editTitle, setEditTitle] = useState(false);
	const [editNote, setEditNote] = useState(false);

	const handleClickOutside = (event) => {
		if (
			event.target.id != "heading-input" &&
			event.target.id != "description-input"
		) {
			console.log('click!');
			document.removeEventListener("click", handleClickOutside, true);
			setEditTitle(false);
			setEditNote(false);
			// todo: edit leaderboard
		}
	};

	useEffect(() => {
		(editTitle || editNote) && document.addEventListener("click", handleClickOutside, true);
	});

	// todo: split title among black and violet color
	// todo: handle click outside (and save edits)
	return (
		<Container>
			<TwoColumn>
				<TextColumn textOnLeft={textOnLeft}>
					<TextContent>
						{editTitle ? (
							<>
								<HeadingInput
									id="heading-input"
									defaultValue={leaderboard.title}
									autoFocus
								/>
								<br />
							</>
						) : (
							<Heading
								onClick={() => {
									setEditTitle(true);
								}}
							>
								{formatHeading(leaderboard.title)}
							</Heading>
						)}
						{editNote ? (
							<DescriptionInput
								id="description-input"
								defaultValue={leaderboard.note}
								autoFocus
							/>
						) : (
							<Description
								onClick={() => {
									setEditNote(true);
								}}
							>
								{leaderboard.note || "Leaderboard description"}
							</Description>
						)}
					</TextContent>
				</TextColumn>
			</TwoColumn>
		</Container>
	);
};
