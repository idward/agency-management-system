import {Inject, Injectable, Injector} from "@angular/core";
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse} from '@angular/common/http';
import {Observable, Operator} from "rxjs/Rx";
import {AuthenticationService} from "../auth/authentication.service";

@Injectable()
export class BasicHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newRequest = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        // 'Authorization': token
      }
    });
    return next.handle(newRequest);
    // return Observable.create((observer:any) => {
    //   // setTimeout(() => {
    //     debugger;
    //     const authService = this.inj.get(AuthenticationService);
    //     observer.next(authService.getToken() || 'none');
    //     observer.complete();
    //   // });
    // })
    //   .mergeMap((authorization:string) => {
    //     const newRequest = req.clone({
    //       setHeaders: {
    //             'Content-Type': 'application/json',
    //             'Authorization': authorization
    //       }
    //     });
    //
    //     return next.handle(newRequest);
    //   });

    // this.authService = this._injector.get(AuthenticationService);
    // const newRequest = req.clone({
    //   setHeaders: {
    //     'Content-Type': 'application/json',
    //     'Authorization': this.authService.getToken()
    //   }
    // });
    // return next.handle(newRequest);
    // return next.handle(newRequest).do((event: HttpEvent<any>) => {
    //   if (event instanceof HttpResponse) {
    //     console.log('successfully acess!');
    //   }
    // }, (err: any) => {
    //   if (err.status === 401) {
    //     console.log('401');
    //   }
    // });
  }
}
