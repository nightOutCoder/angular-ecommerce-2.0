import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProudctService {

  private baseUrl = environment.ecommerce + '/products'; //it return only records
  // private baseUrl = 'http://localhost:8080/api/products?size=100'; //it return 100 records

  private categoryUrl = environment.ecommerce + '/product_category';
  

  constructor(private httpClient: HttpClient) { }

  getProudctList(theCategoryId: number): Observable<Product[]>{
    const searchURL = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchURL);
  }

  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(map(response => response._embedded.productCategory))
  }

  searchProducts(theKeyword: string): Observable<Product[]>{
    const searchURL = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchURL);
  }

  private getProducts(searchURL: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchURL).pipe(map(response => response._embedded.products));
  }

  getProduct(theProductId: number): Observable<Product> {
    // need to build the URL based on the product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductistPaginate(thePage: number, 
                        thePageSize: number, 
                        theCategoryId: number): Observable<GetResponseProduct>{
    // need to build the URL based on the product id, page and size
    const searchURL = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${thePageSize}`;
    console.log('123->', searchURL);
    return this.httpClient.get<GetResponseProduct>(searchURL);
  }

  serarchProductPaginate(thePage: number, 
                         thePageSize: number, 
                        theKeyword: string): Observable<GetResponseProduct>{
      // need to build the URL based on the product id, page and size
      const searchURL = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` + `&page=${thePage}&size=${thePageSize}`;
      return this.httpClient.get<GetResponseProduct>(searchURL);
  }
}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size : number, // size of the page
    totalElements : number, // Grand total in database 
    totalPages : number, // Total pages available
    number : number // Curent page number
  }
}


interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

