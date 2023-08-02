import { RouterModule, Routes } from '@angular/router';
import { AccessLogManagementComponent } from './access-log-management/access-log-management.component';
import { FunctionManagementComponent } from './function-management/function-management.component';
import { LogHistoryManagementComponent } from './log-history-management/log-history-management.component';
import { ParamConfigManagementComponent } from './param-config-management/param-config-management.component';
import { PermissionDataManagementComponent } from './permission-data-management/permission-data-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { FunctionListComponent } from './function-management/function-list/function-list.component';
import { UserListComponent } from './user-management/user-list/user-list.component';
import {PermissionGuard} from '@viettel-vss-base/vss-ui';

const routes: Routes = [
  { path: '', redirectTo: '/admin/user-management', pathMatch: 'full' },
  { path: 'access-log-management', component: AccessLogManagementComponent, canActivate:[PermissionGuard], data:{roles:['ROLE_ACCESS_LOG_VIEW']} },
  { path: 'function-management', component: FunctionManagementComponent, canActivate:[PermissionGuard], data:{roles:['ROLE_FUNCTION_VIEW','ROLE_MODULE_VIEW']}  },
  { path: 'log-history-management', component: LogHistoryManagementComponent, canActivate: [PermissionGuard], data: {roles: ['ROLE_HISTORY_LOG_VIEW']} },
  { path: 'param-config-management', component: ParamConfigManagementComponent, canActivate:[PermissionGuard], data:{roles:['ROLE_APP_CONFIG_VIEW']} },
  { path: 'permission-data-management', component: PermissionDataManagementComponent, canActivate:[PermissionGuard], data:{roles:['ROLE_USER_VIEW','ROLE_USER_STORE_VIEW','ROLE_USER_STORE_VIEW_ERP']} },
  { path: 'user-management', component: UserManagementComponent, canActivate:[PermissionGuard], data:{roles:['ROLE_ROLEGROUP_VIEW','ROLE_USER_BY_ROLEGROUP_VIEW']}  },
  { path: 'user-management/user-list', component: UserListComponent, canActivate:[PermissionGuard], data:{roles:['ROLE_USER_VIEW']}  },
  { path: 'function-list', component: FunctionListComponent, canActivate:[PermissionGuard], data:{roles:['ROLE_FUNCTION_VIEW']}   },
];

export const AdminRoutes = RouterModule.forChild(routes);
