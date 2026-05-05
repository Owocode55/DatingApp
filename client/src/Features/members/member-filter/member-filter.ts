import { Component, ElementRef, model, output, ViewChild } from '@angular/core';
import { MemberParam } from '../../../types/Member';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-member-filter',
  imports: [FormsModule],
  templateUrl: './member-filter.html',
  styleUrl: './member-filter.css',
})
export class MemberFilter {
 @ViewChild("FilterModel") modelRef! : ElementRef<HTMLDialogElement>;
 closeModal = output();
 submitData = output<MemberParam>()
 memberParam = model(new MemberParam());

 constructor(){
   const localParam = localStorage.getItem('filters');

  if(localParam){
    this.memberParam.set(JSON.parse(localParam))
  }
 }

 open(){
  this.modelRef.nativeElement.showModal();
 } 

 close(){
  this.modelRef.nativeElement.close();
  this.closeModal.emit();
 }

 submit(){
  this.submitData.emit(this.memberParam());
  this.close();
 }

 onMinAgeChange(){
  if(this.memberParam().minAge < 18) this.memberParam().minAge = 18
 }

 onMaxAgeChnage(){
  if(this.memberParam().maxAge < this.memberParam().minAge) this.memberParam().maxAge == this.memberParam().minAge
 }
}
