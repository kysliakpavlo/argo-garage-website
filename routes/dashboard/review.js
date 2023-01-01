const Router = require('express-promise-router');
const util = require('util');
const db = require('../../db');
const router = new Router();


router.get('/', async (req, res) => {
  const endpointURL = 'https://rvfewintfuw3vsvscx4wtyupai0eyerk.lambda-url.us-east-1.on.aws/';
  const queryTxtA = `SELECT id,image_id,camera_orientation,device_type,blocked,hidden,filtered FROM media `;
  const queryTxtB = [
    `WHERE processed_manually=FALSE AND content_type='image' AND (blocked=TRUE OR filtered=TRUE) `,
    `WHERE processed_manually=FALSE AND content_type='image' AND (blocked=TRUE OR filtered=TRUE) `,
    `WHERE processed_manually=FALSE AND content_type='image' `
  ];
  const queryTxtC = [
    `ORDER BY blocked DESC,filtered DESC,upload_time DESC LIMIT 1`,
    `ORDER BY upload_time ASC LIMIT 1`,
    `ORDER BY upload_time ASC LIMIT 1`
  ];

  var renderRoute = 'dashboard/done';
  var renderParams = {
    title: 'Argonovo'
  };
      
  var baseURL = req.baseUrl;
  var process_id = baseURL.match(/(?<=\/review\/)[012]/g);  
  if ( (process_id != null) && Array.isArray(process_id) && !Number.isNaN(process_id[0])) {
    process_id = process_id[0];
  } else {
    process_id = '0';
  }

  const { rows } = await db.query(queryTxtA+queryTxtB[process_id]+queryTxtC[process_id]);
  if (rows.length == 1) {  

    var row_id = rows[0]['id'];
    var image_id = rows[0]['image_id'];
    var device_type = JSON.parse(rows[0]['device_type']);
    var blocked = rows[0]['blocked'];
    var filtered = rows[0]['filtered'];
    var hidden = rows[0]['hidden'];
    var camera_orientation = rows[0]['camera_orientation'];

    var visualflag = '';
    
    if (blocked == true) {
      visualflag = 'visualflagred';      
    } else if (filtered == true) {
      visualflag = 'visualflagyellow';      
    } else if (hidden == true) {
      visualflag = 'visualflagblue';      
    }

    renderRoute = 'dashboard/review';
    renderParams = {
      title: 'Argonovo | Review',
      renderRowID: row_id,
      renderImageID: image_id,
      renderImageURL: endpointURL,
      renderOrientation: camera_orientation,
      renderJSONdata: JSON.stringify(device_type,null,2),
      renderBlocked: blocked,
      renderFiltered: filtered,
      renderHidden: hidden,
      renderVisual: visualflag
    };
  }
  
  res.render(renderRoute, renderParams);
});

module.exports = router;