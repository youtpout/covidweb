import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
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
export class MapComponent implements AfterViewInit {
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

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initMap();
    }
  }

  private initMap(): void {
    this.map = this.L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });
    const tiles = this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
          const marker = this.L.marker([m.lat, m.lng]).addTo(this.map);

        }
      }
    }
  }

}
