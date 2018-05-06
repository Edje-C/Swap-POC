DROP DATABASE IF EXISTS swap;
CREATE DATABASE swap;

\c swap;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE,
    password_digest VARCHAR,
    email VARCHAR,
    spotfiy_id VARCHAR DEFAULT ''
);

CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES users(id),
    name VARCHAR,
    length INTEGER,
    date_created DATE,
    status BOOLEAN
);

CREATE TABLE tracks (
    playlist_id INTEGER REFERENCES playlists(id),
    track_uri VARCHAR,
    name VARCHAR,
    duration VARCHAR,
    artists VARCHAR,
    album VARCHAR
);

CREATE TABLE friends (
    follower_id INTEGER REFERENCES users(id),
    following_id INTEGER REFERENCES users(id)
);

CREATE TABLE collaborations (
    playlist_id INTEGER REFERENCES playlists(id),
    user_id INTEGER REFERENCES users(id),
    status CHAR
);


INSERT INTO users (username, password_digest, email)
  VALUES('edje-c', '$2a$10$nNpYLNkN7AOP41hvoVtaT.bUW3R.e3Fb/ZGqsXaOn3xlMuFW4wWeG', 'edje-c@swap.com'),
        ('ikyomadu', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'ikyomadu@swap.com'),
        ('xavierbx', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'xavierbx@swap.com'),
        ('newtonjr', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'newtonjr@swap.com'),
        ('ferminjan', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'ferminjan@swap.com'),
        ('doriguzman', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'doriguzman@swap.com'),
        ('notadocbuta', '$2a$10$noryJFgByFccCS/F6XILSeqM.3TqBhmRJ0QtAMPHtlzriqk6rsY8S', 'notadocbuta@swap.com');


INSERT INTO playlists (creator_id, name, length, date_created, status)
  VALUES(1, 'New Beginnings', 15, '2018/05/01', false),
        (1, 'Road Trip With Losers', 96, '2018/05/03', false),
        (7, 'Jams', 56, '2018/05/05', false),
        (3, 'Quality and Trash', 30, '2018/05/05', false),
        (1, 'Today''s A Good One', 50, '2018/05/07', false),
        (6, 'Pussy Poppin Playlist Remix', 60, '2018/05/09', false),
        (2, '音楽は癒しです', 10, '2018/05/10', false),
        (4, 'That Mix', 72, '2018/05/10', false),
        (5, 'Música Para Las Chicas', 80, '2018/05/15', false);

INSERT INTO tracks (playlist_id, track_uri, name, duration, artists, album)
  VALUES(1, '34xTFwjPQ1dC6uJmleno7x', 'Godspeed', '2:57', 'Frank Ocean', 'Blonde'),
        (1, '1NCpNh3FtNEFIDOx22umJW', 'Fire Escape', '4:22', 'Foster The People', 'Supermodel'),
        (1, '7eRU0RltchvgOTSbX6vmdv', '666 ʇ', '4:12', 'Bon Iver', '22, A Million'),
        (1, '65u1dHQyQyE4y4aN2eDmMF', '$$$ - with Matt Ox', '2:10', 'XXXTENTACION, Matt Ox', '?'),
        (1, '1SQYnNI7TlgzrN9i61Kpox', 'Wonder Where We Land', '2:45', 'SBTRKT, Sampha', 'Wonder Where We Land'),
        (1, '0Zx8khUcEfCFK2AEoIhC92', 'Don''t Leave', '3:34', 'Snakehips, MØ', 'Don''t Leave'),
        (1, '7KA4W4McWYRpgf0fWsJZWB', 'See You Again', '3:00', 'Tyler, The Creator, Kali Uchis', 'Flower Boy'),
        (1, '5Kvf5qLa7bvgCV5lddTbDY', 'Harder', '4:00', 'Oliver Root', 'Harder'),
        (1, '736XrOvsUtOpuyLmPdjuG3', 'Told You So', '3:10', 'Miguel', 'War & Leisure'),
        (1, '6mOYKdbTO2cuJDUs8He5Z6', 'Heartbreak', '2:37', 'Christian Leave', 'Heartbreak Room'),
        (1, '5wTVNpi5WDByxBgKgUE6MU', 'Supermodel', '3:01', 'SZA', 'Ctrl'),
        (1, '3cBV8V9zlYNraydyF8NpBY', 'Dress', '3:49', 'Sylvan Esso', 'Sylvan Esso'),
        (1, '5f9Y4fa3y4mR6Lg1fifz86', 'Bridge Burn', '2:44', 'Little Comets', 'Life Is Elsewhere'),
        (1, '4L2K7JKseFCBoHMZEAszW0', 'Jealous', '4:47', 'Labrinth', 'Jealous'),
        (1, '5q5gzmbBS5yQzos2BvVr1t', 'Nights With You', '3:17', 'MØ', 'Nights With You');

INSERT INTO friends (follower_id, following_id)
  VALUES(5, 1),
        (1, 5),
        (4, 1),
        (6, 1),
        (1, 4),
        (6, 5),
        (7, 6),
        (6, 7),
        (1, 6),
        (5, 6),
        (3, 6),
        (1, 2),
        (3, 1),
        (1, 3),
        (6, 3),
        (2, 1);

INSERT INTO collaborations (playlist_id, user_id, status)
  VALUES(1, 6, 'a'),
        (1, 5, 'a'),
        (2, 7, 'a'),
        (2, 2, 'a'),
        (2, 3, 'a'),
        (2, 4, 'a'),
        (3, 1, 'a'),
        (3, 3, 'a'),
        (3, 4, 'a'),
        (4, 5, 'a'),
        (4, 1, 'a'),
        (5, 6, 'a'),
        (5, 4, 'a'),
        (5, 5, 'a'),
        (5, 3, 'a'),
        (6, 5, 'a'),
        (6, 4, 'a'),
        (6, 3, 'a'),
        (7, 1, 'p'),
        (8, 5, 'a'),
        (8, 3, 'a'),
        (8, 1, 'a'),
        (8, 6, 'a'),
        (8, 7, 'a'),
        (9, 6, 'a'),
        (9, 3, 'a'),
        (9, 7, 'a');
