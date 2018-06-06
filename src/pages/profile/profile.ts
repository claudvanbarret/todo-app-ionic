import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
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


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afs: AngularFirestore,
    private auth: AuthService) {
  }

  ionViewDidLoad() {
    this.todosLength = this.navParams.get('todosLength');
    this.todosCompletedLength = this.navParams.get('todosCompletedLength');
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
    console.log(name);
    try {
      const user = await this.auth.isLoggedIn();

      this.afs.doc<User>(`users/${user.uid}`)
          .update({'displayName': name})
          .then(() => {
            this.editName = false;
          });
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit(){
    this.retrieveUserData();
  }

}
