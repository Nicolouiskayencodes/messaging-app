const router = require('express').Router();
const controller = require('../controllers')

router.post('/login', controller.authenticationController.login);

router.post('/register', controller.authenticationController.register);

router.get('/logout', controller.authenticationController.logout);

router.get('/login-success', controller.authenticationController.loginSuccess);

router.get('/login-failure', controller.authenticationController.loginFailure);

router.get("/protected", controller.authenticationController.protected)

router.get('/userinfo', controller.userController.getUserInfo)

router.put('/updatename', controller.userController.changeName)

router.put('/updateavatar', controller.userController.changeAvatar)

module.exports = router;