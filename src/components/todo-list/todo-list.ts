import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { TodoModel } from '../../models/todo.model';
import { NavParams, NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';


/**
 * Generated class for the TodoListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'todo-list',
  templateUrl: 'todo-list.html'
})
export class TodoListComponent implements OnInit {
  private todoCollection: AngularFirestoreCollection<TodoModel>;
  private todoDoc: AngularFirestoreDocument<TodoModel>;
  private loader: Loading;
  todos$: Observable<TodoModel[]>;

  @Input() showButtonDone: boolean = true;
  @Input() done: boolean;
  @Input() deadline?: string;
  @Input() messageEmpty?: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private afs: AngularFirestore,
    private auth: AuthService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) { }

  async retrieveTodos(): Promise<void> {
    try {
      const user = await this.auth.isLoggedIn();
      
      if(user){
        this.todoCollection = await this.afs.collection<TodoModel>('todos', ref => {
          if(this.deadline) {
            return ref.where('userUid', '==', user.uid)
                      .where('done', '==', this.done)
                      .where('deadline', '==', this.deadline);
          } else {
            return ref.where('userUid', '==', user.uid).where('done', '==', this.done);
          }
        });

        this.todos$ = this.todoCollection.valueChanges();
      }
    } catch (error) {
      console.error(error);
    }
  }

  markAsDone(todo: TodoModel): void{
    todo.done = true;
    this.updateTodo(todo);
  }

  async updateTodo(todo): Promise<void>{
    try {
      this.todoDoc = this.afs.doc<TodoModel>(`todos/${todo.id}`);
      this.todoDoc.update(Object.assign({}, todo));
    } catch (error) {
      console.error(error);
    }
    
  }

  async deleteTodo(todo): Promise<void> {
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

  ngOnInit(){
    this.presentLoading();
    this.retrieveTodos()
      .then(() => {
        this.loader.dismiss();
      });
  }

}
