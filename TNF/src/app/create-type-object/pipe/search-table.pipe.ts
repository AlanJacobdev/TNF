import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchTable'
})
export class SearchTablePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    return value.filter(function(item: any) {
      console.log(item.idType)
        return item.idType.toLowerCase().includes(args);
      
    });
  }

}
