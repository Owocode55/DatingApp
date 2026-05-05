import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../Core/services/admin-service';
import { User } from '../../types/user';
import { AccountService } from '../../Core/services/account-service';
import { UserManagement } from "../user-management/user-management";
import { PhotoManagement } from "../photo-management/photo-management";

@Component({
  selector: 'app-admin',
  imports: [UserManagement, PhotoManagement],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin  {
  

  accountService = inject(AccountService)
  activeTab = "photos"

  tabs = [
    {label : "Photo mamnagement" , value : "photos"},
    {label : "Roles management" , value : "roles"}
  ]



  setTab(tab : string){
    this.activeTab = tab
  }

 
}
