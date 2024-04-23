import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAb7yaJdv0YTIaTMo7k1Mo0_TS_DSxwuCg",
    authDomain: "colam-apps.firebaseapp.com",
    databaseURL: "https://colam-apps-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "colam-apps",
    storageBucket: "colam-apps.appspot.com",
    messagingSenderId: "308160185299",
    appId: "1:308160185299:web:d47b10e7aa7974ea3a2526"
};


export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = initializeAuth(app);