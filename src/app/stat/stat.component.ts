import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { Case } from '../models/case';
import { CaseByDate } from '../models/case-by-date';
import { DailyTransport } from '../models/daily-transport';
import { Daily } from '../models/daily';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
  item: DailyTransport;
  datas: Array<Daily>;
  visibility: [Date, boolean];
  cases: number = 0;
  recovered: number = 0;
  deaths: number = 0;
  casesAdd: number = 0;
  recoveredAdd: number = 0;
  deathsAdd: number = 0;
  displayedColumns = ["region", "confirmed", "recovered", "deaths"];
  timeCase;
  country: string;
  key = "updateNumber";
  sortOrder = new Map();

  constructor(private dataService: DataService) {

    this.dataService.currentMessage.subscribe(r => {
      this.item = r;
      this.datas = this.item.series;
      this.sortOrder.set("confirmed", false);
      let load = sessionStorage.getItem(this.key);
      if (!load) {
        this.timeCase = setInterval(() => {
          this.updateNumber(this.item);
        }, 20);
      }
      else {
        this.cases = this.item.confirmed;
        this.recovered = this.item.recovered;
        this.deaths = this.item.deaths;
        this.casesAdd = this.item.confirmedAdd;
        this.deathsAdd = this.item.deathsAdd;
        this.recoveredAdd = this.item.recoveredAdd;
      }
    });
  }

  ngOnInit(): void {
    if (this.item) {
      this.updateNumber(this.item);
    }

  }

  getSorted(name) {
    return this.sortOrder.has(name) ? (this.sortOrder.get(name) == true ? "sorted-up" : "sorted-down") : "not-sorted";
  }

  updateNumber(item: DailyTransport) {
    if (this.cases < item.confirmed) {
      this.cases += Math.round(item.confirmed / 100);
    } else if (this.cases > item.confirmed) {
      this.cases = item.confirmed;
    }
    if (this.recovered < item.recovered) {
      this.recovered += Math.round(item.recovered / 100);
    } else if (this.recovered > item.recovered) {
      this.recovered = item.recovered;
    }

    if (this.deaths < item.deaths) {
      this.deaths += Math.round(item.deaths / 100);
    } else if (this.deaths > item.deaths) {
      this.deaths = item.deaths;
    }

    if (this.cases == item.confirmed && this.recovered == item.recovered && this.deaths == item.deaths) {
      this.casesAdd = item.confirmedAdd;
      this.deathsAdd = item.deathsAdd;
      this.recoveredAdd = item.recoveredAdd;
      clearInterval(this.timeCase);
      sessionStorage.setItem(this.key, 'true');
    }
  }

  updateCase(goal: number) {

  }

  search(event) {
    this.datas = [];
    let text = event.toLocaleLowerCase();
    let cases = this.item.series;
    cases = cases.filter(c => c.country.toLocaleLowerCase().indexOf(text) != -1);
    cases.forEach(element => {
      this.datas.push(element);
    });
  }


  filter(val: string) {
    let invert = false;
    if (this.sortOrder.has(val) && this.sortOrder.get(val) == true) {
      invert = true;
      this.sortOrder.set(val, false);
    } else {
      this.sortOrder.clear();
      this.sortOrder.set(val, true);
    }
    this.datas = this.datas.sort((a, b) => {

      let res = a[val] < b[val] ? -1 : a[val] > b[val] ? 1 : 0;
      if (invert)
        res = res * -1;
      return res;
    })
  }

  clear() {
    this.country = "";
    let cases = this.item.series;
    cases.forEach(element => {
      this.datas.push(element);
    });
    this.sortOrder.clear();
    this.sortOrder.set('confirmed', true);
    this.filter('confirmed');
  }

}
