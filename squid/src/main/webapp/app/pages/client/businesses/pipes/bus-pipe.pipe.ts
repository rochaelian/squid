import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busPipe',
})
export class BusPipePipe implements PipeTransform {
  transform(value: any[], arg: any): any[] {
    if (arg === undefined) {
      return value;
    }
    if (arg === '' || arg.length < 3) {
      return value;
    }

    const arrayBusiness = [];

    for (const business of value) {
      if (business.name.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        arrayBusiness.push(business);
      }
    }

    return arrayBusiness;
  }
}
