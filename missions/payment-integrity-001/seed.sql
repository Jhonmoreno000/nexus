-- Seed Data for Incident #1842
INSERT INTO customers (id, name, email) VALUES
(3421, 'Sarah Connor', 'sconnor@cyberdyne.corp'),
(1876, 'Marcus Wright', 'mwright@skynet.org'),
(2390, 'Kyle Reese', 'kreese@resistance.net'),
(4502, 'John Connor', 'jconnor@resistance.net'),
(6123, 'Kate Brewster', 'kbrewster@darpa.mil');

INSERT INTO orders (id, customer_id, status, total_amount) VALUES
(10001, 3421, 'paid', 249.99),
(10002, 1876, 'paid', 120.00),
(10003, 2390, 'paid', 899.50),
(10004, 4502, 'paid', 45.00),
(10005, 6123, 'paid', 1340.00);

INSERT INTO payments (id, order_id, amount, status) VALUES
(5601, 10001, 249.99, 'paid'),
(5602, 10002, 120.00, 'paid'),
(5603, 10003, 899.50, 'paid'),
(5604, 10004, 45.00, 'paid'),
(5605, 10005, 1340.00, 'paid');

-- Note: Orders 10001 and 10003 have missing transaction records (payment gateway timeout anomaly)
INSERT INTO transactions (id, payment_id, status, amount) VALUES
(8821, 5602, 'completed', 120.00),
(8834, 5604, 'completed', 45.00),
(8835, 5605, 'completed', 1340.00);
