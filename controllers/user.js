const Crypto = require('crypto')
const supabase = require('../config/supabase.js')
const {decode} = require('base64-arraybuffer')

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
    const ext = req.file.originalname.split('.').pop()
    const filename = Crypto.randomUUID() + '.'+ ext
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "Please upload a file"});
        return
      }
      const fileBase64 = decode(file.buffer.toString('base64'))

      const {data, error} = await supabase.storage
      .from('messaging-app')
      .upload(`public/${filename}`, fileBase64, {
        contentType: file.mimetype
      });
      if (error) {
        return next(error)
      }
      } catch (error) {
        return next(error)
      }
      
      const {data} = supabase.storage
      .from('messaging-app')
      .getPublicUrl(`public/${filename}`, {
        download: true
      });
      try {
        await db.changeAvatar(req.user.id, data.publicUrl) 
      } catch (error) {
        return next(error)
      }
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}

const makeConversation = async (req, res, next) => {
  const userarray = req.body.userarray
  userarray.unshift(req.user)
  if (req.user){
    try {
      const conversation = await db.makeConversation(userarray)
      return res.status(200).json(conversation)
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
      const conversation = await db.getConversation(parseInt(req.params.conversationid), req.user.id)
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
    if (req.file) {
      const ext = req.file.originalname.split('.').pop()
      const filename = Crypto.randomUUID() + '.'+ ext
      const file = req.file;
    try {
      if (!file) {
        res.status(400).json({ message: "Please upload a file"});
        return
      }
      const fileBase64 = decode(file.buffer.toString('base64'))

      const {data, error} = await supabase.storage
      .from('messaging-app')
      .upload(`public/${filename}`, fileBase64, {
        contentType: file.mimetype
      });
      if (error) {
        return next(error)
      }
      } catch (error) {
        return next(error)
      }
      
      const {data} = supabase.storage
      .from('messaging-app')
      .getPublicUrl(`public/${filename}`, {
        download: true
      });
      try {
        await db.sendPictureMessage(parseInt(req.params.conversationid), parseInt(req.user.id), data.publicUrl, req.body.content) 
        return res.status(200).json({message: "Success"})
      } catch (error) {
        return next(error)
      }
    } else {
      try {
      await db.sendMessage(parseInt(req.params.conversationid), parseInt(req.user.id), req.body.content)
      return res.status(200).json({message: "Success"})
    } catch (error) {
      return next(error)
    }}
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}
const updateMessage = async (req, res, next) => {
  if (req.user) {
   
      try {
      await db.updateMessage(parseInt(req.params.messageid), req.user.id, req.body.content )
      return res.status(200).json({message: "Success"})
    } catch (error) {
      return next(error)
    }
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}
const deleteMessage = async (req, res, next) => {
  if (req.user) {
   
      try {
      await db.deleteMessage(parseInt(req.params.messageid), req.user.id)
      return res.status(200).json({message: "Success"})
    } catch (error) {
      return next(error)
    }
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}

const addFriend = async ( req, res, next ) => {
  if (req.user){
    try {
      await db.addFriend(req.user.id, parseInt(req.params.friendid))
      return res.status(200).json('success')
    } catch (error) {
      return next(error)
    }
    
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}

const getUsers = async (req, res, next) => {
  if (req.user){
    try {
      const users = await db.getUsers(req.user.id)
      console.log(users)
      return res.status(200).json(users)
    } catch (error) {
      return next(error)
    }
    
  } else {
    return res.status(401).json({message: "Not authenticated"})
  }
}


module.exports = { getUserInfo, changeName, changeAvatar, makeConversation, openConversation, sendMessage, updateMessage, addFriend, getUsers, deleteMessage }