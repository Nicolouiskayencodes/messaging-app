const express = require('express');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes/routes.js');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./db/prisma.js')
require('dotenv').config();
const cors = require('cors')


const app = express();
const corsOptions ={
  origin: 'http://localhost:5173',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
app.use(cors(corsOptions));

require('./config/passport')
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use(session({
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  ),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 7* 24 * 60 * 60 * 1000,
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use((req, res, next)=>{
  console.log(res.locals);
  next();
})

app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(' Message Board - listening on port '+PORT+'!'));