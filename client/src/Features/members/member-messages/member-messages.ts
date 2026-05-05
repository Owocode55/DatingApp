import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { MessageService } from '../../../Core/services/message-service';
import { MemberService } from '../../../Core/services/member-service';
import { Message } from '../../../types/Message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../Core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../Core/services/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit, OnDestroy {
  @ViewChild('messageEndRef') messageEndRef! : ElementRef
  protected messageService = inject(MessageService);
  memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected presenceService = inject(PresenceService);
  //messages = signal<Message[]>([]);
  messageContent = '';

constructor(){
  effect(()=>{
    const currentMessage = this.messageService.messessagThread();

    if(currentMessage.length > 0){
      this.scrollToButtom();
    }
  })
}
  ngOnDestroy(): void {
    this.messageService.StopConnectionHub();
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
      next: param =>{
        const otherUserId = param.get('id')
        if(!otherUserId) return;
        this.messageService.CreateHubConnection(otherUserId);
      }
        
    })
  }

  loadMessages() {
    const memberId = this.memberService.member()?.id;
    if (memberId) {
      this.messageService.getMessageThread(memberId).subscribe({
        next : response => {
          //this.messages.set(response.map( message => ({...message , isCurrentUserSender : message.senderId !== memberId })));
        }
      });
    }
  }


  createMessage(){
  const recipientId = this.memberService.member()?.id;

  if(!recipientId) return;

  this.messageService.createMessage(recipientId , this.messageContent)?.then(()=>{
    this.messageContent = '';
  })
}

scrollToButtom(){
  setTimeout(()=>{
   if(this.messageEndRef){
      this.messageEndRef.nativeElement.scrollIntoView({behaviour : "smooth"});
  }
  })
  
}

}

