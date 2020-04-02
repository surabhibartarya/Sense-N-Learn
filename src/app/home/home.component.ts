import { Component, NgZone, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

import { GraphDataService } from './../graph-data.service';

import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private chart: am4charts.XYChart;

  imageSeries;
  imageSeriesCopy;
  shipmentimageSeries;
  shipmentchart;

  serviceData = []
  dropDownData  = [];
  supplyRegion = [] ;
  supplyPorts = [] ;
  destination = [] ;
  destinationPorts = [] ;

  mapMarkers;

  constructor(private zone: NgZone , private graphDataService : GraphDataService , public router: Router) {}
  
  ngOnInit(){   }

   navigateWithState(markerData) {
    this.router.navigateByUrl('/location', { state: { data: markerData } });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
            this.worldMap();
            this.thermalGraph();
            this.shipmentPerformanceMap();
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
         this.imageSeries = chart.series.push(new am4maps.MapImageSeries());

        // Create image
        var imageSeriesTemplate = this.imageSeries.mapImages.template;
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
           //Saving the data returned from server
           this.serviceData = markerData;
           //Setting Supply Port Data
           this.supplyRegion= [...new Set(markerData.map(item => item['Supply Region']))];
            markerData.forEach(element => {
              //Pushing supply port info into marker data field.
              this.imageSeries.data.push( {latitude : element["Supply Coordinate"].Latitude , 
                                      longitude : element["Supply Coordinate"].Longitude , 
                                      title : element["Supply Port"] , 
                                      markerDetails : element,
                                      flag: "../assets/images/green_marker.svg"});
              //Pushing destination port info into marker data field.
              this.imageSeries.data.push( { latitude : element["Delivery Coordinate"].Latitude ,
                                       longitude : element["Delivery Coordinate"].Longitude , 
                                       title : element["Destination Port"] , 
                                       markerDetails : element,
                                       flag: "../assets/images/blue_marker.svg"});
              });
              this.imageSeriesCopy =this.imageSeries.data;
        })
 
          
      
        marker.events.on("hit", function(ev)  {
          console.log("clicked on ", ev.target.dataItem);
          console.log(this);
          //this.router.navigateByUrl('/location', { state: { data: "markerData" } });
          //this.router.navigate(['/location'], { state: { data: 'off' } })
          //this.navigateWithState(ev.target.dataItem);
          this.zone.run(() => {
            this.navigateWithState(ev.target.dataItem.dataContext);
          })
         },this);
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

  filterDropDownData(selectedItem,key){
    console.log("sel",selectedItem);
    console.log("key",key);
    console.log(this.dropDownData);
  }

  supplyPortFilterDropDownData(selectedItem){
    this.destination = [];
    this.destinationPorts = [];
    this.dropDownData = this.serviceData.filter(element => {return element['Supply Region'] == selectedItem});
    this.supplyPorts= [...new Set(this.dropDownData.map(item => item['Supply Port']))];
    console.log(this.dropDownData);
    this.imageSeries.data = this.imageSeriesCopy.filter(element => {return element.markerDetails['Supply Region'] == selectedItem});
    console.log(this.imageSeries.data);

  }

  destinationFilterDropDownData(selectedItem){
    this.destinationPorts = [];
    this.dropDownData = this.dropDownData.filter(element => {return element['Supply Port'] == selectedItem });
    this.destination= [...new Set(this.dropDownData.map(item => item.Destination))];
  }

  destinationPortFilterDropDownData(selectedItem){
    this.dropDownData = this.dropDownData.filter(element => {return element.Destination == selectedItem });
    this.destinationPorts= [...new Set(this.dropDownData.map(item => item['Destination Port']))];
  }

  allDDSet(selectedItem){
    this.dropDownData = this.dropDownData.filter(element => {return element['Destination Port'] == selectedItem });
    console.log(this.dropDownData);
    this.imageSeries.data = [{
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
    }]; 
  }



shipmentPerformanceMap(){

// Create map instance
 this.shipmentchart = am4core.create("shipmentMap", am4maps.MapChart);

// Set map definition
this.shipmentchart.geodata = am4geodata_worldLow;

// Set projection
this.shipmentchart.projection = new am4maps.projections.Miller();

// Create map polygon series
var polygonSeries = this.shipmentchart.series.push(new am4maps.MapPolygonSeries());

// Exclude Antartica
polygonSeries.exclude = ["AQ"];

// Make map load polygon (like country names) data from GeoJSON
polygonSeries.useGeodata = true;

// Configure series
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = this.shipmentchart.colors.getIndex(0).lighten(0.5);

// Create hover state and set alternative fill color
var hs = polygonTemplate.states.create("hover");
hs.properties.fill = this.shipmentchart.colors.getIndex(0);

// Add image series
this.shipmentimageSeries = this.shipmentchart.series.push(new am4maps.MapImageSeries());
this.shipmentimageSeries.mapImages.template.propertyFields.longitude = "longitude";
this.shipmentimageSeries.mapImages.template.propertyFields.latitude = "latitude";
this.shipmentimageSeries.data = [ {
  "title": "Brussels",
  "latitude": 50.8371,
  "longitude": 4.3676
}, {
  "title": "Copenhagen",
  "latitude": 55.6763,
  "longitude": 12.5681
}, {
  "title": "Paris",
  "latitude": 48.8567,
  "longitude": 2.3510
}, {
  "title": "Reykjavik",
  "latitude": 64.1353,
  "longitude": -21.8952
}, {
  "title": "Moscow",
  "latitude": 55.7558,
  "longitude": 37.6176
}, {
  "title": "Madrid",
  "latitude": 40.4167,
  "longitude": -3.7033
}, {
  "title": "London",
  "latitude": 51.5002,
  "longitude": -0.1262,
  "url": "http://www.google.co.uk"
}, {
  "title": "Peking",
  "latitude": 39.9056,
  "longitude": 116.3958
}, {
  "title": "New Delhi",
  "latitude": 28.6353,
  "longitude": 77.2250
}, {
  "title": "Tokyo",
  "latitude": 35.6785,
  "longitude": 139.6823,
  "url": "http://www.google.co.jp"
}, {
  "title": "Ankara",
  "latitude": 39.9439,
  "longitude": 32.8560
}, {
  "title": "Buenos Aires",
  "latitude": -34.6118,
  "longitude": -58.4173
}, {
  "title": "Brasilia",
  "latitude": -15.7801,
  "longitude": -47.9292
}, {
  "title": "Ottawa",
  "latitude": 45.4235,
  "longitude": -75.6979
}, {
  "title": "Washington",
  "latitude": 38.8921,
  "longitude": -77.0241
}, {
  "title": "Kinshasa",
  "latitude": -4.3369,
  "longitude": 15.3271
}, {
  "title": "Cairo",
  "latitude": 30.0571,
  "longitude": 31.2272
}, {
  "title": "Pretoria",
  "latitude": -25.7463,
  "longitude": 28.1876
} ];

// add events to recalculate map position when the map is moved or zoomed
this.shipmentchart.events.on( "ready", this.updateCustomMarkers,this);
this.shipmentchart.events.on( "mappositionchanged", this.updateCustomMarkers,this );
}



// this function will take current images on the map and create HTML elements for them
updateCustomMarkers( event) {
  // go through all of the images
  this.shipmentimageSeries.mapImages.each((image) => {
    // check if it has corresponding HTML element
    if (!image.dummyData || !image.dummyData.externalElement) {
      // create onex
      image.dummyData = {
        externalElement: this.createCustomMarker(image)
      };
    }

    // reposition the element accoridng to coordinates
    var xy = this.shipmentchart.geoPointToSVG( { longitude: image.longitude, latitude: image.latitude } );
    image.dummyData.externalElement.style.top = xy.y + 'px';
    image.dummyData.externalElement.style.left = xy.x + 'px';
  });
  
  console.log(this.shipmentimageSeries.mapImages);
  //console.log(this.shipmentchart);
  //console.log(this.shipmentimageSeries.data.dummyData);

}

// this function creates and returns a new marker element
createCustomMarker( image ) {
  var chart = image.dataItem.component.chart;

  // create holder
  var holder = document.createElement( 'div' );
  holder.className = 'map-marker';
  holder.title = image.dataItem.dataContext.title;
  holder.style.position = 'absolute';

  // maybe add a link to it?
  if ( undefined != image.url ) {
    holder.onclick = function() {
      window.location.href = image.url;
    };
    holder.className += ' map-clickable';
  }

  // create dot
  var dot = document.createElement( 'div' );
  dot.className = 'dot';
  holder.appendChild( dot );

  // create pulse
  var pulse = document.createElement( 'div' );
  pulse.className = 'pulse';
  holder.appendChild( pulse );

  // append the marker to the map container
  chart.svgContainer.htmlElement.appendChild( holder );
  console.log(chart.svgContainer.htmlElement);
  return holder;

  }


  //Donut charts data
  //FCL donut chart
   fclTitle = 'On time shipments';
   fclType = 'PieChart';
   fclData = [
      ['Sales Point 2nd Qtr', 28],
      ['Sales Point 1st Qtr', 72]
   ];
   fclOptions = {    
      pieHole:0.8,
      chartArea:{left:0,width:'100%',height:'100%'},
      colors:['CDCDCD','white'],
      pieSliceBorderColor:'#6f30a0',
      width: 50,
      height : 50,
      legend:'none'
   }

   //On time shipment donut chart
   otsTitle = 'On time shipments';
   otsType = 'PieChart';
   otsData = [
      ['Sales Point 2nd Qtr', 28],
      ['Sales Point 1st Qtr', 72]
   ];
   otsOptions = {    
      pieHole:0.8,
      chartArea:{left:0,width:'100%',height:'100%'},
      colors:['CDCDCD','white'],
      pieSliceBorderColor:'#6f30a0',
      width: 50,
      height : 50,
      legend:'none'
   }

   //Total Shipments donut chart
   tsTitle = 'On time shipments';
   tsType = 'PieChart';
   tsData = [
      ['Sales Point 2nd Qtr', 28],
      ['Sales Point 1st Qtr', 72]
   ];
   tsOptions = {    
      pieHole:0.8,
      chartArea:{left:0,width:'100%',height:'100%'},
      colors:['CDCDCD','white'],
      pieSliceBorderColor:'#6f30a0',
      width: 50,
      height : 50,
      legend:'none'
   }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });

  }
}
