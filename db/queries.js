const { connect } = require('../routes/routes.js')
const prisma = require('./prisma.js')

async function getUserInfo(id){
  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
      include: {
        conversations: {include: {Users: true},},
        friends: {
          select:{
          displayName: true,
          username: true,
          lastActive: true,
        },
        orderBy: {lastActive: 'desc'},
        }
      },
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
  const userIds = []
  let exists = true
  userarray.map(user => {
    usersQuery.push({id: user.id})
    userIds.push(user.id)
  })
  const users = await prisma.user.findMany({
      where: {
        id: {in: userIds},
      },
      include: {
        conversations: {
          include: {
            Users:true,
          },
          },
          
      }
    })
    console.log(users)
    for(i=1; i<users.length; i++){
      if (!users[0].conversations.some(conversation => {return conversation.Users.some(user => {return user.id === users[i].id})})){
        exists = false
      } else {
        console.log(users[0].conversations.some(conversation => {return conversation.Users.some(user => {return user.id === users[i].id})}))
      }
    }
    console.log(exists)
    if(exists === false) {
      await prisma.conversation.create({
        data: {
          Users: {
              connect: usersQuery
          },
        },
        
      })
    }
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

async function getUsers(id) {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: id
      }
    }
  })
  return users
}


module.exports = { getUserInfo, changeName, changeAvatar, makeConversation, getConversation, sendMessage, sendPictureMessage, updateMessage, updatePictureMessage, addFriend, getUsers }