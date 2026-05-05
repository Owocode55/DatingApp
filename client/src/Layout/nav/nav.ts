import { inject, Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../Core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../Core/services/toast-service';
import { themes } from '../theme';
import { BusyService } from '../../Core/services/busy-service';
import { HasRoles } from "../../Shared/directive/has-roles";

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive, HasRoles],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit  {

  protected accountService = inject(AccountService);
  protected toastService = inject(ToastService);
  private router = inject(Router);
  protected busyService = inject(BusyService);
  protected selectedTheme =signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;
  protected creds: any = {};
  protected isLoading = signal(false);
  
  ngOnInit(): void {
    this.selectedTheme.set(localStorage.getItem('theme') || 'light')
    document.documentElement.setAttribute('data-theme',this.selectedTheme());
  }
  
  setSelectedTheme(theme : string){
    this.selectedTheme.set(theme);
    localStorage.setItem("theme",theme);
    document.documentElement.setAttribute('data-theme',theme);
    const element = document.activeElement as HTMLDivElement;
    element?.blur();
  }

  handleClose(){
    const element = document.activeElement as HTMLDivElement;
    element?.blur();
  }
  
  login() {
    this.isLoading.set(true);
    this.accountService.login(this.creds).subscribe({
      next: (result) => {
        console.log(result);
        this.creds = {};
        this.toastService.success("login successful")
        this.router.navigateByUrl('/members');
      },
      error: (error) => {
        this.toastService.error(error.error);
        console.log(error.error);
        this.isLoading.set(false);
      },
      complete: ()=>{
        this.isLoading.set(false);
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
