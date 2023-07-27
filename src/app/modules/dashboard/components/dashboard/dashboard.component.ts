import { Component, OnInit } from '@angular/core';
import {colMock} from './dashboard.column';

@Component({
  selector: 'vbom-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  column = colMock
  constructor() { }

  ngOnInit(): void {
  }

}
