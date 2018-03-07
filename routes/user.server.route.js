var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user.server.controller');
const isAuth = require('../middleware/auth')

router.get('/user/:status',isAuth,UserController.get); //different to parameters received
router.get('/user/detail/:id',UserController.show);
router.put('/user/:id',isAuth,UserController.update);
router.delete('/user/:id',isAuth,UserController.remove);
router.post('/user',UserController.create);
router.post('/user/login',UserController.login);
router.put('/user/changepw/:id',isAuth, UserController.changePassword);

router.post('/user/imageUpload',UserController.imageUpload);
router.get('/user/image/:image',UserController.getImageFile);
router.param('id',UserController.findById);

module.exports = router;
