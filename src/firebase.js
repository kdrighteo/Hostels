// Firebase config and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCeLTnNfBQllws0oo4qNHtCCHEYuYQKNG8",
  authDomain: "hostels-56680.firebaseapp.com",
  projectId: "hostels-56680",
  storageBucket: "hostels-56680.firebasestorage.app",
  messagingSenderId: "875835304031",
  appId: "1:875835304031:web:9cd6a141de190cfa9f93ea",
  measurementId: "G-T3Q83ZGD0Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }; 