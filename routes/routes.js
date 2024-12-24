const router = require('express').Router();
const controller = require('../controllers')
const passport = require('passport')
const multer  = require('multer')
const storage = multer.memoryStorage({
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
const upload = multer({ storage: storage })

router.post('/login', passport.authenticate('local'), controller.authenticationController.login);
router.post('/register', controller.authenticationController.register);
router.get('/logout', controller.authenticationController.logout);

router.get('/userinfo', controller.userController.getUserInfo)
router.put('/updatename', controller.userController.changeName)
router.put('/updateavatar', upload.single('file'), controller.userController.changeAvatar)
router.get('/conversation/:conversationid', controller.userController.openConversation)
router.post('/conversation', controller.userController.makeConversation)
router.post('/message/:conversationid', upload.single('file'), controller.userController.sendMessage)
router.put('/message/:messageid', controller.userController.updateMessage)
router.delete('/message/:messageid', controller.userController.deleteMessage)
router.put('/friend/:friendid', controller.userController.addFriend)
router.get('/users', controller.userController.getUsers)

module.exports = router;