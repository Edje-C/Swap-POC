DROP DATABASE IF EXISTS swap;
CREATE DATABASE swap;

\c swap;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE,
    spotify_id VARCHAR,
    email VARCHAR UNIQUE
);

CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    creator VARCHAR REFERENCES users (username),
    name VARCHAR,
    length INTEGER,
    date_created TIMESTAMP,
    uri VARCHAR DEFAULT '',
    complete BOOLEAN DEFAULT false
);

CREATE TABLE tracks (
    playlist_id INTEGER REFERENCES playlists (id),
    track_uri VARCHAR,
    name VARCHAR,
    duration VARCHAR,
    artists VARCHAR,
    album VARCHAR
);

CREATE TABLE friends (
    follower VARCHAR REFERENCES users (username),
    following VARCHAR REFERENCES users (username)
);

CREATE TABLE collaborations (
    playlist_id INTEGER REFERENCES playlists (id),
    username VARCHAR REFERENCES users (username),
    status CHAR DEFAULT 'p'
);


INSERT INTO users (username, spotify_id, email)
  VALUES('edje-c', 'edje-c','edje-c@swap.com'),
        ('ikyomadu', 'ikyomadu', 'ikyomadu@swap.com'),
        ('xavierbx', 'xavierbx', 'xavierbx@swap.com'),
        ('newtonjr', 'newtonjr', 'newtonjr@swap.com'),
        ('ferminjan', 'ferminjan', 'ferminjan@swap.com'),
        ('doriguzman', 'doriguzman', 'doriguzman@swap.com'),
        ('notadocbuta', 'notadocbuta', 'notadocbuta@swap.com'),
        ('kelstar809', 'kelstar809', 'kelstar809@swap.com'),
        ('jason', 'jason', 'jason@swap.com'),
        ('izza', 'izza', 'izza@swap.com'),
        ('liu', 'liu', 'liu@swap.com'),
        ('chrisyzeli', 'chrisyzeli', 'chrisyzeli@swap.com');


INSERT INTO playlists (creator, name, length, date_created, complete)
  VALUES('edje-c', 'New Beginnings', 15, '05/01/2018 14:05:06', true),
        ('edje-c', 'Road Trip With Losers', 96, '05/03/2018 11:12:16', true),
        ('notadocbuta', 'Jams', 56, '05/05/2018 20:01:12', true),
        ('xavierbx', 'Quality and Trash', 30, '05/05/2018 22:15:14', true),
        ('edje-c', 'Today''s A Good One', 50, '05/07/2018 14:34:43', true),
        ('doriguzman', 'Poppin Playlist Remix', 60, '05/09/2018 16:05:06', true),
        ('ikyomadu', '音楽は癒しです', 10, '05/10/2018 23:05:46', false),
        ('newtonjr', 'That Mix', 72, '05/10/2018 23:45:45', false),
        ('ferminjan', 'Música Para Las Chicas', 80, '05/15/2018 11:27:17', true);

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

INSERT INTO friends (follower, following)
  VALUES('ferminjan', 'edje-c'),
        ('edje-c', 'ferminjan'),
        ('newtonjr', 'edje-c'),
        ('doriguzman', 'edje-c'),
        ('edje-c', 'newtonjr'),
        ('doriguzman', 'ferminjan'),
        ('notadocbuta', 'doriguzman'),
        ('doriguzman', 'notadocbuta'),
        ('edje-c', 'doriguzman'),
        ('ferminjan', 'doriguzman'),
        ('xavierbx', 'doriguzman'),
        ('edje-c', 'ikyomadu'),
        ('xavierbx', 'edje-c'),
        ('edje-c', 'xavierbx'),
        ('doriguzman', 'xavierbx'),
        ('ikyomadu', 'edje-c');

INSERT INTO collaborations (playlist_id, username, status)
  VALUES(1, 'doriguzman', 'a'),
        (1, 'ferminjan', 'a'),
        (2, 'notadocbuta', 'a'),
        (2, 'ikyomadu', 'a'),
        (2, 'xavierbx', 'a'),
        (2, 'newtonjr', 'a'),
        (3, 'edje-c', 'a'),
        (3, 'xavierbx', 'a'),
        (3, 'newtonjr', 'a'),
        (4, 'ferminjan', 'a'),
        (4, 'edje-c', 'a'),
        (5, 'doriguzman', 'a'),
        (5, 'newtonjr', 'a'),
        (5, 'ferminjan', 'a'),
        (5, 'xavierbx', 'a'),
        (6, 'ferminjan', 'a'),
        (6, 'newtonjr', 'a'),
        (6, 'xavierbx', 'a'),
        (7, 'edje-c', 'p'),
        (8, 'ferminjan', 'a'),
        (8, 'xavierbx', 'a'),
        (8, 'edje-c', 'p'),
        (8, 'doriguzman', 'a'),
        (8, 'notadocbuta', 'a'),
        (9, 'doriguzman', 'a'),
        (9, 'xavierbx', 'a'),
        (9, 'notadocbuta', 'a');
