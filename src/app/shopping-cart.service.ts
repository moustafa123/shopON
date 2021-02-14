import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Product } from './models/product';
import 'rxjs/add/operator/take';
import { ShoppingCart } from './models/shopping-cart';
import { ShoppingCartItem } from './models/shopping-cart-item';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create() {
    return this.db.list('/shopping-cart').push({
      dateCreated: new Date().getTime()
    });
  }

  public async getCart(): Promise<Observable<ShoppingCart>>  {
    let cartId = await this.getOrCreateCartId();
    console.log('CART ID: ', cartId);
    console.log('DB OBJECT: ', this.db.object('/shopping-cart/' + cartId));
    this.db.object('/shopping-cart/' + cartId).valueChanges().subscribe(x => console.log('X:', x));
    return this.db.object('/shopping-cart/' + cartId).valueChanges().pipe(map((shoppingCart: {items: {[productId: string]: ShoppingCartItem}}) => new ShoppingCart(shoppingCart.items))

    );
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-cart/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) {
      return cartId;
    }
    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  public async addToCart(product: Product){
    this.updateItem(product, 1, 1);
    console.log("Hello");
  }

  public async removeFromCart(product: Product) {
    this.updateItem(product, -1, 0);
  }

  public async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-cart/' + cartId + '/items').remove();
  }

  private async updateItem(product: Product, numChange: number, numFix: number) {
    console.log("Hello");
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.key);

    item$
    .valueChanges()
    .take(1)
    .subscribe((item: any) => {
      if(item && item.quantity == 1 && (numChange + numFix < 0) ){
        item$.remove();
        return;
      }
      if(item){
    
        item$.update({ quantity: item.quantity + numChange });
      } 
      else{
        item$.update({title: product.title,
                      imageUrl: product.imageUrl,
                      price: product.price, 
                      quantity: numFix });
      } 
    });
  }
}
