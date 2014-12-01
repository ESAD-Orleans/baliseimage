var express = require('express');
var app = express();


app.use('/baliseimage/files', express.static(__dirname + '/files/'))
app.use('/baliseimage/public',express.static(__dirname + '/public'))

app.get('/baliseimage/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.listen(3000);