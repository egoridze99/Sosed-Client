const express = require("express");
const router = express.Router();
const Transactions = require('../models/Transaction');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("loginCheck"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  
  Transactions.find({telefone : req.user.telefoneNumber}, null, null)
    .then(transactions => {
      res.render("dashboard", {
        user: req.user,
        transactions: transactions.reverse()
      });
    })
    .catch()
});

module.exports = router;