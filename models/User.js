const bcrypt = require('bcrypt-nodejs');
const generateId = require('./generateId');


module.exports = db => {
  return {

    create: obj => {
      return new Promise((resolve, reject) => {
        let fail = false;
        const user = {};

        // store values
        user.username = obj.username.trim();
        user.email = obj.email.toLowerCase().trim(); // TO DO: ensure email is unique
        user.password = obj.password.trim();

        // default values
        user._id = generateId();
        user.wins = 0;
        user.losses = 0;
        user.createdAt = Date.now();

        // make sure email and username are unique
        db.collection("users").get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            const existingUser = doc.data();
            if (user.email === existingUser.email
             || user.username === existingUser.username) {
              fail = true;
              reject()
            }
          })

          // hash password
          if (!fail) {
            bcrypt.genSalt(5, (err, salt) => {
              if (err) reject(err);
              else {
                bcrypt.hash(user.password, salt, null, (err, hash) => {
                  if (err) reject(err);
                  else {
                    user.password = hash;

                    // save to db
                    db.collection("users").doc(user._id).set(user)
                    resolve(user)
                  }
                });
              }
            });
          }
        })
        .catch(err => reject(err))
      });
    },

    verifyPassword: (password, cb) => {
      bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
      })
    },
  };
};
