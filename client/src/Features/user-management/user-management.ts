import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AdminService } from '../../Core/services/admin-service';
import { User } from '../../types/user';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  @ViewChild("roleModal") roleModal! : ElementRef<HTMLDialogElement>
  private adminService = inject(AdminService);
  userList = signal<User[]>([]);
  selectedUser : User | null = null;
  avilableRoles = ['Member' , 'Moderator', 'Admin']

  ngOnInit(): void {
    this.loadUser();
  }
  loadUser() {
    this.adminService.getUserRoles().subscribe({
      next: (response) => {
        this.userList.set(response);
      },
    });
  }
 
  openModal(user : User){
    this.selectedUser = user;
    this.roleModal.nativeElement.showModal();
  }

  toggleRole(event : Event, role : string){
    if (!this.selectedUser) return;

    let checked = (event.target as HTMLInputElement).checked;

    if(checked){
      this.selectedUser.roles.push(role)
    }else{
      this.selectedUser.roles.filter(r => r !== role)
    }
  }

  updateRoles(){
    if(!this.selectedUser) return;
    this.adminService.updateRoles(this.selectedUser?.id , this.selectedUser?.roles).subscribe({
      next : roles => {
        this.userList.update(user => user.map(u => {
          if(u.id == this.selectedUser?.id) this.selectedUser.roles = roles;
          return u;
        }))
        this.roleModal.nativeElement.close();
      },
      error : error => console.log(error)
    })

  }

}
