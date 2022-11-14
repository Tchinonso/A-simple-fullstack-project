const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbServer = require('./dbserver');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post('/insert', (request, response) => {
	console.log(request.body)
	const { name } = request.body;
	const db = dbServer.getDbServerInstance();

	const result = db.insertNewName(name);

	result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});
//read
app.get('/getAll', (request, response) => {
	const db = dbServer.getDbServerInstance();
	const result = db.getAllData();

	result
		.then(data => response.json({data : data}))
		.catch(err => console.log(err));
	
})
//update
app.patch('/update', (request, response) => {
	const { id, name } = request.body;
	const db = dbServer.getDbServerInstance();

	const result = db.updateNameById(id, name);

  result
    .then(data => response.json({ success: true }))
    .catch(err => console.log(err));
})
//delete
app.delete('/delete:id', (request, response) => {
	const { id } = request.params;
	
	const db = dbServer.getDbServerInstance();

  const result = db.deleteRowById(id);

  result
    .then(data => response.json({ success: true }))
    .catch(err => console.log(err));
})

app.get('/search:name', (request, response) => {
	const { name } = request.params;

	const db = dbServer.getDbServerInstance();
	
	const result = db.searchByName(name);

  result
    .then(data => response.json({ data: data }))
    .catch(err => console.log(err));
})


app.listen(process.env.PORT, () => console.log('app is runningg'));