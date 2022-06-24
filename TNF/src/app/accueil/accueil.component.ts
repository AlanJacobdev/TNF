import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DemandeAdmin } from 'src/structureData/DemandeAdmin';
import { faComment, faCalendar, faUser, faArrowRightFromBracket, faArrowLeft, faArrowRight, faCalendarCheck, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import { FetchDemandeAdminService } from '../demande-admin/service/fetch-demande-admin.service';

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
  
  constructor(private cookieService: CookieService, private fetchDemandeAdminService : FetchDemandeAdminService) { 
    let Admin = this.cookieService.get('Admin');
    if (Admin == "true"){
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.getAllDemandeAdmin();
  }
    public dayIsSelect : boolean = false;
    public currentDay : number = -1;
    public selectedDay : number = -1;
    public monthOfSelectedDay : string = "";
    public currentMonth :string ="";
    public selectedMonth :string ="";
    public currentYear : number = -1;
    public selectedYear :number = -1;
    public selectedDate : Date = new Date();
    public dateNow : Date = new Date();
    public templateOfCurrentMonth : { start: number; end: number; lastMonthDays: number; CurrentMonthDays : number }[] = []
    public weekOfCurrentMonth : number[][] = [] ;

  ngOnInit(): void {
    this.initCalendarToday();
  }

  initCalendarToday(){
    const date = new Date();
    this.currentDay = date.getDate();
    this.currentMonth = date.toLocaleString('default', { month: 'long' });
    this.currentMonth = this.currentMonth.charAt(0).toUpperCase() + this.currentMonth.slice(1);
    this.selectedMonth = date.toLocaleString('default', { month: 'long' });
    this.selectedMonth = this.selectedMonth.charAt(0).toUpperCase() + this.selectedMonth.slice(1);
    this.currentYear = date.getFullYear();
    this.templateOfCurrentMonth = this.getWeeksOfMonth(this.currentYear,date.getMonth());
    this.selectedYear = date.getFullYear();
    this.templateOfCurrentMonth = this.getWeeksOfMonth(this.selectedYear,date.getMonth());
    this.weekOfCurrentMonth =this.getAllDaysOfWeek(this.templateOfCurrentMonth);
  }

  changeMonth(isForward : boolean) {
    let date : Date;
    if (isForward) {
      date = new Date(this.selectedDate.setMonth(this.selectedDate.getMonth() + 1))
      this.selectedDate = date;
    } else {
      date = new Date(this.selectedDate.setMonth(this.selectedDate.getMonth() - 1))
      this.selectedDate = date;
    }
    this.selectedMonth = date.toLocaleString('default', { month: 'long' });
    this.selectedMonth = this.selectedMonth.charAt(0).toUpperCase() + this.selectedMonth.slice(1);
    this.selectedYear = date.getFullYear();
    this.templateOfCurrentMonth = this.getWeeksOfMonth(this.selectedYear,date.getMonth());
    this.weekOfCurrentMonth =this.getAllDaysOfWeek(this.templateOfCurrentMonth);
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
    console.log(table);
    
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

    return tabOfWeeks;

  }


  getAllDemandeAdmin(){
    if(this.isAdmin){
      this.fetchDemandeAdminService.getAllDemandeAdmin().then((list: DemandeAdmin[]) => {
        if (list != undefined) {
          this.listeDemandeAdmin = list
          console.log(this.listeDemandeAdmin);
          
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

  selectDay(day : number, specific : boolean, isBefore : boolean){
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
  }

}
