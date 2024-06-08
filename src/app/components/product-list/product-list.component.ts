import { Component, OnInit } from '@angular/core';
import { ProudctService } from '../../service/proudct.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-product-list',
  //templateUrl: './product-list.component.html',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  constructor(private proudctService: ProudctService){
  }

  ngOnInit(){
    this.listProudcts();  
  }

  listProudcts(){
    this.proudctService.getProudctList().subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
