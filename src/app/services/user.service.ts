import { Injectable } from '@angular/core';
import { User, UserSettings } from '../models/user.model';
import { Observable, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<User> | any;
  auth: string | any;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection("users").doc(user.uid).valueChanges();
        } else {
          return new Observable<User>();
        }
      })
    );
    this.auth = getAuth();
  }

  signUp(user: User): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
      .then((credential) => {
        const userWithUid: User = {
          uid: user.uid,
          password: user.password,
          email: user.email,
          name: user.name,
          phone: user.phone,
          city: user.city,
          photoUrl: user.photoUrl,
        };

        return this.firestore.collection('users').doc(credential.user?.uid).set(userWithUid);
      });
  }

  getUid() {
    // Check if a user is signed in
    const user = this.auth.currentUser;

    if (user) {
      // User is signed in
      return user.uid;
    } else {
      // No user is signed in
      alert('No user signed in.');
      return null;
    }
  }

  updateUserSettings(uid: string, settings: UserSettings): Promise<void> {
    return this.firestore.collection("users").doc(uid).update({ settings });
  }

  getUser(uid: string): Observable<User> | any {
    return this.firestore.collection("users").doc(uid).valueChanges();
  }

  updateUser(uid: string, data: Partial<User>): Promise<void> {
    return this.firestore.collection("users").doc(uid).update(data)
  }
}
