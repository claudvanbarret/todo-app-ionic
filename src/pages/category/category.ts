import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { 
  AngularFirestore,
  AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { CategoryModel } from '../../models/category.model';

/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  private categoryCollection: AngularFirestoreCollection<CategoryModel>;
  categories: Observable<CategoryModel[]>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private afs: AngularFirestore
  ) { }


  ionViewWillLoad(): void {
    this.retrieveCategories();
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
