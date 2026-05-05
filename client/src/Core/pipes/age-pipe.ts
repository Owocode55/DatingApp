import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
})
export class AgePipe implements PipeTransform {

  transform(value: string): number {
    const toDay = new Date();
    const dob = new Date(value);

    let age = toDay.getFullYear() - dob.getFullYear();
    let monthDiff = toDay.getMonth() - dob.getMonth();

    if(monthDiff < 0 || (monthDiff === 0 && toDay.getDate() < dob.getDate())){
      age--;
    }


    return age;
  }

}
