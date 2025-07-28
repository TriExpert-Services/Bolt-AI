INSERT INTO users (username, email, password, role, balance) VALUES
('admin', 'admin@promint.com', '$2y$10$N.x.QYV7y5J1N5bE6bO3.OKU.V5B.7v8./.5bO3.OKU.V5B.7v8.', 'admin', 10000.00),
('johndoe', 'johndoe@email.com', '$2y$10$N.x.QYV7y5J1N5bE6bO3.OKU.V5B.7v8./.5bO3.OKU.V5B.7v8.', 'client', 500.00),
('janesmith', 'janesmith@email.com', '$2y$10$N.x.QYV7y5J1N5bE6bO3.OKU.V5B.7v8./.5bO3.OKU.V5B.7v8.', 'client', 1500.00);

INSERT INTO transactions (user_id, amount, type) VALUES
(2, 200.00, 'deposit'),
(2, 50.00, 'withdrawal'),
(3, 1000.00, 'deposit'),
(3, 250.00, 'withdrawal');

INSERT INTO kyc_submissions (user_id, document_type, document_path, status) VALUES
(2, 'Passport', 'uploads/passport_johndoe.jpg', 'pending'),
(3, 'Drivers License', 'uploads/license_janesmith.jpg', 'approved');
