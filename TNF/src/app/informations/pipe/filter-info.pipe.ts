import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterInfo'
})
export class FilterInfoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    return value.filter(function(item: any) {
    return (JSON.stringify(item.titre).toLowerCase().includes(args) || JSON.stringify(item.profilCreation).toLowerCase().includes(args));
    });
  }

}
