import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../Features/members/member-profile/member-profile';

export const saveUpdateMemberChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
  if(component.editForm?.dirty){
     return confirm("Are you sure you want to leave the page");
  }else{
 return true;
  }
 
};
