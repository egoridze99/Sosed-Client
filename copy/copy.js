const mongoose = require('mongoose');
const Buyer = require('../models/Buyer');
const fs = require('fs');

const db = require('../config/keys');
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, {useNewUrlParser: true})
    .then(() => console.log('\nMongodb connected...'))
    .then(() => {
        Buyer.find({}, null, null)
            .then(users => {
                const json = JSON.stringify(users, null, '  ');

                fs.writeFile('users.json', json, 'utf8', err => {
                    if (err) throw err;

                    console.log('ok');
                });
            });
    })
    .then()
    .catch(err => console.log(err))

