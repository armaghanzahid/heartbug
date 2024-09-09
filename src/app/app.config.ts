import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'heartbug-b1b52',
        appId: '1:797977456212:web:328189ab920297c7f187c1',
        storageBucket: 'heartbug-b1b52.appspot.com',
        apiKey: 'AIzaSyDic6Zcb-78vIvwvyXIRRyuRgXad4jZNYU',
        authDomain: 'heartbug-b1b52.firebaseapp.com',
        messagingSenderId: '797977456212',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
