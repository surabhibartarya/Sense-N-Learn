import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {

  baseUrl = 'http://localhost:4000/';

  constructor( private http: HttpClient ) { }

  getDamageShipments() {
    return this.http.get(this.baseUrl+'damageShipments');
  }

  getHazardousProducts(){
    return this.http.get(this.baseUrl+'hazardousProducts');
  }

  getHazardousCategory(){
    return this.http.get(this.baseUrl+'hazardousCategory');
  }

  getThermalGraph(){
    return this.http.get(this.baseUrl+'thermalGraph/Acetic Acid');
  }

  getMarkers(){
    return this.http.get(this.baseUrl+'markers');
  }

  getSPI(){
    return this.http.get(this.baseUrl+'shipmentPerformanceIndicator');
  }

}
