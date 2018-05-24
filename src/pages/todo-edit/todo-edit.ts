import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TodoModel } from '../../models/todo.model';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';

/**
 * Generated class for the TodoEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-todo-edit',
  templateUrl: 'todo-edit.html',
})
export class TodoEditPage {
  todo: TodoModel = new TodoModel();
  private todoParams: TodoModel;
  private todoCollection: AngularFirestoreCollection<TodoModel>;
  private todoDoc: AngularFirestoreDocument<TodoModel>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
  }

  ionViewDidLoad(): void {
    this.todoParams = this.navParams.get('todo');
    if (this.todoParams) this.todo = this.todoParams;
  }

  save(){
    if (!this.todo.id) {
      this.todo.id = this.afs.createId();
      this.todoCollection = this.afs.collection<TodoModel>('todos');
      this.todoCollection
        .doc(this.todo.id)
        .set(Object.assign({}, this.todo))
        .then(() => {
          this.navCtrl.pop();
        });
    } else {
      this.todo.done = false;
      this.todoDoc = this.afs.doc<TodoModel>(`todos/${this.todo.id}`);
      this.todoDoc.update(Object.assign({}, this.todo));
      this.navCtrl.pop();
    }
  }
}
