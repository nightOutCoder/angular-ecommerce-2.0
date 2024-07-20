import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { count } from 'rxjs';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  constructor(private formBuilder: FormBuilder){
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
}
