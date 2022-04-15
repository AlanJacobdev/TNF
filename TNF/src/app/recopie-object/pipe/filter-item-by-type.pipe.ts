import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterItemByType'
})
export class FilterItemByTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    return value.filter(function(item: any) {
      console.log(item.idType)
        return item.idItem.toLowerCase().includes(args);
    });
  }

}
