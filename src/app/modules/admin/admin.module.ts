import { PermissionDataManagementComponent } from './permission-data-management/permission-data-management.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AccessLogManagementComponent } from './access-log-management/access-log-management.component';
import { AdminRoutes } from './admin.routing';
import { FunctionManagementComponent } from './function-management/function-management.component';
import { LogHistoryManagementComponent } from './log-history-management/log-history-management.component';
import { ParamConfigManagementComponent } from './param-config-management/param-config-management.component';
import { CreateOrEditPermissionComponent } from './user-management/create-or-edit-permission/create-or-edit-permission.component';
import { EditUserPermissionComponent } from './user-management/edit-user-permission/edit-user-permission.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AddUserPermissionOfListUserComponent } from './user-management/add-user-permission-of-list-user/add-user-permission-of-list-user.component';
import { RoleGroupListComponent } from './user-management/role-group-list/role-group-list.component';
import { CreateOrEditFunctionComponent } from './function-management/create-or-edit-function/create-or-edit-function.component';
import { UpdateItemFunctionComponent } from './function-management/update-item-function/update-item-function.component';
import { CreateAndUpdateDataPermissionComponent } from './permission-data-management/create-and-update-data-permission/create-and-update-data-permission.component';
import { CreateAndUpdateConfigComponent } from './param-config-management/create-and-update-config/create-and-update-config.component';
import { AddFunctionsComponent } from './function-management/add-functions/add-functions.component';
import { FunctionListComponent } from './function-management/function-list/function-list.component';
import { UserListComponent } from './user-management/user-list/user-list.component';
import {
    NotificationModule,
    PermissionModule,
    TableModule,
    TreeModule,
    VssUiControlsModule, VssUiDirectivesModule
} from '@viettel-vss-base/vss-ui';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
@NgModule({
    imports: [
        CommonModule,
        AdminRoutes,
        NzTabsModule,
        NzMenuModule,
        NzIconModule,
        NzLayoutModule,
        NzDropDownModule,
        FormsModule,
        TableModule,
        VssUiControlsModule,
        NzCardModule,
        TreeModule,
        PermissionModule,
        NzButtonModule,
        NzFormModule,
        NotificationModule,
        NzRadioModule,
        NzInputModule,
        VssUiDirectivesModule,
        NzModalModule,
        NzToolTipModule,
    ],
  declarations: [
    UserManagementComponent,
    AccessLogManagementComponent,
    FunctionManagementComponent,
    LogHistoryManagementComponent,
    ParamConfigManagementComponent,
    PermissionDataManagementComponent,
    CreateOrEditPermissionComponent,
    EditUserPermissionComponent,
    AddUserPermissionOfListUserComponent,
    RoleGroupListComponent,
    CreateOrEditFunctionComponent,
    UpdateItemFunctionComponent,
    CreateAndUpdateDataPermissionComponent,
    CreateAndUpdateConfigComponent,
    UserListComponent,
    AddFunctionsComponent,
    FunctionListComponent,
  ]
})
export class AdminModule { }
