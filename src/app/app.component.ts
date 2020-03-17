import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  title = 'covidweb';
  

  constructor() {

  }

  ngOnDestroy(): void {
   
  }

}
