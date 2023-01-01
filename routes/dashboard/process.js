const Router = require('express-promise-router');
const util = require('util');
const db = require('../../db');
const router = new Router();
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({region: 'us-east-1'});

router.get('/', async (req, res) => {
    var baseURL = req.baseUrl;
    var row_id = baseURL.match(/(?<=\/process\/id\/)[0-9]+(?=\/mod\/[bcf123uj])/g)[0];
    var mod = baseURL.match(/(?<=\/process\/id\/[0-9]+\/mod\/)[bcf123uj]/g)[0];
    
    queryTxt = `
        SELECT image_id
        FROM media
        WHERE id=`+row_id;
    const { rows } = await db.query(queryTxt);
    var image_id = rows[0]['image_id'];

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
            queryTxt = `
                UPDATE media
                SET
                    processed_manually=false,
                    processed_amazon=false,
                    camera_orientation='portraitUp'
                WHERE id=`+row_id;
            var params = {
                FunctionName: "argo-garage-orient-dev",
                Payload: '{"bucket":"s3argoprod","img_src":"images/'+image_id+'","img_dst":"images/'+image_id+'","rotation": "90"}'
            };
            await lambda.invoke(params).promise();
            break;
        case '2':            
            queryTxt = `
                UPDATE media
                SET
                    processed_manually=false,
                    processed_amazon=false,
                    camera_orientation='portraitUp'
                WHERE id=`+row_id;
            var params = {
                FunctionName: "argo-garage-orient-dev",
                Payload: '{"bucket":"s3argoprod","img_src":"images/'+image_id+'","img_dst":"images/'+image_id+'","rotation": "180"}'
            };
            await lambda.invoke(params).promise();
            break;        
        case '3':           
            queryTxt = `
                UPDATE media
                SET
                    processed_manually=false,
                    processed_amazon=false,
                    camera_orientation='portraitUp'
                WHERE id=`+row_id;
            var params = {
                FunctionName: "argo-garage-orient-dev",
                Payload: '{"bucket":"s3argoprod","img_src":"images/'+image_id+'","img_dst":"images/'+image_id+'","rotation": "270"}'
            };
            await lambda.invoke(params).promise();
            break;
        case 'u':
            queryTxt = `
                UPDATE media
                SET
                    camera_orientation='portraitUp'
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