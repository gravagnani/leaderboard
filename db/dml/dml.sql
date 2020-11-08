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
	, image			text
	, flag_active	bit
	, created_at 	timestamptz
	, created_by	varchar
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
	, mode 			varchar
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
	, leaderboard_uuid 	varchar
	, user_uuid			varchar
	, user_full_name	varchar
	, user_mean			real
	, user_variance		real
	, created_at 		timestamptz
	, created_by		varchar
	, modified_at 		timestamptz
	, modified_by		varchar
	
	, primary key(id)
	, foreign key(user_uuid) references leaderboard_dev.users(uuid)
	, foreign key(leaderboard_uuid) references leaderboard_dev.leaderboard(uuid)
	, unique (leaderboard_uuid, user_uuid)
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
	, uuid				varchar unique
	, leaderboard_uuid	varchar
	, created_at 		timestamptz
	, created_by		varchar
	, modified_at 		timestamptz
	, modified_by		varchar
	
	, primary key (id)
	, foreign key (leaderboard_uuid) references leaderboard_dev.leaderboard(uuid)
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
	, game_uuid			varchar
	, user_uuid			varchar
	, team				int
	, mean_old			real
	, variance_old		real
	, mean_new			real
	, variance_new		real
	, created_at 		timestamptz
	, created_by		varchar
	, modified_at 		timestamptz
	, modified_by		varchar
	
	, primary key (id)
	, foreign key (user_uuid) references leaderboard_dev.users(uuid)
	, foreign key (game_uuid) references leaderboard_dev.game(uuid)
);

select *
from leaderboard_dev.user_game
;


------------------------------
------ LEADERBOARD VIEW ------
------------------------------

-- drop view leaderboard_dev.leaderboard_v

create or replace view leaderboard_dev.leaderboard_v as
select 
	  l.id
	, l.uuid
	, l.title
	, l.place
	, l.note
	, l.min_users
	, l.max_users
	, l.start_date
	, l.end_date
	, l.mode
	, l.flag_public
	, l.flag_active
	, l.created_at
	, l.created_by
	, l.modified_at
	, l.modified_by
	, count(distinct user_uuid) users
from leaderboard_dev.leaderboard l left join leaderboard_dev.user_leaderboard ul 
	on (l.uuid = ul.leaderboard_uuid)
group by 
	  l.id
	, l.uuid
	, l.title
	, l.place
	, l.note
	, l.min_users
	, l.max_users
	, l.start_date
	, l.end_date
	, l.mode
	, l.flag_public
	, l.flag_active
	, l.created_at
	, l.created_by
	, l.modified_at
	, l.modified_by
;

select *
from leaderboard_dev.leaderboard_v
;


------------------------------
---------- GAME VIEW ---------
------------------------------

-- drop view leaderboard_dev.game_v

create or replace view leaderboard_dev.game_v as
	select
		  g.id
		, g.uuid as game_uuid
		, g.leaderboard_uuid
		, string_agg(ug.user_uuid, ',') as users_uuid
		, string_agg(u.full_name, ',') as users_name
		, string_agg(cast(mean_new - mean_old as varchar), ',') as users_delta
		, g.created_at
		, g.created_by
		, g.modified_at
		, g.modified_by
	from leaderboard_dev.game g 
		inner join leaderboard_dev.user_game ug 
			on (g.uuid = ug.game_uuid)
		inner join leaderboard_dev.users u 
			on (ug.user_uuid = u.uuid)
	group by 
	  	  g.id
		, g.uuid
		, g.leaderboard_uuid
		, g.modified_at
		, g.modified_by
;


select to_char(modified_at, 'Dy DD Mon')
from leaderboard_dev.game_v
;

