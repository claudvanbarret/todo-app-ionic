import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { 
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { TodoModel } from '../../models/todo.model';

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
export class HomePage {
  
  private todoCollection: AngularFirestoreCollection<TodoModel>;
  private todoDoc: AngularFirestoreDocument<TodoModel>;
  todos: Observable<TodoModel[]>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private afs: AngularFirestore,
    public alertCtrl: AlertController
  ) {
    
  }

  ionViewDidLoad(): void {
    this.retrieveTodos();
  }

  async retrieveTodos(): Promise<void> {
    try {
      this.todoCollection = this.afs.collection<TodoModel>('todos');
      this.todos = this.todoCollection.valueChanges();
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

  updateTodo(todo): void{
    this.todoDoc = this.afs.doc<TodoModel>(`todos/${todo.id}`);
    this.todoDoc.update(Object.assign({}, todo));
  }

  deleteTodo(todo): void {
    this.todoDoc = this.afs.doc<TodoModel>(`todos/${todo.id}`);
    this.todoDoc.delete();
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
}
