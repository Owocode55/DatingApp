import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MemberLikeParam, Members } from '../../types/Member';
import { PaginatedResult } from '../../types/PaginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  
  baseUrl = environment.baseUrl;
  httpClient = inject(HttpClient);
  likeId = signal<string[]>([]);


   likeMembers(targetId : string){
    return this.httpClient.post(this.baseUrl + `likes/${targetId}`, {}).subscribe({
      next : ()=>{
        if(this.likeId().includes(targetId)){
          this.likeId.update(ids => ids.filter(x =>  x!== targetId))
        }else{
          this.likeId.update(ids => [...ids, targetId])
        }
      }
    })
   }

   getLikedMember(memberLikeParam : MemberLikeParam){
    let param = new HttpParams();
    param = param.append("pageNumber", memberLikeParam.pageNumber)
    param = param.append("pageSize", memberLikeParam.pageSize)
    param = param.append("predicate", memberLikeParam.predicate)
    return this.httpClient.get<PaginatedResult<Members>>(this.baseUrl + 'likes', {params : param});
   }

   getLikeIds(){
    return this.httpClient.get<string[]>(this.baseUrl + 'likes/list').subscribe({
      next : (value )=>{
         this.likeId.set(value);
      } 
    })
   }

}
