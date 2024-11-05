import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "willguard-18181.firebaseapp.com",
    projectId: "willguard-18181",
    storageBucket: "willguard-18181.appspot.com",
    messagingSenderId: "813590251813",
    appId: "1:813590251813:web:5add320010e34a3bdd72cc"
};

export const app = initializeApp(firebaseConfig);