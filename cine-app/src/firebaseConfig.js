// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJ5B_nQ5VITYftTF02CaQz6SXO8FbrIdA",
  authDomain: "peliculas-9a667.firebaseapp.com",
  projectId: "peliculas-9a667",
  storageBucket: "peliculas-9a667.firebasestorage.app",
  messagingSenderId: "236752549058",
  appId: "1:236752549058:web:21e1f8ccf496b99f2a775b"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };