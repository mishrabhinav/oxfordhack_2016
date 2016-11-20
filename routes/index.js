var express = require('express');
var request = require('request');
var router = express.Router();
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});

var sqs = new AWS.SQS({region:'eu-west-1'}); 

var jobId = 0;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ejs' });
});

router.post('/', function(req, res, next) {

  var messageAttributes = {};

  console.log(req.body);
  for(var i = 0; i < 10; i++) {
    messageAttributes[req.body[i].id] = {
      DataType: "String",
      StringValue: req.body[i].src
    }
  };

  var msg = { payload: jobId++ };
  
  var sqsParams = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: process.env.QueueUrl,
    MessageAttributes: messageAttributes
  };

  sqs.sendMessage(sqsParams, function(err, data) {
    if (err) {
      console.log('ERR', err);
    }
  
    console.log(data);
  });

  //console.log(req.body)
  //
  request('http://localhost:3030/read', function(err, response, body) {
     //console.log(body);
     res.json(body);
  });
});

module.exports = router;
