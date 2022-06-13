import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsentService } from '../services/consent.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.css']
})
export class ConsentComponent implements OnInit {
  appName : string = "";
  accountName : string = "johnny"
  scopes : any;
  clientId : any;
  returnUri : any;
  request : any = {
    scopeIds : []
  }
  exchangeTokenRequest : any = {
    authCode : "",
    redirectUri : "",
    clientId : "",
    grantType : "authorization_code"
  }
  constructor(private consentService : ConsentService, private router : Router, private activatedRoute:ActivatedRoute, private tokenService : TokenStorageService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params['clientId'];
      this.returnUri = params['returnUri']
    })
    this.request.scopeIds = [];
   }

  ngOnInit(): void {
    console.log(this.router.url)
    this.getScopes();
  }

  cancel() {
    this.tokenService.signOut();
    window.location.href= this.returnUri
  }

  grantedAuthorities(){
    this.request.scopeIds = [];
    for(let i = 0; i < this.scopes.length; i++) {
      this.request.scopeIds.push(this.scopes[i].id);
    }
    // console.log(this.request)
    this.consentService.getAuthorizationCode(this.clientId, this.request).subscribe(res => {
      this.exchangeTokenRequest.authCode = res.body;
      this.exchangeTokenRequest.redirectUri = this.returnUri;
      this.exchangeTokenRequest.clientId = this.clientId;
      console.log(this.exchangeTokenRequest)
      this.consentService.exchangeToken(this.exchangeTokenRequest).subscribe((res:any) => {
        let token = this.tokenService.getToken(TokenStorageService.accessTokenKey);
        let userId = "";
        if (token) {
          userId = token.toString().split(".")[0];
        }
        let body = res.body;
        this.tokenService.signOut();
        window.location.href= this.returnUri + `?token=${body.jwtAccessToken}&userId=${userId}`;
      })
    }, err => {
      console.log(err);
    })
  }

  getScopes() {
    this.scopes = this.consentService.getScopes(this.clientId).subscribe((res) => {
      let body : any = res.body;
      this.scopes = body.scopes;
      this.appName = body.applicationName;
      // console.log(res.body)
    }, err => {
      if (err.status === 401) {
        //navigate /delete cookies or whatever

        this.router.navigate(['/login'], {queryParams: {clientId : err.error, returnUrl : window.location.href}});
    }
    })
  }
}
