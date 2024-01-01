const bcrypt = require('bcrypt');
const generateId = require('./generateId');


module.exports = db => {
  return {

    create: obj => {
      return new Promise((resolve, reject) => {
        let fail = false;
        const user = {};

        user.email = obj.email.toLowerCase().trim(); // TO DO: ensure email is unique
        user.username = obj.username.trim();
        user.password = obj.password;

        // default values
        user._id = generateId();
        user.wins = 0;
        user.losses = 0;
        user.createdAt = Date.now();

        // make sure email and username are unique
        // TODO: is there a better way to do this?
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
            bcrypt.hash(user.password, 10)
            .then(hash => {
              user.password = hash;
              db.collection("users").doc(user._id).set(user);
              resolve(user);
            })
            .catch(err => reject(err));
            // bcrypt.genSalt(5, (err, salt) => {
            //   if (err) reject(err);
            //   else {
            //     bcrypt.hash(user.password, salt, null, (err, hash) => {
            //       if (err) {
            //         console.log(err);
            //         throw err;
            //         reject(err);
            //       }
            //       else {
            //         user.password = hash ? hash : 'temp';
            //
            //         // save to db
            //         db.collection("users").doc(user._id).set(user)
            //         resolve(user)
            //       }
            //     });
            //   }
            // });
          }
        })
        .catch(err => reject(err))
      });
    },

    verifyPassword: (user, password, cb) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
      })
    },

    findOne: user => {
      return new Promise((resolve, reject) => {
        db.collection("users").get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            const existingUser = doc.data();
            let match = true;
            for (const key in user) {
              if (user[key] != existingUser[key]) {
                match = false;
              }
            }
            if (match === true) {
              resolve(existingUser);
            }
          })
          reject("No user found")
        })
      });
    },

    findById: function(id) {
      return new Promise((resolve, reject) => {
        db.collection('users').doc('' + id).get()
        .then((doc) => {
          if (doc.exists) {
            resolve(doc.data());
          } else {
            reject(null)
          }
        })
      })
    },

    save: user => {
      return new Promise((resolve, reject) => {
        db.collection("users").doc(user._id).set(user)
        resolve(user)
      })
    },

  };
};
