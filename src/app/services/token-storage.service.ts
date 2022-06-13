import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  public static accessTokenKey = "access-token";
  constructor() { }
  public saveAccessToken(accesstoken : string){
    window.sessionStorage.removeItem(TokenStorageService.accessTokenKey);
    window.sessionStorage.setItem(TokenStorageService.accessTokenKey, accesstoken)
  }
  public getToken(tokenKey : string): string | null {
    return window.sessionStorage.getItem(tokenKey);
  }
  signOut () : void {
    window.sessionStorage.clear();
  }
}
