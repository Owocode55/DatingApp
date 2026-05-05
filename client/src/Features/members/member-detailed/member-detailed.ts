import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, OnInit,signal } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { Members } from '../../../types/Member';
import { AgePipe } from '../../../Core/pipes/age-pipe';
import { AccountService } from '../../../Core/services/account-service';
import { PresenceService } from '../../../Core/services/presence-service';
import { LikeService } from '../../../Core/services/like-service';

@Component({
  selector: 'app-member-detailed',
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed implements OnInit {
  private accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  protected presenceService = inject(PresenceService);
  private activeRouter = inject(ActivatedRoute);
  private router = inject(Router);
  protected title = signal<string | undefined>('Profile');
  protected member$? : Observable<Members>;
  protected likeService = inject(LikeService);
  //protected memberData = signal<Members | undefined>(undefined);
  private routeParameter = signal<string | null>(null);
  protected hasLiked = computed(()=>{
    return this.likeService.likeId().includes(this.routeParameter()!);
  })
  protected isCurrentUser = computed(()=>{
    return this.accountService.currentUser()?.id === this.routeParameter();
  })

   constructor(){
    this.activeRouter.paramMap.subscribe(param =>{
      this.routeParameter.set(param.get('id'));
    })
   }
  ngOnInit(): void {
    this.member$ = this.loadMember();
    // this.activeRouter.data.subscribe({
    //   next : data => this.memberData.set(data["member"])
    // })
    this.title.set(this.activeRouter.firstChild?.snapshot.title)

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(
      {
        next : ()=> {
          this.title.set(this.activeRouter.firstChild?.snapshot.title)
        }
      }
    )
  }

  toggleLike(tergetId : string){
    this.likeService.likeMembers(tergetId);
  }
    
  loadMember(){
    const id = this.routeParameter()//this.activeRouter.snapshot.paramMap.get("id");
    if(!id) return;

    return this.memberService.getMember(id);
  }
}


