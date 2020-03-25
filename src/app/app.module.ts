import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { StatComponent } from './stat/stat.component';
import { DataService } from './service/data.service';
import { UiModule } from './ui/ui.module';
import { ToolService } from './service/tool.service';
import { NewsComponent } from './news/news.component';
import { MapComponent } from './map/map.component';
import { AroundComponent } from './around/around.component';
import { ChartComponent } from './chart/chart.component';
import { InfosComponent } from './infos/infos.component';


@NgModule({
  declarations: [
    AppComponent,
    StatComponent,
    NewsComponent,
    MapComponent,
    AroundComponent,
    ChartComponent,
    InfosComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    UiModule
  ],
  providers: [
    {
      provide: 'isBrowser', useValue: true
    },
    DataService,
    ToolService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
