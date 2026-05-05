import { HttpClient } from '@angular/common/http';
import { signal,inject,Injectable } from '@angular/core';
import { User, UserRegistration } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { PresenceService } from './presence-service';
import { HubConnectionState } from '@microsoft/signalr';
import { LikeService } from './like-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private presenceService = inject(PresenceService);
  private likeService = inject(LikeService);
  public currentUser = signal<User | null>(null);
  private baseUrl = environment.baseUrl;
  protected isLoading = signal(false);
  
  login(creds:any){
     return this.http.post<User>(this.baseUrl + 'account/login', creds , {withCredentials : true}).pipe(
      tap(user => {
          this.setCurrentUser(user)
          this.refreshTokenTimer();
      })
     )
  }

  register(creds: UserRegistration){
    return this.http.post<User>(this.baseUrl + 'account/register', creds ,  {withCredentials : true}).pipe(
      tap(user => {
          this.setCurrentUser(user)
          this.refreshTokenTimer()
      })
     )
  }


  refreshToken(){
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {} ,  {withCredentials : true});
  }
   
  refreshTokenTimer(){
    setInterval(() => {
       this.http.post<User>(this.baseUrl + 'account/refresh-token', {} ,  {withCredentials : true}).subscribe({
        next : user => this.setCurrentUser(user),
        error : error => this.logout()
       })
    }, 1 * 60 * 1000)
  }

  setCurrentUser(user : User){
    user.roles = this.getRolesFromToken(user);
    this.currentUser.set(user);
    if(this.presenceService.hubConnection?.state !== HubConnectionState.Connected){
      this.presenceService.createHubConnection(user);
    }

    //localStorage.setItem("user" , JSON.stringify(user));
  }

  logout(){

    this.http.post(this.baseUrl + 'account/logout' , {} , {withCredentials : true}).subscribe({
      next: ()=>{
          this.currentUser.set(null);
          this.presenceService.stopHubConnection();
          localStorage.removeItem("filters");
          this.likeService.likeId.set([]);
          
          
    //localStorage.removeItem("user");
      },
      error : error => {
         console.log(error);
      }
  })
   
  }

  getRolesFromToken(user : User) : string[]{
    const credential = user.token.split(".")[1];
    const  decoded = atob(credential);
    const jsondata = JSON.parse(decoded);
    return Array.isArray(jsondata.role) ? jsondata.role : [jsondata.role]

  }
}
