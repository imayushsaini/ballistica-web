import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

const TOKEN_HEADER_KEY = 'x-access-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    let authReq = request;
    const token = this.token.getToken();
    
    // Only attach Authorization header to our backend API endpoints
    // Never send Authorization header to third-party endpoints (e.g. raw.githubusercontent.com, presigned S3 URLs) to prevent CORS preflight blocks
    const isApiEndpoint =
      request.url.includes('mods.69420555.xyz') ||
      request.url.includes('ballistica.workers.dev') ||
      request.url.includes('ballistica.net') ||
      request.url.startsWith('/v2/') ||
      request.url.startsWith('/api/');

    if (token != null && isApiEndpoint) {
      authReq = request.clone({
        setHeaders: { Authorization: 'Bearer ' + token },
      });
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
