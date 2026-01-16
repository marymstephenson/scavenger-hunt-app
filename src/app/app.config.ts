import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 1. Add these two imports at the top
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDNia1K0bycc5-dlpL9qNTgg0kBdMpJezQ",
  authDomain: "al-thespian-hunt.firebaseapp.com",
  projectId: "al-thespian-hunt",
  storageBucket: "al-thespian-hunt.firebasestorage.app",
  messagingSenderId: "56866930252",
  appId: "1:56866930252:web:f77c8ea42060f9fb67ff29"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // 2. Add these two lines here to "activate" Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
};