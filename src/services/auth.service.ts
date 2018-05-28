import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
	private user: User;

	constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
		afAuth.authState.subscribe(user => {
			if(user) {
				this.updateUserData(user);
			}	
		});
	}

	signInWithEmail(credentials) {
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }
    
  signUp(credentials){
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
	}
	
	singOut(){
		return this.afAuth.auth.signOut();
	}

	private updateUserData(user){
		const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

		const data: User = {
			uid: user.uid,
			email: user.email,
			photoURL: user.photoURL,
			displayName: user.displayName
		}

		return userRef.set(data);
	}
}