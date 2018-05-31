import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface Password {
  type: string;
  icon: string;
  show: boolean;
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  password: Password;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private auth: AuthService,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private menuCtrl: MenuController
  ) { }

  ionViewWillLoad(): void {
    this.password = {
      type: 'password',
      icon: 'eye-off',
      show: false
    }
    this.createFormLogin();
  }

  ionViewDidEnter(){
    this.menuCtrl.swipeEnable(false);
  }

  createFormLogin(){
    this.loginForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
		});
  }

  signInWithEmailAndPassword() {
    let data = this.loginForm.value;

    let credentials = {
			email: data.email,
			password: data.password
		};
    
    this.auth.signInWithEmail(credentials)
      .then(res => { 
        this.navCtrl.setRoot('HomePage');
        this.menuCtrl.swipeEnable(true);
      })
      .catch(error => {
        this.presentToast(error.message);
      });
  }

  goToSignUpPage(){
    this.navCtrl.push('SignUpPage');
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: 'toast'
    });
    toast.present();
  }

  showHidePassword(){
    if(!this.password.show){
      this.password = {
        type: 'text',
        icon: 'eye',
        show: true
      }
    } else {
      this.password = {
        type: 'password',
        icon: 'eye-off',
        show: false
      }
    }
  }
}
