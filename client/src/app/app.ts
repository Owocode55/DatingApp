import { HttpClient } from '@angular/common/http';
import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Nav } from '../Layout/nav/nav';
import { AccountService } from '../Core/services/account-service';
import { Home } from "../Features/home/home";
import { User } from '../types/user';
import { ConfirmDialog } from "../Shared/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Nav, RouterOutlet, ConfirmDialog],
})
export class App {
  protected router = inject(Router);
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  protected readonly title = signal('Dating App');
  protected members = signal<User[]>([]);
  
//not neede also
  // ngOnInit(): void {
  //   this.setCurrentUser();
  //   this.http.get<User[]>('https://localhost:5001/api/members').subscribe({
  //     next: (response) => this.members.set(response),
  //     error: (error) => console.log(error),
  //     complete: () => console.log('Completed http request'),
  //   });
  // }
// not needed any more this is done in app.config.ts
  // setCurrentUser() {
  //   const user = localStorage.getItem('user');
  //   if (!user) return;

  //   this.accountService.currentUser.set(JSON.parse(user));
  // }

  //Another approach
  //this.members.set(await getMembers)
  //Not needed here also
  async getMembers() {
    try {
      return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
