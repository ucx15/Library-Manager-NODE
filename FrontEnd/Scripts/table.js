class tableImproved {
	constructor() {
		this.nRows = 0;
		this.nCols = 0;

		this.title = "";

		this.tHead = [];
		this.tBody = [];
	}

	setTitle(title) {
		this.title = title;
	}

	addHeaders(headers) {
		this.tHead.push(headers);
		this.nCols = headers.length;
	}

	addRow(row) {
		if (row.length != this.nCols) {
			console.log("Error: Row length does not match the number of columns");
			return;
		}

		this.nRows++;
		this.table.push(row);
	}

	deleteRow(index) {
		this.nRows--;
		this.table.splice(index, 1);
	}

	show() {
		console.log("Title: " + this.title);
		console.log("Headers: " + this.tHead);
		console.log("Table: ");
		console.table(this.tBody);
	}
}

let t1 = new tableImproved();
t1.show();