import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../Core/services/message-service';
import { PaginatedResult } from '../../types/PaginatedResponse';
import { Message } from '../../types/Message';
import { Paginator } from '../../Shared/paginator/paginator';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmDialog } from '../../Shared/confirm-dialog/confirm-dialog';
import { ConfirmDialogService } from '../../Core/services/confirm-dialog-service';

@Component({
  selector: 'app-messages',
  imports: [Paginator, RouterLink, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {
  messageService = inject(MessageService);
  private confirmDialog = inject(ConfirmDialogService)
  pageNumber = 1;
  pageSize = 10;
  fetchContainer = 'Inbox';
  container = 'Inbox';
  paginatedMessages = signal<PaginatedResult<Message> | null>(null);
  tabs = [
    { Label: 'Inbox', Value: 'Inbox' },
    { Label: 'Outbox', Value: 'Outbox' },
  ];

  ngOnInit(): void {
    this.loadMessage();
  }

  setContainer(container: string) {
    this.container = container;
    this.pageNumber = 1;
    this.loadMessage();
  }

  loadMessage() {
    this.messageService.getMessages(this.container, this.pageNumber, this.pageSize).subscribe({
      next: (reponse) => {
        this.paginatedMessages.set(reponse);
        this.fetchContainer = this.container;
      },
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;

    this.loadMessage();
  }

  get isInbox() {
    return this.fetchContainer === 'Inbox';
  }
async confirmDelete(event : Event, id : string){
    event.stopPropagation();
    const ok = await this.confirmDialog.confirm("Are you sure you want to delete message?")

    if(ok) this.deleteMessage(id);
}

  deleteMessage(id : string){
    this.messageService.deleteMEssage(id).subscribe({
      next : () => {
         const current = this.paginatedMessages();

         if(current&& current.items.length > 0){
          this.paginatedMessages.update(prev => {
            if(!prev) return null;

            const newItem = prev.items.filter(x => x.id !== id) || [];

            return {
              items : newItem,
              metaData : prev.metaData
            }
          })
         }
      }
    })
  }
}
