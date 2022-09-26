import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'actifVisualisation'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class ActifVisualisationPipe implements PipeTransform {

    /**
   * Fonction vérifiant la présence d'un élement dans la liste des objets 
   * @param value : Liste des objets
   * @param args : Argument de filtrage (ett)
   * @param type : Type d'objet (objet repère, item ou sous item)
   * @returns Liste des élement comportant args
   */
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
