import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { CaseByCity } from '../shared/case-by-city';
import { DataService } from '../shared/data.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map;
  items: Array<CaseByCity>;

  constructor(private dataService: DataService) {
    this.dataService.currentCitiesMessage.subscribe(message => {
      this.items = message;
      this.loadMarker();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    this.loadMarker();
  }

  loadMarker() {
    if (this.map && this.items && this.items.length) {
      console.log("marker");
      let markers = [];
      for (const item of this.items) {
        if (item && item.coord) {
          //let text = this.toolService.getCountryName(item.country) + ", " + item.city;
          // if (item.confirmed) {
          //     text += " " + item.confirmed + " confirmed";
          // }
          let m = {
            lat: item.coord.latitude,
            lng: item.coord.longitude,
            title: "country",
            selected: false
          };
          const marker = L.marker([m.lat, m.lng]).addTo(this.map);

        }
      }
    }
  }

}
