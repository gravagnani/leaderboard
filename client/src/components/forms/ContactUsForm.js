import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { useHistory } from "react-router-dom";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";

import ErrorAlert from "../../alerts/ErrorAlert";

import PaypalButton from "../payment/PaypalButton";

import { createLeaderboard } from "../../controllers/leaderboardController";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const FormContainer = styled.div`
	${tw`p-10 sm:p-12 md:p-16 bg-primary-900 text-gray-100 rounded-lg relative`}
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
			${tw`text-gray-900`}
		}
	}
`;

const Column = tw.div` flex flex-col`;
const InputContainer = tw.div`relative py-5 mt-6`;
const Label = tw.label`absolute top-0 left-0 tracking-wide font-semibold text-sm`;
const Input = tw.input``;
const InputText = tw.textarea`resize-y border rounded-md`;
const ButtonLeft = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;
const ButtonRight = tw.button`w-full float-right sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;
const ButtonRightPP = tw.button`float-right mt-6 `;

const setLocalStorage = (email, full_name) => {
	sessionStorage.setItem("name-input", full_name);
	sessionStorage.setItem("email-input", email);
};

const SvgDotPattern1 = tw(
	SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`;

const doCreateLeaderboard = async () => {
	let title = sessionStorage.getItem("title-input");
	let place = sessionStorage.getItem("place-input");
	let note = sessionStorage.getItem("note-input");
	let min_users = sessionStorage.getItem("min-users-input");
	let max_users = sessionStorage.getItem("max-users-input");
	let start_date = sessionStorage.getItem("start-date-input");
	let end_date = sessionStorage.getItem("end-date-input");
	let mode = sessionStorage.getItem("active-tab")
		? sessionStorage.getItem("active-tab")
		: "C";
	let full_name = sessionStorage.getItem("name-input");
	let email = sessionStorage.getItem("email-input");
	let pricing = sessionStorage.getItem("pricing-input"); // basic - medium - large

	return createLeaderboard({
		title,
		place,
		note,
		min_users,
		max_users,
		start_date,
		end_date,
		mode,
		full_name,
		email,
		pricing,
	});
};

export default () => {
	const history = useHistory();

	const [errorMessage, setErrorMessage] = useState(null);

	const user = JSON.parse(localStorage.getItem("user"));

	const handleBackBtnClick = () => {
		history.push({
			pathname: "/",
		});
	};

	const handleNextBtnClick = () => {};

	return (
		<Container>
			<Content>
				{errorMessage && (
					<ErrorAlert
						message={errorMessage}
						setMessage={setErrorMessage}
					/>
				)}
				<FormContainer>
					<div tw="mx-auto max-w-4xl">
						<h2>Contact Us</h2>
						<Column>
							<InputContainer>
								<Label htmlFor="email-input">Your Email Address</Label>
								<Input
									id="email-input"
									type="email"
									placeholder="E.g. john@mail.com"
									defaultValue={user && user.email}
								/>
							</InputContainer>
							<InputContainer>
								<Label htmlFor="message-input">Message</Label>
								<InputText
									id="message-input"
									rows="8"
									placeholder=""
									defaultValue={""}
								/>
							</InputContainer>
						</Column>

						<ButtonLeft
							onClick={(e) => {
								handleBackBtnClick();
							}}
						>
							Back
						</ButtonLeft>
						<ButtonRight
							onClick={(e) => {
								handleNextBtnClick();
							}}
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
