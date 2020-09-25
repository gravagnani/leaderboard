create schema leaderboard_dev;


-- # DROP TABLES
drop table leaderboard_dev.user_game;
drop table leaderboard_dev.game;
drop table leaderboard_dev.user_leaderboard;
drop table leaderboard_dev.leaderboard;
drop table leaderboard_dev.users;

-- SEARCHPATH 
set search_path to 'leaderboard_dev';


---------------------------
------- USERS TABLE -------
---------------------------

-- drop table leaderboard_dev.user;

create table leaderboard_dev.users (
	  id			serial
	, uuid			varchar unique
	, email 		varchar unique
	, full_name		varchar
	, password 		varchar
	, flag_active	bit
	, created_at 	timestamptz
	, modified_at 	timestamptz
	, modified_by	varchar
	
	, primary key (id)
);

select * 
from leaderboard_dev.user
;

---------------------------
---- LEADERBOARD TABLE ----
---------------------------

-- drop table leaderboard_dev.leaderboard

create table leaderboard_dev.leaderboard (
	  id			serial
	, uuid 			varchar unique
	, title 		varchar
	, place 		varchar
	, note 			varchar
	, min_users		int
	, max_users		int
	, start_date	timestamptz
	, end_date		timestamptz
	, flag_public	bit
	, flag_active 	bit
	, created_at 	timestamptz
	, created_by	varchar
	, modified_at 	timestamptz
	, modified_by	varchar
	
	, primary key (id)
);

select *
from leaderboard_dev.leaderboard
;


------------------------------
--- USER-LEADERBOARD TABLE ---
------------------------------

-- drop table leaderboard_dev.user_leaderboard

create table leaderboard_dev.user_leaderboard (
	  id 				serial
	, leaderboard_id 	int
	, user_id			int
	, flag_owner		bit
	, user_mean			real
	, user_variance		real
	, created_at 		timestamptz
	, modified_at 		timestamptz
	, modified_by		varchar
	
	, primary key(id)
	, foreign key(user_id) references leaderboard_dev.users(id)
	, foreign key(leaderboard_id) references leaderboard_dev.leaderboard(id)
);

select * 
from leaderboard_dev.user_leaderboard
; 



------------------------------
--------- GAME TABLE ---------
------------------------------

-- drop table leaderboard_dev.game

create table leaderboard_dev.game (
	  id 				serial
	, leaderboard_id	int
	, modified_at 		timestamptz
	, modified_by		varchar
	
	, primary key (id)
	, foreign key (leaderboard_id) references leaderboard_dev.leaderboard(id)
);

select *
from leaderboard_dev.game
;



------------------------------
------- USER-USER TABLE ------
------------------------------

-- drop table leaderboard_dev.user_game

create table leaderboard_dev.user_game (
	  id 				serial
	, game_id			int
	, user_id			int
	, team				int
	, modified_at 		timestamptz
	, modified_by		varchar
	
	, primary key (id)
	, foreign key (user_id) references leaderboard_dev.users(id)
	, foreign key (game_id) references leaderboard_dev.game(id)
);

select *
from leaderboard_dev.user_game
;



select * from users where uuid = 'P53J99OE4H';
