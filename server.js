var colors = require('colors');
//
var express = require('express');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var app = express();

app.get('/',function(req,res){
	res.redirect('/baliseimage/');
})

//
app.use('/baliseimage/files', express.static(__dirname + '/files'))
app.use('/baliseimage/public',express.static(__dirname + '/public'))
//
app.use(busboy());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true,
	limit: '50mb'
}));

app.post('/baliseimage/post',require('./post').post);

app.get('/baliseimage/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.get('/baliseimage/paper/*', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.listen(3000);
console.log('server started : '+'http://localhost:3000/baliseimage/'.blue.bgWhite.inverse);