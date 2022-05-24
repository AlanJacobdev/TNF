import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNU'
})
export class FilterNUPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    return value.filter(function(item: any) {
    return item.numeroUnique.toLowerCase().includes(args);
      
    });
  }

}
