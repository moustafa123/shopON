import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db: AngularFireDatabase ) { }

  getAll() {
    this.db.list('categories').snapshotChanges().subscribe(users =>{
      console.log('users: ', users );
    });
    return this.db.list('/categories', ref => ref.orderByChild('name')).snapshotChanges();
  }
}



