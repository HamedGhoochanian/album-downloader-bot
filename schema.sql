CREATE TABLE IF NOT EXISTS users
(
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(255) NOT NULL
);

CREATE TYPE album_status as enum('waiting_for_name','waiting_for_songs','zipped','cancelled');

CREATE TABLE IF NOT EXISTS albums
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) DEFAULT NULL,
    state album_status NOT NULL DEFAULT 'waiting_for_name',
    creator_id INTEGER,
    date timestamp DEFAULT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS songs
(
    id         SERIAL PRIMARY KEY,
    creator_id INTEGER,
    album_id INTEGER      NOT NULL,
    file_name  VARCHAR(512) NOT NULL,
    date timestamp DEFAULT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id),
    FOREIGN KEY (album_id) REFERENCES albums (id)
);
