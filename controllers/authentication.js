const passport = require('passport');
const prisma = require('../db/prisma.js')
const bcrypt = require('bcryptjs')
const db = require('../db/queries.js')

const login = passport.authenticate('local', {
  successRedirect: "/login-success",
  failureRedirect: "/login-failure"
})

const register = async (req, res, next) => {
  if (req.body.username && req.body.password){
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    try {
      await prisma.user.create({ 
        data: {
          username: req.body.username,
          password: hashedPassword,
        }
      });
      res.status(200).json({message: "Register success"});
    } catch(err) {
      return next(err);
    }
  })} else {
    res.status(401).json({errors: 'Fields must be filled out'})
  }
}

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({message:'Logout success'});
  }
  );
}

const loginSuccess = (req, res, next) => {
  res.status(200).json(req.user);
}

const loginFailure =  (req, res, next) => {
  res.status(403).json({errors:[{msg:'Username or password did not match'}]})
}


module.exports = {login, register, logout, loginSuccess, loginFailure}