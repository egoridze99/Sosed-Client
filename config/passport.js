const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const Buyer = require('../models/Buyer');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'telefoneNumber' }, (telefoneNumber, password, done) => {
      // Match user
      Buyer.findOne({
        telefoneNumber
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Такого номера не найдено' });
        }
        console.log(user);
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Неверный пароль' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Buyer.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
