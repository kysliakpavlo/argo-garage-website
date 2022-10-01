var express = require('express');
var router = express.Router();

var nextImage = 'https://6fup2zzx27dmctf34en2bnn4om0vrrqa.lambda-url.us-east-1.on.aws/image/04CD8859-095C-449C-BB17-EBA6067258FD_1660426291_CAP_A2FC568E-09D2-4F79-9094-B0BFF45AE8BE.jpg';
var nextContent = JSON.stringify({"ModerationLabels":[{"Confidence": 56.03160095214844, "Name": "Suggestive", "ParentName": ""}, {"Confidence": 56.03160095214844, "Name": "Revealing Clothes", "ParentName": "Suggestive"}],"Errors":[]},null,2);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('moderate', {
    title: 'Argonovo | Dashboard',
    imageURL: nextImage,
    imageContent: nextContent
  });
});

module.exports = router;
