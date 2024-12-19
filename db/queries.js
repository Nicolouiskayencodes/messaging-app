const prisma = require('./prisma.js')

async function getUserInfo(id){
  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
      include: {
        conversations: {include: {Users: true, readBy: true},},
        friends: {
          select:{
            id: true,
            displayName: true,
            username: true,
            lastActive: true,
            avatar: true,
            conversations: {
              where:{Users: {some:{id: id}}},
              select: {
                id: true,
                Users: true
              },
              orderBy: {updateAt: 'asc'},
            }
        },
        orderBy: {username: 'desc'},
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
      avatar: url,
    },
  })
}

async function makeConversation(userarray) {
  const usersQuery = []
  const userIds = []
  let exists = true;
  let conversationId = null;
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
    //This took me like an hour an a half to figure out - I probably could have made it easier by making the relation explicit and therefore queryable
    for(i=1; i<users.length; i++){
      if (!users[0].conversations.some(conversation => {return (conversation.Users.some(user => {return user.id === users[i].id}) && conversation.Users.length === users.length)})) {
        exists = false
      } else {
        users[0].conversations.forEach(conversation => {if (conversation.Users.length === users.length){
          if (conversation.Users.every(user => {return (userIds.includes(user.id))})){ conversationId = conversation.id }
        }})

        } 
      }
    if(exists === false ) {
      const conversation = await prisma.conversation.create({
        data: {
          Users: {
              connect: usersQuery
          },
        },
      })
      return conversation;
    } else {
      const conversation = await prisma.conversation.findUnique({ where: {
        id: conversationId,},
        include: { Users: true,},
      })
      return conversation;
    }
  }


async function getConversation(conversationid, userid) {
  console.log(conversationid)
  await prisma.conversation.update({
    where: {
      id: conversationid
    },
    data: {
      readBy: {
        connect: [{
          id: userid
        }],
        },
      },
  })
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationid,
      Users: {
        some:{
          id: userid
      }}
    },
    include: {
      Messages: {
        include: {author: true},
      },
      Users: true,
    }
  })
  return conversation
}

async function sendMessage(conversationid, userid, content) {
  await prisma.conversation.update({
    where: {
      id: conversationid
    },
    data: {
      readBy: {
        set: [],
        },
      },
  })
  await prisma.message.create({
    data: {
      conversationId: conversationid,
      authorId: userid,
      content: content,
    },
  }
  )
}

async function sendPictureMessage(conversationid, userid, imageurl, content) {
  await prisma.message.create({
    data: {
      conversationId: conversationid,
      authorId: userid,
      image: imageurl,
      content: content,
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
async function deleteMessage( messageid, userid ) {
  await prisma.message.delete({
    where: {
      id: messageid,
      authorId: userid
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


module.exports = { getUserInfo, changeName, changeAvatar, makeConversation, getConversation, sendMessage, sendPictureMessage, updateMessage, updatePictureMessage, addFriend, getUsers, updateMessage, deleteMessage }