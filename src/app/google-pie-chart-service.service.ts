import { GoogleChartsBaseService } from './google-charts-base-service';
import { Injectable } from '@angular/core';
import { PieChartConfig } from './models/PieChartConfig.model';

declare var google: any;

@Injectable()
export class GooglePieChartServiceService extends GoogleChartsBaseService{

  constructor() {  super(); }

  public BuildPieChart(elementId: String, data: any[], config: PieChartConfig) : void {  
   // var chartFunc = () => { return new google.visualization.PieChart(document.getElementById(elementId)); };
    var options = {
            title: config.title,
            pieHole: config.pieHole,
      };

  //  this.buildChart(data, chartFunc, options);
  }

}
