import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { count } from 'rxjs';
import { FormServiceService } from '../../services/form-service.service';


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
  }

  onSubmit() {
    console.log('Handing submit Button');
    console.log(this.checkoutFormGroup?.get('customer')!.value);
    console.log(`Email is -> ${this.checkoutFormGroup?.get('customer')!.value.email}`);

    console.log(`Shipping Address : ${this.checkoutFormGroup?.get('shippingAddress')!.value}`);
    console.log(`Billing Address : ${this.checkoutFormGroup?.get('billingAddress')!.value}`);
  }

  copyShippingAddressToBillingAddress(event: any){

    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
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
}
