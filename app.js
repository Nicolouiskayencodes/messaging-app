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
  origin: 'https://nicos-messenger.netlify.app',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}
app.use(cors(corsOptions));

require('./config/passport')
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('trust proxy', 1)
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
    sameSite: 'none',
    secure: true,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(' Message Board - listening on port '+PORT+'!'));