var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var sha1 = require('sha1');
var mime = require('mime-types');
var app = express();

app.get('/',function(req,res){
	res.redirect('/baliseimage/');
})

//
app.use('/baliseimage/files', express.static(__dirname + '/files'))
app.use('/baliseimage/public',express.static(__dirname + '/public'))
//
app.use(busboy());
app.post('/baliseimage/post.php',function(req,res){
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldname, file, filename) {
		console.log("Uploading: " + filename);
		//
		var filepath_base = __dirname + '/files/' + filename;
		fstream = fs.createWriteStream(filepath_base);
		file.pipe(fstream);
		fstream.on('close', function () {
			var file_mimetype = mime.lookup(filepath_base),
				file_type = false,
				file_rename = sha1(filename + Math.random()),
				filepath_rename = __dirname + '/files/' + file_rename
				;
			switch(file_mimetype){
				case 'image/jpeg' :
					file_type = 'jpg';
					break;
			}
			if(file_type){
				filepath_rename += '.'+file_type;
				console.log('rename file > '+ file_rename);
				fs.rename(filepath_base, filepath_rename,
				function () {
					var response = {
						"success": true,
						"mimetype": file_mimetype,
						"filename": file_rename,
						"filepath": 'files/' + file_rename+ '.'+file_type
					}
					res.json(response);
				});
			}else{
				fs.unlinkSync(filepath_base);
				res.redirect('back');
			}

		});
	});
});

app.get('/baliseimage/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.listen(3000);