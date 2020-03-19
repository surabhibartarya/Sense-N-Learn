import { Component, NgZone, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
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
    })
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });

  }
}
