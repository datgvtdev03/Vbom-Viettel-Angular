import { Component, OnInit } from '@angular/core';
import {usersTableColumn} from '../../users.table.column';

@Component({
  selector: 'vbom-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  column = usersTableColumn
  constructor() { }

  ngOnInit(): void {
  }

}
