import {Inject, Injectable, Injector} from "@angular/core";
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {Observable, Operator} from "rxjs/Rx";
import {AuthenticationService} from "../auth/authentication.service";

@Injectable()
export class BasicHttpInterceptor implements HttpInterceptor {
  intercept(req:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>> {
    const newRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        // 'Authorization': token
      }
    });
    return next.handle(newRequest).do((event:HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        console.log('sucessfully acess!');
      }
    }, (err:any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          //navigate the user to login route
          //remove the token from localstorage
        }
      }
    });
  }
}
