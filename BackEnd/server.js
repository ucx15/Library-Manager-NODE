// Server.js

const fs = require("fs");
const express = require('express');
const sqlite3 = require('sqlite3');
const dotenv = require('dotenv')
const cors = require('cors');


dotenv.config({ path: __dirname + "\\.env.local" })

const PORT = process.env.PORT || 5000;
const DB_NAME = process.env.DB_NAME || "libDB.db";


// Checks if existing database already exists
// if not then create new one
if (!fs.existsSync(DB_NAME)) {
	console.log(`Creating ${DB_NAME}`);

	const db = new sqlite3.Database(DB_NAME);

	// Create Table - Members
	db.run(`CREATE TABLE IF NOT EXISTS Members (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(30) NOT NULL,
		email VARCHAR(50) NOT NULL,
		phone VARCHAR(15) NOT NULL,
		address VARCHAR(250) NOT NULL,
		issues VARCHAR(30) NOT NULL)`,

		(err) => {
			if (err) { console.error('Error creating table:', err.message) }
			else { console.log('Members table created.') }
		});

	// Create Table - Books
	db.run(`CREATE TABLE IF NOT EXISTS Books (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title VARCHAR(50) NOT NULL,
		author VARCHAR(30) NOT NULL,
		publisher VARCHAR(30) NOT NULL,
		year VARCHAR(8) NOT NULL)`,
		(err) => {
			if (err) { console.error('Error creating table:', err.message) }
			else { console.log('Books table created.') }
		});

	db.close();
}


// Express Server
const app = express();
app.use(
	cors({
		origin: '*'
	})
)
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

var loggedin = 0;
var orig_uname = 'uc';
var orig_passw = 'uc';

app.post('/api/login', (req, res) => {
	const fetched_uname = req.body.uname;
	const fetched_passw = req.body.psw;

	loggedin = 0;
	if (fetched_uname === orig_uname && fetched_passw === orig_passw) {
		loggedin = 1;
	}
	res.send(loggedin.toString());
});

app.get('/api/logout', (req, res) => {
	loggedin = 0;
	res.send(loggedin.toString());
});

app.get('/api/isLoggedIn', (req, res) => {
	res.send(loggedin.toString());
});

app.get('/api/getuname', (req, res) => {
	if (loggedin) {
		res.send('uc');
	}
	else {
		res.sendStatus(500);
	}
});

// Fetch Tables from DB
app.get('/api/fetch/:table', (req, res) => {
	const table_name = req.params.table.toLowerCase().slice(6, req.params.table.length);
	const db = new sqlite3.Database(DB_NAME);
	const query = "SELECT * FROM " + table_name + " ORDER BY id DESC";

	db.all(query, [], (err, rows) => {
		if (err) {
			console.error('ERROR: fetching data:', err.message);
			res.status(500).json({ error: 'Failed to fetch data from the database.' });
		}
		else {
			console.log(`Fetched ${table_name}`)
			res.status(200).json(rows);
		}
	});

	db.close();
});

// Add member or book to DB
app.post('/api/add/:type', (req, res) => {
	action = req.params.type.toLowerCase();

	const db = new sqlite3.Database(DB_NAME);
	let query = "";
	let p1, p2, p3, p4;

	if (action == "add-book") {
		p1 = req.body.title;
		p2 = req.body.author;
		p3 = req.body.publisher;
		p4 = req.body.year;
		query = `INSERT INTO Books (title, author, publisher, year) VALUES (?, ?, ?, ?)`;
	}

	else if (action == "add-member") {
		p1 = req.body.name;
		p2 = req.body.email;
		p3 = req.body.phone;
		p4 = req.body.address;
		query = `INSERT INTO Members (name, email, phone, address, issues) VALUES (?, ?, ?, ?, 0)`;
	}

	db.run(query, [p1,p2,p3,p4], (err) => {
		if (err) {
			console.error(`Error adding ${action}:`, err.message);
			res.status(500).json({ error: `Failed to add ${book} to the database.`});
		}
		else {
			console.log(`Added ${action}`)
			res.sendStatus(200);
		}
	});

	db.close();
});


app.listen(PORT, () => {
	console.log(`Backend @ LibraryManager: http://localhost:${PORT}`);
});
