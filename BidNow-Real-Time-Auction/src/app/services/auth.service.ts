import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { catchError, from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  firestore = inject(Firestore);

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  register(
    email: string,
    username: string,
    password: string,
    role: 'Admin' | 'Auctioneer' | 'Bidder'
  ): Observable<void> {
    const createUserPromise = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then(
      (userCredential) => {
        console.log('User created:', userCredential.user);
        return updateProfile(userCredential.user, {
          displayName: username,
        }).then(() => {
          const userRef = doc(this.firestore, `users/${userCredential.user.uid}`);
          return setDoc(userRef, { username, email, role }).then(() => {
            if (this.isBrowser()) {
              localStorage.setItem('authToken', userCredential.user.refreshToken);
              localStorage.setItem('userRole', role);
              localStorage.setItem('userEmail', email);
              localStorage.setItem('userUsername', username);
            }
          });
        });
      }
    );

    return from(createUserPromise).pipe(
      map(() => {}),
      catchError((error) => {
        console.error('Registration Error:', error);
        throw error;
      })
    );
  }

  login(email: string, password: string): Observable<{ email: string; username: string; role: string } | null> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        const userRef = doc(this.firestore, `users/${user.uid}`);
        console.log('Fetching user from Firestore:', user.uid);
  
        return from(getDoc(userRef)).pipe(
          map((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data() as { role: string };
              const userInfo = {
                email: user.email || '',
                username: user.displayName || '',
                role: userData.role,
              };
  
              console.log('User logged in:', userInfo);
  
              if (this.isBrowser()) {
                localStorage.setItem('authToken', userCredential.user.refreshToken);
                localStorage.setItem('userRole', userData.role);
                localStorage.setItem('userEmail', user.email || '');
                localStorage.setItem('userUsername', user.displayName || '');
              }
  
              return userInfo;
            }
            console.warn('User document not found in Firestore');
            return null;
          })
        );
      }),
      catchError((error) => {
        console.error('Login Error:', error);
        throw error;
      })
    );
  }
  

  getCurrentUser(): Observable<{ email: string; username: string; role: string } | null> {
    if (this.isBrowser()) {
      const storedEmail = localStorage.getItem('userEmail');
      const storedUsername = localStorage.getItem('userUsername');
      const storedRole = localStorage.getItem('userRole');
  
      if (storedEmail && storedUsername && storedRole) {
        return new Observable((observer) => {
          observer.next({
            email: storedEmail,
            username: storedUsername,
            role: storedRole,
          });
          observer.complete();
        });
      }
    }
  
    return new Observable((observer) => {
      const user = this.firebaseAuth.currentUser;
      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        getDoc(userRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data() as { username: string; role: string };
              const currentUser = {
                email: user.email || '',
                username: userData.username || '',
                role: userData.role,
              };
  
              if (this.isBrowser()) {
                localStorage.setItem('userEmail', currentUser.email);
                localStorage.setItem('userUsername', currentUser.username);
                localStorage.setItem('userRole', currentUser.role);
              }
  
              observer.next(currentUser);
            } else {
              observer.next(null);
            }
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
          });
      } else {
        observer.next(null);
        observer.complete();
      }
    });
  }

  logout(): Observable<void> {
    return from(signOut(this.firebaseAuth)).pipe(
      map(() => {
        if (this.isBrowser()) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userUsername');
        }
      }),
      catchError((error) => {
        console.error('Logout Error:', error);
        throw error;
      })
    );
  }

  sendPasswordResetEmail(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.firebaseAuth, email)).pipe(
      catchError((error) => {
        console.error('Error sending password reset email:', error);
        throw error;
      })
    );
  }
}