var mongoose = require('mongoose'),
	formidable = require('formidable'),
	fs=require('fs'),
	querystring = require("querystring");


var fileSchema = mongoose.Schema({
	fileName:String,
	fileSize:String,
	path:String,
	comment:String,
	updateDate:Date,
	Seminar : String,
	startFrom:Number,
	endWith:Number
})

var fileModel = mongoose.model('File',fileSchema);

exports.upload =function(options){
	//console.log(options);

	return function(req, res, next){
			var form = new formidable.IncomingForm(),
			fileSize, 
			fileName,
			files = [],
			fields = [];
			form.uploadDir = options.uploadDir;
			form.on('field', function(field, value){
	          	console.log(field, value);
				fields.push([field, value]);
			}).on('file', function(field, file){
	          	fileName = file.name;
				fileName = (new Date()).getTime() + parseInt(Math.random()*100)+"." 
								 + fileName.substring(fileName.lastIndexOf('.')+1, fileName.length).toLowerCase();
				fs.rename(file.path, './upload/'+fileName, function(err) {
					fs.unlink(file.path, function() { console.log("delete temp"); });
				});
				files.push([field, file]);
			}).on('progress', function(bytesRecieved, bytesExpected){
	 			fileSize = bytesExpected/1024 + ' KB';
			}).on('end', function(){
				res.statusCode=200;
				res.setHeader('Content-Type', 'text/html');
			    res.send({ msg: 'Success',fileName:fileName,fileSize:fileSize});
			    console.log('upload success');
			});
			console.log('start to parser');
			form.parse(req); 
		}
	}

//list files
exports.findAllFiles = function(req, res, next) {
	 fileModel.find(function(err, files){
		if(!err){
			res.send(files);
			//res.end();
		} else {
			console.log(err);
			next(new Error(err));
		}
	});
}

exports.addFile = function(req,res, next) {
	var fileName=req.body.fileName;
	var fileSize=req.body.fileSize;
	var startFrom=req.body.startFrom;
	var endWith=req.body.endWith;
	var comment=req.body.comment;
	var newfile = new fileModel;
	newfile.path = './upload/';
	newfile.fileName=fileName;
	newfile.fileSize =fileSize;
	newfile.startFrom=startFrom;
	newfile.endWith=endWith;
	newfile.comment=comment;
	newfile.Seminar = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length).toUpperCase()
	newfile.updateDate = Date();
	newfile.save(function(err){
		console.log('save');
		if(!err){
			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/html');
			res.send({ msg: 'File has been uploaded to the server.',file:newfile});
			console.log('done');
		} else {
			next(new Error('Save database error.'));				
		}	
	});
} 

//find single record by id
exports.findFileById = function(req,res, next) {
	fileModel.findById(req.params.id, function(err,file) {
		if (!err) {
			res.send(file);
			//res.end();
		} else {
			console.log(err);
			res.statusCode = 404;
			res.send({status:'404',message:'cannot find related record'});
			next(new Error(err));
			//res.end();
		}

	})
} 

//delete file and remove record in DB
exports.removeFileById = function(req,res,next) {
	//console.log(req);
	fileModel.findById(req.params.id, function(err, file){
		//console.log("filepath="+file.path+file.fileName);
			var fs = require('fs');
			fs.unlink(file.path+file.fileName, function (err) {
			  if (err) next(new Error('file not exist'));
			});	

			file.remove(function(err){
				if(err){
					next(new Error('Delete file record error'));			
				} else {
					res.statusCode = 200;
					res.end('{ msg: Result file has been deteled on server.');					
				}
			});
		});
}
