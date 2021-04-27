/*
	This database is a little strange because this project was originally
	designed to work with mongoDB/mongoose. However, mLab abruptly stopped
	supporting Heroku, so I had to switch database providers. I decided it
	was easiest to just convert to firebase. It is what it is.
*/

const admin = require('firebase-admin');

// init database
if (process.env.NODE_ENV === 'production') {
    admin.initializeApp({ credential: admin.credential.cert({
        project_id: process.env.project_id,
        type: process.env.type,
        private_key_id: process.env.private_key_id,
        private_key: process.env.private_key.replace(/\\n/g, '\n'),
        client_email: process.env.client_email,
        client_id: process.env.client_id,
        auth_uri: process.env.auth_uri,
        token_uri: process.env.token_uri,
        auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
        client_x509_cert_url: process.env.client_x509_cert_url,
    })})
} else {
    const sdk = require('./firebase-adminsdk.json');
    admin.initializeApp({ credential: admin.credential.cert(sdk) })
}
const db = admin.firestore();

// export
module.exports = {
  User: require('./User')(db),
  Game: require('./Game')(db),
};
