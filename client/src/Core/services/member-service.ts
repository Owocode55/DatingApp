import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AccountService } from './account-service';
import { environment } from '../../environments/environment';
import { MemberParam, Members, Photo, UpdateMember } from '../../types/Member';
import { tap } from 'rxjs';
import { PaginatedResult } from '../../types/PaginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private httpClient = inject(HttpClient);
  private accoutnService = inject(AccountService);
  private apiUrl = environment.baseUrl;
  showMemberUpdateForm = signal<boolean>(false);
  member = signal<Members | null>(null);
  getMembers(memberParam : MemberParam){
    let params = new HttpParams();

    params = params.append('pageNumber', memberParam.pageNumber);
    params = params.append('pageSize', memberParam.pageSize);
    params = params.append('minAge', memberParam.minAge);
    params = params.append('maxAge', memberParam.maxAge);
    params = params.append('orderBy', memberParam.orderBy);

    if(memberParam.gender) params = params.append('gender', memberParam.gender);


    return this.httpClient.get<PaginatedResult<Members>>(this.apiUrl + 'members' , {params} /* , this.getHttpOption() */);
  }
  
  getMember(id : string){
    return this.httpClient.get<Members>(this.apiUrl + 'members/' + id /* ,  this.getHttpOption() */).pipe
    (tap(member =>{
      this.member.set(member);
    }))
  }

  getMemberPhoto(id : string){
    return this.httpClient.get<Photo[]>(this.apiUrl + 'members/'+ id +'/photos')
  }

    updateMember(updateMember :UpdateMember){
    return this.httpClient.put(this.apiUrl + 'members', updateMember);
  }

  uploadPhoto(file : File){
    const formData = new FormData();
    formData.append('file' , file);

    return this.httpClient.post<Photo>(this.apiUrl + 'members/add-photo' , formData);
  }

  setMainPhoto(photo : Photo){
    return this.httpClient.put(this.apiUrl + 'members/set-main-photo/'+ photo.id , {});
  }

  deletePhoto(photo : Photo){
    return this.httpClient.delete(this.apiUrl + 'members/delete-photo/'+ photo.id);
  }

  private getHttpOption(){
    return {
      headers : new HttpHeaders({
        Authorization : "Bearer " + this.accoutnService.currentUser()?.token
      })
    }

  }

  totgleMemberUpdateForm(){
    this.showMemberUpdateForm.set(!this.showMemberUpdateForm());
  }
}
