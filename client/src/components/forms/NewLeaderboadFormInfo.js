import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { useHistory, useLocation } from "react-router-dom";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";

import ErrorAlert from "../../alerts/ErrorAlert";

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
			${tw`text-gray-500`}
		}
	}
`;

const Column = tw.div`flex flex-col`;
const InputContainer = tw.div`relative py-5 mt-6`;
const Label = tw.label`absolute top-0 left-0 tracking-wide font-semibold text-sm`;
const Input = tw.input``;
const TextArea = tw.textarea`h-24 sm:h-full resize-none`;
const ButtonLeft = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;
const ButtonRight = tw.button`w-full float-right sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;

const SvgDotPattern1 = tw(
	SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`;

const setLocalStorage = (title, place, note) => {
	sessionStorage.setItem("title-input", title);
	sessionStorage.setItem("place-input", place);
	sessionStorage.setItem("note-input", note);
};

export default () => {
	const history = useHistory();

	const [errorMessage, setErrorMessage] = useState(null);

	const handleNextBtnClick = () => {
		const title = document.getElementById("title-input").value;
		const place = document.getElementById("place-input").value;
		const note = document.getElementById("note-input").value;
		if (!title) {
			setErrorMessage('Error: "Title" must have some value');
		} else {
			setLocalStorage(title, place, note);
			history.push({
				pathname: "/new/options",
				//pathname: "/new/pricing",
			});
		}
	};

	const titleInputSS = sessionStorage.getItem("title-input")
		? sessionStorage.getItem("title-input")
		: null;
	const placeInputSS = sessionStorage.getItem("place-input")
		? sessionStorage.getItem("place-input")
		: null;
	const noteInputSS = sessionStorage.getItem("note-input")
		? sessionStorage.getItem("note-input")
		: null;

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
						<h2>What Leaderboard?</h2>
						<Column>
							<InputContainer>
								<Label htmlFor="title-input">Title</Label>
								<Input
									id="title-input"
									type="text"
									placeholder="E.g. Title Leaderboard"
									defaultValue={titleInputSS}
								/>
							</InputContainer>
							<InputContainer>
								<Label htmlFor="place-input">Place</Label>
								<Input
									id="place-input"
									type="text"
									placeholder="E.g. New York"
									defaultValue={placeInputSS}
								/>
							</InputContainer>
							<InputContainer tw="flex-1">
								<Label htmlFor="note-input">Note</Label>
								<TextArea
									id="note-input"
									placeholder="E.g. Details about your event"
									defaultValue={noteInputSS}
								/>
							</InputContainer>
						</Column>

						<ButtonLeft
							onClick={(e) => {
								history.push({
									//pathname: "/",
									pathname: "/new/pricing",
								});
							}}
							value="Back"
						>
							Back
						</ButtonLeft>
						<ButtonRight
							onClick={(e) => {
								handleNextBtnClick();
							}}
							value="Next"
						>
							Next
						</ButtonRight>
					</div>
					<SvgDotPattern1 />
				</FormContainer>
			</Content>
		</Container>
	);
};
