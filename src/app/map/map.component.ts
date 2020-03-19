import { Component, OnInit, AfterViewInit, Inject, AfterContentInit } from '@angular/core';
import { CaseByCity } from '../shared/case-by-city';
import { DataService } from '../shared/data.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterContentInit {
  private map;
  items: Array<CaseByCity>;
  public L = null;

  constructor(@Inject('isBrowser') private isBrowser: boolean, private dataService: DataService) {
    if (this.isBrowser) {
      this.L = require('leaflet');
      let iconDefault = this.L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      this.L.Marker.prototype.options.icon = iconDefault;
    }

    this.dataService.currentCitiesMessage.subscribe(message => {
      this.items = message;
      if (this.isBrowser) {
        this.loadMarker();
      }
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initMap();
    }
  }

  ngAfterContentInit() {

  }


  private initMap(): void {
    this.map = this.L.map('map', {
      center: [51.505, -0.09],
      zoom: 5
    });
    const tiles = this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    tiles.addTo(this.map);
    this.loadMarker();
  }

  loadMarker() {
    if (this.map && this.items && this.items.length) {
      console.log("marker");
      let markers = [];
      let i = 0;
      for (const item of this.items) {
        if (item && item.coord) {
          var poptext = (item.city || item.country) + "<br/>" + item.confirmed + " confirmed";
          let m = {
            lat: item.coord.latitude,
            lng: item.coord.longitude,
            selected: false
          };
          setTimeout(() => {
            this.showMarker(m.lat, m.lng, poptext)
          }, i);
          i++;
        }
      }
    }
  }


  showMarker(lat, long, text) {
    const marker = this.L.marker([lat, long]).addTo(this.map).bindTooltip(text);
  }


  // showMarker() {
  //   console.log("marker");
  //   let markers = [];
  //   for (const item of this.items) {
  //     if (item && item.coord) {
  //       var poptext = (item.city || item.country) + "<br/>" + item.confirmed + " confirmed";
  //       let m = {
  //         lat: item.coord.latitude,
  //         lng: item.coord.longitude,
  //         selected: false
  //       };
  //       const marker = this.L.marker([m.lat, m.lng]).addTo(this.map).bindTooltip(poptext);

  //     }
  //   }
  // }

}
