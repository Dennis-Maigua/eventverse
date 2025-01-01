import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "my-apps-f9116.firebaseapp.com",
    projectId: "my-apps-f9116",
    storageBucket: "my-apps-f9116.firebasestorage.app",
    messagingSenderId: "55140563277",
    appId: "1:55140563277:web:42847543de8cb0064c9f04",
    measurementId: "G-X8E2HMKLDM"
};

export const app = initializeApp(firebaseConfig);