const Router = require('express-promise-router');
const util = require('util');
const db = require('../../db');
const router = new Router();
require('dotenv').config();

router.get('/', async (req, res) => {
  const endpointURL = process.env.IMAGES_ENDPOINT;
  const queryTxt = `
    SELECT
      id,
      image_id,
      camera_orientation,
      device_type,
      blocked,
      hidden,
      filtered,
      location_latr,
      location_lonr
    FROM media
    WHERE
      processed_manually=FALSE AND
      processed_amazon=TRUE AND
      content_type='image'
    ORDER BY
      blocked DESC,
      filtered DESC,
      upload_time ASC
    LIMIT 1
  `;
  
  var renderRoute = 'dashboard/done';
  var renderParams = {
    title: 'Argonovo'
  };
      
  const { rows } = await db.query(queryTxt);
  if (rows.length == 1) {  

    var row_id = rows[0]['id'];
    var image_id = rows[0]['image_id'];
    var device_type = JSON.parse(rows[0]['device_type']);
    var blocked = rows[0]['blocked'];
    var filtered = rows[0]['filtered'];
    var hidden = rows[0]['hidden'];
    var camera_orientation = rows[0]['camera_orientation'];
    var lat = rows[0]['location_latr']*14.323944;  //  90 deg/(2*pi)
    var lon = rows[0]['location_lonr']*28.647889;  // 180 deg/(2*pi)

    console.log(lat);
    console.log(lon);

    var camera_orientation0 = '';
    var camera_orientation1 = 'rotate90';
    var camera_orientation2 = 'rotate180';
    var camera_orientation3 = 'rotate270';

    switch (camera_orientation) {
      case 'landscapeLeft':
        camera_orientation0 = 'rotate270';
        camera_orientation1 = '';
        camera_orientation2 = 'rotate   90';
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
      renderImageURL: endpointURL,
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