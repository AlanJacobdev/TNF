import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'actifVisualisation'
})
export class ActifVisualisationPipe implements PipeTransform {

  transform(value: any, args?: any, type?: any): any {
    if (!value) return null;
    if (!args) return value;
    

    
    if(type != null) {
      if(type =='OR'){
        if(args == "Aucun") return value; 
        return value.filter(function(item: any) {
          return JSON.stringify(item.etat)
            .includes(args);
        });
      } else if (type == 'Item') {
        if(args == "Aucun") return value; 
        return value.filter(function(item: any) {
          return JSON.stringify(item.etat)
            .includes(args);
        });
      } else {
        if(args == "Aucun") return value; 
        return value.filter(function(item: any) {
          return JSON.stringify(item.etat)
            .includes(args);
        });
      }

    }
  }

}
