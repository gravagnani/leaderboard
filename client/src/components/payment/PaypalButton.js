import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import PaypalExpressBtn from "react-paypal-express-checkout";

import {
	PRICING_BASIC,
	PRICING_MEDIUM,
	PRICING_LARGE,
	PRICE_BASIC,
	PRICE_MEDIUM,
	PRICE_LARGE,
} from "../../constants";

import { createLeaderboard } from "../../controllers/leaderboardController";

// TODO: NON MI PIACE MOLTO COME IMPLEMENTATO -> GUARDARE COME FARE VALIDAZIONE LATO SERVER
export default ({ pricing, history, doCreateLeaderboard, setErrorMessage }) => {
	const onSuccess = (payment) => {
		// Congratulation, it came here means everything's fine!
		console.log("The payment was succeeded!", payment);
		// You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
		doCreateLeaderboard()
			.then((e) => {
				console.log(e);
				if (e.status == "error") {
					throw new Error(e.error);
				}
				const leaderboard_uuid = e.data.uuid;
				history.push({
					pathname: "/leaderboard/" + leaderboard_uuid,
				});
			})
			.catch((e) => {
				setErrorMessage(e);
			});
	};

	const onCancel = (data) => {
		// User pressed "cancel" or close Paypal's popup!
		console.log("The payment was cancelled!", data);
		// You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
	};

	const onError = (err) => {
		// The main Paypal's script cannot be loaded or somethings block the loading of that script!
		console.log("Error!", err);
		// Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
		// => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
	};

	let env = "sandbox"; // you can set here to 'production' for production
	let currency = "EUR"; // or you can set this value from your props or state
	let total = null; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
	// Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/
	switch (pricing) {
		case PRICING_BASIC:
			break;
		case PRICING_MEDIUM:
			total = PRICE_MEDIUM;
			break;
		case PRICING_LARGE:
			total = PRICE_LARGE;
			break;
	}

	let style = {
		label: "paypal",
		tagline: false,
		size: "large",
		shape: "pill",
		color: "gold",
	};

	const client = {
		sandbox:
			"AVyJg7Hqc-WHUqw3kQZw3Z0VE5pKtA6g4Cfwd_8eHX6d_40rDqikX7b1NCFb8fQ3t6nGJ38svF5gH7Y3",
		production: "SANDBOX_CODE",
	};

	// In order to get production's app-ID, you will have to send your app to Paypal for approval first
	// For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
	//   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
	// For production app-ID:
	//   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

	// NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
	return (
		<PaypalExpressBtn
			env={env}
			client={client}
			style={style}
			currency={currency}
			total={total}
			onError={onError}
			onSuccess={onSuccess}
			onCancel={onCancel}
		/>
	);
};
