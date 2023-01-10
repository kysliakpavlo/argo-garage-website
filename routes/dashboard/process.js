const Router = require('express-promise-router');
const util = require('util');
const db = require('../../db');
const router = new Router();
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({region: 'us-east-1'});

router.get('/', async (req, res) => {
    var baseURL = req.baseUrl;
    var row_id = baseURL.match(/(?<=\/process\/id\/)[0-9]+(?=\/mod\/[bcf123j])/g)[0];
    var mod = baseURL.match(/(?<=\/process\/id\/[0-9]+\/mod\/)[bcf123j]/g)[0];
    const s3_bucket = process.env.IMAGES_BUCKET;
    const lambda_orient = process.env.LAMBDA_ORIENT;
    
    queryTxt = `
        SELECT image_id
        FROM media
        WHERE id=`+row_id+` LIMIT 1`;
    const { rows } = await db.query(queryTxt);
    image_id = rows[0]['image_id'];

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
            var params = {
                FunctionName: lambda_orient,
                Payload: '{"bucket":"'+s3_bucket+'","img_src":"images/'+image_id+'","rotation": "1"}'
            };
            orient_response = await lambda.invoke(params).promise();
            response = JSON.parse(orient_response.Payload);
            strip_folder = response.body.Key.replace(/^images\//g,'');
            image_id_new =  strip_folder.match(/[a-zA-Z0-9-_.]+.jpg$/g)[0];
            queryTxt = `
                UPDATE media
                SET
                    image_id='`+image_id_new+`',
                    processed_manually=false,
                    processed_amazon=false
                WHERE id=`+row_id;
            break;
        case '2':
            var params = {
                FunctionName: lambda_orient,
                Payload: '{"bucket":"'+s3_bucket+'","img_src":"images/'+image_id+'","rotation": "2"}'
            };
            orient_response = await lambda.invoke(params).promise();
            response = JSON.parse(orient_response.Payload);
            strip_folder = response.body.Key.replace(/^images\//g,'');
            image_id_new =  strip_folder.match(/[a-zA-Z0-9-_.]+.jpg$/g)[0];
            queryTxt = `
                UPDATE media
                SET
                    image_id='`+image_id_new+`',
                    processed_manually=false,
                    processed_amazon=false
                WHERE id=`+row_id;
            break;        
        case '3':
            var params = {
                FunctionName: lambda_orient,
                Payload: '{"bucket":"'+s3_bucket+'","img_src":"images/'+image_id+'","rotation": "3"}'
            };
            orient_response = await lambda.invoke(params).promise();
            response = JSON.parse(orient_response.Payload);
            strip_folder = response.body.Key.replace(/^images\//g,'');
            image_id_new =  strip_folder.match(/[a-zA-Z0-9-_.]+.jpg$/g)[0];
            queryTxt = `
                UPDATE media
                SET
                    image_id='`+image_id_new+`',
                    processed_manually=false,
                    processed_amazon=false
                WHERE id=`+row_id;
            break;
        case 'j':
            queryTxt = `
                UPDATE media
                SET
                    processed_manually=TRUE,
                    camera_orientation='portraitUp'
                WHERE id=`+row_id;
            break;
        default:
            queryTxt = `SELECT NOW()`;
    }

    await db.query(queryTxt);
  
    res.redirect(req.get('Referrer'));
});

module.exports = router;