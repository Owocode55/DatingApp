import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { BusyService } from '../services/busy-service';
import { inject } from '@angular/core';
import { delay, finalize, identity, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
  const catche = new Map<string, HttpEvent<unknown>>();
export const loadInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService)



   const generateCatchKeys = (url : string, param : HttpParams): string =>{
     const paramString = param.keys().map(key =>`${key}=${param.get(key)}`).join('&');
      return paramString ? `${url}?${paramString}` : url
   }
    const catcheKey =  generateCatchKeys(req.url , req.params)
    console.log(req);
   if(req.method == "GET"){
      console.log('Catchkey' , catcheKey);
       const data = catche.get(catcheKey)
       if(data) return of(data)
   }

  

  busyService.busy();
  return next(req).pipe(
    environment.isProduction ? identity : delay(500),
    tap(response =>{
      if(req.method == "GET"){
        const catcheKey =  generateCatchKeys(req.url , req.params)
        catche.set(catcheKey , response)
      }
      else{
        catche.clear()
      }
    }),
    finalize(()=>{
      busyService.hiddle()
    })
  )
};
