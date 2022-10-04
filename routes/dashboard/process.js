const Router = require('express-promise-router');
const util = require('util');
const db = require('../../db');
const router = new Router();

router.get('/', async (req, res) => {
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
        default:
            queryTxt = `SELECT NOW()`;
    }

    const { rows } = await db.query(queryTxt);
  
    res.redirect(req.get('Referrer'));
});

module.exports = router;