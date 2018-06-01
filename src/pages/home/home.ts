import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { 
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { TodoModel } from '../../models/todo.model';
import { User } from '../../models/user.model';

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
})
export class HomePage implements OnInit {
  private todoCollection: AngularFirestoreCollection<TodoModel>;
  private todoDoc: AngularFirestoreDocument<TodoModel>;
  private loader: Loading;
  todos: Observable<TodoModel[]>;
  user$: Observable<User>;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private afs: AngularFirestore,
    public alertCtrl: AlertController,
    private auth: AuthService,
    public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad(): void {
    this.presentLoading();
    this.retrieveTodos()
      .then(() => {
        this.dismissLoading();
      }); 
  }

  async retrieveTodos(): Promise<void> {
    try {
      const user = await this.auth.isLoggedIn();
      if(user){
        this.todoCollection = await this.afs.collection<TodoModel>('todos', ref => ref.where('userUid', '==', user.uid));
        this.todos = await this.todoCollection.valueChanges();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async retrieveUserData(): Promise<void>{
    try {
      const user = await this.auth.isLoggedIn();
      this.user$ = this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    } catch (error) {
      console.error(error);
    }
  }

  goToEdit(): void{
    this.navCtrl.push('TodoEditPage');
  }

  markAsDone(todo: TodoModel): void{
    todo.done = true;
    this.updateTodo(todo);
  }

  async updateTodo(todo){
    try {
      this.todoDoc = this.afs.doc<TodoModel>(`todos/${todo.id}`);
      this.todoDoc.update(Object.assign({}, todo));
    } catch (error) {
      console.error(error);
    }
    
  }

  async deleteTodo(todo) {
    try {
      this.todoDoc = this.afs.doc<TodoModel>(`todos/${todo.id}`);
      this.todoDoc.delete();
    } catch (error) {
      console.error(error);
    }
  }

  showDeleteConfirm(todo) {
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to delete this?',
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteTodo(todo);
          }
        }
      ]
    });

    confirm.present();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }

  dismissLoading(){
    this.loader.dismiss();
  }

  ngOnInit(){
    this.retrieveUserData();
  }
}
