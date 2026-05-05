import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Members, UpdateMember } from '../../../types/Member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../Core/services/member-service';
import { AccountService } from '../../../Core/services/account-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../Core/services/toast-service';
import { TimeAgoPipe } from '../../../Core/pipes/time-ago-pipe';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, TimeAgoPipe,FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  private toast = inject(ToastService);
  protected accountService = inject(AccountService);
  private router = inject(ActivatedRoute);
  protected memberService = inject(MemberService);
  //protected member = signal<Members | undefined>(undefined);
  protected updateMember: UpdateMember = {
    description: '',
    displayName: '',
    city: '',
    country: '',
  };

  ngOnInit(): void {
    //This is to use the resolver to get member.
    // this.router.parent?.data.subscribe({
    //   next: (data) => this.member.set(data['member']),
    // });

    this.updateMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
    };
  }

  ngOnDestroy(): void {
    if (this.memberService.showMemberUpdateForm()) {
      this.memberService.showMemberUpdateForm.set(false);
    }
  }

  updateMemberDetails() {
    if (!this.memberService.member()) return;
    const currentUser = this.accountService.currentUser();
    const memberRecord = { ...this.memberService.member(), ...this.updateMember };
    this.memberService.updateMember(memberRecord).subscribe({
      next: () => {
        if(currentUser && currentUser.displayName !== memberRecord.displayName){
          currentUser.displayName = memberRecord.displayName;
          this.accountService.setCurrentUser(currentUser);

        }
        this.memberService.member.set(memberRecord as Members);
        this.toast.success('Member updated successfully');
        this.memberService.showMemberUpdateForm.set(false);
        this.editForm?.reset(memberRecord);
      },
    });
  }
}
