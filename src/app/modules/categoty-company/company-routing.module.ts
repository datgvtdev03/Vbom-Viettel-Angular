import { CompanySystemComponent } from './component/company-system/company-system.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyStaffComponent } from './component/company-staff/company-staff.component';
import { CompanyDepartmentComponent } from './component/company-department/company-department.component';
import { CompanyMandatesComponent } from './component/company-mandates/company-mandates.component';

const routes: Routes = [
  {
    path: 'staff',
    component: CompanyStaffComponent,
  },
  {
    path: 'department',
    component: CompanyDepartmentComponent,
  },
  {
    path: 'mandates',
    component: CompanyMandatesComponent,
  },
  {
    path: 'system',
    component: CompanySystemComponent,
  },
  {
    path: 'targets',
    component: CompanySystemComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
})
export class CompanyRoutingModule {}
