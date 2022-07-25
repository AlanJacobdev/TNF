import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NavBarService } from 'src/app/navbar/service/nav-bar.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FetchInformationService {

constructor(private readonly http: HttpClient, private navBarService: NavBarService){
}

    async exportFiles( files : FormData){
        let user = this.navBarService.getLogin();
        let url = "http://"+environment.API_URL+"/document/file-upload/:user"
        url = url.replace("{User}", user)
        try {
        const res : any = await lastValueFrom(this.http.post<any>(url, files));

        if (res.hasOwnProperty('error')) {
            const resAny : any = res;
            return resAny.error;
        } else {
            return res;
        }
        } catch (e : any) {
            let returnError;
            if(e.hasOwnProperty('error')){
            if(e.error.hasOwnProperty('status')){
                returnError=e.error["error"];
            } else {
                returnError=e.error.message[0];
            }
            }
        return returnError;
        }
    }
}