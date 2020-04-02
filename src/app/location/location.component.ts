import { Component, OnInit, NgZone } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


am4core.useTheme(am4themes_animated);


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  public state;
  shipImage = "M434.886,210.701c-1.42-2.506-4.079-4.056-6.96-4.056h-34.625v-16.208c0-4.418-3.582-8-8-8h-24.333V150.52c0-4.418-3.582-8-8-8h-31.667v-32.281c0-4.418-3.582-8-8-8h-79.667c-4.418,0-8,3.582-8,8v32.281h-31.667c-4.418,0-8,3.582-8,8v31.917h-24.333c-4.418,0-8,3.582-8,8v31.583h-32.333v-87.5c0-4.418-3.582-8-8-8h-96c-4.418,0-8,3.582-8,8v87.5H8c-2.875,0-5.529,1.542-6.952,4.041c-1.423,2.498-1.396,5.568,0.071,8.04l48.63,81.985c6.023,10.034,19.391,17.601,31.093,17.601H345.4c11.703,0,25.071-7.567,31.098-17.607l58.292-97.323C436.27,216.285,436.307,213.208,434.886,210.701z M377.301,206.645h-56v-8.208h56V206.645z M305.301,198.437v8.314c-13.408,1.063-22.964,10.084-27.404,15.27h-36.262v-23.583H305.301z M344.968,182.437h-64V158.52h64V182.437z M241.635,118.239h63.667v24.281h-63.667V118.239z M201.968,158.52h63v23.917h-63V158.52z M169.635,198.437h56v23.583h-56V198.437z M25.301,142.52h80v15.417h-16c-4.418,0-8,3.582-8,8s3.582,8,8,8h16v16.25h-16c-4.418,0-8,3.582-8,8s3.582,8,8,8h16v15.833h-80V142.52z M362.775,307.852c-3.09,5.147-11.371,9.835-17.375,9.835H80.843c-6.003,0-14.285-4.688-17.354-9.8L22.047,238.02h91.254h168.5c2.663,0,5.176-1.361,6.662-3.571c0.08-0.118,8.07-11.804,19.447-11.804h76.056c0.435,0.073,0.879,0.12,1.334,0.12s0.899-0.047,1.334-0.12h27.174L362.775,307.852z,M65.301,157.94c-2.11,0-4.17,0.85-5.66,2.34c-1.49,1.49-2.34,3.55-2.34,5.66c0,2.1,0.85,4.16,2.34,5.65c1.49,1.49,3.55,2.35,5.66,2.35c2.11,0,4.17-0.86,5.66-2.35c1.49-1.49,2.34-3.55,2.34-5.65c0-2.11-0.85-4.17-2.34-5.66C69.471,158.79,67.411,157.94,65.301,157.94z,M41.631,157.94c-2.1,0-4.17,0.85-5.65,2.34c-1.49,1.49-2.35,3.55-2.35,5.66c0,2.1,0.86,4.16,2.35,5.65c1.49,1.49,3.55,2.35,5.65,2.35c2.11,0,4.17-0.86,5.66-2.35c1.49-1.49,2.34-3.55,2.34-5.65c0-2.11-0.85-4.17-2.34-5.66C45.801,158.79,43.741,157.94,41.631,157.94z,M65.301,190.19c-2.11,0-4.17,0.85-5.66,2.34c-1.49,1.49-2.34,3.55-2.34,5.66c0,2.1,0.85,4.16,2.34,5.65c1.49,1.49,3.55,2.35,5.66,2.35c2.11,0,4.17-0.86,5.66-2.35c1.49-1.49,2.34-3.55,2.34-5.65c0-2.11-0.85-4.17-2.34-5.66C69.471,191.04,67.411,190.19,65.301,190.19z,M41.631,190.19c-2.1,0-4.16,0.85-5.65,2.34c-1.49,1.49-2.35,3.55-2.35,5.66c0,2.1,0.86,4.16,2.35,5.65c1.49,1.49,3.55,2.35,5.65,2.35c2.11,0,4.17-0.86,5.66-2.35c1.49-1.49,2.34-3.55,2.34-5.65c0-2.11-0.85-4.17-2.34-5.66C45.801,191.04,43.741,190.19,41.631,190.19z,M121.481,254.27c-2.1,0-4.16,0.85-5.65,2.34c-1.49,1.49-2.35,3.55-2.35,5.66c0,2.1,0.86,4.17,2.35,5.66c1.48,1.49,3.55,2.34,5.65,2.34c2.11,0,4.17-0.85,5.66-2.34c1.49-1.49,2.34-3.55,2.34-5.66c0-2.11-0.85-4.17-2.34-5.66C125.651,255.121,123.591,254.27,121.481,254.27z,M153.551,254.27c-2.11,0-4.17,0.85-5.66,2.34c-1.49,1.49-2.34,3.55-2.34,5.66c0,2.11,0.85,4.17,2.34,5.66c1.49,1.49,3.56,2.34,5.66,2.34c2.11,0,4.17-0.85,5.66-2.34c1.49-1.49,2.34-3.55,2.34-5.66c0-2.11-0.85-4.17-2.34-5.66C157.721,255.121,155.661,254.27,153.551,254.27z,M185.621,254.27c-2.11,0-4.17,0.85-5.66,2.34c-1.49,1.49-2.34,3.56-2.34,5.66s0.85,4.17,2.34,5.66c1.49,1.49,3.55,2.34,5.66,2.34c2.1,0,4.16-0.85,5.65-2.34c1.49-1.49,2.35-3.56,2.35-5.66s-0.86-4.17-2.35-5.66C189.781,255.121,187.721,254.27,185.621,254.27z,M217.681,254.27c-2.1,0-4.17,0.85-5.65,2.34c-1.49,1.49-2.35,3.55-2.35,5.66c0,2.11,0.86,4.17,2.35,5.66c1.48,1.49,3.55,2.34,5.65,2.34c2.11,0,4.17-0.85,5.66-2.34c1.49-1.49,2.34-3.55,2.34-5.66c0-2.11-0.85-4.17-2.34-5.66C221.851,255.121,219.791,254.27,217.681,254.27z,M249.751,254.27c-2.1,0-4.17,0.85-5.66,2.34c-1.49,1.49-2.34,3.55-2.34,5.66c0,2.11,0.85,4.17,2.34,5.66c1.49,1.49,3.56,2.34,5.66,2.34c2.11,0,4.17-0.85,5.66-2.34c1.49-1.49,2.34-3.55,2.34-5.66c0-2.11-0.85-4.17-2.34-5.66C253.921,255.121,251.861,254.27,249.751,254.27z,M281.821,254.27c-2.11,0-4.17,0.85-5.66,2.34c-1.49,1.49-2.34,3.55-2.34,5.66c0,2.11,0.85,4.17,2.34,5.66c1.49,1.49,3.55,2.34,5.66,2.34c2.1,0,4.16-0.85,5.65-2.34c1.49-1.49,2.35-3.55,2.35-5.66c0-2.11-0.86-4.17-2.35-5.66C285.981,255.121,283.921,254.27,281.821,254.27z";

  constructor() {}

  ngOnInit() {
    this.state = window.history.state.data.markerDetails;
    console.log(this.state); //= window.history.state.data);
    this.plotRoute();
  }

  plotRoute(){
    let chart = am4core.create("routemapdiv", am4maps.MapChart);
    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();
    chart.homeZoomLevel = 2.5;
    chart.homeGeoPoint = {
        latitude: 38,
        longitude: -60
    };

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.mapPolygons.template.fill = chart.colors.getIndex(0).lighten(0.5);
    polygonSeries.mapPolygons.template.nonScalingStroke = true;
    polygonSeries.exclude = ["AQ"];

    // Add line bullets
    let cities = chart.series.push(new am4maps.MapImageSeries());
    cities.mapImages.template.nonScaling = true;

    let city = cities.mapImages.template.createChild(am4core.Circle);
    city.radius = 6;
    city.fill = chart.colors.getIndex(0).brighten(-0.2);
    city.strokeWidth = 2;
    city.stroke = am4core.color("#fff");

    function addCity(coords, title) {
        let city = cities.mapImages.create();
        city.latitude = coords.latitude;
        city.longitude = coords.longitude;
        city.tooltipText = title;
        return city;
    }

    //let paris = addCity({ "latitude": 48.8567, "longitude": 2.3510 }, "Paris");
    //let toronto = addCity({ "latitude": 43.8163, "longitude": -79.4287 }, "Toronto");
    //let la = addCity({ "latitude": 34.3, "longitude": -118.15 }, "Los Angeles");
    //let havana = addCity({ "latitude": 23, "longitude": -82 }, "Havana");
    console.log("Plot: ", this.state);
    let source = addCity({ "latitude": this.state['Supply Coordinate'].Latitude , "longitude" : this.state['Supply Coordinate'].Longitude} , this.state['Supply Port']);
    let destination = addCity({ "latitude": this.state['Delivery Coordinate'].Latitude , "longitude" : this.state['Delivery Coordinate'].Longitude} , this.state['Destination Port']);
    // Add lines
    let lineSeries = chart.series.push(new am4maps.MapArcSeries());
    lineSeries.mapLines.template.line.strokeWidth = 2;
    lineSeries.mapLines.template.line.strokeOpacity = 0.5;
    lineSeries.mapLines.template.line.stroke = city.fill;
    lineSeries.mapLines.template.line.nonScalingStroke = true;
    lineSeries.mapLines.template.line.strokeDasharray = "1,1";
    lineSeries.zIndex = 10;

    function addLine(from, to) {
        let line = lineSeries.mapLines.create();
        line.imagesToConnect = [from, to];
        line.line.controlPointDistance = -0.3;

        return line;
    }

    //addLine(paris, toronto);
    //addLine(toronto, la);
    //addLine(la, havana);
    addLine(source,destination);

    // Add ship
    let ship = lineSeries.mapLines.getIndex(0).lineObjects.create();
    ship.position = 0;
    ship.width = 48;
    ship.height = 48;

    ship.adapter.add("scale", function(scale, target) {
        return 0.5 * (1 - (Math.abs(0.5 - target.position)));
    })

    let shipImage = ship.createChild(am4core.Sprite);
    shipImage.scale = 0.08;
    shipImage.horizontalCenter = "middle";
    shipImage.verticalCenter = "middle";
    shipImage.path = this.shipImage;
    shipImage.fill = chart.colors.getIndex(2).brighten(-0.2);
    shipImage.strokeOpacity = 0;


    // ship animation
    let currentLine = 0;
    let direction = 1;
    function animateship() {

        // Get current line to attach ship to
        ship.mapLine = lineSeries.mapLines.getIndex(currentLine);
        ship.parent = lineSeries;

        // Set up animation
        let from, to;
        let numLines = lineSeries.mapLines.length;
        if (direction == 1) {
            from = 0
            to = 1;
            if(source.longitude > destination.longitude) //Flipping the ship
             {  
             if (shipImage.rotation != 180) {
                shipImage.animate({ to: 180, property: "rotation" }, 1000).events.on("animationended", animateship);
                 return;
             }
            }
        }
        else {
            from = 1;
            to = 0;
            if (shipImage.rotation != 180) {
                shipImage.animate({ to: 180, property: "rotation" }, 1000).events.on("animationended", animateship);
                return;
            }
        }

        // Start the animation
        let animation = ship.animate({
            from: from,
            to: to,
            property: "position"
        }, 5000, am4core.ease.sinInOut);
        animation.events.on("animationended", animateship)
        /*animation.events.on("animationprogress", function(ev) {
          let progress = Math.abs(ev.progress - 0.5);
          //console.log(progress);
          //shipImage.scale += 0.2;
        });*/

}

// Go!
animateship();

  }

}
