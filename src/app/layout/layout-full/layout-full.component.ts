import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import {PermissionService, VssAuthService, VssUiTabModel} from '@viettel-vss-base/vss-ui';
import {AuthService} from '../../service/auth.service';
import {DashboardComponent} from '../../modules/dashboard/components/dashboard/dashboard.component';
import {UsersComponent} from '../../modules/users/components/users/users.component';
import {SampleComponent} from '@vbomApp/modules/sample/components/sample/sample.component';

@Component({
  selector: 'vbom-layout-full',
  templateUrl: './layout-full.component.html',
  styleUrls: ['./layout-full.component.scss']
})
export class LayoutFullComponent implements OnInit {
  isHorizontal = environment.config.isHorizontalMenu;
  isCollapsed= true;
  menus = [
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
      "id": "1",
      "level": 1,
      "title": "User",
      "url": "/users",
    },
    {
      "icon": "fa-bars",
      "children": [],
      "id": "1",
      "level": 1,
      "title": "Sample",
      "url": "/sample",
    }
  ]
  dataTabSelector: VssUiTabModel[] = []

  constructor(private vssAuthService: VssAuthService, private apiService: AuthService, private permission: PermissionService) {
    this.dataTabSelector = this.menus?.map(s => {
      let selector = null;
      switch(s.url) {
        case '/sample':
          selector = SampleComponent;
          break;
        case '/users':
          selector = UsersComponent;
          break;
        default:
          selector = DashboardComponent;
          break;
      }
      return {...s, selector: selector};
    });
  }


  changeExpand() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit(): void {
    this.apiService.getUserRoles().subscribe(
      res => {
        this.permission.setRuleUser(res.data);
      }
    )
  }
  logout() {
    this.vssAuthService.logout();
  }

}
