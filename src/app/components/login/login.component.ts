import { Component, Inject, inject, OnInit } from '@angular/core';
import myAppConfig from '../../config/my-app-config';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, pkce } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  oktaSignIn: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth){
    this.oktaSignIn = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      //useClassicEngine: true,
      authParams: {
        pkce: true, // proof key for code exchange
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });

    console.log(this.oktaSignIn.baseUrl);
    console.log(this.oktaSignIn.clientId);
  }
  
  ngOnInit(): void {
    this.oktaSignIn.remove();

    this.oktaSignIn.renderEl({
      el: '#okta-sign-in-widget' //This is the 'id' mentioned in html. This name could be anything
    },
    (response: any) =>{
      if(response.status == 'SUCCESS'){
        this.oktaAuth.signInWithRedirect();
      }
    },
    (error: any) => {
      console.log('ttt', error);
      throw error;
    }
    );
  }
}
