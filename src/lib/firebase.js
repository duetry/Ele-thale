import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBc_LxrOk9Yuz-aDX64iS425aCld2gAJN8",
  authDomain: "offergodown-9d928.firebaseapp.com",
  projectId: "offergodown-9d928",
  storageBucket: "offergodown-9d928.firebasestorage.app",
  messagingSenderId: "296941779640",
  appId: "1:296941779640:web:0bc9015f209bf12244d24d",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);