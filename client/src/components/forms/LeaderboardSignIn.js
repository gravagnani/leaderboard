import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import {
	SectionHeading,
	Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const TextColumn = styled(Column)((props) => [
	tw` mt-16 md:mt-0`,
	props.textOnLeft
		? tw`md:mr-12 lg:mr-16 md:order-first`
		: tw`md:order-last`,
]);

const Image = styled.div((props) => [
	`background-image: url("${props.imageSrc}");`,
	tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-center`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
	SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-center leading-tight`;
const Description = tw.p`mt-4 mb-4 text-center md:text-center text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;
const HeadingLink = tw.span`text-primary-500 cursor-pointer hover:underline`;

const Input = tw.input`w-6/12 border-2 px-5 py-3 rounded focus:outline-none font-medium transition duration-300 hocus:border-primary-500`;

const SubmitButton = tw(PrimaryButtonBase)`inline-block lg:ml-6 mt-6 sm:mt-3`;

const copyClipboard = () => {
	let copyText = document.getElementById("link-leaderboard");
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/
	document.execCommand("copy");
};

export default (props) => {
	const history = useHistory();
	// The textOnLeft boolean prop can be used to display either the text on left or right side of the image.

	return (
		<Container>
			<TwoColumn>
				<TextColumn>
					<TextContent>
						<Heading>
							<HeadingLink
								onClick={() => {
									history.push({
										pathname: "/signin",
										calling_page: "/leaderboard/" + props.leaderboardUUID
									});
								}}
							>
								Sign In
							</HeadingLink>{" "}
							to Participate.
						</Heading>
					</TextContent>
				</TextColumn>
			</TwoColumn>
		</Container>
	);
};
