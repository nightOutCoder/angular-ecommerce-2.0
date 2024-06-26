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
  previousCategoryId: number = 1;
  serachMode: boolean = false;

  products: Product[] = [];

  // ne properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5; // try with 5 & 50
  theTotalElements: number = 0;


  constructor(private proudctService: ProudctService, private route: ActivatedRoute){
  }

  ngOnInit(){
    this.route.paramMap.subscribe(() =>{
      this.listProudcts();  
    });
  }

  listProudcts(){
    // check if 'keyword' parameter is available
    const serachMode: boolean = this.route.snapshot.paramMap.has('keyword');
    if(serachMode){
      this.handleSearchProudcts();
    } else {
      this.handleListProudcts();
    }
  }

  handleListProudcts(){
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

    // check if we have a different category than previous
    // Note - Angular will reuse a component if it is currently being viewed
    //

    // If we have a different category id than previous
    // the set thePageNumber back to 1

    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    /*Old Function*/
    // this.proudctService.getProudctList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )


    // here we setting -1 to pageNumber becuase in Spring data rest: pages are 0 based but in angular zero based
    this.proudctService.getProductistPaginate(this.thePageNumber-1, this.thePageSize,this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1; // pages are 0 based in spring data rest 
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    )
  }

  handleSearchProudcts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.proudctService.searchProducts(theKeyword).subscribe(
    data => {
      this.products = data;
    }  
    );
  }

  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProudcts();
  }
}
