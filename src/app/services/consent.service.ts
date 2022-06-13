import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ConsentService {

  private scopesUrl = "http://localhost:8080/api/v1/scopes";
  private authorizationCodeUrl = "http://localhost:8080/api/v1/consent?clientId=";
  private exchangeTokenUrl = "http://localhost:8080/api/v1/token"
  constructor(private http: HttpClient) {}
  getScopes(clientId : string){
    return this.http.get(this.scopesUrl + "?clientId=" + clientId, {observe: 'response'});
  }

  getAuthorizationCode(clientId : string, scopes : any) {
    return this.http.post(this.authorizationCodeUrl + clientId, JSON.stringify(scopes), {
      headers : {
        'Content-Type': 'application/json'
      }, observe : 'response',
      responseType : 'text'
    })
  }

  exchangeToken(request : any){
    return this.http.post(this.exchangeTokenUrl, JSON.stringify(request), {headers : {
      'Content-Type': 'application/json'
    }, observe : 'response'});
  }
}
