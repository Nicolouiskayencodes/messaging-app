const db = require('../db/queries')
const getUserInfo = async (req, res, next) => {
  if (req.user){
    try {
      const userInfo = await db.getUserInfo(req.user.id)
      return res.status(200).json(userInfo)
    } catch (error) {
      return next(error)
    }
    
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}

const changeName = async (req, res, next) => {
  if (req.user){
    try {
      await db.changeName(req.user.id, req.body.name)
    } catch (error) {
      return next(error)
    }
    
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}

const changeAvatar = async (req, res, next) => {
  if (req.user){
    // insert multer and upload to cloud site, receive image url
    try {
      // await db.changeAvatar(req.user.id, imageurl) 
    } catch (error) {
      return next(error)
    }
    
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}

const openConversation = async (req, res, next) => {
  if (req.user){
    try {
      const conversation = await db.getConversation(req.params.conversationid, req.user.id)
      return res.status(200).json(conversation)
    } catch (error) {
      return next(error)
    }
    
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}

const sendMessage = async (req, res, next) => {
  if (req.user) {
    if (req.body.picture !== null){
      // multer for image
      try {
        // await db.sendPictureMessage(req.params.conversationid, req.user.id, req.body.content, imageurl)
      } catch (error) {
        return next(error)
      }
    } else {
      try {
      await db.sendMessage(req.params.conversationid, req.user.id, req.body.content)
    } catch (error) {
      return next(error)
    }}
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}


module.exports = { getUserInfo, changeName, changeAvatar, openConversation }