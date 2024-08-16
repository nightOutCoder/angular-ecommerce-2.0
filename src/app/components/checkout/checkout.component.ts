import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormServiceService } from '../../services/form-service.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Formvalidators } from '../../validators/formvalidators';
import { CartService } from '../../service/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';


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



  constructor(private formBuilder: FormBuilder, private formService: FormServiceService, private cartService: CartService, private checkoutService: CheckoutService, private router: Router){
  }

  ngOnInit(){

    this.reviewCartDetails();


    this.checkoutFormGroup = this.formBuilder.group({
        customer: this.formBuilder.group({
          firstName: new FormControl('', [Validators.required, Validators.minLength(2), Formvalidators.notOnlyWhitespace]),
          lastName: new FormControl('',[Validators.required, Validators.minLength(2), Formvalidators.notOnlyWhitespace]),
          email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Formvalidators.notOnlyWhitespace])
          }),

        shippingAddress: this.formBuilder.group({
          street: new FormControl('', [Validators.required, Validators.minLength(2), Formvalidators.notOnlyWhitespace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), Formvalidators.notOnlyWhitespace]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Formvalidators.notOnlyWhitespace])
          }),

        billingAddress: this.formBuilder.group({
          street: new FormControl('', [Validators.required, Validators.minLength(2), Formvalidators.notOnlyWhitespace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), Formvalidators.notOnlyWhitespace]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Formvalidators.notOnlyWhitespace])
          }),

        creditCard: this.formBuilder.group({
          cardType: new FormControl('', [Validators.required]),
          nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Formvalidators.notOnlyWhitespace]),
          cardNumber: new FormControl('', [Validators.required,Validators.pattern('[0-9]{16}')]),
          securityCode: new FormControl('', [Validators.required,Validators.pattern('[0-9]{3}')]),
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
  reviewCartDetails() {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
      }
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  onSubmit() {
    console.log('Handing submit Button');

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItem;

    //create orderItems from cartitems
    // - long way
    // let orderItems: OrderItem[] = [];
    // for(let i = 0 ; i< cartItems.length; i++){
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }

    //-short way of doing same thing
    let orderItems: OrderItem[] = cartItems.map(data => new OrderItem(data));

    // set up purchase
    let purchase = new Purchase();

    // populate purcase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderitems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via CheckOutServicde
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response =>{
        alert(`YOur Order has been received\n Order Tracking number ${response.orderTrackingNumber}`)
        
        //reset cart
        this.resetCart();
      },
      error: err => {
        alert(`There was an error : ${err.message}`);
      }
    });

    console.log(this.checkoutFormGroup?.get('customer')!.value);
    console.log("Email is ->"+ this.checkoutFormGroup?.get('customer')!.value.email);

    console.log(`Shipping Address : ${this.checkoutFormGroup.get('shippingAddress')?.value}`);
    console.log(`Billing Address : ${this.checkoutFormGroup.get('billingAddress')?.value}`);

    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
  }


  resetCart() {
    
    // reset cart data
    this.cartService.cartItem = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to products page
    this.router.navigateByUrl("/products");
  }

  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

    // Get shipping address controls
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street');}

  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city');}

  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state');}

  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country');}

  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  
  // Get billing address controls
  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street');}

  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city');}

  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state');}

  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country');}

  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode');}

  // Get credit card form controls
  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode');}


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
