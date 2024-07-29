import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { count } from 'rxjs';
import { FormServiceService } from '../../services/form-service.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];



  constructor(private formBuilder: FormBuilder, private formService: FormServiceService){
  }

  ngOnInit(){
    this.checkoutFormGroup = this.formBuilder.group({
        customer: this.formBuilder.group({
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          email: new FormControl('')
          }),

        shippingAddress: this.formBuilder.group({
          street: [''],
          city: [''],
          state: [''],
          country: [''],
          zipCode: ['']
          }),

        billingAddress: this.formBuilder.group({
          street: [''],
          city: [''],
          state: [''],
          country: [''],
          zipCode: ['']
          }),

        creditCard: this.formBuilder.group({
          cardType: [''],
          nameOnCard: [''],
          cardNumber: [''],
          securityCode: [''],
          expirationMonth: [''],
          expirationYear: ['']
          }),  
      });


      // populate credit card months
      const startMonth: number = new Date().getMonth() + 1; // adding 1 becuase months are zero based
      console.log(`startMonth : ` + startMonth);
      this.formService.getCreditCardMonths(startMonth).subscribe( data => {
        console.log(`Retrieved credit card months: ` + JSON.stringify(data));
        this.creditCardMonths = data;
      })

      // populate credit card years
      this.formService.getCreditCardYears().subscribe( data => {
        console.log(`Retrieved credit card years: `+ JSON.stringify(data));
        this.creditCardYears = data;
      });

      // populate countries

      this.formService.getCountries().subscribe(
        data => {
          console.log("Retrieved countries: " + JSON.stringify(data));
          this.countries = data;
        }
      )
  }

  onSubmit() {
    console.log('Handing submit Button');
    console.log(this.checkoutFormGroup?.get('customer')!.value);
    console.log("Email is ->"+ this.checkoutFormGroup?.get('customer')!.value.email);

    console.log(`Shipping Address : ${this.checkoutFormGroup.get('shippingAddress')?.value}`);
    console.log(`Billing Address : ${this.checkoutFormGroup.get('billingAddress')?.value}`);

    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
    
    
  }

  copyShippingAddressToBillingAddress(event: any){

    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //bug fix for states
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    const currentYear: number = new Date().getFullYear();

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if(currentYear == selectedYear){
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    } 

    this.formService.getCreditCardMonths(startMonth).subscribe(
      
      data => {
        console.log(data);
        console.log(`Retrieved credit card months: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    )

  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code : ${countryCode}`);
    console.log(`${formGroupName} country name : ${countryName}`);

    this.formService.getStates(countryCode).subscribe(
      data =>{
        if(formGroupName == 'shippingAddress'){
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    )
  }
}
