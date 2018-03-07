'use strict'
const User = require('../models/user.server.model');
const passwordHash = require('password-hash');
const jwt = require('../services/jwt');
//const FileManager = require('./../services/staticManager');

function get(req, res){
	let status = req.params.status;
	User.find({'_id':{$ne:req.payload.user._id},
				'status':{$ne:status}}
	,(err, result)=>{
		if(err){
			return res.status(400).send({
                message: err
            });
		} else {
			res.status(200).send({users:result})
		}
	});
}
function findById(req, res, next, id) {
	User.findById(id).exec((err, user)=>{
		if(err) return res.status(500).send({err:err})
		req.user = user
		next();
	})
}
function show(req,res){
     res.json(req.user);
}

function update(req, res){
	let user = req.user;
	user.email = req.body.email;
	user.username = req.body.username;
	user.save().then((updated)=>{
		res.status(200).send({
				user: updated
		});	
	}).catch(err=>{ return err})
}
function remove(req, res){
	let user = req.user;
	user.status="removed";
	user.save().then((removed)=>{
		res.status(200).send({
				user: removed
		});	
	}).catch(err=>{ return err})
}

function changePassword(req, res){
	let user = req.user;
	//if(req.payload.user._id!=user._id) return res.status(401).send({error:"Solo puedes actualizar tu contraseña"});

	user.password = passwordHash.generate(req.body.password);;
	user.save().then((usr)=>{
		res.status(200).send({
				user: usr
		});	
	}).catch(error=>{ return error})
	
}

function create(req, res) {
		var user = new User();
		user.username = req.body.username;
		user.email = req.body.email;
		user.password = passwordHash.generate(req.body.password);
		
		user.save().then((usr)=>{
			res.status(200).send({
					user: usr
			});	
		}).catch(err=>{ return err})
}

function login (req, res) {
  User.findOne({ email: req.body.email.toLowerCase() },'password',(err, user) => {
    if (err) return res.status(500).send({ message: err });
	
	if (user){
		if(user.comparePassword(req.body.password,user.password)){
			user.status = "online";
				user.save().then((usr)=>{
					return res.status(200).send({user:user ,message: 'Te has logueado correctamente',token: jwt.createToken(user)})
				}).catch(err=>{ return err})
		}else{
			return res.status(401).send({message: 'No coinside la contraseña o el usuario'})
		}
	}else{
		return res.status(404).send({ message: 'No existe el usuario' })
	}
  })
}
function imageUpload(req, res){
	if(req.files){		
		const data = {image: req.files, user: req.payload.user};
		FileManager.staticFileUpload(data,(error)=>{
			if(error){
				return res.status(401).send({message:error});
			}else{
				User.findByIdAndUpdate(req.body.id,{image : image.name},(err,updated)=>{
					if(!updated)  res.status(404).send({ message:'user not found'});
					res.send({user: updated, message:'file uploaded'});
				});
			}
		});
	}else{
		 res.status(400).send({message: 'No files were uploaded.'});
	}
}
function getImageFile(req, res){
	var image = req.params.image;
	const url ="./"+req.payload.user._id+"/"+image;
	staticFileUpload.getImageFile(url,(error)=>{
		if(result){
			 res.sendFile(result)
		}else{
			return res.status(404).send({message:"No found file"});
		}
	});
}

function logout(req, res){
	let user = req.user;
	user.status="offline";
	user.save().then((removed)=>{
		res.status(200).send({
				user: removed
		});	
	}).catch(err=>{ return err})
}

module.exports = {
	get,
	show,
	findById,
	update,
	changePassword,
	create,
	login,
	remove,
	imageUpload,
	getImageFile
};