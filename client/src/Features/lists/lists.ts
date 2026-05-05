import { Component, inject, OnInit, signal } from '@angular/core';
import { LikeService } from '../../Core/services/like-service';
import { MemberLikeParam, Members } from '../../types/Member';
import { FormField } from "@angular/forms/signals";
import { Membercard } from '../members/membercard/membercard';
import { PaginatedResult } from '../../types/PaginatedResponse';
import { Paginator } from "../../Shared/paginator/paginator";

@Component({
  selector: 'app-lists',
  imports: [FormField, Membercard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit {

 likeService = inject(LikeService)
 members = signal<PaginatedResult<Members> | undefined>(undefined);
 memberLikedParams = signal<MemberLikeParam>(new MemberLikeParam());
 
 tabs = [{label:"liked", value: "liked"},
  {label: "Liked me" , value:"likedby"},
  {label:"mutual" , value:"mutual"}
 ]

  ngOnInit(): void {
   this.loadLikes()
 }


 loadLikes(){
  this.likeService.getLikedMember(this.memberLikedParams()).subscribe({
    next : members => {
      this.members.set(members);
    }
  })
 }


 setPredicate(value : string){
  if(value !== this.memberLikedParams().predicate){
    this.memberLikedParams.update( member =>({...member , predicate : value, pageNumber : 1}) );

    this.loadLikes(); 
  }
 }

 onPageChange(event : {pageNumber : number , pageSize : number} ){
  this.memberLikedParams.update(param =>({...param , pageNumber : event.pageNumber, pageSize : event.pageSize}))
   
  this.loadLikes();
 }


}
