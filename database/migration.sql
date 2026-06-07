CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS seats (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    locked_until TIMESTAMP NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO users (username) VALUES ('Alice'), ('Bob'), ('Charlie');
INSERT INTO events (title, date) VALUES ('Taylor Swift - Eras Tour Canada', '2026-11-20 20:00:00');
INSERT INTO seats (event_id, seat_number) VALUES (1, 'A-1'), (1, 'A-2'), (1, 'A-3'), (1, 'B-1'), (1, 'B-2');
