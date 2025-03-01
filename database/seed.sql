USE trading_hub;

-- Insert Test Users
INSERT INTO users (username, password_hash, email, latitude, longitude) VALUES
('henry', 'hashedpassword1', 'henry@example.com', 35.3733, -119.0187),
('alice', 'hashedpassword2', 'alice@example.com', 34.0522, -118.2437);

-- Insert Test Posts
INSERT INTO posts (user_id, card_name, description, latitude, longitude) VALUES
(1, 'OP07 Lucci', 'Looking for an OP07 Lucci!', 35.3733, -119.0187),
(2, 'Zoro SR', 'Need a Zoro SR for my deck', 34.0522, -118.2437);

-- Insert Test Comments
INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'I have one for trade!'),
(2, 1, 'Interested in any of my cards?');
