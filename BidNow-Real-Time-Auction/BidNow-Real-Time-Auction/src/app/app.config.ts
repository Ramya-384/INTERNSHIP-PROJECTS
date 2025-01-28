import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom([]),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'bid-now-ef053',
        appId: '1:167797362707:web:e575331177c67e9082efe6',
        storageBucket: 'bid-now-ef053.firebasestorage.app',
        apiKey: 'AIzaSyA5eY5Zd_p0SKNHter2jpoxlnGCgct0a-w',
        authDomain: 'bid-now-ef053.firebaseapp.com',
        messagingSenderId: '167797362707',
        measurementId: 'G-Q4ZCVDGWDM',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
  ],
};