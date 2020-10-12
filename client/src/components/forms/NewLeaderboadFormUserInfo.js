import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { useHistory } from "react-router-dom";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const FormContainer = styled.div`
	${tw`p-10 sm:p-12 md:p-16 bg-primary-500 text-gray-100 rounded-lg relative`}
	form {
		${tw`mt-4`}
	}
	h2 {
		${tw`text-3xl sm:text-4xl font-bold`}
	}
	input,
	textarea {
		${tw`w-full bg-transparent text-gray-100 text-base font-medium tracking-wide border-b-2 py-2 text-gray-100 hocus:border-pink-400 focus:outline-none transition duration-200`};

		::placeholder {
			${tw`text-gray-500`}
		}
	}
`;

const Column = tw.div` flex flex-col`;
const InputContainer = tw.div`relative py-5 mt-6`;
const Label = tw.label`absolute top-0 left-0 tracking-wide font-semibold text-sm`;
const Input = tw.input``;
const ButtonLeft = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;
const ButtonRight = tw.button`w-full float-right sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;

const setLocalStorage = () => {
	sessionStorage.setItem(
		"name-input",
		document.getElementById("name-input").value
	);
	sessionStorage.setItem(
		"email-input",
		document.getElementById("email-input").value
	);
};

const createLeaderboard = () => {
	let title = sessionStorage.getItem("title-input");
	let place = sessionStorage.getItem("place-input");
	let note = sessionStorage.getItem("note-input");
	let min_users = sessionStorage.getItem("min-users-input");
	let max_users = sessionStorage.getItem("max-users-input");
	let start_date = sessionStorage.getItem("start-date-input");
	let end_date = sessionStorage.getItem("end-date-input");
	let active_tab = sessionStorage.getItem("active-tab");
	let name = sessionStorage.getItem("name-input");
	let email = sessionStorage.getItem("email-input");

	console.log({
		title,
		place,
		note,
		min_users,
		max_users,
		start_date,
		end_date,
		active_tab,
		name,
		email,
	});
};

const SvgDotPattern1 = tw(
	SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`;

export default () => {
	const history = useHistory();

	const nameInputSS = sessionStorage.getItem("name-input")
		? sessionStorage.getItem("name-input")
		: "";
	const emailInputSS = sessionStorage.getItem("email-input")
		? sessionStorage.getItem("email-input")
		: "";

	//const [nameInput, setNameInput] = useState(nameInputSS);
	//const [emailInput, setEmailInput] = useState(emailInputSS);

	return (
		<Container>
			<Content>
				<FormContainer>
					<div tw="mx-auto max-w-4xl">
						<h2>Your Info</h2>
						<Column>
							<InputContainer>
								<Label htmlFor="name-input">Your Name</Label>
								<Input
									id="name-input"
									type="text"
									placeholder="E.g. John Doe"
									defaultValue={nameInputSS}
								/>
							</InputContainer>
							<InputContainer>
								<Label htmlFor="email-input">Your Email Address</Label>
								<Input
									id="email-input"
									type="email"
									placeholder="E.g. john@mail.com"
									defaultValue={emailInputSS}
								/>
							</InputContainer>
						</Column>

						<ButtonLeft
							onClick={(e) => {
								e.preventDefault();
								setLocalStorage();
								history.push({
									pathname: "/new/options",
								});
							}}
							value="Back"
						>
							Back
						</ButtonLeft>
						<ButtonRight
							onClick={(e) => {
								e.preventDefault();
								setLocalStorage();
								createLeaderboard();
								history.push({
									pathname: "/leaderboard",
								});
							}}
							value="Done"
						>
							Done
						</ButtonRight>
					</div>
					<SvgDotPattern1 />
				</FormContainer>
			</Content>
		</Container>
	);
};
