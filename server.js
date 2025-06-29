require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();

// DB + Auth
require('./config/passport')(passport);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro na ligação ao MongoDB:', err));


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


app.use('/', require('./routes/auth'));
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));


app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro no servidor!');
});


app.listen(3000, () => console.log('Servidor em http://localhost:3000'));
