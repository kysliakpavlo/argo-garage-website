const Router = require('express-promise-router');
const util = require('util');
const db = require('../../db');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

router.get('/', async (req, res) => {
  const endpointURL = 'https://6fup2zzx27dmctf34en2bnn4om0vrrqa.lambda-url.us-east-1.on.aws/image/';
  const queryTxtA = `SELECT id,image_id,camera_orientation,device_type,blocked,hidden,filtered FROM media `;
  const queryTxtB = [
    `WHERE processed_manually=FALSE AND content_type='image'`,
    `WHERE processed_manually=FALSE AND content_type='image'`,
    `WHERE processed_manually=FALSE AND content_type='image'`
  ];
  const queryTxtC = `ORDER BY blocked DESC,filtered DESC,upload_time DESC LIMIT 1`;
      
  var baseURL = req.baseUrl;
  var process_id = baseURL.match(/(?<=\/review\/)[012]/g);  
  if ( (process_id != null) && Array.isArray(process_id) && !Number.isNaN(process_id[0])) {
    process_id = process_id[0];
  } else {
    process_id = '0';
  }

  const { rows } = await db.query(queryTxtA+queryTxtB[process_id]+queryTxtC)
  res.send(rows[0])
});

// export our router to be mounted by the parent application
module.exports = router;