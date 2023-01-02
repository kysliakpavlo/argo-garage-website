const Router = require('express-promise-router');
const util = require('util');
const db = require('../../db');
const router = new Router();

function updateOrientation(currentOrientation,indexShift) {
    const orientations = ['portraitUp','landscapeRight','landscapeLeft','portraitDown'];
    var currentOrientationIndex = 0

    switch(currentOrientation) {
        case 'landscapeRight':
            currentOrientationIndex = 1;
            break;
        case 'landscapeLeft':
            currentOrientationIndex = 2;
            break;
        case 'portraitDown':
            currentOrientationIndex = 3;
            break;            
    }

    var updatedOrientationIndex = (currentOrientationIndex + indexShift) % 4;
    var updatedOrientation = orientations[updatedOrientationIndex];
    
    return updatedOrientation;
}

router.get('/', async (req, res) => {
    var baseURL = req.baseUrl;
    var row_id = baseURL.match(/(?<=\/process\/id\/)[0-9]+(?=\/mod\/[bcf123j])/g)[0];
    var mod = baseURL.match(/(?<=\/process\/id\/[0-9]+\/mod\/)[bcf123j]/g)[0];
    
    queryTxt = `
        SELECT camera_orientation
        FROM media
        WHERE id=`+row_id;
    const { rows } = await db.query(queryTxt);
    var camera_orientation = rows[0]['camera_orientation'];
    var newOrientation = camera_orientation;

    switch(mod) {
        case 'b':
            queryTxt = `
                UPDATE media
                SET
                    blocked=TRUE
                WHERE id=`+row_id;
            break;
        case 'c':
            queryTxt = `
                UPDATE media
                SET
                    blocked=FALSE,
                    filtered=FALSE
                WHERE id=`+row_id;
            break;
        case 'f':
            queryTxt = `
                UPDATE media
                SET
                    filtered=TRUE
                WHERE id=`+row_id;
            break;
        case '1':
            newOrientation = updateOrientation(camera_orientation,1);
            queryTxt = `
                UPDATE media
                SET
                    processed_manually=false,
                    processed_amazon=false,
                    camera_orientation=`+newOrientation+`
                WHERE id=`+row_id;
            break;
        case '2':
            newOrientatoin = updateOrientation(camera_orientation,2);
            queryTxt = `
                UPDATE media
                SET
                    processed_manually=false,
                    processed_amazon=false,
                    camera_orientation=`+newOrientation+`
                WHERE id=`+row_id;
            break;        
        case '3':
            newOrientatoin = updateOrientation(camera_orientation,3);
            queryTxt = `
                UPDATE media
                SET
                    processed_manually=false,
                    processed_amazon=false,
                    camera_orientation=`+newOrientation+`
                WHERE id=`+row_id;
            break;
        case 'j':
            queryTxt = `
                UPDATE media
                SET
                    processed_manually=TRUE
                WHERE id=`+row_id;
            break;
        default:
            queryTxt = `SELECT NOW()`;
    }

    await db.query(queryTxt);
  
    res.redirect(req.get('Referrer'));
});

module.exports = router;