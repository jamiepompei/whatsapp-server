var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let cors = require('cors');

let mongoose = require('mongoose');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let chatRouter = require('./routes/chats.route');
let messageRouter = require('./routes/message.route');
const Pusher = require('pusher');

var app = express();

app.use(cors());

require('dotenv').config()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configs

let connectionUrl = `mongodb+srv://admin:${process.env.password}@cluster0.3ni9o.mongodb.net/whatsApp?retryWrites=true&w=majority`;

mongoose.connect(connectionUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch((error)=>{
  console.log("error ", error, ' ', `${process.env.password}`)
})

var pusher = new Pusher({
  appId: "1164481",
  key: "ca0478730270c9e290b6",
  secret: "43bb921413f0c01d9f42",
  cluster: "us2",
  useTLS: true
})

const db = mongoose.connection;
db.once('open', ()=>{
  console.log('db connected');
  const messageCollection = db.collection('messages');
  const changeStream = messageCollection.watch();
  changeStream.on('change', (change)=>{
    console.log("what is in change ", change)
    if(change.operationType == 'insert'){
      const messageDetails =  change.fullDocument;
      pusher.trigger(
        'message', 'inserted', {
          message: messageDetails.message,
          chat_id: messageDetails.chat_id,
          time: messageDetails.time,
          from: messageDetails.from
        }
      )
    }
  });
})

// routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chats', chatRouter);
app.use('/messages', messageRouter);


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
  res.render('error');
});

module.exports = app;
