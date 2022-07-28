import { Component, OnInit } from '@angular/core';
import { DemandeAdmin } from 'src/structureData/DemandeAdmin';
import { faComment, faCalendar, faUser, faArrowRightFromBracket, faArrowLeft, faArrowRight, faCalendarCheck, faChevronDown, faClock, faEye, faArrowRightLong, faBook, faCaretRight, faImage, faInfo, faPen, faPlus, faRotateLeft, faTrashCan, faXmark} from '@fortawesome/free-solid-svg-icons';
import { FetchDemandeAdminService } from '../demande-admin/service/fetch-demande-admin.service';
import { allActivity, infoForDescription, typeActivity, typeInfoPerDay, typeInfoPerMounth } from 'src/structureData/Accueil';
import { FetchAccueilService } from './service/fetch-accueil/fetch-accueil.service';
import { Description } from 'src/structureData/Description';
import { NavBarService } from '../navbar/service/nav-bar.service';
import { InformationInfo } from 'src/structureData/Informations';
import { FetchInformationService } from '../informations/service/fetch-information.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  public faCalendar = faCalendar;
  public faUser = faUser;
  public faRotateLeft = faRotateLeft
  public faEye = faEye;
  public faCaretRight = faCaretRight
  public faImage = faImage;
  public faBook = faBook;
  public faXmark = faXmark;
  public faInfo = faInfo;
  public faPen = faPen;
  public faTrashCan = faTrashCan;
  public faPlus = faPlus;
  public faArrowRightLong = faArrowRightLong;
  public faChevronDown = faChevronDown;
  public faCalendarCheck = faCalendarCheck;
  public faArrowLeft = faArrowLeft;
  public faArrowRight = faArrowRight;
  public faRightLong = faArrowRightFromBracket;
  public faClock = faClock;
  public faComment = faComment;
  public isAdmin : boolean = false
  public listeDemandeAdmin : DemandeAdmin[] = []
  public listeInformations : InformationInfo[] = [];
  public waitingMonth : boolean = false;
  public waitingActivityOfDay : boolean = false;
  constructor(private fetchAccueilService : FetchAccueilService, private fetchDemandeAdminService : FetchDemandeAdminService, private navbarService : NavBarService, private fetchInformationService : FetchInformationService) { 
    let Admin = this.navbarService.getEstAdmin();
    if (Admin){
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.getAllDemandeAdmin();
    this.initCalendarToday();
    this.navbarService.receiveChat().subscribe( () => {
    this.getAllInformations();
    }); 
  }
    public selectedIdOfObject : string = ""; 
    public selectedObjet : infoForDescription = {
      id: '',
      libelle: '',
      description: [],
      newDescription : [],
      typeObjet: ''
    } 
    public selectedDescriptionAreEdited : boolean = false;
    public startOfMonth : Date = new Date();
    public endOfMonth : Date = new Date();
    public dayIsSelect : boolean = false;
    public currentDay : number = -1;
    public selectedDay : number = -1;
    public monthOfSelectedDay : string = "";
    public currentMonth :string ="";
    public selectedNumberMonth : number = -1;
    public selectedMonth :string ="";
    public currentYear : number = -1;
    public selectedYear :number = -1;
    public selectedDate : Date = new Date();
    public dateNow : Date = new Date();
    public templateOfCurrentMonth : { start: number; end: number; lastMonthDays: number; CurrentMonthDays : number }[] = []
    public weekOfCurrentMonth : number[][] = [] ;
    public typeActivityNow : typeActivity = typeActivity.All;
    public TypeActivity = typeActivity;
    public calendarWithActivity = new Map<string, {'CountC': number, 'CountM': number, 'CountD': number}>();
    public calendarAndActivity : [string, {
      CountC: number;
      CountM: number;
      CountD: number;
  }][] = [];
    public listeActiviteParMois: typeInfoPerMounth = {
      objectCreated: [],
      objectModified: [],
      objectDeleted: []
    };
    public listeActiviteParJour : typeInfoPerDay = {
      objectCreated: [],
      objectModified: [],
      objectDeleted: []
    }

    public allActivityOfDay : allActivity[] = []

  ngOnInit(){
    
  }

  initCalendarToday(){
    const date = new Date();
    this.selectedDate = date;
    this.currentDay = date.getDate();
    this.selectedNumberMonth = date.getMonth()+1;
    this.currentMonth = date.toLocaleString('default', { month: 'long' });
    this.currentMonth = this.currentMonth.charAt(0).toUpperCase() + this.currentMonth.slice(1);
    this.selectedMonth = date.toLocaleString('default', { month: 'long' });
    this.selectedMonth = this.selectedMonth.charAt(0).toUpperCase() + this.selectedMonth.slice(1);
    this.currentYear = date.getFullYear();
    this.templateOfCurrentMonth = this.getWeeksOfMonth(this.currentYear,date.getMonth());
    this.selectedYear = date.getFullYear();
    this.getNumberOfActivityForEachDay();
  }

  async changeMonth(isForward : boolean) {
    this.selectedDay = -1;
    let date : Date;
    if (isForward) {
      date = new Date(this.selectedDate.setMonth(this.selectedDate.getMonth() + 1))
      this.selectedDate = date;
    } else {
      date = new Date(this.selectedDate.setMonth(this.selectedDate.getMonth() - 1))
      this.selectedDate = date;
    }
    this.selectedNumberMonth = date.getMonth()+1;
    this.selectedMonth = date.toLocaleString('default', { month: 'long' });
    this.selectedMonth = this.selectedMonth.charAt(0).toUpperCase() + this.selectedMonth.slice(1);
    this.selectedYear = date.getFullYear();
    this.templateOfCurrentMonth = this.getWeeksOfMonth(this.selectedYear,date.getMonth());
    this.getNumberOfActivityForEachDay();
  }


  getWeeksOfMonth(year : number, month_number : number){
    let weeks = [],
        lastDate = new Date(year, month_number + 1, 0),
        numDays = lastDate.getDate();
    let numberOfLastDayPM  = new Date(year, month_number, 0).getDate();
    
    let d = new Date(year, month_number, 0);
    var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? 1 : 1) ; 
    
    
    let start = (diff % numberOfLastDayPM == 0 ? numberOfLastDayPM : diff % numberOfLastDayPM);
    let end = (diff + 6 % 7 === 0) ? 6 : ((diff + 6) % numberOfLastDayPM == 0 ? numberOfLastDayPM : (diff + 6) % numberOfLastDayPM ) ;
    if( start >=1 && start < 10){
      this.startOfMonth = new Date(year,month_number,start)
    } else {
      this.startOfMonth = new Date(year,month_number-1,start)
    }
    
    weeks.push({start: start, end: end, lastMonthDays: numberOfLastDayPM, CurrentMonthDays : numDays});
    start = end + 1;
    end = end + 7;
    end = start === 1 && end === 8 ? 1 : end;
    if (end > numDays) {
        end = numDays;
    }
    weeks.push({start: start, end: end,lastMonthDays: numberOfLastDayPM, CurrentMonthDays : numDays});

    while (start <= numDays) {
        start = end + 1;
        end = end + 7;
        end = start === 1 && end === 8 ? 1 : end;
        if (end >= numDays) {
            let startExceed = end+1;
            let overflow = numDays - end;
            end = overflow == 0 ? overflow : -overflow;
            weeks.push({start: start, end: end, lastMonthDays: numberOfLastDayPM, CurrentMonthDays : numDays});
            start = startExceed;
            if(end > numDays) {
              this.endOfMonth = new Date(year,month_number+1,end)  
            } else {
              this.endOfMonth = new Date(year,month_number+1,end)  
            }
                  
        } else {
          weeks.push({start: start, end: end, lastMonthDays: numberOfLastDayPM, CurrentMonthDays : numDays});
        }
    }
    
    return weeks;
  }
  

   getAllDaysOfWeek (table : {
    start: number;
    end: number;
    lastMonthDays: number, 
    CurrentMonthDays : number
    }[]) 
  {

    let listeActiviteParMois = this.listeActiviteParMois;

    let firstweek = true;
    let tabOfWeeks = [];
    let weekTab: number[] = [];
    for (const week of table) {
      weekTab.splice(0);
      const range = (start : number, end : number, lastMonthDays : number, CurrentMonthDays : number) => Array.from(Array(7).keys()).map((x : number) => {
        // x + start
        if (firstweek){     
            if(x + start > lastMonthDays) {
              if ((x + start) % lastMonthDays == end) {
                firstweek = false;
              }
              return (x + start) % lastMonthDays 
            } else {
              if (x + start == end) {
                firstweek = false;
              }
              return (x + start)
            }
        } else {

          if(x + start > CurrentMonthDays) {
            return (x + start) % CurrentMonthDays 
          } else {
            return (x + start)
          }

        }
        
      });     
      tabOfWeeks.push(range(week.start,week.end, week.lastMonthDays, week.CurrentMonthDays));      
    }
    
    if (listeActiviteParMois != undefined ) {
      console.log(listeActiviteParMois);
      this.calendarWithActivity.clear();
      let valueC = -1;
      let valueM = -1;
      let valueD = -1;
      let lastDate = new Date(this.selectedYear, this.selectedNumberMonth, 0),
      firstweek = true;
      let lastweek = false;
      for(const week of tabOfWeeks){
        for (const day of week){
          let dayModify = day < 10 ? '0'+ day : day;
          valueC = -1;
          valueM = -1;
          valueD = -1;
          if(firstweek) {
            //console.log(dayModify+ "-" + (day > 10 ? (this.selectedNumberMonth -1 < 10 ? '0'+ (this.selectedNumberMonth -1) : this.selectedNumberMonth -1) : (this.selectedNumberMonth < 10 ? '0'+ this.selectedNumberMonth : this.selectedNumberMonth)) +'-'+ this.selectedYear);
            let responseC = listeActiviteParMois.objectCreated.find((element)=> element.date === dayModify+ "-" + (day > 10 ? (this.selectedNumberMonth -1 < 10 ? '0'+ (this.selectedNumberMonth -1) : this.selectedNumberMonth -1) : (this.selectedNumberMonth < 10 ? '0'+ this.selectedNumberMonth : this.selectedNumberMonth)) +'-'+ this.selectedYear);
            
            if (responseC != undefined){
              valueC = responseC.count;
            }
            let responseM = listeActiviteParMois.objectModified.find((element)=> element.date === dayModify+ "-" + (day > 10 ? (this.selectedNumberMonth -1 < 10 ? '0'+ (this.selectedNumberMonth -1) : this.selectedNumberMonth -1) : (this.selectedNumberMonth < 10 ? '0'+ this.selectedNumberMonth : this.selectedNumberMonth)) +'-'+ this.selectedYear);
            if (responseM != undefined) {
              valueM = responseM.count
            }
            let responseD = listeActiviteParMois.objectDeleted.find((element)=> element.date === dayModify+ "-" + (day > 10 ? (this.selectedNumberMonth -1 < 10 ? '0'+ (this.selectedNumberMonth -1) : this.selectedNumberMonth -1) : (this.selectedNumberMonth < 10 ? '0'+ this.selectedNumberMonth : this.selectedNumberMonth)) +'-'+ this.selectedYear);
            if (responseD != undefined){
              valueD = responseD.count
            }
            this.calendarWithActivity.set(dayModify+ "-" + (day > 10 ? (this.selectedNumberMonth -1 < 10 ? '0'+ (this.selectedNumberMonth -1) : this.selectedNumberMonth -1) : (this.selectedNumberMonth < 10 ? '0'+ (this.selectedNumberMonth) : this.selectedNumberMonth)) +'-'+ this.selectedYear , 
            {CountC: valueC, CountM :valueM , CountD: valueD  })
          } else {
            if(!lastweek){
              if (day == lastDate.getDate()){
                lastweek = true;
              }
              //console.log(dayModify+ "-" + (this.selectedNumberMonth < 10 ? '0'+ (this.selectedNumberMonth) : this.selectedNumberMonth) +'-'+ this.selectedYear);
              

              let responseC = listeActiviteParMois.objectCreated.find((element)=> element.date === dayModify+ "-" + (this.selectedNumberMonth < 10 ? '0'+ (this.selectedNumberMonth) : this.selectedNumberMonth) +'-'+ this.selectedYear);
              if (responseC != undefined){
                valueC = responseC.count;
              }
              let responseM = listeActiviteParMois.objectModified.find((element)=> element.date === dayModify+ "-" + (this.selectedNumberMonth < 10 ? '0'+ (this.selectedNumberMonth) : this.selectedNumberMonth) +'-'+ this.selectedYear);
              if (responseM != undefined) {
                valueM = responseM.count
              }
              let responseD = listeActiviteParMois.objectDeleted.find((element)=> element.date === dayModify+ "-" + (this.selectedNumberMonth < 10 ? '0'+ (this.selectedNumberMonth) : this.selectedNumberMonth) +'-'+ this.selectedYear);
              if (responseD != undefined){
                valueD = responseD.count
              }

              this.calendarWithActivity.set(dayModify+ "-" + (this.selectedNumberMonth < 10 ? '0'+ (this.selectedNumberMonth) : this.selectedNumberMonth) +'-'+ this.selectedYear , 
              {CountC: valueC, CountM: valueM, CountD: valueD })
            } else {

             // console.log(dayModify+ "-" + (this.selectedNumberMonth + 1 < 10 ? '0'+ (this.selectedNumberMonth + 1) : this.selectedNumberMonth + 1) +'-'+ this.selectedYear);
              

             let responseC = listeActiviteParMois.objectCreated.find((element)=> element.date === dayModify+ "-" + (this.selectedNumberMonth + 1 < 10 ? '0'+ (this.selectedNumberMonth + 1) : this.selectedNumberMonth + 1) +'-'+ this.selectedYear);
             if (responseC != undefined){
               valueC = responseC.count;
             }
             let responseM = listeActiviteParMois.objectModified.find((element)=> element.date === dayModify+ "-" + (this.selectedNumberMonth + 1 < 10 ? '0'+ (this.selectedNumberMonth + 1) : this.selectedNumberMonth + 1) +'-'+ this.selectedYear);
             if (responseM != undefined) {
               valueM = responseM.count
             }
             let responseD = listeActiviteParMois.objectDeleted.find((element)=> element.date === dayModify+ "-" + (this.selectedNumberMonth + 1 < 10 ? '0'+ (this.selectedNumberMonth + 1) : this.selectedNumberMonth + 1) +'-'+ this.selectedYear);
             if (responseD != undefined){
               valueD = responseD.count
             }
              this.calendarWithActivity.set(dayModify+ "-" + (this.selectedNumberMonth + 1 < 10 ? '0'+ (this.selectedNumberMonth + 1) : this.selectedNumberMonth + 1) +'-'+ this.selectedYear , 
              {CountC: valueC, CountM: valueM, CountD: valueD})
          }
          }
        }
        firstweek = false;
        lastweek = false;
      }
    } else {
      console.log("prb acquisition activité");
      
    }

    
    this.calendarAndActivity.splice(0);
    this.calendarAndActivity = this.getKeys();    
    
    return tabOfWeeks;

  }


  getAllDemandeAdmin(){
    if(this.isAdmin){
      this.fetchDemandeAdminService.getAllDemandeAdmin().then((list: DemandeAdmin[]) => {
        if (list != undefined) {
          this.listeDemandeAdmin = list
          
        } else {
          console.log("Demande Admin : aucune ")
          this.listeDemandeAdmin.splice(0);
        }
      }).catch((e) => {
      })
    }
  }


  getAllInformations(){
    this.listeInformations.splice(0)
    this.fetchInformationService.getInformations().then((list: InformationInfo[]) => {
      this.listeInformations = list
    }).catch((e) => {
    })
  }

  async readFile(idDoc : number){
    (await this.fetchInformationService.readFile(idDoc)).subscribe(res => {
      const fileURL = URL.createObjectURL(res);
      window.open(fileURL, '_blank');
    });
  }

  today(){
    this.initCalendarToday();
  }

  async selectDay(day : number, specific : boolean){
    if(specific) {
      this.selectedDay = -1;
    } else {
      this.dayIsSelect = true;
      this.selectedDay = day;
      this.monthOfSelectedDay = this.selectedDate.toLocaleString('default', { month: 'long' });
      this.monthOfSelectedDay = this.monthOfSelectedDay.charAt(0).toUpperCase() + this.selectedMonth.slice(1);
      this.selectedDate = new Date(this.selectedYear, this.selectedDate.getMonth(), day)
      await this.getHistoryOfOneDay();
    }
    
  }

  
  showCalendar(){
    this.dayIsSelect = false;
    this.selectedDay = -1;
    this.typeActivityNow = this.TypeActivity.All
  }

  selectTypeActivity(activity : typeActivity){
    this.typeActivityNow = activity;
    this.scrollToStartOfActivity();
  }

  getNumberOfActivityForEachDay(){

    this.waitingMonth = true
    this.fetchAccueilService.getNumberOfActivityForEachDay(this.startOfMonth.toLocaleDateString("en-CA").substring(0, 10), this.endOfMonth.toLocaleDateString("en-CA").substring(0, 10).replace('/','-')).then((list: typeInfoPerMounth) => {
      if (list != undefined) {
        this.listeActiviteParMois = list
        this.weekOfCurrentMonth = this.getAllDaysOfWeek(this.templateOfCurrentMonth)
        this.waitingMonth = false
      } else {
        console.log("Demande Admin : aucune ")
        this.listeDemandeAdmin.splice(0);
      }
    }).catch((e) => {
    })
  }

  getKeys(){
    return Array.from(this.calendarWithActivity);
  }

  async getHistoryOfOneDay(){
    this.waitingActivityOfDay = true;
    this.fetchAccueilService.getHistoryOfOneDay(this.selectedDate.toLocaleDateString("en-CA").substring(0, 10)).then((list: typeInfoPerDay) => {
      if (list != undefined) {

        this.listeActiviteParJour = list;
        
        this.allActivityOfDay.splice(0);
        //Ajout liste All

        for (const created of list.objectCreated){
          this.allActivityOfDay.push({
            id : created.id,
            libelle: created.libelle,
            etat: created.etat,
            profil : created.profilCreation,
            date : new Date(created.dateCreation),
            description: created.description,
            typeObjet : created.typeObjet,
            typeActivity : this.TypeActivity.Create 
          })
        }

        for (const edited of list.objectModified){
          this.allActivityOfDay.push({
            id : edited.id,
            libelle: edited.libelle,
            newlibelle: edited.newlibelle,
            etat: edited.etat,
            newEtat: edited.newEtat,
            profil : edited.profilModification,
            date : new Date(edited.dateModification),
            description: edited.description,
            newDescription : edited.newDescription,
            typeObjet : edited.typeObjet,
            typeActivity : typeActivity.Edit
          })
        }

        for (const deleted of list.objectDeleted){
          this.allActivityOfDay.push({
            id : deleted.id,
            libelle: deleted.libelle,
            etat: deleted.etat,
            profil : deleted.profilSuppression,
            date : new Date(deleted.dateSuppression),
            description: deleted.description,
            typeObjet : deleted.typeObjet,
            typeActivity : this.TypeActivity.Delete 
          })
        }

        const sortedActivityDesc = this.allActivityOfDay.sort(
          (objA, objB) => objB.date.getTime() - objA.date.getTime(),
        );
        this.allActivityOfDay = sortedActivityDesc;
        this.waitingActivityOfDay = false;

      } else {
        console.log("Demande Admin : aucune ")
        this.listeActiviteParJour = {
          objectCreated: [],
          objectModified: [],
          objectDeleted: []
        }
        this.waitingActivityOfDay = false;
      }
    }).catch((e) => {
      this.waitingActivityOfDay = false;
    })

    
  }

  selectObjectFromActivity(id : string, date : Date, edit: boolean) {
    this.selectedIdOfObject = id;
    this.selectedDescriptionAreEdited = edit;
    let objetCreated = this.listeActiviteParJour.objectCreated.find((element) => (element.dateCreation == date) && element.id == id);
    let objetModified = this.listeActiviteParJour.objectModified.find((element) => (element.dateModification == date)&& element.id == id );
    let objetDeleted = this.listeActiviteParJour.objectDeleted.find((element) => (element.dateSuppression == date) && element.id == id);
    
    if(objetCreated == undefined && objetModified == undefined && objetDeleted == undefined){
      this.selectedObjet = {
        id: '',
        libelle: '',
        description: [],
        newDescription : [],
        typeObjet: ''
      }
    }
    else {
      if (objetCreated != undefined){
        this.selectedObjet = objetCreated;
        console.log(objetCreated.description);
      } else if (objetModified != undefined){
        this.selectedObjet = objetModified;
      } else if (objetDeleted != undefined){
        this.selectedObjet = objetDeleted;
      }
    }
  }

  selectObjectFromAllActivity(id : string, date : Date, edit: boolean) {
    this.selectedIdOfObject = id;
    this.selectedDescriptionAreEdited = edit;
    let allObjetCreated = this.allActivityOfDay.find((element) => (element.date == date) && element.id == id);
    
    if(allObjetCreated == undefined){
      this.selectedObjet = {
        id: '',
        libelle: '',
        description: [],
        newDescription : [],
        typeObjet: ''
      }
    }
    else {
      this.selectedObjet = allObjetCreated;
    }
  }

  public equals (desc1 : Description[], desc2 : Description[]){
    if (JSON.stringify(desc1) === JSON.stringify(desc2)) {
      return true
    } 
    return false
  }

  scrollToStartOfActivity(){
   const element = document.getElementById("scrolltableActivity");
    if (element != null){
      element.scrollTop = 0;
    }
  }
}
