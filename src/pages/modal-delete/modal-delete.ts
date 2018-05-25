import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { 
  AngularFirestore,
  AngularFirestoreDocument } from 'angularfire2/firestore';
import { TodoModel } from '../../models/todo.model';

/**
 * Generated class for the ModalDeletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-delete',
  templateUrl: 'modal-delete.html',
})
export class ModalDeletePage {
  todo: TodoModel;
  private todoDoc: AngularFirestoreDocument<TodoModel>;
  constructor(
    private navParams: NavParams, 
    private view: ViewController,
    private afs: AngularFirestore
  ) { }

  closeModal(){
    this.view.dismiss();
  }

  ionViewWillLoad() {
    this.todo = this.navParams.get('todo');
  }

  delete(): void {
    this.todoDoc = this.afs.doc<TodoModel>(`todos/${this.todo.id}`);
    this.todoDoc.delete()
      .then(() => {
        this.view.dismiss();
      });
  }

}
