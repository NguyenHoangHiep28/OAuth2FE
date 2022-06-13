import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, of, throwError } from "rxjs";
import { TokenStorageService } from "./token-storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenStorageService, private router : Router) {}

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    // this.tokenService.signOut;
    //handle your auth error or rethrow
    this.tokenService.signOut();
    // if (err.status === 401) {
    //     //navigate /delete cookies or whatever
    //     this.router.navigate(['/login'], {queryParams: {applicationName : }});
        
    //     // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
    //     return of(err.message); // or EMPTY may be appropriate here
    // }
    return throwError(err);
}
  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    // Get the auth token from the service.
    const authToken = this.tokenService.getToken(TokenStorageService.accessTokenKey);
    let authReq = req;
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
        authReq = req.clone({
        headers: req.headers.set('Auth', `${authToken}`)
        });
    // send cloned request with header to the next handler.
    return next.handle(authReq).pipe(catchError(x=> this.handleAuthError(x)))
  }
}