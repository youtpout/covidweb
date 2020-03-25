import { Component, OnInit, AfterViewInit, Inject, AfterContentInit } from '@angular/core';
import { CaseByCity } from '../models/case-by-city';
import { DataService } from '../service/data.service';
import { ToolService } from '../service/tool.service';

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

  constructor(@Inject('isBrowser') private isBrowser: boolean, private dataService: DataService, private toolService: ToolService, ) {
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
      setTimeout(() => {
        this.showMarker2();
      }, 200);
    }
  }


  showMarker(lat, long, text) {
    const marker = this.L.marker([lat, long]).addTo(this.map).bindTooltip(text);
  }


  showMarker2() {
    console.log("marker");
    let markers = [];
    for (const item of this.items) {
      if (item && item.coord) {
        var poptext = this.toolService.getCountryName(item.country) + (item.city ? ", " + item.city : "") + "<br/>" + item.confirmed + " confirmed";
        let m = {
          lat: item.coord.latitude,
          lng: item.coord.longitude,
          selected: false
        };
        const marker = this.L.marker([m.lat, m.lng]).addTo(this.map).bindTooltip(poptext);

      }
    }
  }

}
