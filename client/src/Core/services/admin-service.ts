import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../types/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private httpClient = inject(HttpClient);
  baseUrl = environment.baseUrl

  getUserRoles(){
    return this.httpClient.get<User[]>(this.baseUrl + 'admin/users-with-roles');
  }

  updateRoles(userId : string,roles : string[]){
    return this.httpClient.post<string[]>(this.baseUrl + `admin/edit-role/${userId}?roles=${roles}`, {})
  }

}
