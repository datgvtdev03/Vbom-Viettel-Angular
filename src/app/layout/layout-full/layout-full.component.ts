import { Component, OnInit } from '@angular/core';
import {
  VssAuthService,
  VssUiBaseNavModel,
  VssUiTabModel
} from '@viettel-vss-base/vss-ui';
import {AuthService} from '../../service/auth.service';
import {DashboardComponent} from '../../modules/dashboard/components/dashboard/dashboard.component';
import {UsersComponent} from '../../modules/users/components/users/users.component';
import {SampleComponent} from '@vbomApp/modules/sample/components/sample/sample.component';
import {AdminService} from '@vbomApp/service/admin.service';
import {ResponseCode} from '@vbomApp/modules/shares/enum/common.enum';
import {environment} from '@vbomEnv/environment';
import {VbomPermissionServiceService} from '@vbomApp/service/vbom-permission-service.service';
import {
  LogHistoryManagementComponent
} from '@vbomApp/modules/admin/log-history-management/log-history-management.component';
import {VssUiNavModel} from '@viettel-vss-base/vss-ui/vss-ui/modules/menu/menu.model';
import {
  AccessLogManagementComponent
} from '@vbomApp/modules/admin/access-log-management/access-log-management.component';
import {UserManagementComponent} from '@vbomApp/modules/admin/user-management/user-management.component';
import {UserListComponent} from '@vbomApp/modules/admin/user-management/user-list/user-list.component';
import {
  ParamConfigManagementComponent
} from '@vbomApp/modules/admin/param-config-management/param-config-management.component';
import {
  PermissionDataManagementComponent
} from '@vbomApp/modules/admin/permission-data-management/permission-data-management.component';
import {FunctionManagementComponent} from '@vbomApp/modules/admin/function-management/function-management.component';
import {FunctionListComponent} from '@vbomApp/modules/admin/function-management/function-list/function-list.component';

@Component({
  selector: 'vbom-layout-full',
  templateUrl: './layout-full.component.html',
  styleUrls: ['./layout-full.component.scss']
})
export class LayoutFullComponent implements OnInit {
  isHorizontal = environment.config.isHorizontalMenu;
  isCollapsed= true;
  menusPermission: VssUiBaseNavModel[] = []
  menus: VssUiNavModel[] = [
    {
      "icon": "fa-tachometer",
      "children": [],
      "id": "1",
      "level": 1,
      "title": "Dashboard",
      "url": "/dashboard",
    },
    {
      "icon": "fa-users",
      "children": [],
      "id": "2",
      "level": 1,
      "title": "User",
      "url": "/users",
    },
    {
      "icon": "fa-bars",
      "children": [],
      "id": "3",
      "level": 1,
      "title": "Sample",
      "url": "/sample",
    }
  ]
  dataTabSelector: VssUiTabModel[] = []

  constructor(
      private vssAuthService: VssAuthService,
      private apiService: AuthService,
      private permission: VbomPermissionServiceService,
      private adminService: AdminService
  ) {
    this.dataTabSelector = [
      {url: '/sample', selector: SampleComponent},
      {url: '/users', selector: UsersComponent},
      {url: '/admin/log-history-management', selector: LogHistoryManagementComponent},
      {url: '/admin/access-log-management', selector: AccessLogManagementComponent},
      {url: '/admin/user-management', selector: UserManagementComponent},
      {url: '/admin/user-management/user-list', selector: UserListComponent},
      {url: '/admin/param-config-management', selector: ParamConfigManagementComponent},
      {url: '/admin/permission-data-management', selector: PermissionDataManagementComponent},
      {url: '/admin/function-management', selector: FunctionManagementComponent},
      {url: '/admin/function-list', selector: FunctionListComponent},
    ]
  }


  ngOnInit(): void {
    this.getMenusPermission()
    this.apiService.getUserRoles().subscribe(
      res => {
        this.permission.setRuleUser(res);
      }
    )
  }
  logout() {
    this.vssAuthService.logout();
  }

  getMenusPermission() {
    this.adminService.getMenusShow()
        .subscribe(
            resp => {
              if (resp.code === ResponseCode.SUCCESS) {
                resp?.data?.filter((x: any) => !!x?.moduleName)
                this.menusPermission = resp?.data
              }
            }
        )
  }

}
