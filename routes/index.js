const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.redirect('/auth/login'));

router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { user: req.session.user });
    } else {
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/auth/login');
    }
});

module.exports = router;
