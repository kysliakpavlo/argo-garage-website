const Router = require('express-promise-router');
const util = require('util');
const db = require('../../db');
const router = new Router();

router.get('/', async (req, res) => {
  const endpointURL = 'https://4sz7bsq7y7nzg66fxeyvhn5xe40gxyiw.lambda-url.us-east-1.on.aws/image/';
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
    var camera_orientation0 = '';
    var camera_orientation1 = 'rotate90';
    var camera_orientation2 = 'rotate180';
    var camera_orientation3 = 'rotate270';

    switch (camera_orientation) {
      case 'landscapeLeft':
        camera_orientation0 = 'rotate270';
        camera_orientation1 = '';
        camera_orientation2 = 'rotate90';
        camera_orientation3 = 'rotate180';
        break;
      case 'portraitDown':
        camera_orientation0 = 'rotate180';
        camera_orientation1 = 'rotate270';
        camera_orientation2 = '';
        camera_orientation3 = 'rotate90';
        break;
      case 'landscapeRight':
        camera_orientation0 = 'rotate90';
        camera_orientation1 = 'rotate180';
        camera_orientation2 = 'rotate270';
        camera_orientation3 = '';
        break;
    }

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
      renderImageURL: endpointURL+image_id,
      renderOrientation: camera_orientation,
      renderOrientation0: camera_orientation0,
      renderOrientation1: camera_orientation1,
      renderOrientation2: camera_orientation2,
      renderOrientation3: camera_orientation3,
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