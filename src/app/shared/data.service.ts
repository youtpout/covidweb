import { Injectable } from "@angular/core";

import { CaseByDate } from "./case-by-date";
import { Case } from "./case";
import { CloseCase } from "./close-case";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';



@Injectable()
export class DataService {
    
    apiKeyV1 = "41b660dc-2534-4be5-bd65-8aa32157b034";
    
    constructor(private http:HttpClient){

    }

    private messageSource = new BehaviorSubject<any>({});
    currentMessage = this.messageSource.asObservable();

    changeMessage(message: any) {
        this.messageSource.next(message)
    }    

    getCloseCase(latitude,longitude):Array<CloseCase> {
        const url = "https://covid.ovh/api/v1.0/case/coord?latitude="+latitude+"&longitude="+longitude;
        let items = new Array<CloseCase>();
        console.log(Date.now());
        this.http.get(url).subscribe((r: any) => {
            if (r && r.length) {
                items=r;
                }
            console.log(Date.now());
        }, (e) => {
            console.log(e);
        });

        return items;
    }

    getCases(): any {
        const url = "https://covid.ovh/api/v1.0/case?apiKey=" + this.apiKeyV1;
        let time = Date.now();
        // console.log(url);
        //this.toolService.logEvent("get", "cases");
        return this.http.get(url).subscribe((r: any) => {
            time = Date.now() - time;
            console.log('Load case by country in ' + time + 'ms');

            let caseByDate = new CaseByDate();
            if (r) {
                caseByDate.visible = true;
                caseByDate.confirmed = r.confirmed;
                caseByDate.deaths = r.deaths;
                caseByDate.recovered = r.recovered;
                caseByDate.date = r.date;
                caseByDate.cases = new Array<Case>();
                if (r.cases && r.cases.length) {
                    for (const item of r.cases) {
                        let data = new Case();
                        data.region = item.B;
                        data.province = item.A;
                        data.confirmed = item.E;
                        data.deaths = item.F;
                        data.recovered = item.G;
                        caseByDate.cases.push(data);
                    }
                }
            }

            this.changeMessage(caseByDate);

            return caseByDate;

        }, (e) => {
            console.log(e);
            return e;
        });
    }

    
}
