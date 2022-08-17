import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterExportationType'
})
export class FilterExportationTypePipe implements PipeTransform {

  transform(value: any, args: any, type? : any): any {
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();
    if(type != null) {
      if(type =='OR'){
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeType)
            .toLowerCase()
            .includes(args);
        });
      } else if (type == 'Item') {
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeObjet)
            .toLowerCase()
            .includes(args);
        });
      } else {
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeSousItem)
            .toLowerCase()
            .includes(args);
        });  
      }
      
    }
  }

}
