import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRecopie'
})
export class FilterRecopiePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();
    return value.filter(function(item: any) {
        return item.idObjetRepere.toLowerCase().includes(args);
    });
  }

}
