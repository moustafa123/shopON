import { Product } from './product';

export class ShoppingCartItem {
    key?: string;
    title: string;
    imageUrl: string;
    price: number;
    quantity: number;
    constructor(init?: Partial<ShoppingCartItem>) {
        Object.assign(this, init);
      //  console.log('PRODUCT: ', product);
       // console.log('QUANTITY: ', quantity);
    }

    get totalPrice() {
        return this.price * this.quantity; 
    }
}