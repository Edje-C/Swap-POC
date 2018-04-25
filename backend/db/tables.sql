DROP DATABASE IF EXISTS swap;
CREATE DATABASE swap;

\c swap;

DROP TABLE IF EXISTS users, playlist, tracks, friends;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE,
    password_digest VARCHAR,
    email VARCHAR,
    spotfiy_id VARCHAR DEFAULT ''
);

CREATE TABLE playlist (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    creator_id VARCHAR,
    collaborator_count INTEGER,
    length INTEGER,
    date_created VARCHAR
);

CREATE TABLE tracks (
    playlist_id INTEGER REFERENCES playlist(id),
    track_uri VARCHAR,
    name VARCHAR,
    duration INTEGER,
    artists VARCHAR,
    album VARCHAR
);

CREATE TABLE friends (
    follower_id INTEGER REFERENCES users(id),
    following_id INTEGER REFERENCES users(id)
);

CREATE TABLE collaborations (
    playlist_id INTEGER REFERENCES playlist(id),
    user_id INTEGER REFERENCES users(id),
    status BOOLEAN
);
