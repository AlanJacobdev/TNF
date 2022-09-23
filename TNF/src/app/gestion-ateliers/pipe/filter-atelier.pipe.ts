import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAtelier'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterAtelierPipe implements PipeTransform {

    /**
   * Fonction vérifiant la présence d'un argument dans la liste des atelier
   * @param value : Liste des objets
   * @param args : Argument de filtrage
   * @returns Liste des élement comportant args
   */
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    return value.filter(function(item: any) {
    return item.idAtelier.toLowerCase().includes(args);
      
    });
  }

}
