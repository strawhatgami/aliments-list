import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import { sequelize } from '../model/index.js';
const COOKIE_SECRET = "secret1";

const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

export default session({
  key: "express.sid",
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
//    httpOnly: false,
    secure: false,
  },
  store: sessionStore
});

sessionStore.sync();
