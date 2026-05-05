import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  imports: [ReactiveFormsModule],
  templateUrl: './input-text.html',
  styleUrl: './input-text.css',
})
export class InputText implements ControlValueAccessor {
label = input<string>('');
type = input<string>('text')
maxDate = input<string>('');

constructor(@Self() public ngControl : NgControl){
  this.ngControl.valueAccessor = this
}

  writeValue(obj: any): void {

  }
  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {

  }

  get control():FormControl{
    return this.ngControl.control as FormControl
  }
}
