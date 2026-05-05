import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Message } from '../../types/Message';
import { PaginatedResult } from '../../types/PaginatedResponse';
import { AccountService } from './account-service';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
   baseURL = environment.baseUrl;
   hubUrl = environment.hubUrl;

   private accountService = inject(AccountService);
   private hubConnection? : HubConnection;
   messessagThread = signal<Message[]>([]);
   httpClient = inject(HttpClient)

   CreateHubConnection(otherUser : string){
    const currentUser = this.accountService.currentUser();
    if(!currentUser) return;
    this.hubConnection = new HubConnectionBuilder().
    withUrl(this.hubUrl +'messages?userId='+otherUser, {accessTokenFactory : ()=> currentUser.token}).withAutomaticReconnect().configureLogging(LogLevel.Debug).build()
    
    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on("RecieveMessagesThread", (messages : Message[]) =>{
      console.log(messages)
      this.messessagThread.set(messages.map(message => ({...message, isCurrentUserSender : message.senderId !== otherUser})))
    })

    this.hubConnection.on("NewMessages", (message : Message)=>{
      message.isCurrentUserSender = currentUser.id == message.senderId

      this.messessagThread.update(messages => [...messages, message]);
    })
  }

  StopConnectionHub(){
    if(this.hubConnection?.state === HubConnectionState.Connected){
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }

   getMessages(container : string, pageNumber : number, pageSize : number){
    let param = new HttpParams();
    param = param.append("container" , container);
    param = param.append("pageNumber" , pageNumber);
    param = param.append("pageSize" , pageSize);

    return this.httpClient.get<PaginatedResult<Message>>(this.baseURL +'messages', {params : param})
   }

   getMessageThread(memberId : string){
    return this.httpClient.get<Message[]>(this.baseURL + `messages/thread/${memberId}`)
   }

   createMessage(recipientId : string , content : string){
    //return this.httpClient.post<Message>(this.baseURL + 'messages' , {recipientId , content});
    return this.hubConnection?.invoke('SendMessages' , {recipientId , content});
   }
   

   deleteMEssage(messageId : string){
    return this.httpClient.delete(this.baseURL + 'messages/'+ messageId);
   }
}
