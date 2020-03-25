import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatComponent } from './stat/stat.component';
import { MapComponent } from './map/map.component';
import { NewsComponent } from './news/news.component';
import { ChartComponent } from './chart/chart.component';
import { AroundComponent } from './around/around.component';
import { InfosComponent } from './infos/infos.component';

const routes: Routes = [
  { path: '', component: StatComponent, pathMatch: 'full' },
  { path: 'map', component: MapComponent },
  { path: 'news', component: NewsComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'around', component: AroundComponent },
  { path: 'infos', component: InfosComponent },
  // {
  //   path: '',
  //   redirectTo: '/stat',
  //   pathMatch: 'full'
  // },
  { path: '**', redirectTo: '' }];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,
      {
        initialNavigation: 'enabled'
      })]
  ,
  exports: [RouterModule]
})
export class AppRoutingModule { }
