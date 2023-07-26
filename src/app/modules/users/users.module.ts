import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import {NzCardModule} from 'ng-zorro-antd/card';
import {TableModule} from '@viettel-vss-base/vss-ui';
import {UsersRoutingModule} from './users-routing.module';



@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    NzCardModule,
    TableModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
