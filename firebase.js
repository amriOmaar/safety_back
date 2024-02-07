// firebase.js
const admin = require("firebase-admin");

const serviceAccount = require("./safety-338e7-firebase-adminsdk-dh2gg-1f595271ad.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.messaging();
