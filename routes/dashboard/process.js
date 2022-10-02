queryTxt = `
    select now()
`;

require('dotenv').config();
const express = require('express');
const app = express();
const { Client } = require('pg');

const client = new Client({
	host	: process.env.RDS_HOSTNAME,
	user	: process.env.RDS_USERNAME,
	port	: process.env.RDS_PORT,
	password: process.env.RDS_PASSWORD,
	database: process.env.RDS_DB_NAME
});

client.connect();

client.query(queryTxt,(err,res)=>{
	if(!err) {   
        app.get('/', function(req, res, next) {
            var baseURL = req.baseUrl;
            var image_id = baseURL.match(/(?<=\/process\/id\/)[0-9]+(?=\/mod\/[a-z0-9])/g)[0];
            var mod = baseURL.match(/(?<=\/process\/id\/[0-9]+\/mod\/)[a-z0-9]/g)[0];
            console.log(baseURL);
            console.log(image_id);
            console.log(mod);

            var response = 'Done';

            switch(mod) {
                case '1':
                    response = '1';
                    break;
                case '2':
                    response = '2';
                    break;
                case '3':
                    response = '3';
                    break;
                case 'b':
                    response = 'b';
                    break;
                case 'f':
                    response = 'f';
                    break;
                case 'j':
                    response = 'j';
                    break;
                default:
                    response = 'Unknown mod';
            }
            res.send(response);
        });
    } else {
		console.log(err.message);
    }
	client.end();
})

module.exports = app;