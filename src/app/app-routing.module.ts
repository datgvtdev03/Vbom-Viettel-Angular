import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutFullComponent} from './layout/layout-full/layout-full.component';
import {PermissionModule} from '@viettel-vss-base/vss-ui';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {
    path: '',
    component: LayoutFullComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(d => d.DashboardModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'sample',
        loadChildren: () => import('./modules/sample/sample.module').then(m => m.SampleModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'company',
        loadChildren: () =>
          import('./modules/category-company/company.module').then(
            (m) => m.CompanyModule
          ),
      },
    ]
  },
  // {
  //   path: '**',
  //   redirectTo: 'dashboard'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule,
    PermissionModule
  ]
})
export class AppRoutingModule { }
