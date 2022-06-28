import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DemandeAdmin } from 'src/structureData/DemandeAdmin';
import { faComment, faCalendar, faUser, faArrowRightFromBracket, faArrowLeft, faArrowRight, faCalendarCheck, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import { FetchDemandeAdminService } from '../demande-admin/service/fetch-demande-admin.service';
import { typeInfoPerMounth } from 'src/structureData/Accueil';
import { FetchAccueilService } from './service/fetch-accueil/fetch-accueil.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  public faChevronDown = faChevronDown;
  public faCalendarCheck = faCalendarCheck;
  public faArrowLeft = faArrowLeft;
  public faArrowRight = faArrowRight;
  public faRightLong = faArrowRightFromBracket;
  public faComment = faComment;
  public faCalendar = faCalendar;
  public faUser = faUser;
  public isAdmin : boolean = false
  public listeDemandeAdmin : DemandeAdmin[] = []
  public waitingMonth : boolean = false;
  
  constructor(private fetchAccueilService : FetchAccueilService,private cookieService: CookieService, private fetchDemandeAdminService : FetchDemandeAdminService) { 
    let Admin = this.cookieService.get('Admin');
    if (Admin == "true"){
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.getAllDemandeAdmin();
    this.initCalendarToday();
  }
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

  ngOnInit(){
    
  }

  initCalendarToday(){
    const date = new Date();
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
            let responseC = listeActiviteParMois.objectCreated.find((element)=> element.date === dayModify+ "-" + (day > 10 ? (this.selectedNumberMonth -1 < 10 ? '0'+ (this.selectedNumberMonth -1) : this.selectedNumberMonth -1) : (this.selectedNumberMonth < 10 ? '0'+ (this.selectedNumberMonth) : this.selectedNumberMonth) +'-'+ this.selectedYear));
            if (responseC != undefined){
              valueC = responseC.count;
            }
            let responseM = listeActiviteParMois.objectModified.find((element)=> element.date === dayModify+ "-" + (day > 10 ? (this.selectedNumberMonth -1 < 10 ? '0'+ (this.selectedNumberMonth -1) : this.selectedNumberMonth -1) : (this.selectedNumberMonth < 10 ? '0'+ (this.selectedNumberMonth) : this.selectedNumberMonth)+'-'+ this.selectedYear));
            if (responseM != undefined) {
              valueM = responseM.count
            }
            let responseD = listeActiviteParMois.objectDeleted.find((element)=> element.date === dayModify+ "-" + (day > 10 ? (this.selectedNumberMonth -1 < 10 ? '0'+ (this.selectedNumberMonth -1) : this.selectedNumberMonth -1) : (this.selectedNumberMonth < 10 ? '0'+ (this.selectedNumberMonth) : this.selectedNumberMonth)+'-'+ this.selectedYear));
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


  today(){
    this.initCalendarToday();
  }

  selectDay(day : number, specific : boolean){
    if(specific) {
      this.selectedDay = -1;
    } else {
      this.dayIsSelect = true;
      this.selectedDay = day;
      this.monthOfSelectedDay = this.selectedDate.toLocaleString('default', { month: 'long' });
      this.monthOfSelectedDay = this.monthOfSelectedDay.charAt(0).toUpperCase() + this.selectedMonth.slice(1);
    }
    
  }

  showCalendar(){
    this.dayIsSelect = false;
    this.selectedDay = -1;
  }

  getNumberOfActivityForEachDay(){

    this.waitingMonth = true
    this.fetchAccueilService.getNumberOfActivityForEachDay(this.startOfMonth.toLocaleDateString("en-CA").substring(0, 10).replace('/','-'), this.endOfMonth.toLocaleDateString("en-CA").substring(0, 10).replace('/','-')).then((list: typeInfoPerMounth) => {
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

}
