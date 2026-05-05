import { Injectable, inject } from '@angular/core';
import { AccountService } from './account-service';
import { of, tap } from 'rxjs';
import { LikeService } from './like-service';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);
  private likerService = inject(LikeService);

  init() {
    //const user = localStorage.getItem('user');
    console.log("Init service called")
    this.accountService.refreshToken().pipe(
      tap((userResp) => {
        
        if(userResp){
        this.accountService.currentUser.set(userResp);
        this.likerService.getLikeIds();
        this.accountService.refreshTokenTimer();
        }
        
      }),
    ).subscribe();

    //this.accountService.currentUser.set(JSON.parse(user));

    return of(null);
  }
}
