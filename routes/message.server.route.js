var express = require('express');
var router = express.Router();
const isAuth = require('../middleware/auth')

var MessageController = require('../controllers/message.server.controller');
/* GET home page. */
router.post('/message/',isAuth,MessageController.create);
router.post('/getmessage/',isAuth,MessageController.listMessages);


module.exports = router;
