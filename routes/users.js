const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const Buyer = require('../models/Buyer');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  console.log(req.body);
  const { tel, password, password2 } = req.body;
  let errors = [];

  console.log('*');

  if (!tel || !password || !password2) {
    errors.push({ msg: 'Заполните все поля!' });
  }

  if (password != password2) {
    errors.push({ msg: 'Пароли не совпадают!' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Длина пароля должна быть больше 6 символов' });
  }

  console.log(errors);

  if (errors.length > 0) {
      res.render('register', {
        errors,
        tel,
        password,
        password2
      });
  } else {
    Buyer.findOne({ telefoneNumber: tel }).then(user => {
      user.isPassword = true;

      console.log(user);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(user => {
              req.flash(
                'success_msg',
                'Успешно зарегестрированы!'
              );
              res.redirect('/users/login');
            })
            .catch(err => console.log(err));
        });
      });
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.post('/loginCheck', (req, res, next) => {
  Buyer.findOne({ telefoneNumber: req.body.tel })
    .then(user => {
      if (user) {
        if (user.isPassword !== false) res.render('login', { telefoneNumber: req.body.tel })
        else res.render('register', { tel: req.body.tel });
      } else {
        res.render('loginCheck', {
          errors : [{msg : 'К сожалению вы еще не зарегестрированы в акции'}]
        })
      }
    })
    .catch(err => console.error(err));
})

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
