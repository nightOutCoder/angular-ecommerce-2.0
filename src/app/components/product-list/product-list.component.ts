import { Component, OnInit } from '@angular/core';
import { ProudctService } from '../../service/proudct.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  currentCategoryId: number = 1;

  products: Product[] = [];
  constructor(private proudctService: ProudctService, private route: ActivatedRoute){
  }

  ngOnInit(){
    this.route.paramMap.subscribe(() =>{
      this.listProudcts();  
    });
  }

  listProudcts(){

    // check if 'id' parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //Get id and convert to number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // no category available. setting default to 1
      this.currentCategoryId = 1;
    }
    this.proudctService.getProudctList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }

}
