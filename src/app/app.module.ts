import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LocationComponent } from './location/location.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { GooglePieChartServiceService } from './google-pie-chart-service.service';

const appRoutes:Routes = [
  { path:'login', component:LoginComponent },
  { path:'home', component:HomeComponent },
  { path:'location', component:LocationComponent },
  { path:'analytics', component:AnalyticsComponent },
  { path: '', redirectTo: '/login',pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    LocationComponent,
    AnalyticsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GoogleChartsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [GooglePieChartServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
