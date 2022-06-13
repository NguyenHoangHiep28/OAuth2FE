import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private clientNameUrl = "http://localhost:8080/api/v1/client";
  private loginUrl = "http://localhost:8080/api/v1/login";
  constructor(private http : HttpClient) { }
  getAppName(clientId : string){
    return this.http.get(this.clientNameUrl + `?clientId=${clientId}`, {observe: 'response', responseType: 'text'})
  }

  login(credential : object) {
    return this.http.post(this.loginUrl, credential, {headers : {
      'Content-Type': 'application/json'
    }, observe : 'response'})
  }

}
