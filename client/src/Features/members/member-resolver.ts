import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../../Core/services/member-service';
import { Members } from '../../types/Member';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Members> = (route, state) => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  const id= route.paramMap.get('id');

  if(!id) {
    router.navigateByUrl("/not-found");
    return EMPTY;
  }

  return memberService.getMember(id);
};
