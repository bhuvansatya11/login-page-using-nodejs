const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const bcryptjs = require('bcryptjs');
const User = require('C:/Users/pavan/OneDrive/Desktop/login_forn/login-page-using-nodejs/models/user.js');

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // your schema definition here
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

const app = express();

// Database connection
mongoose.connect('mongodb://localhost/loginapp', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// View engine setup
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
