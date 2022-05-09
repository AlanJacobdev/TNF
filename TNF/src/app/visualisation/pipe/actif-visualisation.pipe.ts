import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'actifVisualisation'
})
export class ActifVisualisationPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    return value.filter(function(item: any) {
      return JSON.stringify(item.valide)
        .includes(args);
    });
  }

}
