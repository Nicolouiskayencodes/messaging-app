const router = require('express').Router();
const controller = require('../controllers/controller.js')

router.post('/login', controller.login);

router.post('/register', controller.register);

router.get('/logout', controller.logout);

router.get('/login-success', controller.loginSuccess);

router.get('/login-failure', controller.loginFailure);

router.get("/protected", controller.protected
)

module.exports = router;