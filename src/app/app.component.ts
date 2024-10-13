import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
///new///
import {  OnInit } from '@angular/core';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

////////
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'seat-res';
  ////////////////////////////////////
  ngOnInit(): void {
    (window as any).fbAsyncInit = () => {
      window.FB.init({
        appId: '896208515767854',
        cookie: true,
        xfbml: true,
        version: 'v2.7' // Use a valid version
      });
      window.FB.AppEvents.logPageView();
    };

    // Load the SDK
    ((d, s, id) => {
      const js = d.createElement(s) as HTMLScriptElement; // Cast to HTMLScriptElement
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      const fjs = d.getElementsByTagName(s)[0];
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }
  loginWithFacebook(): void {
    window.FB.login((response: any) => {
      if (response.authResponse) {
        console.log('Successfully logged in with Facebook!', response);
        this.sendAccessTokenToBackend(response.authResponse.accessToken);
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'email' });
  }

  sendAccessTokenToBackend(accessToken: string): void {
    // Here, send the access token to your backend API
    console.log('Access token:', accessToken);
    // You can now call a backend API to exchange this token
  }
  //////////////////////////////////////////////////////////
}
