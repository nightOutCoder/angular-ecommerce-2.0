import { Injectable, numberAttribute } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItem: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  

  constructor() { 
  }

  addToCart(theCartItem: CartItem){

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem!: CartItem;  // we can assume that it will never fail and that we will never tyr to access it before initialization

    if(this.cartItem.length > 0 ){
    // find the item in the cart based on item id
      // for(let tempCartItem of this.cartItem){
      //   if(tempCartItem.id == theCartItem.id){
      //     existingCartItem = tempCartItem;
      //     break
      //   }
      // }

      existingCartItem = this.cartItem.find(tempCartItem => tempCartItem.id === theCartItem.id)!;

    // check if we found it 
    alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart){
      // increment the quantity
      existingCartItem.quantity++;
    } else {
      // just add the item to the array
      this.cartItem.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItem){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue +=currentCartItem.quantity;
    }

    // publish the new values. so all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number){
    for(let tempCardItem of this.cartItem){
      const subTotalPrice = tempCardItem.quantity * tempCardItem.unitPrice;
      console.log(`name: ${tempCardItem.name}, quantify=${tempCardItem.quantity}, unitPrice=${tempCardItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----------');
  }

  decrementQuantity(theCartItem: CartItem){
    theCartItem.quantity--;

    if(theCartItem.quantity == 0){
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem){
    // get index of item in the array
    const itemIndex = this.cartItem.findIndex(data => data.id == theCartItem.id);

    //if found remove the item from the array at given index
    if(itemIndex > -1){
      this.cartItem.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }
}
