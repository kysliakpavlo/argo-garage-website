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

var queryTxt = 'SELECT NOW()';

client.connect();

app.get('/', function(req, res, next) {
    var baseURL = req.baseUrl;
    var image_id = baseURL.match(/(?<=\/process\/id\/)[0-9]+(?=\/mod\/[a-z0-9])/g)[0];
    var mod = baseURL.match(/(?<=\/process\/id\/[0-9]+\/mod\/)[a-z0-9]/g)[0];
    
    switch(mod) {
        case 'b':
            queryTxt = `
                UPDATE media
                SET
                    blocked=TRUE
                WHERE id=`+image_id;
            break;
        case 'c':
            queryTxt = `
                UPDATE media
                SET
                    blocked=FALSE,
                    filtered=FALSE
                WHERE id=`+image_id;
            break;
        case 'f':
            queryTxt = `
                UPDATE media
                SET
                    filtered=TRUE
                WHERE id=`+image_id;
            break;
        case 'j':
            queryTxt = `
                UPDATE media
                SET
                    processed_manually=TRUE
                WHERE id=`+image_id;
            break;
    }

    client.query(queryTxt,(err,res)=>{
        if(!err) {
            console.log('successful query');
            console.log(queryTxt);
        } else {
            console.log(err.message);
        }
        client.end();
    });

    res.send(queryTxt); 
    //res.redirect('/dashboard/review');
});

module.exports = app;