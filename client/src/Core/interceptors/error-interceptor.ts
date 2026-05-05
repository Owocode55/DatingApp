import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast-service';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  let toastService = inject(ToastService);
  let router = inject(Router);
  return next(req).pipe(catchError(error => {
    if(error){
     switch(error.status){
      case 400:
      if(error.error.errors){
        let modelStateError : any = [];
        for(let key in error.error.errors){
            if(error.error.errors[key])
              modelStateError.push(error.error.errors[key]);
        }
        throw modelStateError.flat();
      }else
        toastService.error(error.error);
      break;
     
     case 401:
      toastService.error("Unauthorized request");
      break;
     
      case 404:
        router.navigateByUrl("/not-found")
        break;

      case 500:
        const navigationExtras : NavigationExtras = {state : {error : error.error}};
        router.navigateByUrl("/server-error" , navigationExtras);
        break;
      
      default:
        toastService.error("Unexpected error")
        break;
     }
    }
    throw error;
  }))
};
