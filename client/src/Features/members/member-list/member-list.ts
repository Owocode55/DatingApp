import { AsyncPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { MemberParam, Members } from '../../../types/Member';
import { Observable } from 'rxjs';
import { Membercard } from '../membercard/membercard';
import { PaginatedResult } from '../../../types/PaginatedResponse';
import { Paginator } from "../../../Shared/paginator/paginator";
import { MemberFilter } from '../member-filter/member-filter';

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe, Membercard, Paginator, MemberFilter],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList {
 private memberService = inject(MemberService);
 paginatedMembers$ ?: Observable<PaginatedResult<Members>>;
 @ViewChild('FilterModel') modal! : MemberFilter;
 memberParam = new MemberParam();
 filterParam = new MemberParam();

 constructor(){
  const localParam = localStorage.getItem('filters');

  if(localParam){
    this.memberParam = JSON.parse(localParam)
    this.filterParam = JSON.parse(localParam)
  }
 this.loadMember(); 
 }

 loadMember(){
    localStorage.setItem('filters', JSON.stringify(this.memberParam))
   this.paginatedMembers$ = this.memberService.getMembers(this.memberParam);
 }
 

 onPageChange(event : {pageNumber : number , pageSize : number}){
  this.memberParam.pageNumber = event.pageNumber;
  this.memberParam.pageSize = event.pageSize;
   
  this.loadMember();
  

 }

 openModal(){
  this.modal.open()
 }

 onCloseModal(){
  console.log("modal closed")
 }

 onFilterChange(data : MemberParam){
  this.memberParam = {...data}
  this.filterParam = {...data}
  this.loadMember()
 }

 onReset(){
  this.memberParam = new MemberParam();
  this.filterParam = new MemberParam();
  this.loadMember()
 }

 get displayMessage():string {
  const defaultParam = new MemberParam();
 
   const filter : string[] = [];

   if(this.filterParam.gender)
        filter.push(this.filterParam.gender + 's')
  else
      filter.push("Males & Females")

    if(this.filterParam.minAge !== defaultParam.minAge || this.filterParam.maxAge != defaultParam.maxAge){
      filter.push(` ages ${this.filterParam.minAge}-${this.filterParam.maxAge}`)
    }

    filter.push(this.filterParam.orderBy === "lastActive" ? "last active" : 'newest members')

    return filter.length > 0 ? `Selected : ${filter.join('  | ') }`: "All members"

 }
}
