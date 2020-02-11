import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
    username:string = "";
    password:string ="";

  constructor(private router:Router) { }

  ngOnInit() {
  }
  login(loginform:NgForm):void{
    console.log(loginform.value);
    this.router.navigateByUrl('home');
  }
  
}
