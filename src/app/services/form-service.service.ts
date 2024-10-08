import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  private countriesUrl = environment.ecommerce + '/countries';
  private statesUrl = environment.ecommerce + '/states';


  constructor(private httpClient: HttpClient) {
   }

   getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
   }

   getStates(theCountryCode: string): Observable<State[]> {
    //serach url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    )

   }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    // build an array for  Month dropdown list
    // start at current month and loop until 12th month

    for(let theMonth = startMonth; theMonth <=12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  
  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    // build an array for Year dropdown list
    // start at the current year and loop for next 10 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }
    
    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
