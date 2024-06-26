const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('C:/Users/pavan/OneDrive/Desktop/login_forn/login-page-using-nodejs/models/user.js');


// Now you can use the User model
// Login Page
router.get('/login', (req, res) => res.render('login'));

// Login Handle
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }).then(user => {
        if (!user) {
            req.flash('error_msg', 'Email is not registered');
            return res.redirect('/auth/login');
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                req.flash('error_msg', 'Password incorrect');
                res.redirect('/auth/login');
            }
        });
    });
});

module.exports = router;

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { email, password, password2 } = req.body;
    let errors = [];

    if (!email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/auth/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

