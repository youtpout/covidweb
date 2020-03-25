import { Component, OnInit, Inject } from '@angular/core';
import { ToolService } from '../service/tool.service';
import { DataService } from '../service/data.service';
import { CaseByCity } from '../models/case-by-city';
import { CloseCase } from '../models/close-case';
import { Coord } from '../models/coord';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

@Component({
  selector: 'app-around',
  templateUrl: './around.component.html',
  styleUrls: ['./around.component.scss']
})
export class AroundComponent implements OnInit {
  coord: Coord = { latitude: 51.505, longitude: -0.09 };
  havePosition: boolean;
  markerArounds = [];
  private map;
  public L = null;
  error;
  marker;
  roundIcon;
  isSearching: boolean = false;
  items: Array<CaseByCity>;

  constructor(@Inject('isBrowser') private isBrowser: boolean, private toolService: ToolService, private dataService: DataService) {
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
      this.roundIcon = this.L.divIcon({ html: '<i class="your-position"></i>', iconSize: [25, 25], className: 'myDivIcon' });
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initMap();
      this.getLocation();
    }
  }

  private initMap(): void {
    this.map = this.L.map('mapid', {
      center: [51.505, -0.09],
      zoom: 5
    });
    const tiles = this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let self = this;
    this.marker = this.L.marker([51.505, -0.09], { icon: this.roundIcon, draggable: true }).on('move', (ev) => this.move(ev, self)).addTo(this.map).bindPopup('Your position');
    tiles.addTo(this.map);
  }

  move(ev: any, self) {
    if (self.coord.latitude && self.coord.longitude) {
      self.coord.latitude = ev.latlng.lat;
      self.coord.longitude = ev.latlng.lng;
    }
  }

  getLocation() {
    this.toolService.getPosition().then(r => {
      this.havePosition = true;
      console.log(r);
      this.coord = {
        latitude: r.lat,
        longitude: r.lng

      };
      this.error = "";
      this.setMarker(this.coord.latitude, this.coord.longitude);
    },
      e => {
        this.havePosition = false;
        if (e.code == 1) {
          this.error = "User denied the request for Geolocation. Activate it on your browser and click on arrow."
        }
        else if (e.code == 2) {
          this.error = "Location information is unavailable."
        }
        else if (e.code == 3) {
          this.error = "The request to get user location timed out."
        }
        else {
          this.error = "An unknown error occurred."
        }
      })
  }

  updateMarker(coord) {
    if (coord.lat && coord.long) {
      var latitude = coord.lat.value;
      var longitude = coord.long.value;
      this.setMarker(latitude, longitude);
    }
  }

  setMarker(latitude, longitude) {
    this.marker.setLatLng([latitude, longitude]);
    this.map.panTo([latitude, longitude]);
  }

  clearMarkers() {
    console.log("clear");
    for (var i = 0; i < this.markerArounds.length; i++) {
      this.map.removeLayer(this.markerArounds[i]);
    }
    this.markerArounds = [];
  }

  getCaseAround() {
    if (this.coord && this.coord.latitude) {
      this.isSearching = true;
      this.clearMarkers();
      this.items = [];
      this.dataService.getCloseCase(this.coord.latitude, this.coord.longitude).subscribe((r) => {
        this.items = r;
        this.isSearching = false;
        if (this.items && this.items.length) {
          for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var poptext = this.toolService.getCountryName(item.country) + (item.city ? ", " + item.city : "") + "<br/>" + item.confirmed + " confirmed";
            var m = this.L.marker([item.coord.latitude, item.coord.longitude]).addTo(this.map).bindTooltip(poptext);
            this.markerArounds.push(m);
          }
        }
      }, (e) => this.isSearching = false);
    }
  }

}
