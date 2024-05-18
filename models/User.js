const bcrypt = require('bcrypt');
const generateId = require('./generateId');


module.exports = db => {
    return {
        create: data => {
            return new Promise((resolve, reject) => {
                const user = {
                    _id: generateId(),
                    email: data.email ? data.email.toLowerCase().trim() : null,
                    username: data.username.trim(),
                    password: data.password,
                    rating: 1500,
                    wins: 0,
                    losses: 0,
                    lastGame: null,
                    createdAt: Date.now(),
                };

                db.collection('users').where('email', '==', user.email).get()
                    .then(snapshot => {
                        if (data.email && !snapshot.empty)
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

                        const user = doc.data();
                        delete user.password;

                        resolve(user)
                    })
            })
        },

        findOne: (field, value, unsafe = false) => {
            return new Promise((resolve, reject) => {
                db.collection('users').where(field, '==', value).get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                            reject()
                            return;
                        }

                        const user = snapshot.docs[0].data();

                        if (!unsafe)
                            delete user.password;

                        resolve(user)
                    })
            });
        },

        getRankings: (page, limit) => {
            return new Promise((resolve, reject) => {
                const results = [];

                db.collection('users').orderBy('rating', 'desc').limit(limit).get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            const user = doc.data();
                            delete user.password;
                            results.push(user);
                        });

                        resolve(results);
                    })
                    .catch(error => {
                        reject('Error getting documents: ' + error);
                    });
            });
        },

        save: user => {
            db.collection('users').doc(user._id).set(user)
        },
    };
};
