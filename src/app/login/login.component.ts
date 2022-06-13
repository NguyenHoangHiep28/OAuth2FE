import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error : string = "";
  clientId : string = "";
  returnUrl : string = "";
  appName : any = "";
  credential : any = {
    username : "",
    password : "",
    clientId : ""
  }
  constructor(private loginService : LoginService, private activatedRoute:ActivatedRoute, private tokenService : TokenStorageService, private router : Router) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params['clientId'];
      this.returnUrl = decodeURI(params['returnUrl']);
    })
   }

  ngOnInit(): void {
    this.getClientName();
  }

  getClientName() {
    this.loginService.getAppName(this.clientId).subscribe(res => {
      this.appName = res.body
    })
  }

  login() {
    this.credential.clientId = this.clientId;
    console.log(this.credential)
    this.loginService.login(this.credential).subscribe(res => {
      let body : any = res.body;
      console.log(res)
      this.tokenService.saveAccessToken(body.accessToken)
      window.location.href = this.returnUrl;
    }, err => {
      this.error = "true";
    })
  }

}
