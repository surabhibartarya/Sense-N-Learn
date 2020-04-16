import { Component, OnInit } from '@angular/core';
import { GraphDataService } from './../graph-data.service';


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
        backgroundColor: '#f8f8f8'
      },
      height: 150,
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
      width: '100%',
      backgroundColor: '#f8f8f8'
    },
    hAxis: {
         title: 'Month'
    },
    curveType: 'function',
    pointSize:5,
    series: [{color: '#02b34b'}, {color: '#008bdb'}],
    lineDashStyle: [2, 2],
    height: 150
   };

   //Qty Damage column chart
   columnType = 'ColumnChart';
   columnData = [];
   columnColumnNames = ['Quarter', 'Quantity'];
   columnOptions = {
     legend: { position: 'top', alignment: 'end' },
    chartArea: {
      width: '100%',
      height:'50%',
      backgroundColor: '#f8f8f8'
    },
    height: 150
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
      chartArea:{width:'90%',height:'75%' , backgroundColor: '#f8f8f8'},
      colors:['CDCDCD','white'],
      pieSliceBorderColor:'#6f30a0',
      pieSliceTextStyle: {
         color: 'black',
       },
      width: 170,
      legend:'none',
      height: 150,
      fontSize: 14
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
      chartArea:{width:'90%',height:'75%', backgroundColor: '#f8f8f8'},
      colors:['CDCDCD','white'],
      pieSliceBorderColor:'#6f30a0',
      pieSliceTextStyle: {
         color: 'black',
       },
      width: 170,
      legend:'none',
      height: 150,
      fontSize: 14
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
      chartArea:{width:'90%',height:'75%', backgroundColor: '#f8f8f8'},
      colors:['CDCDCD','white'],
      pieSliceBorderColor:'#6f30a0',
      pieSliceTextStyle: {
         color: 'black',
       },
      width: 170,
      legend:'none',
      height: 150,
      fontSize: 14,
      
   }

   
  constructor(private graphDataService : GraphDataService) { }

  ngOnInit() {
     this.graphDataService.getDamageShipments().subscribe((data) => {
            let graphData= [];
            let a = Object.values(data);
            a.forEach(element => {
               let tempArr= [];
               let quarter = element.Quarter;
               tempArr.push(quarter);
               let quantity = element.Quantity;
               tempArr.push(quantity);
               graphData.push(tempArr);
            });
            this.columnData = graphData;
     })

     //hazardousProducts service call
     this.graphDataService.getHazardousProducts().subscribe((data) => {
        let graphData= [];
        let arrayHazardousProducts = Object.values(data);
        arrayHazardousProducts.forEach(element => {
            let tempArr= [];
            let month = element.Month;
            tempArr.push(month);
            let hazardous = element.Hazardous;
            tempArr.push(hazardous);
            let nonHazardous = element["Non-Hazardous"];
            tempArr.push(nonHazardous);
            graphData.push(tempArr);
        })
        this.lineData = graphData;
     })

     //hazardousCategory service call
     this.graphDataService.getHazardousCategory().subscribe((data) => {
      let graphData= [];
      let arrayHazardousCategory = Object.values(data);
      arrayHazardousCategory.forEach(element => {
          let tempArr= [];
          let category = element.Category;
          tempArr.push(category);
          let fcl = element.FCL;
          tempArr.push(fcl);
          let lcl = element.LCL;
          tempArr.push(lcl);
          graphData.push(tempArr);
      })
      this.data = graphData;
   })
}
}
