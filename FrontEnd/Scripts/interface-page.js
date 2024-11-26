var currentFormOpened = null;
var currentSelected = 'member';


// Forms
function formContainerDisplay(which) {
	if (currentFormOpened == which) {
		return;
	}

	document.getElementById('form-container').style.display = 'flex';

	formTitle = document.getElementById('form-title');
	formElement = document.getElementById('form-element');

	ipf0 = document.getElementById('if0');
	ipf1 = document.getElementById('if1');
	ipf2 = document.getElementById('if2');
	ipf3 = document.getElementById('if3');


	if (which == 'add-member') {
		formTitle.innerHTML = 'Add Member';

		ipf0.innerHTML = '<input type="text" class="form-input" id="input-name" name="name" required>';
		ipf0.innerHTML += '<label for="name" class="form-label">Name</label>';

		ipf1.innerHTML = '<input type="email" class="form-input" id="input-email" name="email" required>';
		ipf1.innerHTML += '<label for="email" class="form-label">e-Mail</label>';

		ipf2.innerHTML = '<input type="tel" class="form-input" id="input-phone" name="phone" required>';
		ipf2.innerHTML += '<label for="phone" class="form-label">Phone</label>';

		ipf3.innerHTML = '<input type="text" class="form-input" id="input-address" name="address" required>';
		ipf3.innerHTML += '<label for="address" class="form-label">Address</label>';
	}

	else if (which == 'add-book') {
		formTitle.innerHTML = 'Add Book';
		ipf0.innerHTML = '<input type="text" class="form-input" id="input-title" name="title" required>';
		ipf0.innerHTML += '<label for="title" class="form-label">Title</label>';

		ipf1.innerHTML = '<input type="text" class="form-input" id="input-author" name="author" required>';
		ipf1.innerHTML += '<label for="author" class="form-label">Author</label>';

		ipf2.innerHTML = '<input type="text" class="form-input" id="input-publisher" name="publisher" required>';
		ipf2.innerHTML += '<label for="publisher" class="form-label">Publisher</label>';

		ipf3.innerHTML = '<input type="text" class="form-input" id="input-year" name="year" required>';
		ipf3.innerHTML += '<label for="year" class="form-label">Year</label>';

	}

	formElement.appendChild(document.getElementById('form-btn-container'));
	formElement.appendChild(document.getElementById('form-footer'));

	currentFormOpened = which;
	console.log('display: ' + currentFormOpened);
}

function formContainerHide() {
	document.getElementById('form-container').style.display = 'none';
	console.log('hide: ' + currentFormOpened);
	currentFormOpened = null;
}

function formClear() {
	document.getElementById('form-element').reset();
	console.log('clear: ' + currentFormOpened);
}

function submitForm() {
	let formData = new FormData(document.getElementById('form-element'));
	let formDataJSON = Object.fromEntries(formData.entries());

	let url = 'http://localhost:5000/api/add/' + currentFormOpened;

	fetch(url,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formDataJSON),
		})
		.then(response => {
			if (response.ok) {
				// update rendered table
				let table_id = (currentFormOpened == 'add-member') ? "table-members" : "table-books";
				let val = Object.values(formDataJSON);
				updateTable(table_id, ...val);
				console.log('Form submitted successfully');
			}
			else {
				console.log('Form submission failed');
			}
		});


	formClear();
	formContainerHide();
}


// Tables
function hydrateTable(which, data) {
	console.log('hydrating: ' + which);

	numRows = Object.keys(data).length;
	let table = document.createElement('table');

	table.id = which;
	table.classList.add('data-table');

	// Create Headers for Table

	let header = table.createTHead();
	let headerRow = header.insertRow(0);

	let headerCell0 = headerRow.insertCell(0);
	let headerCell1 = headerRow.insertCell(1);
	let headerCell2 = headerRow.insertCell(2);
	let headerCell3 = headerRow.insertCell(3);
	let headerCell4 = headerRow.insertCell(4);

	if (which == 'table-members') {
		let headerCell5 = headerRow.insertCell(5);

		headerCell0.outerHTML = '<th>ID</th>';
		headerCell1.outerHTML = '<th>Name</th>';
		headerCell2.outerHTML = '<th>Email</th>';
		headerCell3.outerHTML = '<th>Phone</th>';
		headerCell4.outerHTML = '<th>Address</th>';
		headerCell5.outerHTML = '<th>Issues</th>';
	}

	else if (which == 'table-books') {
		headerCell0.outerHTML = '<th>ID</th>';
		headerCell1.outerHTML = '<th>Title</th>';
		headerCell2.outerHTML = '<th>Author</th>';
		headerCell3.outerHTML = '<th>Publisher</th>';
		headerCell4.outerHTML = '<th>Year</th>';
	}


	// Filling the body
	let body = table.createTBody();

	if (numRows) {
		for (let i = 0; i < numRows; i++) {
			let row = body.insertRow(i);
			let cell0 = row.insertCell(0);
			let cell1 = row.insertCell(1);
			let cell2 = row.insertCell(2);
			let cell3 = row.insertCell(3);
			let cell4 = row.insertCell(4);

			if (which == 'table-members') {
				let cell5 = row.insertCell(5);
				cell5.innerHTML = 0;

				cell0.innerHTML = data[i].id;
				cell1.innerHTML = data[i].name;
				cell2.innerHTML = data[i].email;
				cell3.innerHTML = data[i].phone;
				cell4.innerHTML = data[i].address;
			}

			else if (which == 'table-books') {
				cell0.innerHTML = data[i].id;
				cell1.innerHTML = data[i].title;
				cell2.innerHTML = data[i].author;
				cell3.innerHTML = data[i].publisher;
				cell4.innerHTML = data[i].year;
			}
		}
	}

	document.getElementById('main-render-area').appendChild(table);

	if (which == "table-books") {
		table.style.display = "none";
	}
}

function fetchTable(which) {
	let url = 'http://localhost:5000/api/fetch/' + which;
	fetch(url)
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error("Can't fetch table: " + which);
		})
		.then(data => {
			hydrateTable(which, data);
		})
		.catch(error => {
			console.log(error);
		});
}

function updateTable(which, c1, c2, c3, c4) {
	let table = document.getElementById(which);

	// Get current ID from table
	let currentID = table.rows.length - 1;


	// Insert new row
	let row = table.insertRow(1);

	let cell0 = row.insertCell(0);
	let cell1 = row.insertCell(1);
	let cell2 = row.insertCell(2);
	let cell3 = row.insertCell(3);
	let cell4 = row.insertCell(4);

	cell0.innerHTML = currentID + 1;
	cell1.innerHTML = c1;
	cell2.innerHTML = c2;
	cell3.innerHTML = c3;
	cell4.innerHTML = c4;


	if (which == 'table-members') {
		let cell5 = row.insertCell(5);
		cell5.innerHTML = 0;
	}

	console.log('table updated: ' + which);
}

// Side Bar
function setUname() {
	let uNameLabel = document.getElementById('uname-label');

	fetch("http://localhost:5000/api/getuname").
		then(resp => {
			if (resp.ok) {
				return resp.text();
			}
			throw new Error("Not Logged in!");
		}).
		then(data => {
			uNameLabel.innerHTML = data;
		}).
		catch(error => {
			console.log(error + "\nCan't fetch uName\nSetting to 'Anonymous'");
			uNameLabel.innerHTML = "Anonymous";
		})
}

// Other UI
function refreshSelector() {
	throw new Error("Refreshing current table not implemented yet\n");
}

function swapSelector() {
	let activeElement = document.getElementById('selector-1');
	let unactiveElement = document.getElementById('selector-2');

	let t1 = document.getElementById('table-members');
	let t2 = document.getElementById('table-books');

	if (currentSelected == 'member') {
		activeElement.innerHTML = "Books";
		unactiveElement.innerHTML = "Members";
		currentSelected = 'book';

		t1.style.display = "none";
		t2.style.display = "table";
	}

	else if (currentSelected == 'book') {
		activeElement.innerHTML = "Members";
		unactiveElement.innerHTML = "Books";
		currentSelected = 'member';

		t1.style.display = "table";
		t2.style.display = "none";
	}

}


function logout() {
	fetch("http://localhost:5000/api/logout").
		then(resp => resp.text()).
		then(data => {

			if (data) {
				window.location.href = "./index.html";
				return;
			}
			console.log("CANT LogOut!!!!!")
		})
}



// ----- MAIN ------

/*
	Check if logged in
	fetch all tables
*/

fetch('http://localhost:5000/api/isLoggedIn')
	.then(response => {
		if (response.ok) {
			return response.text();
		}

		throw new Error("Can't Fetch authentication status");
	})
	.then(loggedIn => {
		loggedIn = parseInt(loggedIn);

		if (!loggedIn) {
			throw new Error("Not Logged in!!");
		}

		setUname();
		fetchTable('table-members');
		fetchTable('table-books');

	})
	.catch((error) => {
		console.log(error + "\nReverting to 'index.html'");
		window.location.href = './index.html';
	});
