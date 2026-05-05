import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastService } from './toast-service';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr'
import { User } from '../../types/user';
import { email } from '@angular/forms/signals';
import { Message } from '../../types/Message';


@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private toastService = inject(ToastService);
  onlineUsers = signal<string[]>([]);
  hubConnection ?: HubConnection;

  createHubConnection(user :User){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'presence' , {accessTokenFactory : () => user.token})
    .withAutomaticReconnect().build();

    this.hubConnection.start().catch(error => console.log(error))

    this.hubConnection.on("UserOnline", email => {
      this.onlineUsers.update(users => [...users , email])
    })

    this.hubConnection.on("UserOffline" , email => {
      this.onlineUsers.update(users => users.filter(u => u !== email));
    })

    this.hubConnection.on("GetOnlineUsers", users => {
      this.onlineUsers.set(users);
    })

    this.hubConnection.on("NewMessageRecieved" , (message : Message) =>{
      this.toastService.info(message.senderDisplayName + " sent you a new message",10000, message.senderImageUrl , `/member/${message.senderId}/messages`);
    })
  }
  
  stopHubConnection(){
    if(this.hubConnection?.state === HubConnectionState.Connected){
      this.hubConnection.stop().catch(error => console.log(error))
    }
  }
  
}
