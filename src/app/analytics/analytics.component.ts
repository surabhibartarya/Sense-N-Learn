import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
   title = 'Number of FCL/LCL Cargo’s';
    type = 'ColumnChart';
    data = [
       ["HAZ CAT 1", 100, 50],
       ["HAZ CAT 2", 80, 60],
       ["HAZ CAT 3", 95, 45],
       ["HAZ CAT 4", 92, 25],
       ["HAZ CAT 1,2&3", 25, 14],
    ];
    columnNames = ['Category', 'FCL','LCL'];
    options ={
      legend: { position: 'top', alignment: 'end' },
      chartArea: {
        //width: '100%'
      },
      //width: '100%',
      series: [{color: '#cc99ff'}, {color: '#6f30a0'}]
    }

   
    //Line Chart configuration

   lineTitle = 'Qty in tons';
   lineType = 'LineChart';
   lineData = [
        ["Jan",  4.3, 2.4],
        ["Feb",  2.5, 4.4],
        ["Mar",  3.5,  1.8],
        ["Apr",  4.5, 2.8],
        ["May",  4.3, 2.4],
        ["Jun",  2.5, 4.4],
        ["Jul",  3.5, 1.8],
        ["Aug",  4.5, 2.8],
        ["Sep",  4.3, 2.4],
        ["Oct",  2.5, 4.4],
        ["Nov",  3.5,  1.8],
        ["Dec",  4.5,  2.8]
   ];
   lineColumnNames = ["Month", "Hazardous", "Non Hazardous"];
   lineOptions = {   
    legend: { position: 'top', alignment: 'end' },
    chartArea: {
      width: '100%'
    },
    hAxis: {
         title: 'Month'
    },
    curveType: 'function',
    pointSize:5,
    series: [{color: '#02b34b'}, {color: '#008bdb'}],
    lineDashStyle: [2, 2]
   };

   //Qty Damage column chart
   columnType = 'ColumnChart';
   columnData = [
      ["Q4 2018", 6000],
      ["Q1 2019", 5800],
      ["Q2 2019", 5200],
      ["Q3 2019", 4900],
      ["Q4 2019", 4500]
   ];
   columnColumnNames = ['Quarter', 'Quantity'];
   columnOptions = {
     legend: { position: 'top', alignment: 'end' },
    chartArea: {
      width: '100%'
    }
  }
    
//On time shipments doughnut chart
   doughnutOneTitle = 'On time shipments';
   doughnutOneType = 'PieChart';
   doughnutOneData = [
      ['Sales Point 2nd Qtr', 28],
      ['Sales Point 1st Qtr', 72]
   ];
   doughnutOneOptions = {    
      pieHole:0.8,
      chartArea:{left:0,width:'50%',height:'75%'},
      colors:['CDCDCD','white'],
      pieSliceBorderColor:'#6f30a0',
      width: 200,
      legend:'none'
   }

   //Freight contribution per shipment
   doughnutTwoTitle = 'Freight contribution per shipment';
   doughnutTwoType = 'PieChart';
   doughnutTwoData = [
      ['Sales Point 2nd Qtr', 11],
      ['Sales Point 1st Qtr', 89]
   ];
   doughnutTwoOptions = {    
      pieHole:0.8,
      chartArea:{left:0,width:'50%',height:'75%'},
      colors:['CDCDCD','white'],
      pieSliceBorderColor:'#6f30a0',
      width: 200,
      legend:'none'
   }

   //Intra warehouse shipments
   doughnutThreeTitle = 'Intra warehouse shipments';
   doughnutThreeType = 'PieChart';
   doughnutThreeData = [
      ['Sales Point 2nd Qtr', 84],
      ['Sales Point 1st Qtr', 16]
   ];
   doughnutThreeOptions = {    
      pieHole:0.8,
      chartArea:{left:0,width:'50%',height:'75%'},
      colors:['CDCDCD','white'],
      pieSliceBorderColor:'#6f30a0',
      width: 200,
      legend:'none'
   }

  constructor() { }

  ngOnInit() {
  }

}
