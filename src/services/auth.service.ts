import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/user.model';
import { first } from 'rxjs/operators';

@Injectable()
export class AuthService {

	constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
		afAuth.authState.subscribe(user => {

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

	isLoggedIn() {
		return this.afAuth.authState.pipe(first()).toPromise();
	}

	async updateUserData(user){

		const doc = await this.docExists(`users/${user.uid}`);
		if(!doc) {
			const userRef =  this.afs.doc(`users/${user.uid}`);

			const data: User = {
				uid: user.uid,
				email: user.email,
				photoURL: user.photoURL,
				displayName: user.displayName
			}

			return userRef.set(data);
		}
	}

	docExists(path: string) {
		return this.afs.doc(path).valueChanges().pipe(first()).toPromise()
	}
}