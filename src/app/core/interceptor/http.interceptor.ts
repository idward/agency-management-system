import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from "rxjs/Observable";

export class BasicHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newRequest = req.clone({
      headers: req.headers.set('Content-Type','application/json')
    });
    return next.handle(newRequest);
  }
}
