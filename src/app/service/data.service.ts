import { Injectable } from "@angular/core";

import { CaseByDate } from "../models/case-by-date";
import { Case } from "../models/case";
import { CloseCase } from "../models/close-case";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CaseByCity } from '../models/case-by-city';
import { Coord } from '../models/coord';
import { NewsTransportDto } from '../models/news-transport-dto';
import { map } from "rxjs/operators";
import { ToolService } from './tool.service';
import { DailyTransport } from '../models/daily-transport';

@Injectable()
export class DataService {

    apiKeyV1 = "41b660dc-2534-4be5-bd65-8aa32157b034";
    urlWeb = "https://api.covid.ovh/";
    //urlWeb = "https://localhost:32768/";

    constructor(private http: HttpClient, private toolService: ToolService) {

    }

    private messageSource = new BehaviorSubject<any>({});
    currentMessage = this.messageSource.asObservable();
    changeMessage(message: any) {
        this.messageSource.next(message);
    }

    private citiesSource = new BehaviorSubject<any>({});
    currentCitiesMessage = this.citiesSource.asObservable();
    changeCitiesMessage(message: any) {
        this.citiesSource.next(message);
    }


    private newsSource = new BehaviorSubject<any>({});
    currentNewsMessage = this.newsSource.asObservable();
    changeNewsMessage(message: any) {
        this.newsSource.next(message);
    }


    public getCloseCase(latitude, longitude): Observable<Array<CaseByCity>> {
        const url = this.urlWeb + "api/v1.0/case/coord?latitude=" + latitude + "&longitude=" + longitude + "&apiKey=" + this.apiKeyV1;
        return this.http.get<Array<CloseCase>>(url).pipe(map(r => this.jsonToCity(r)));
    }

    getCities(): any {
        const url = this.urlWeb + "api/v1.0/case/cities?apiKey=" + this.apiKeyV1;
        // console.log(url);
        let time = Date.now();
        //this.toolService.logEvent("get", "cities");
        return this.http.get(url).subscribe((r: any) => {
            time = Date.now() - time;
            let item = this.jsonToCity(r);
            this.changeCitiesMessage(item);

            return r;

        }, (e) => {
            console.log(e);
            return e;
        });
    }

    getCases(): any {
        const url = this.urlWeb + "api/v1.0/case?apiKey=" + this.apiKeyV1;
        let time = Date.now();
        // console.log(url);
        //this.toolService.logEvent("get", "cases");
        return this.http.get(url).subscribe((r: any) => {
            time = Date.now() - time;

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

    getNews(take: number, skip: number): Observable<NewsTransportDto> {
        const url = this.urlWeb + "api/v1.0/case/news?apiKey=" + this.apiKeyV1 + "&take=" + take + "&skip=" + skip;
        // console.log(url);
        let time = Date.now();
        return this.http.get<NewsTransportDto>(url);
    }

    getDaily(): any {
        const url = this.urlWeb + "api/v1.0/case/daily?apiKey=" + this.apiKeyV1;
        return this.http.get<DailyTransport>(url).subscribe((r: any) => {
            this.changeMessage(r);
        }, (e) => {
            console.log(e);
            return e;
        });
    }

    getSeries(): Observable<any> {
        const url = this.urlWeb + "api/v1.0/case/serie?apiKey=" + this.apiKeyV1;
        return this.http.get<any>(url);
    }



    jsonToCity(z: any): Array<CaseByCity> {
        let cities = []

        if (z && z.length) {
            for (const r of z) {
                let city = new CaseByCity();
                city.country = this.toolService.getCountryName(r.A);
                city.city = r.B;
                city.coord = new Coord();
                if (r.C) {
                    city.coord.latitude = r.C.G;
                    city.coord.longitude = r.C.H;
                }
                city.distance = r.D;
                city.confirmed = r.E;
                city.deaths = r.F;
                cities.push(city);
            }
        }
        return cities;
    }
}
