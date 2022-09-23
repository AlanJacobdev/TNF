import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterInfo'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterInfoPipe implements PipeTransform {

    /**
   * Fonction vérifiant la présence d'un élement dans les informations
   * @param value : Liste des objets
   * @param args : Argument de filtrage
   * @returns Liste des élement comportant args
   */
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    return value.filter(function(item: any) {
    return (JSON.stringify(item.titre).toLowerCase().includes(args) || JSON.stringify(item.profilCreation).toLowerCase().includes(args));
    });
  }

}
