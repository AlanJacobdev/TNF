import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAtelier'
})
export class FilterAtelierPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    return value.filter(function(item: any) {
    return item.idAtelier.toLowerCase().includes(args);
      
    });
  }

}
