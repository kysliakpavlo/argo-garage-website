const endpointURL = 'https://6fup2zzx27dmctf34en2bnn4om0vrrqa.lambda-url.us-east-1.on.aws/image/';
const queryTxt = `
  SELECT
    id,
    image_id,
    camera_orientation,
    device_type,
    blocked,
    hidden,
    filtered
  FROM media
  WHERE
    processed_manually=FALSE AND
    content_type='image'
  ORDER BY
    blocked DESC,
    filtered DESC,
    upload_time DESC
  LIMIT 1
  `;

require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Client } = require('pg');

const client = new Client({
  host  : process.env.RDS_HOSTNAME,
  user  : process.env.RDS_USERNAME,
  port  : process.env.RDS_PORT,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME
});

client.connect();

client.query(queryTxt,(err,res)=>{
  if(!err && res.rowCount==1) {    
    var row_id = res.rows[0]['id'];
    var image_id = res.rows[0]['image_id'];
    var camera_orientation = res.rows[0]['camera_orientation'];    
    var device_type = JSON.parse(res.rows[0]['device_type']);
    var blocked = res.rows[0]['blocked'];
    var filtered = res.rows[0]['filtered'];
    var hidden = res.rows[0]['hidden'];

    router.get('/', function(req, res, next) {
      res.render('dashboard/review', {
        title: 'Argonovo | Review',
        renderRowID: row_id,
        renderImageID: image_id,
        renderImageURL: endpointURL+image_id,
        renderOrientation: camera_orientation,
        renderJSONdata: JSON.stringify(device_type,null,2),
        renderBlocked: blocked,
        renderFiltered: filtered,
        renderHidden: hidden
      }); 
    });      
  } else {
    router.get('/', function(req, res, next) {
      res.render('dashboard/done', {
        title: 'Argonovo'
      }); 
    });
  }

  client.end();
});

module.exports = router;