import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService= inject(AccountService);
  const toast = inject(ToastService)

  console.log("currentUser" , accountService.currentUser());

  if(accountService.currentUser()) return true;
   
  toast.error("Unathorize access");
  return false;
};
