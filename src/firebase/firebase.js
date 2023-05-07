// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {GoogleAuthProvider, browserLocalPersistence, indexedDBLocalPersistence} from 'firebase/auth';
import {getFirestore,initializeFirestore,persistentLocalCache,persistentMultipleTabManager} from '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};
//process.env.REACT_APP_SECRET_NAME
// Initialize Firebase

export const app = initializeApp(firebaseConfig);
initializeFirestore(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  localCache: persistentLocalCache(
    /*settings*/ {tabManager: persistentMultipleTabManager()}
  ),
});
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
