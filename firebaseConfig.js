// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCji4lpk7VU-lHxpzBFXlzUIjJg_eNpP8E', // API Key, bunu Firebase Console'dan alabilirsiniz.
  authDomain: 'tirkanomalifirebase.firebaseapp.com', // Project ID'nizden türetilmiş authDomain.
  projectId: 'tirnakanomalifirebase', // Firebase Console'dan aldığınız Project ID.
  storageBucket: 'tirkanomalifirebase.appspot.com', // Project ID'nizle ilişkili storage bucket.
  messagingSenderId: '732226610963', // Firebase Console'dan alacağınız Sender ID.
  appId: '1:732226610963:android:f2b53334c1831045989ce6', // Firebase Console'dan alacağınız App ID.
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };