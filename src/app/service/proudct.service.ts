import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProudctService {

  private baseUrl = 'http://localhost:8080/api/products'; //it return only records
  // private baseUrl = 'http://localhost:8080/api/products?size=100'; //it return 100 records
  

  constructor(private httpClient: HttpClient) { }

  getProudctList(): Observable<Product[]>{
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(map(response => response._embedded.products))
  }
}

interface GetResponse {
  _embedded: {
    products: Product[];
  }
}
