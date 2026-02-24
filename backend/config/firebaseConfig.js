const admin = require("firebase-admin");
const serviceAccount = require("../firebaseServiceAccountKey.json"); // Add your Firebase private key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL, // Optional: If using Firestore
});

module.exports = admin;
