import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signUp',
  templateUrl: 'signUp.html',
})
export class SignUpPage {
  signUpForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private fb: FormBuilder,
    private auth: AuthService,
    private menuCtrl: MenuController,
    private toastService: ToastService,
  ) { }

  ionViewWillLoad(): void {
    this.createSignUpLogin();
  }

  ionViewDidEnter(){
    this.menuCtrl.swipeEnable(false);
  }

  createSignUpLogin(){
    this.signUpForm = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
			confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
		});
  }

  signUp() {
    let data = this.signUpForm.value;
    if(data.password !== data.confirmPassword) {
      this.toastService.create("The passwords you entered don't match");
      return;
    }
		let credentials = {
			email: data.email,
			password: data.password
    };
    
    this.auth.signUp(credentials)
      .then((data) => {
        this.auth.updateUserData(data.user);
        this.navCtrl.setRoot('HomePage');
        this.menuCtrl.swipeEnable(true);
      });
  }
}
