import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProudctService } from '../../service/proudct.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[]=[];

  constructor(private productService: ProudctService){
    
  }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories(){
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('pc' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }

}
