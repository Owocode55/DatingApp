import { Injectable } from '@angular/core';
import { ConfirmDialog } from '../../Shared/confirm-dialog/confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private dialogComponent? : ConfirmDialog


  register(component : ConfirmDialog){
    this.dialogComponent = component;
  }

   confirm(message="are you sure you want to delete?"): Promise<boolean>{
     if(!this.dialogComponent){
      throw new Error("Confirm dialog not registered")
     }

     return this.dialogComponent.open(message);
   }
}
