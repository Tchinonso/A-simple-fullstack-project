const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
let instance = null

const connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	port: process.env.DB_PORT
});

connection.connect((err) => {
	if (err) {
		console.log(err.message)
	}

	console.log('db ' + connection.state)

});

class DbServer {
	static getDbServerInstance() {
		return instance ? instance : new DbServer();
	}

	async getAllData() {
		try {
			const response = await new Promise((resolve, reject) => {
				const query = "SELECT * FROM names;";

				connection.query(query, (err, results) => {
				if (err) reject(new Error(err.message));
				resolve(results);
				})
		});

			console.log(response);
			return response;
			
	} catch(error) {
			console.log(error);
		}
	}

	async insertNewName(name) {
		try {
			const dateAdded = new Date();
			const insertId = await new Promise((resolve, reject) => {
        	const query = "INSERT INTO names (name , date_added) VALUES (?,?) ;";

        	connection.query(query, [name, dateAdded] , (err, result) => {
          	if (err) reject(new Error(err.message));
          	resolve(result.insertId);
        });
      });

      console.log(insertId);
			return {
				id : insertId,
				name : name,
				dateAdded : dateAdded
	  };
		} catch (error) {
			console.log(error)
		}
	}

	async deleteRowById(id) {
		try {
			id = parseInt(id);

      		const dateAdded = new Date();
      		const response = await new Promise((resolve, reject) => {
        	const query = "DELETE FROM names WHERE id =  ?";

        	connection.query(query, [id], (err, result) => {
          	if (err) reject(new Error(err.message));
          	resolve(result.affectedRows);
			});
					
				});
			return response === 1 ? true : false;
      console.log(response);
		} catch (error) {
			console.log(error);
			return false;
		}
		
	}

	async updateNameById(id, name) {
		try {
      id = parseInt(id);

      const dateAdded = new Date();
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE names SET name = ? WHERE id = ?";

        connection.query(query, [name,id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      return response === 1 ? true : false;
      console.log(response);
    } catch (error) {
      console.log(error);
      return false;
    }
	}

	async searchByName(name) {
		try {
      id = parseInt(id);

      const dateAdded = new Date();
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM names WHERE names = ? ;";

        connection.query(query, [name], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
      console.log(response);
    } catch (error) {
      console.log(error);
      return false;
    }
	}
}

module.exports = DbServer;