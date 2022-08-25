require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
	host	: process.env.RDS_HOSTNAME,
	user	: process.env.RDS_USERNAME,
	port	: process.env.RDS_PORT,
	password: process.env.RDS_PASSWORD,
	database: process.env.RDS_DB_NAME
});

client.connect();

client.query('SELECT * FROM MEDIA',(err,res)=>{
	if(!err) {
		console.log(res.rows);
	} else {
		console.log(err.message);
	}
	client.end();
})
