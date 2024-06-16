import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProudctService {

  private baseUrl = 'http://localhost:8080/api/products'; //it return only records
  // private baseUrl = 'http://localhost:8080/api/products?size=100'; //it return 100 records

  private categoryUrl = 'http://localhost:8080/api/product_category';
  

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
}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  }
}


interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

