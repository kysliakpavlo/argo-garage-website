const queryTxt = [`
  SELECT
    image_id,
    camera_orientation,
    device_type,
    blocked,
    hidden,
    filtered
  FROM media
  WHERE
    processed_amazon=TRUE AND
    processed_manually=FALSE AND
    content_type='image' AND    
    (
      blocked=TRUE OR
      filtered=TRUE
    )
  ORDER BY upload_time DESC
  LIMIT 1
  `,`
  SELECT
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
  ORDER BY upload_time DESC
  LIMIT 1
  `];

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

var toRenderRoute = 'dashboard/done';
var toRenderParams = {
  title: 'Argonovo'
};

client.connect();

const endpointURL = 'https://6fup2zzx27dmctf34en2bnn4om0vrrqa.lambda-url.us-east-1.on.aws/image/';

router.get('/', function(req, res, next) {
  const baseURL = req.baseUrl;
  var reviewType = baseURL.match(/(?<=\/review\/)[01]/g);

  if (reviewType == null) {
    reviewType = 0;
  } else {
    reviewType = reviewType[0];
  }



  client.query(queryTxt[reviewType],(err,res)=>{
    if(!err && res.rowCount==1) {    
      var image_id = res.rows[0]['image_id'];
      var camera_orientation = res.rows[0]['camera_orientation'];    
      var device_type = JSON.parse(res.rows[0]['device_type']);
      var blocked = res.rows[0]['blocked'];
      var filtered = res.rows[0]['filtered'];
      var hidden = res.rows[0]['hidden'];

      toRenderRoute = 'dashboard/review';
      toRenderParams = {
        title: 'Argonovo | Review',
        renderURL: endpointURL+image_id,
        renderOrientation: camera_orientation,
        renderJSONdata: JSON.stringify(device_type,null,2),
        renderBlocked: blocked,
        renderFiltered: filtered,
        renderHidden: hidden
      };      
    }

    client.end();
  });

  res.render(toRenderRoute, toRenderParams); 
});

module.exports = router;