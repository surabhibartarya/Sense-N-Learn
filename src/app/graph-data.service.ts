import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {

  constructor( private http: HttpClient ) { }

  getDamageShipments() {
    return this.http.get(`http://localhost:4000/damageShipments`);
  }

  getHazardousProducts(){
    return this.http.get('http://localhost:4000/hazardousProducts');
  }

  getHazardousCategory(){
    return this.http.get('http://localhost:4000/hazardousCategory');
  }

  getThermalGraph(){
    return this.http.get('http://localhost:4000/thermalGraph/Acetic Acid');
  }

  getMarkers(){
    return this.http.get('http://localhost:4000/markers');
  }

}
