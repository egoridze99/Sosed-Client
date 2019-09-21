const mongoose = require('mongoose');
const Buyer = require('../models/Buyer');
const fs = require('fs');
const users = require('./users.json');

const db = require('../config/keys');
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, {useNewUrlParser: true})
    .then(() => console.log('good'))
    .then(() => {
        users.forEach(item => {
            const newBuyer = new Buyer({
                _id : item._id,
                telefoneNumber : item.telefoneNumber,
                buyer : item.buyer,
                total : item.total,
                free : item.free,
            });

            newBuyer.save()
                .then(() => {
                    console.log('saved!')
                })
                .catch(err => console.error(err))
        })
    })
    .catch(err => console.error(err))