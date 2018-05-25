import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalDeletePage } from './modal-delete';

@NgModule({
  declarations: [
    ModalDeletePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalDeletePage),
  ],
})
export class ModalDeletePageModule {}
