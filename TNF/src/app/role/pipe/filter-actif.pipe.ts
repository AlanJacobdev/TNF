import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterActif'
})
export class FilterActifPipe implements PipeTransform {

  transform(value: any): any {
    if (!value) return null;
  
    return value.filter(function(item: any) {
      if (JSON.stringify(item.isPaste) == 'true') {
        return true
      }
      return false
    });
      
      
    
  }

}
