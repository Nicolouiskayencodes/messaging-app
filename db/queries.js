const prisma = require('./prisma.js')

async function getUserInfo(id){
  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
    data: {
      include: {
        conversations: true,
        friends: true
      }
    }
  })
  return user
}

async function changeName(id, name) {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      displayName: name,
    },
  })
}

async function changeAvatar(id, url) {
  await prisma.user.update({
    where: {
      id: id,
      users: {

      }
    },
    data: {
      picture: url,
    },
  })
}

async function getConversation(conversationid, userid) {
  await prisma.conversation.findUnique({
    where: {
      id: conversationid,
      users: {
        some:{
          id: userid
      }}
    }
  })
}

async function sendMessage(conversationid, userid, content) {
  await prisma.message.create({
    data: {
      conversationId: conversationid,
      authorId: userid,
      content: content,
    },
  }
  )
}

async function sendPictureMessage(conversationid, userid, content, imageurl) {
  await prisma.message.create({
    data: {
      conversationId: conversationid,
      authorId: userid,
      content: content,
      picture: imageurl
    },
  }
  )
}


module.exports = { getUserInfo, changeName, changeAvatar, getConversation, sendMessage, sendPictureMessage }