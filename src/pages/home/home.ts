import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { TodoListComponent } from '../../components/todo-list/todo-list';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  entryComponents: [TodoListComponent]
})
export class HomePage implements OnInit {
  user$: Observable<User>;
  list: string;
  today: string;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private afs: AngularFirestore,
    private auth: AuthService,
    private datePipe: DatePipe  
  ) { }

  async retrieveUserData(): Promise<void>{
    try {
      const user = await this.auth.isLoggedIn();
      this.user$ = this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit(){
    this.list = 'today';
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.retrieveUserData();
  }
}
