import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { DataService } from './service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'covidweb';


  constructor(private dataService: DataService) {

  }
  ngOnInit(): void {
    this.dataService.getDaily();
    this.dataService.getCities();
  }

  ngOnDestroy(): void {

  }

}
