import { Pipe, PipeTransform } from '@angular/core';
import { etatExport } from 'src/structureData/Item';

@Pipe({
  name: 'filterExportationEtat'
})
export class FilterExportationEtatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    return value.filter(function(item: any) {
      if( args == etatExport.C) {
        return (item.dateModification == null);
      } else if(args == etatExport.M) {
        return (item.dateModification != null)
      } else {
        return value;
      }
      });
      
  }


}
