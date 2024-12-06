const prisma = require('./prisma.js')

async function getUserInfo(id){
  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
    data: {
      include: {
        conversations: true,
        friends: {
          displayName: true,
          lastActive: true,
          orderBy: lastActive,
        }
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
    },
    data: {
      picture: url,
    },
  })
}

async function makeConversation(userarray) {
  const usersQuery = []
  userarray.map(userid => {
    usersQuery.push({id: userid})
  })
  await prisma.conversation.create({
    data: {
      user: {
        connect: usersQuery
      }
  }})
}

async function getConversation(conversationid, userid) {
  await prisma.message.update({
    where: {
      conversationId: conversationid
    },
    data: {
      readBy: {
        connect: {
          id: userid
        }
      }
    }
  })
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

async function updateMessage(messageid, userid, content) {
  await prisma.message.update({
    where: {
      id: messageid,
      authorId: userid
    },
    data: {
      content: content,
    },
  }
  )
}

async function updatePictureMessage(messageid, userid, content, imageurl) {
  await prisma.message.update({
    where: {
      id: messageid,
      authorId: userid
    },
    data: {
      content: content,
      picture: imageurl,
    },
  }
  )
}

async function addFriend(userid, friendid) {
  await prisma.user.update({
    where: {
      id: userid,
    },
    data: {
      friends: {
        connect: {
          id: friendid
        }
      }
    }
  })
}

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: displayName
  })
  return users
}


module.exports = { getUserInfo, changeName, changeAvatar, makeConversation, getConversation, sendMessage, sendPictureMessage, updateMessage, updatePictureMessage, addFriend, getUsers }