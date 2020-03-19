import { Component, NgZone, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

import { GraphDataService } from './../graph-data.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private chart: am4charts.XYChart;

  constructor(private zone: NgZone , private graphDataService : GraphDataService) {}

  ngOnInit(){}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
            this.worldMap();
            this.thermalGraph();
          })
  }

  worldMap(){
    var chart = am4core.create("worldmapdiv", am4maps.MapChart);

        // Set map definition
        chart.geodata = am4geodata_worldLow;

        // Set projection
        chart.projection = new am4maps.projections.Miller();

        // Create map polygon series
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;
        polygonSeries.exclude = ["AQ"];

        // Create image series
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());

        // Create image
        var imageSeriesTemplate = imageSeries.mapImages.template;
        var marker = imageSeriesTemplate.createChild(am4core.Image);
        marker.width = 28;
        marker.height = 28;
        marker.nonScaling = true;
        marker.tooltipText = "{title}";
        marker.horizontalCenter = "middle";
        marker.verticalCenter = "middle";
        marker.propertyFields.href = "flag";

        // Set property fields
        imageSeriesTemplate.propertyFields.latitude = "latitude";
        imageSeriesTemplate.propertyFields.longitude = "longitude";

        // Add data markers
        //imageSeries.data=[];

        this.graphDataService.getMarkers().subscribe((serviceData) => {
           let markerData= Object.values(serviceData);
            markerData.forEach(element => {
              //Pushing supply port info into marker data field.
              imageSeries.data.push( {latitude : element["Supply Coordinate"].Latitude , 
                                      longitude : element["Supply Coordinate"].Longitude , 
                                      title : element["Supply Port"] , 
                                      flag: "../assets/images/green_marker.svg"});
              //Pushing destination port info into marker data field.
              imageSeries.data.push( { latitude : element["Delivery Coordinate"].Latitude ,
                                       longitude : element["Delivery Coordinate"].Longitude , 
                                       title : element["Destination Port"] , 
                                       flag: "../assets/images/blue_marker.svg"});
              });
              console.log( imageSeries.data);
        })
 
         /* imageSeries.data = [{
          "latitude": 12.9716,
          "longitude": 77.5946,
          "title": "Bangalore",
          "flag": "../assets/images/blue_marker.svg"
        }, {
          "latitude": 40.712775,
          "longitude": -74.005973,
          "title": "New York",
          "flag": "../assets/images/green_marker.svg"
        }, {
          "latitude": 51.5074,
          "longitude": 0.1278,
          "title": "London",
          "flag": "../assets/images/green_marker.svg"
        }]; */
 
        marker.events.on("hit", function(ev) {
          console.log("clicked on ", ev.target.dataItem);
         });
  }

  thermalGraph(){

    let chart = am4core.create("chartdiv", am4charts.XYChart);
      var data= [];

      //Getting thermal data from API and then setting the chart
      this.graphDataService.getThermalGraph().subscribe((serviceData) => {
        let thermalData = Object.values(serviceData);
        thermalData.forEach(element => {
          //data.push({date : element.Date , open: parseInt(element.Threshold), close: parseInt(element[" Avg Temperature  "])});
          data.push({date : element.Date , threshold: element.Threshold, avgTemp: element["Avg Temperature"]});
        })
        chart.data = data;

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.openValueY = "threshold";
        series.dataFields.valueY = "avgTemp";
        series.tooltipText = "Threshold: {openValueY.value} Average Temperature: {valueY.value}";
        series.sequencedInterpolation = true;
        series.fillOpacity = 0.3;
        series.defaultState.transitionDuration = 1000;
        series.tensionX = 0.8;

        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.dataFields.dateX = "date";
        series2.dataFields.valueY = "threshold";
        series2.sequencedInterpolation = true;
        series2.defaultState.transitionDuration = 1500;
        series2.stroke = chart.colors.getIndex(6);
        series2.tensionX = 0.8;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.scrollbarX = new am4core.Scrollbar();
      });

  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });

  }
}
