import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { 
  AngularFirestoreCollection, 
  AngularFirestoreDocument, 
  AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { TodoModel } from '../../models/todo.model';
import { CategoryModel } from '../../models/category.model';

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

  private categoryCollection: AngularFirestoreCollection<CategoryModel>;
  private categoryDoc: AngularFirestoreDocument<CategoryModel>;
  categories: Observable<CategoryModel[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
  }

  ionViewDidLoad(): void {
    this.todoParams = this.navParams.get('todo');
    if (this.todoParams) this.todo = this.todoParams;
  }

  ionViewWillLoad(): void {
    this.retrieveCategories();
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

  async retrieveCategories(): Promise<void> {
    try {
      this.categoryCollection = this.afs.collection<CategoryModel>('categories');
      this.categories = this.categoryCollection.valueChanges();
    } catch (error) {
      console.error(error);
    }
  }
}
