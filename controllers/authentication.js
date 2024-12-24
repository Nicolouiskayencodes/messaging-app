const prisma = require('../db/prisma.js')
const bcrypt = require('bcryptjs')

const login = (req, res, next) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(403).json({errors:[{msg:'Username or password did not match'}]})
  }
}

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


module.exports = {login, register, logout, }