import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterExportationAtelier'
})
export class FilterExportationAtelierPipe implements PipeTransform {

  transform(value: any, args: string, type? : any): any {
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();
    if(type != null) {
      if(type =='OR'){
        return value.filter(function(item: any) {
          return item.numeroUnique.toLowerCase().charAt(0) === args;    
        });
      } else if (type == 'Item') {
        return value.filter(function(item: any) {
          return item.numeroUnique.toLowerCase().charAt(0) === args; 
        });
      } else {
        return value.filter(function(item: any) {
            return item.idItem.toLowerCase().charAt(2) === args;
        });  
      }
      
    }
  }

}
