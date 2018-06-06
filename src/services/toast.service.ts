import { Injectable } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
  toast: Toast;

  constructor(public toastCtrl: ToastController) { }

  create(message, duration = 3000, ok = false) {
    
    if (this.toast) {
      this.toast.dismiss();
    }

    this.toast = this.toastCtrl.create({
      message,
      duration: ok ? null : duration,
      position: 'top',
      cssClass: 'toast',
      showCloseButton: ok,
      closeButtonText: 'OK',
    });
    
    this.toast.present();
  }
}