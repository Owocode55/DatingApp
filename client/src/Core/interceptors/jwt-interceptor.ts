import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../services/account-service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  req = req.clone({
    headers :  new HttpHeaders({
      Authorization : "Bearer " + accountService?.currentUser()?.token
    })
  })

  return next(req);
};
