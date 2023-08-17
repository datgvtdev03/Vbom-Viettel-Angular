import { CompanyRoutingModule } from './company-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NotificationModule,
  PermissionModule,
  TableModule,
  TreeModule,
  VssUiControlsModule,
  VssUiDirectivesModule,
} from '@viettel-vss-base/vss-ui';
import { CompanyStaffComponent } from './component/company-staff/company-staff.component';
import { CompanyDepartmentComponent } from './component/company-department/company-department.component';
import { CompanyMandatesComponent } from './component/company-mandates/company-mandates.component';
import { CompanySystemComponent } from './component/company-system/company-system.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { StaffAddComponent } from './component/company-staff/staff-add/staff-add.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {
  DepartmentAddStaffComponent
} from "@vbomApp/modules/category-company/component/company-department/department-add-staff/department-add-staff";
import {
  DepartmentAddComponent
} from "@vbomApp/modules/category-company/component/company-department/department-add/department-add.component";
import {
  CompanyTargetsTreeComponent
} from "@vbomApp/modules/category-company/component/company-targets-tree/company-targets-tree";
import {
  TargetsAddComponent
} from "@vbomApp/modules/category-company/component/company-targets-tree/targets-add/targets-add.component";

@NgModule({
  declarations: [
    CompanyStaffComponent,
    CompanyDepartmentComponent,
    CompanyMandatesComponent,
    CompanySystemComponent,
    CompanyTargetsTreeComponent,
    StaffAddComponent,
    DepartmentAddStaffComponent,
    DepartmentAddComponent,
    TargetsAddComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NotificationModule,
    PermissionModule,
    TableModule,
    TreeModule,
    VssUiControlsModule,
    VssUiDirectivesModule,
    CompanyRoutingModule,
    NzCardModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzRadioModule,
    NzModalModule,
    NzToolTipModule,
  ],
})
export class CompanyModule {}
