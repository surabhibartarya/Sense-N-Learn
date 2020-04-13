import { MatStepperModule } from '@angular/material/stepper';
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

  selectedSupplyRegion;
  selectedSupplyPort;
  selectedDestination;

  markerData;

  polygonSeries;
  spiData = [];
  region = [];
  selectedRegion;
  businessUnit = [];
  selectedBusinessUnit;
  product = [];
  spiISO = [];
  spiMarkers = [];
  mapPosEvent;

 centerFlag : boolean = false;
 zoomed =3;

  spiMapCenter = {
    "EU" : {
      "north" : 81.2804,
      "south" : 35.8316,
      "east" : 180,
      "west" : -67.1968,
      "zoom" : 1
    },
    "APAC" : {
      "north" : 52.0701,
      "south" : -43.6126,
      "east" : 145.3476,
      "west" : 68.1649,
      "zoom" : 2
    }
  }


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
    this.graphDataService.getMarkers().subscribe((serviceData) => {
       this.markerData= Object.values(serviceData);
       this.serviceData = this.markerData;
       this.plotWorldMap();
    })
  }

  plotWorldMap(){
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

        //cc this.graphDataService.getMarkers().subscribe((serviceData) => {
         //cc  let markerData= Object.values(serviceData);
           //Saving the data returned from server
         //cc  this.serviceData = markerData;
           //Setting Supply Port Data
           this.supplyRegion= [...new Set(this.markerData.map(item => item['Supply Region']))];
            this.markerData.forEach(element => {
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
      //cc  })
 
          
      
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

  /* filterDropDownData(selectedItem,key){
    console.log("sel",selectedItem);
    console.log("key",key);
    console.log(this.dropDownData);
  } */

  supplyPortFilterDropDownData(selectedItem){
    this.destination = [];
    this.destinationPorts = [];
    this.selectedSupplyRegion = selectedItem;
    this.dropDownData = this.serviceData.filter(element => {return element['Supply Region'] == selectedItem});
    this.supplyPorts= [...new Set(this.dropDownData.map(item => item['Supply Port']))];
    console.log(this.dropDownData);
    this.imageSeries.data = this.imageSeriesCopy.filter(element => {return element.markerDetails['Supply Region'] == selectedItem});
    console.log(this.imageSeries.data);
    
  }

  destinationFilterDropDownData(selectedItem){
    this.destinationPorts = [];
    this.selectedSupplyPort = selectedItem;
    this.dropDownData = this.serviceData.filter(element => {return element['Supply Port'] == selectedItem && element['Supply Region'] == this.selectedSupplyRegion});
    this.imageSeries.data = this.imageSeriesCopy.filter(element => {return element.markerDetails['Supply Port'] == selectedItem && element.markerDetails['Supply Region'] == this.selectedSupplyRegion});
    this.destination= [...new Set(this.dropDownData.map(item => item.Destination))];
  }

  destinationPortFilterDropDownData(selectedItem){
    this.selectedDestination = selectedItem;
    this.dropDownData = this.serviceData.filter(element => {return element.Destination == selectedItem && element['Supply Region'] == this.selectedSupplyRegion && element['Supply Port'] == this.selectedSupplyPort});
    this.imageSeries.data = this.imageSeriesCopy.filter(element => {return element.markerDetails.Destination == selectedItem && element.markerDetails['Supply Region'] == this.selectedSupplyRegion && element.markerDetails['Supply Port'] == this.selectedSupplyPort});
    this.destinationPorts= [...new Set(this.dropDownData.map(item => item['Destination Port']))];
  }

  allDDSet(selectedItem){
    this.dropDownData = this.serviceData.filter(element => {return element['Destination Port'] == selectedItem && element.Destination == this.selectedDestination && element['Supply Region'] == this.selectedSupplyRegion && element['Supply Port'] == this.selectedSupplyPort});
    this.imageSeries.data = this.imageSeriesCopy.filter(element => {return element.markerDetails['Destination Port'] == selectedItem && element.markerDetails.Destination == this.selectedDestination && element.markerDetails['Supply Region'] == this.selectedSupplyRegion && element.markerDetails['Supply Port'] == this.selectedSupplyPort});
    console.log(this.dropDownData);
  }

  regionSelected(selectedItem){
    this.product = [];
    this.spiISO = [];
    this.spiMarkers = [];
    this.selectedRegion = selectedItem;
    this.businessUnit = this.spiData.filter(element => {return element.Region == selectedItem});
    this.businessUnit[0].countriesISO.forEach(element => {
      this.spiISO.push(element);
    });
    this.spiData.forEach(element => {
      if(element.Region == selectedItem)
      { 
        element.Locations.forEach( item => {
          let markerData = {
            "title": item.Product,
            "latitude": item.Latitude,
            "longitude": item.Longitude,
            "product" : item.Product,
            "bu" : element['Business Unit']
          }
        this.spiMarkers.push(markerData);
        })
      }
    })
    this.centerFlag = true;
    this.plotshipmentPerformanceMap();
    //this.centerCountries();
    //this.updateCustomMarkers(this.mapPosEvent);
    //this.centerCountries();
  }

  businessUnitSelected(selectedItem){
    this.product = [];
    this.selectedBusinessUnit = selectedItem;
    let tempProduct = this.spiData.filter(element => {return element.Region == this.selectedRegion && element['Business Unit'] == selectedItem});
    tempProduct.forEach(element => {
      element.Products.forEach( item => {
        this.product.push(item);
      }) 
    })
    console.log(this.spiMarkers);
    this.deleteMarkerChildren();
    this.shipmentimageSeries.data = this.spiMarkers.filter(element => {return  element.bu == selectedItem});
    //this.shipmentchart.zoomToMapObject(this.polygonSeries.getPolygonById("IN"));
    //this.polygonSeries.zoomLevel = 1;
    //this.centerCountries();
    this.updateCustomMarkers(this.mapPosEvent);
    this.centerCountries();
  }

  productsSelected(selectedItem){
    this.centerCountries();
    this.deleteMarkerChildren();
    this.shipmentimageSeries.data = this.spiMarkers.filter(element => {return  element.product == selectedItem});
  }

  centerCountries(){
    var north, south, west, east, zoom;
    console.log("centerCountries");
    //var zoomTo = ["IN", "CN", "KZ"];

    if(this.selectedRegion == "EU" || this.selectedRegion == "APAC")
    {
      let region  = this.selectedRegion;
      north = this.spiMapCenter[region].north;
      east = this.spiMapCenter[region].east;
      south = this.spiMapCenter[region].south;
      west = this.spiMapCenter[region].west;
      zoom = this.spiMapCenter[region].zoom;
      console.log(north,south,east,west);
      //this.zoomed =this.zoomed + 1;
      //this.shipmentchart.zoomToRectangle(north, east, south, west, 8, true);
      console.log(this.zoomed);
      this.shipmentchart.zoomToRectangle(north, east, south, west, zoom, true);
    }
    
  // Find extreme coordinates for all pre-zoom countries
  else {
          for(let i = 0; i < this.spiISO.length; i++) {
            //for(var i = 0; i < zoomTo.length; i++) {
            var country = this.polygonSeries.getPolygonById(this.spiISO[i]);
            console.log(this.spiISO[i]);
            //var country = this.polygonSeries.getPolygonById(zoomTo[i]);
            if (north == undefined || (country.north > north)) {
              north = country.north;
            }
            if (south == undefined || (country.south < south)) {
              south = country.south;
            }
            if (west == undefined || (country.west < west)) {
              west = country.west;
            }
            if (east == undefined || (country.east > east)) {
              east = country.east;
            }
            country.isActive = true
          }

          // Pre-zoom
          this.shipmentchart.zoomToRectangle(north, east, south, west, 1, true);
          //this.shipmentchart.zoomToRectangle(52.0701, 145.3476, -43.6126, 68.1649, 2, true);  //APAC
          //this.shipmentchart.zoomToRectangle(81.2804, 180, 35.8316, -67.1968, 1, true);   //EU
        }
  }

  shipmentPerformanceMap(){
    this.graphDataService.getSPI().subscribe((data) => {
      this.spiData = Object.values(data);
      this.region = [...new Set(this.spiData.map(item => item.Region))];
      this.plotshipmentPerformanceMap();
    })

  }

  deleteMarkerChildren(){
    this.shipmentimageSeries.mapImages.each(element => {
     // console.log(element);
      //console.log(element.htmlContainer.children.length);
      for(let i=1;i<element.htmlContainer.children.length;i++){
        let instance = element.htmlContainer.children[i];
        instance.parentNode.removeChild(instance);
      }
    })
  }

plotshipmentPerformanceMap(){

    // Create map instance
    this.shipmentchart = am4core.create("shipmentMap", am4maps.MapChart);

    // Set map definition
    this.shipmentchart.geodata = am4geodata_worldLow;

    // Set projection
    this.shipmentchart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    this.polygonSeries = this.shipmentchart.series.push(new am4maps.MapPolygonSeries());

    // Exclude Antartica
    this.polygonSeries.exclude = ["AQ"];
    if(this.spiISO.length > 0)
      this.polygonSeries.include = this.spiISO;

    // Make map load polygon (like country names) data from GeoJSON
    this.polygonSeries.useGeodata = true;

    // Configure series
    var polygonTemplate = this.polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = this.shipmentchart.colors.getIndex(0).lighten(0.5);

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = this.shipmentchart.colors.getIndex(0);

    console.log(this.polygonSeries.include);

    // Add image series
    this.shipmentimageSeries = this.shipmentchart.series.push(new am4maps.MapImageSeries());
    this.shipmentimageSeries.mapImages.template.propertyFields.longitude = "longitude";
    this.shipmentimageSeries.mapImages.template.propertyFields.latitude = "latitude";
    this.shipmentimageSeries.data = this.spiMarkers;
  
      // add events to recalculate map position when the map is moved or zoomed
      this.shipmentchart.events.on( "ready", this.updateCustomMarkers,this);
      this.shipmentchart.events.on( "mappositionchanged", this.updateCustomMarkers,this );

      

  
}



// this function will take current images on the map and create HTML elements for them
updateCustomMarkers( event) {
  /* if(this.centerFlag)
  {
    this.centerCountries();
    
    this.centerFlag = false;
  } */
  if(event.type == "ready")
  this.centerCountries();
  if(event.type == "mappositionchanged")
   this.mapPosEvent =event;
  // go through all of the images
  this.shipmentimageSeries.mapImages.each((image) => {
    // check if it has corresponding HTML element
    if (!image.dummyData || !image.dummyData.externalElement) {
      // create onex
      image.dummyData = {
        externalElement: this.createCustomMarker(image)
      };
      console.log(image.dummyData);
    }

    // reposition the element accoridng to coordinates
    var xy = this.shipmentchart.geoPointToSVG( { longitude: image.longitude, latitude: image.latitude } );
    image.dummyData.externalElement.style.top = xy.y + 'px';
    image.dummyData.externalElement.style.left = xy.x + 'px';
  });
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
