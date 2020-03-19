import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Case } from '../shared/case';
import { CaseByDate } from '../shared/case-by-date';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
  item: any;
  dataItems: Array<Case> = [];
  visibility: [Date, boolean];
  cases: number = 0;
  recovered: number = 0;
  deaths: number = 0;
  displayedColumns = ["region", "confirmed", "recovered", "deaths"];
  timeCase;
  key = "updateNumber";

  constructor(private dataService: DataService) {

    this.dataService.currentMessage.subscribe(r => {
      this.item = r;
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
      }

      if (this.item && this.item.cases && this.item.cases.length) {
        this.dataItems = new Array<Case>();

        this.item.cases.forEach(element => {
          this.dataItems.push(element);
        });
      }
    });
  }

  ngOnInit(): void {
    if (this.item) {
      this.updateNumber(this.item);
    }

  }

  updateNumber(item: CaseByDate) {
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
      clearInterval(this.timeCase);
      sessionStorage.setItem(this.key, 'true');
    }
  }

  updateCase(goal: number) {

  }

}
