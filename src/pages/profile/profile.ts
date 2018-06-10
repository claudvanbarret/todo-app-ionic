import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastService } from '../../services/toast.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {
  user$: Observable<User>;
  todosLength: number;
  todosCompletedLength: number;
  editName: boolean = false;
  private loader: Loading;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastService: ToastService,
    private afs: AngularFirestore,
    private auth: AuthService,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    
  }

  async retrieveUserData(): Promise<void>{
    try {
      const user = await this.auth.isLoggedIn();
      this.user$ = this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    } catch (error) {
      console.error(error);
    }
  }

  async updateName(name: string){
    this.presentLoading();
    try {
      const user = await this.auth.isLoggedIn();

      this.afs.doc<User>(`users/${user.uid}`)
          .update({'displayName': name})
          .then(() => {
            this.loader.dismiss();
            this.toastService.create('The name has been successfully updated.')
            this.editName = false;
          }).catch(() => {
            this.toastService.create('The name can not be updated.')
            this.editName = false;
            this.loader.dismiss();
          });
    } catch (error) {
      console.error(error);
    }
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }

  ngOnInit(){
    this.retrieveUserData();
  }

}
