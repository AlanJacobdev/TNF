import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByType'
})
export class FilterByTypePipe implements PipeTransform {

  transform(value: any, args?: any, type?: any): any {
    if (!value) return null;
    if (!args) return value;
    

    console.log(value); 
    console.log(args);
    console.log(type);
    
    if(type != null) {
      if(type =='OR'){
        if(args == "-1") return value; 
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeType)
            .includes(args);
        });
      } else if (type == 'Item') {
        if(args == "-1") return value; 
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeObjet)
            .includes(args);
        });
      } else {
        if(args == "-1") return value; 
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeSousItem)
            .includes(args);
        });
      }

    }
  }

}
