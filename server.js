require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();

// DB + Auth
require('./config/passport')(passport);
mongoose.connect(process.env.MONGODB_URI);

// Middlewares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

// Server
app.listen(3000, () => console.log('Servidor em http://localhost:3000'));
