import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatComponent } from './stat/stat.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  {  path: 'stat', component: StatComponent },
  {  path: 'map', component: MapComponent },
{ path: '',
  redirectTo: '/stat',
  pathMatch: 'full'
},
{ path: '**', redirectTo: '/stat' }];

@NgModule({
  imports: [     RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
