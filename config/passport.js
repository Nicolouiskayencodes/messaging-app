const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const prisma = require('../db/prisma.js')

passport.use(new LocalStrategy(
  async (username, password, done)=>{
    console.log(username)
    try {
      const user = await prisma.user.findUnique({
        where: {username: username}
      })
    if (!user) {
      console.log('Incorrect username')
      return done(null, false, {message: 'Incorrect username'});
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Incorrect password')
      return done(null, false, { message: "Incorrect password" })
    }
    // await prisma.user.update({
    //   where: {id: user.id},
    //   data: {lastActive: new Date()}
    // })
    return done(null, user)
  } catch(err) {
    return done(err);
  }
}))

passport.serializeUser((user,done)=>{
  done(null, user.id);
})

passport.deserializeUser(async(id,done)=>{
  try {
    await prisma.user.update({
      where: {id: id},
      data: {lastActive: new Date()}
    })
    const user = await prisma.user.findUnique({
      where: {id: id}
    })

    done(null, user);
  } catch (err) {
    done(err);
  }
})