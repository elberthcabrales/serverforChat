'use strict'

const jwt = require('../services/jwt');

function isAuth(req, res, next) {
	if(!req.headers.authorization){
		return res.status(403).send({message: 'Need for authorization header'});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');
	jwt.decodeToken(token).then((response)=>{
		req.payload = response;

		next();
	}).catch((err)=>{
		res.send({message: err});
	});
}
module.exports = isAuth
