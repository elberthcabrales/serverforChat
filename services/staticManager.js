const path = require('path');
var fs = require('fs');


//Upload
function staticFileUpload(data, callback){
	
	const dir =  './'+data.userId+'/';
	const image =  data.image;
	if(fs.existsSync(dir)){
		fs.readdirSync(dir).forEach(function(file, index){
			var curPath = path + "/" + file;
			if (fs.lstatSync(curPath).isDirectory()) { // recurse
			  deleteFolderRecursive(curPath);
			} else { //if just is file delete it
			  fs.unlinkSync(curPath);
			}
		  });
		  fs.rmdirSync(path);
	}
	fs.mkdirSync(dir)
	if(image){
		var supported_mimes = [
			'image/jpeg',
			'image/png',
			'image/gif'
		];
		
		if(supported_mimes.indexOf(image.mimetype) >-1){
			staticFile.mv(dir+image.name, function(err) {
				callback(err)
			});
		}else{
			  callback('mime type not supported')
		}
	}else{
		 callback('No files were uploaded.')
	}
}

//remove
function staticFileRemove(pathFile,callback){	
	const path_file = './'+pathFile;
	if(fs.exists(path_file)){
		fs.unlink(path_file,function(err){
			callback(err)
		})
	}		
}
//Get image
function getStaticFile(pathFile,callback){
	const path_file = './'+pathFile;
	fs.exists(path_file, function(exists){
		if(exists){
			let result = path.resolve(path_file);
            callback(result)
		}
	});
}


module.exports = {
  staticFileUpload,
  staticFileRemove,
  getStaticFile
}
