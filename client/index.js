document.addEventListener('DOMContentLoaded', function () {
	fetch('http://localhost:5000/getAll')
		.then(response => response.json())
		.then(data => loadHTMLTable(data['data']));
})

document.querySelector('table tbody').addEventListener('click', function (event) {
	if (event.target.className === "delete-row-btn") {
		deleteRowById(event.target.dataset.id);
	}
	if (event.target.className === "edit-row-btn") {
    	editRowById(event.target.dataset.id);
    }
});

const updateBtn = document.getElementById("update-row-btn");
const searchBtn = document.getElementById('search-btn');

searchBtn.onclick = function () {
	const searchValue = document.getElementById('search-input').value;

	fetch("http://localhost:5000/search/" + searchValue)
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data['data']));
}

function deleteRowById(id) {
	fetch('http://localhost:5000/delete/' + id, {
		method: "DELETE"
	})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				location.reload();
			}
		});
}

function editRowById(id) {
	const updateSection = document.getElementById('update-row');
	updateSection.hidden = false;
	document.getElementById('update-row-btn').dataset.id = id;
}

updateBtn.onclick = function () {
	const updateNameInput = document.getElementById('update-name-input');

	fetch("http://localhost:5000/update", {
		headers: {
			'Content-type':'application/json'
		},
   		 method: "PATCH",
    	 body: JSON.stringify({
      		id: updateNameInput.dataset.id,
      		name: updateNameInput.value,
   		 }),
  	})
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });

}

const btnAdd = document.getElementById("add-btn-name");

btnAdd.onclick = function () {
	const nameInput = document.getElementById("input-name");
	const name = nameInput.value;
	nameInput.value = "";
	
	 fetch('http://localhost:5000/insert', {
	 	headers: {
	 		'Content-type':'application/json'
	 	},
	 	method: 'POST',
	 	body: JSON.stringify({name: name})
	 })
	 	.then(response => response.json())
	 	.then(data => insertRowIntoTable(data['data']));
}


function insertRowIntoTable(data) {
	const table = document.querySelector('table tbody');
	const isTableData = document.querySelector('.no-data');

	let TableHtml = "<tr>";

	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			if (key === 'dateAdded') {
				data[key] = new Date(data[key]).toLocaleString();
			}
			TableHtml += `<td>${data[key]}</td>`;
		}
	}


		TableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
		TableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;

	TableHtml += "</tr>"

	if (isTableData) {
		table.innerHTML = TableHtml;
	} else {
		const newRow = table.insertRow();
		newRow.innerHTML = TableHtml;
	}
}


function loadHTMLTable(data) {
	const table = document.querySelector('table tbody');


	if (data.length === 0) {
		table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
		return;
	}
	let TableHtml = "";

	data.forEach(function ({ id, name, date_added }) {
		TableHtml += "<tr>";
		TableHtml += `<td>${id}</td>`;
		TableHtml += `<td>${name}</td>`;
		TableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
		TableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
		TableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
		TableHtml += "</tr>";
	});
	table.innerHTML = TableHtml;
}
