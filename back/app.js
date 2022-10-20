import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import {authRouter} from './modules/auth.js';
import sessionMiddleware from './modules/session.js';

const FRONT_ORIGIN = "http://localhost:3004";
const COOKIE_SECRET = "secret1";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: [FRONT_ORIGIN],
  credentials: true,
}));
app.use(sessionMiddleware);
app.use(authRouter());
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(res.locals);
});

export default app;
