'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const SECRET_TOKEN = 'testSessionSecret';

function createToken (user) {
 	var payload = {
		user: {_id:user._id, email:user.email},
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix()
	};
 return jwt.encode(payload, SECRET_TOKEN)
}

function decodeToken (token){
	const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, SECRET_TOKEN)

      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'El token ha expirado'
        })
      }
      resolve(payload)
    } catch (err) {
      reject({
        status: 500,
        message: 'Invalid Token'
      })
    }
  })

  return decoded;
}

module.exports = {
  createToken,
  decodeToken
}
