import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { TodoListComponent } from '../../components/todo-list/todo-list';

@NgModule({
  declarations: [
    HomePage,
    TodoListComponent
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule {}
