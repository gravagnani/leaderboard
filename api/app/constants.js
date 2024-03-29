const PRICING_BASIC = "basic";
const PRICING_MEDIUM = "medium";
const PRICING_LARGE = "large";

const MIN_USERS_BASIC = 1;
const MAX_USERS_BASIC = 15;

const MIN_USERS_MEDIUM = 1;
const MAX_USERS_MEDIUM = 30;

const MIN_USERS_LARGE = 1;
const MAX_USERS_LARGE = 100;

const MAX_USERS_PER_TEAM = 1;
const MAX_USERS_PER_GAME = 2;

const DEFAULT_CLASSIC_MEAN = 0;
const DEFAULT_CLASSIC_VARIANCE = null;
const DEFAULT_TRUESKILL_MEAN = 25;
const DEFAULT_TRUESKILL_VARIANCE = 25 / 3;

const WIN_TEAM = 1;
const LOSE_TEAM = 2;
const DRAW_TEAM = 3;

const CLASSIC_WIN_POINTS = 3;
const CLASSIC_LOSE_POINTS = 0;
const CLASSIC_DRAW_POINTS = 1;

export {
	PRICING_BASIC,
	PRICING_MEDIUM,
	PRICING_LARGE,
	MIN_USERS_BASIC,
	MAX_USERS_BASIC,
	MIN_USERS_MEDIUM,
	MAX_USERS_MEDIUM,
	MIN_USERS_LARGE,
	MAX_USERS_LARGE,
	MAX_USERS_PER_TEAM,
	MAX_USERS_PER_GAME,
	DEFAULT_CLASSIC_MEAN,
	DEFAULT_CLASSIC_VARIANCE,
	DEFAULT_TRUESKILL_MEAN,
	DEFAULT_TRUESKILL_VARIANCE,
	WIN_TEAM,
	LOSE_TEAM,
	DRAW_TEAM,
	CLASSIC_WIN_POINTS,
	CLASSIC_LOSE_POINTS,
	CLASSIC_DRAW_POINTS,
};
