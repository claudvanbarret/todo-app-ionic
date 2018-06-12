import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

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
    private toastService: ToastService,
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

  ionViewCanEnter(){
    this.auth.isLoggedIn()
      .then(user => {
        return user ? this.navCtrl.setRoot('HomePage') : true;
      }).catch(error => {
        return true;
      });
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
        this.toastService.create(error.message);
      });
  }

  goToSignUpPage(){
    this.navCtrl.push('SignUpPage');
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
