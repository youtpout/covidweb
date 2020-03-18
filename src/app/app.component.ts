import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { DataService } from './shared/data.service';

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
    this.dataService.getCases();
    this.dataService.getCities();
  }

  ngOnDestroy(): void {
    
  }

}
