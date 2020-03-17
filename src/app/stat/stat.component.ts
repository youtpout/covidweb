import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Case } from '../shared/case';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
  item: any;
  dataItems: Array<Case>=[];
  visibility: [Date, boolean];
  displayedColumns=["region","confirmed","recovered","deaths"];
  constructor(private dataService:DataService) { 
    
    this.dataService.currentMessage.subscribe(r=>      
      {
        this.item=r;
        if (this.item && this.item.cases && this.item.cases.length) {
          this.dataItems = new Array<Case>();

          this.item.cases.forEach(element => {
              this.dataItems.push(element);
          });
      }
      });
  }

  ngOnInit(): void {
    this.dataService.getCases();
  }

}
