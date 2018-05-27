import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private afAuth: AngularFireAuth,
    private fb: FormBuilder
  ) { }

  ionViewWillLoad(): void {
    this.createFormLogin();
  }

  createFormLogin(){
    this.loginForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
  }

  signInWithEmailAndPassword() {
    let data = this.loginForm.value;
    
    this.afAuth.auth.signInWithEmailAndPassword(data.email, data.password)
      .then(res => { 
        console.log(res);
        this.navCtrl.setRoot('HomePage');
      });
  }
}
