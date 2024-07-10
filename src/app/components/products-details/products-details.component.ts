import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProudctService } from '../../service/proudct.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrl: './products-details.component.css'
})
export class ProductsDetailsComponent implements OnInit {

  product!: Product;

  constructor(private productService: ProudctService, private route: ActivatedRoute, private cartService: CartService){

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
      this.handleProductDetails();
    })
  }

  handleProductDetails(){
    // Get the id parm string. convert string to a number using the + symbol
    const theProductId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    );
  }

  addToCart(){
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }
}
