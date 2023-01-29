const Router = require('express-promise-router');
const util = require('util');
const db = require('../../db');
const map = require('../../map');
const router = new Router();

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
    var lat = rows[0]['location_latr']*57.295779;  // 360 deg/(2*pi)
    var lon = rows[0]['location_lonr']*57.295779;  // 360 deg/(2*pi)

    var camera_orientation0 = '';

    switch (camera_orientation) {
      case 'landscapeLeft':
        camera_orientation0 = 'rotate270';
        break;
      case 'portraitDown':
        camera_orientation0 = 'rotate180';
        break;
      case 'landscapeRight':
        camera_orientation0 = 'rotate90';
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

    var unsignedMapURL = '/maps/api/staticmap?'
      +'maptype=terrain&zoom=3&size=100x100&'
      +'markers='+lat+','+lon
      +'&key=AIzaSyAUPGOWC4uw2isF9SaMK_lMARCGK2QLn30';
    var signedMapURL = map.sign(unsignedMapURL, process.env.GMAP_SECRET);

    renderRoute = 'dashboard/review';
    renderParams = {
      title: 'Argonovo | Review',
      renderRowID: row_id,
      renderImageID: image_id,
      renderImageURL: endpointURL,
      renderOrientation: camera_orientation,
      renderOrientation0: camera_orientation0,
      renderJSONdata: JSON.stringify(device_type,null,2),
      renderBlocked: blocked,
      renderFiltered: filtered,
      renderHidden: hidden,
      renderVisual: visualflag,
      renderMap: signedMapURL
    };
  }
  
  res.render(renderRoute, renderParams);
});

module.exports = router;