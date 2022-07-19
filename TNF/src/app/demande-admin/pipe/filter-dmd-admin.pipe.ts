import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDmdAdmin'
})
export class FilterDmdAdminPipe implements PipeTransform {

  transform(value: any, args?: any, type?: any): any {
    if (!value) return null;
    if (!args) return value;
    

    console.log(value); 
    console.log(args);
    console.log(type);
    
    if(type != null) {
      if(type =='A'){
        return value.filter(function(item: any) {
          return JSON.stringify({profilCreation : item.profilCreation, motif: item.motif})
            .includes(args);
        });
      } else {
        return value.filter(function(item: any) {
          return JSON.stringify({profilCreation : item.profilCreation, profilModification: item.profilModification})
            .includes(args);
        });
      }

    }
  }

}
