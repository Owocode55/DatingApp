import { Component , computed, inject, input } from '@angular/core';
import { Members } from '../../../types/Member';
import { RouterLink } from "@angular/router";
import { AgePipe } from '../../../Core/pipes/age-pipe';
import { LikeService } from '../../../Core/services/like-service';
import { PresenceService } from '../../../Core/services/presence-service';

@Component({
  selector: 'app-membercard',
  imports: [RouterLink, AgePipe],
  templateUrl: './membercard.html',
  styleUrl: './membercard.css',
})
export class Membercard {
   likeService = inject(LikeService);
   presenceService = inject(PresenceService);
   member = input.required<Members>();
   

   hasLiked = computed(()=>
    this.likeService.likeId().includes(this.member().id)
   )
   
   isOnline = computed(()=>
    this.presenceService.onlineUsers().includes(this.member().id)
  )

   toggleLike(event : Event){
    event.stopPropagation();
    this.likeService.likeMembers(this.member().id)
   }
}
