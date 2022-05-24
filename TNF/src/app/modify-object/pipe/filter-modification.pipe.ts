import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterModification'
})
export class FilterModificationPipe implements PipeTransform {

  transform(value: any, args?: any,  type? : any): any {
    if (!value) return null;
    if (!args) return value;
    if(type =='OR' || type =='ItemOR' || type == 'SIOR'){
      return value.filter(function(item: any) {
        return JSON.stringify(item.idObjetRepere)
          .toUpperCase()
          .includes(args);
      });
    } else if (type == 'Item' || type == 'SIItem') {
      return value.filter(function(item: any) {
        return JSON.stringify(item.idItem)
          .toUpperCase()
          .includes(args);
      });
    } else {
      return value.filter(function(item: any) {
        return JSON.stringify(item.idSousItem)
          .toUpperCase()
          .includes(args);
      });
    }
  }
}
