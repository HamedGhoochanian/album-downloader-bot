CREATE TABLE IF NOT EXISTS users
(
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(255) NOT NULL,
    state           INTEGER      NOT NULL,
    latest_album_id INTEGER DEFAULT Null
);

CREATE TABLE IF NOT EXISTS albums
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    creator_id INTEGER,
    FOREIGN KEY (creator_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS songs
(
    id         SERIAL PRIMARY KEY,
    creator_id INTEGER,
    album_id INTEGER      NOT NULL,
    file_name  VARCHAR(512) NOT NULL,

    FOREIGN KEY (creator_id) REFERENCES users (id),
    FOREIGN KEY (album_id) REFERENCES albums (id)
);
