var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

//https://api.fortnitetracker.com/v1/profile/{platform}/{epic-nickname}
//TRN-Api-Key: 4cfe622f-6858-4ea3-bcb3-cc501622337c

var uri = 'https://api.fortnitetracker.com/v1/profile/';

app.post('/',function(req, res){
	// console.log(req.body);
	request.get(uri + req.body.platform + '/' + req.body.username, {
		headers : {
			'TRN-Api-Key': '4cfe622f-6858-4ea3-bcb3-cc501622337c'
		}}, function(err, response, body) {
			res.json(body);
	});

});

app.post('/2',function(req, res){
	// console.log(req.body);
	request.get(uri + req.body.platform + '/' + req.body.username, {
		headers : {
			'TRN-Api-Key': '12e4dc49-c224-4a42-8e44-2f7305078132'
		}}, function(err, response, body) {
			res.json(body);
	});

});

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log("Running app at localhost: "+ port);
});
