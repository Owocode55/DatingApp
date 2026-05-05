import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-icon-button',
  imports: [],
  templateUrl: './delete-icon-button.html',
  styleUrl: './delete-icon-button.css',
})
export class DeleteIconButton {
 isDisabled = input<boolean>();
 clickEvent = output<Event>();

onDelete(event : Event){
  this.clickEvent.emit(event);
}

}
