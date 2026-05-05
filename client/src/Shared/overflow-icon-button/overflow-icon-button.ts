import { Component, input, output } from '@angular/core';
import { Photo } from '../../types/Member';

@Component({
  selector: 'app-overflow-icon-button',
  imports: [],
  templateUrl: './overflow-icon-button.html',
  styleUrl: './overflow-icon-button.css',
})
export class OverflowIconButton {

  isCurrentPhoto = input<boolean>(false);

}
