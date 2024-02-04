import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, delay, map, of, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$!: Observable<firebase.default.User> | any;
  private isAuthenticatedValue: boolean = false;

  private isLocalStorageAvailable = typeof localStorage !== 'undefined';

  constructor(private afAuth: AngularFireAuth, private router : Router,
    private afs: AngularFirestore) {

      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );

 }

 getUserUid(): string | any {
  let uid = null;

  this.user$.subscribe((user: { uid: any; }) => {
    if (user) {
      uid = user.uid;
    }
  });

  return uid;
}

 private updateUserData(user: any): Promise<void> {
  const userRef = this.afs.doc(`users/${user.uid}`);
  const data = {
    uid: user.uid,
    email: user.email,
    // Add additional user data as needed
  };
  return userRef.set(data, { merge: true });
}

isAuthenticated(): Observable<boolean> {
  return this.user$.pipe(
    switchMap(user => of(!!user))
  );
}

isValidToken(): Observable<boolean> {
  return this.afAuth.idToken.pipe(
    take(1),
    switchMap(idToken => {
      if (idToken) {
        // Token exists, you can implement additional checks if needed
        return of(true);
      } else {
        // Token doesn't exist or is invalid
        return of(false);
      }
    })
  );
}

 saveToken(token: string): void {
  if (this.isLocalStorageAvailable) {
    localStorage.setItem('token', token);
  } else {
    // Handle the case where localStorage is not available
    alert('localStorage is not available');
  }
}

 getUserData(userId: string): Observable<any> {
  return this.afs.collection('users').doc(userId).valueChanges();
}


isUserLoggedIn() {
  const user = JSON.parse(localStorage.getItem(this.user$)!);
  return user !== null ? true : false;
}

get currentUser(): any {
  return this.afAuth.currentUser;
}

getCurrentUser(): Observable<any> {
  return this.user$;
}

async login(email: string, password: string): Promise<void> {
  try {
    const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
    this.updateUserData(credential.user);
    this.router.navigate(['/home']); // Replace with your desired route
  } catch (error) {
    console.error('Login Error:', error);
    // Handle error (e.g., display error message)
  }
}

  async signIn(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/home']); // Navigate to the dashboard after successful sign-in
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle error (e.g., show error message to the user)
    }
  }

  saveUserData(userId: string, userData: any): Promise<void> {
    return this.afs.collection('users').doc(userId).set(userData);
  }

  signUp(email: string, password: string, name: string, phone: string, city: string): Promise<void> {
      // Step 1: Create user in Firebase Authentication
      return this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          // Step 2: Save additional user data in Firestore
          const userId = result.user?.uid;

          if (userId) {
            const userData = {email, userId, name, phone, city};

            return this.saveUserData(userId, userData);
          } else {
            throw new Error('User ID not available in sign-up result.');
          }
        })
        .then(() => {
          // Step 3: Redirect or perform other actions on successful sign-up
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          // Handle sign-up error
          alert('Sign-up error:'+{error});
          throw error; // Re-throw the error for the component to handle
        });
    }

  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
      alert("You have signed out.");
      this.router.navigate(['/login']); // Navigate to the login page after successful sign-out
    } catch (error) {
      console.error('Error signing out:', error);
      // Handle error (e.g., show error message to the user)
    }
  }

  getCurrentUserSnapshot(): any {
    return this.afAuth.currentUser;
  }
}
