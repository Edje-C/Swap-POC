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


INSERT INTO users (username, password_digest, email)
  VALUES('edje-c', '$2a$10$nNpYLNkN7AOP41hvoVtaT.bUW3R.e3Fb/ZGqsXaOn3xlMuFW4wWeG', 'edje-c@swap.com'),
        ('ikyomadu', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'ikyomadu@swap.com'),
        ('xavierbx', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'xavierbx@swap.com'),
        ('newtonjr', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'newtonjr@swap.com'),
        ('ferminjan', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'ferminjan@swap.com'),
        ('doriguzman', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'doriguzman@swap.com'),
        ('notadocbuta', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'notadocbuta@swap.com');
