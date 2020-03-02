import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blockchaincomponent',
  templateUrl: './blockchaincomponent.component.html',
  styleUrls: ['./blockchaincomponent.component.css']
})
export class BlockchaincomponentComponent implements OnInit {
  
  steps = new Array(7);

  constructor() { }

  ngOnInit() {
  }

}
