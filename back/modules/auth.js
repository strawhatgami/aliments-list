import express from 'express';
const { Router } = express;
import passport from "passport";
export { default as passport } from "passport";
import passportLocal from 'passport-local';
const { Strategy: LocalStrategy } = passportLocal;
import services from '../services/index.js';

passport.serializeUser(services.serializeUser);
passport.deserializeUser(services.deserializeUser);

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, services.onCredentials));

export function ensureConnected(req, res, next) {
  if (!req.user) {
    res.status(401);
    res.send("User not authenticated");
    return;
  }

  next();
}

export const authRouter = () => {
  const router = Router();

  router.use(passport.initialize());
  router.use(passport.session());

  router.post('/auth/login', passport.authenticate('local'), (req, res, next) => {
    res.end();
  });

  router.get('/auth/logout', function (req, res, next) {
    req.logout((err) => {
      if (err) return next(err);

      req.session.destroy();
      res.end();
    });
  });

  return router;
};
