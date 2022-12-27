importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSyAKTyJuYvmVtF9PIxWDj3fnQm8mcfQVE-8",
    authDomain: "pwa-app-service.firebaseapp.com",
    projectId: "pwa-app-service",
    storageBucket: "pwa-app-service.appspot.com",
    messagingSenderId: "93359140602",
    appId: "1:93359140602:web:1a9aafd112c03ec99d2343",
    measurementId: "G-6NEK4VY4S7",
});
const messaging = firebase.messaging();