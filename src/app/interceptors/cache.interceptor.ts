import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from "@angular/common/http";
import { of } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, { response: HttpResponse<any>, expireAt: number }>();

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.method !== "GET") {
      return next.handle(req);
    }

    const cached = this.cache.get(req.url);
    if (cached && cached.expireAt > Date.now()) {
      return of(cached.response);
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.url, {
            response: event,
            expireAt: Date.now() + 60000
          });
        }
      })
    );
  }
}
