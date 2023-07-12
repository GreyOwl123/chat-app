if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const bcryptjs = require('bcryptjs');
const createError = require('http-errors');
const express = require('express');
const http = require("http");
const cors = require("cors");
const path  = require('path');
const cookieParser = require("cookie-parser");
const logger = require('morgan');
const async = require("async");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
         origin: "http://localhost:3000",
         methods: ["GET", "POST"],
         transports: ['websocket', 'polling'],
         credentials: true
       },
      allowEIO3: true
});

io.on('connection', (socket) => {
    console.log('user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.engine.on("connection_error", (err) => {
  console.log(err.req);     // the request object. 
  console.log(err.code);    // error code, i.e 1 which stands for "Transport unknown".
  console.log(err.message); // error message
  console.log(err.context); // additional error context
})

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_DB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}


io.engine.use(logger('dev'));
io.engine.use(express.json());
io.engine.use(express.urlencoded({ extended: true }));
io.engine.use(cookieParser());
io.engine.use(express.static(path.join(__dirname, 'public')));
io.engine.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
io.engine.use(passport.initialize());
io.engine.use(passport.authenticate("session"));


io.engine.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})

io.engine.use('/', indexRouter);
io.engine.use('/users', usersRouter);

// catch 404 and forward to error handler
io.engine.use(function(req, res, next) {
  next(createError(404));
});

// error handler
io.engine.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


module.exports = { app: app, server: server };
