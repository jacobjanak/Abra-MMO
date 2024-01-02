const bcrypt = require('bcrypt');
const generateId = require('./generateId');


module.exports = db => {
    return {
        create: data => {
            return new Promise((resolve, reject) => {
                const user = {
                    _id: generateId(),
                    email: data.email.toLowerCase().trim(),
                    username: data.username.trim(),
                    password: data.password,
                    wins: 0,
                    losses: 0,
                    lastGame: null,
                    createdAt: Date.now(),
                };

                db.collection('users').where('email', '==', user.email).get()
                    .then(snapshot => {
                        if (!snapshot.empty)
                            return Promise.reject('A user already exists with that email.');

                        return db.collection('users').where('username', '==', user.username).get();
                    })
                    .then(snapshot => {
                        if (!snapshot.empty)
                            return Promise.reject('A user already exists with that username.');

                        return bcrypt.hash(user.password, 10);
                    })
                    .then(hash => {
                        user.password = hash;
                        db.collection('users').doc(user._id).set(user);
                        resolve(user);
                    })
                    .catch(err => reject(err));
            });
        },

        verifyPassword: (user, password, cb) => {
            bcrypt.compare(password, user.password, cb)
        },

        findById: function (id) {
            return new Promise((resolve, reject) => {
                db.collection('users').doc(id).get()
                    .then((doc) => {
                        if (!doc.exists) {
                            reject()
                            return;
                        }

                        resolve(doc.data());
                    })
            })
        },

        findOne: (field, value) => {
            return new Promise((resolve, reject) => {
                db.collection('users').where(field, '==', value).get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                            reject()
                            return;
                        }

                        resolve(snapshot.docs[0].data())
                    })
            });
        },

        save: user => {
            db.collection('users').doc(user._id).set(user)
        },
    };
};
