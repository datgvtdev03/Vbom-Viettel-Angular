import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';
import {
  BaseListComponent,
  ColumnType,
  SettingTableDynamic,
  TableColum
} from '@viettel-vss-base/vss-ui';
import {AdminService} from '@vbomApp/service/admin.service';
import {ResponseCode} from '@vbomApp/modules/shares/enum/common.enum';

@Component({
  selector: 'vbom-role-group-list',
  templateUrl: './role-group-list.component.html',
  styleUrls: ['./role-group-list.component.scss'],
})
export class RoleGroupListComponent
  extends BaseListComponent
  implements OnInit
{
  id: any;
  selectedList: any[] = [];
  lstPosition: any[] = [];
  lstGroup: any[] = [];
  lstDepartment: any[] = [];
  settingValue: SettingTableDynamic = {
    bordered: true,
    loading: false,
    pagination: false,
    sizeChanger: false,
    title: null,
    footer: null,
    checkbox: true,
    simple: false,
    size: 'small',
    tableLayout: 'auto',
    isFilterJs: false
  };
  col: TableColum[] = [
    {
      id: 1,
      name: 'index',
      fixedColumn: false,
      attr: 'STT',
      type: ColumnType.TEXT,
      width: '10%',
      isFilter: false,
    },
    {
      id: 2,
      name: 'roleGroupName',
      fixedColumn: false,
      attr: 'Tên nhóm quyền',
      type: ColumnType.TEXT,
      width: '30%',
      isFilter: true,
      isSort: true,
    },
    {
      id: 3,
      name: 'storeName',
      fixedColumn: false,
      attr: 'Kho',
      type: ColumnType.TEXT,
      width: '25%',
      isFilter: true,
      isSort: true,
      filter: {
        name: 'storeId',
        type: ColumnType.SELECT_INT,
        options: [],
        multiple: true,
      },
    },
    {
      id: 4,
      name: 'positionName',
      fixedColumn: false,
      attr: 'Chức vụ',
      type: ColumnType.SELECT,
      options: [],
      width: '25%',
      isSort: true,
      isFilter: true,
      filter: {
        name: 'positionId',
        type: ColumnType.SELECT_INT,
        options: [],
        multiple: true,
      },
    },
  ];

  listOfData: any[] = [];
  displayRoles: any[] = [];
  roleGroupList: any[]= [];
  constructor(
    private message: NzMessageService,
    private modalRef: NzModalRef,
    private adminService: AdminService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setupStreamSearch();
    this.initData();
  }

  initData() {
    this.adminService.getRoleGroupsList().subscribe((res: any) => {
      this.lstGroup =
        res?.data?.map((x: any) => {
          return { value: x?.id, label: x?.roleGroupName };
        }) || [];
    });
    this.adminService.getPositionList().subscribe((res: any) => {
      this.lstPosition =
        res?.data?.map((x: any) => {
          return { value: x?.id, label: `${x.id} - ${x.positionName}` };
        }) || [];
      const colPos = this.col.find((c) => c.name == 'positionName');
      if (colPos) {
        colPos.filter!.options = this.lstPosition;
      }
    });
    this.adminService.getStoreList().subscribe((res: any) => {
      this.lstDepartment =
        res?.data?.map((x: any) => {
          return { value: x?.id, label: `${x.id} - ${x.storeName}` };
        }) || [];
      const colDep = this.col.find((c) => c.name == 'storeName');
      if (colDep) {
        colDep.filter!.options = this.lstDepartment;
      }
    });
  }

  apiSearch(p: any) {
    const filterData = this.searchBind$.value.filterData;
    let payload: any = {
      storeIds: filterData.storeId || [],
      positionId: filterData.positionId || [],
      roleGroupName: filterData?.roleGroupName || '',
      page: this.paging.pageIndex,
      size: this.paging.pageSize,
    };
    if(p.sortField.length) {
      payload.sort = `${p.sortField[0].fieldName},${p.sortField[0].sort}`
    }
    return this.adminService.searchRoleGroupsList(payload).pipe(
      tap((res) => {
        if (res.code === ResponseCode.SUCCESS) {
          this.paging.totalElements = res?.data?.totalElements;
          this.listOfData = res?.data?.content?.map((x: any, index: number) => {
            return {
              ...x,
              index: (this.paging.pageIndex - 1) * this.paging.pageSize + index + 1,
              checked: this.selectedList?.some((z: any) => z?.id === x?.id),
              // fix disable qua roleGroupList
              disabled: this.roleGroupList?.some((z: any) => z?.id === x?.id),
              // departmentName: x?.department?.departmentName,
              storeName: x?.store?.storeName,
              positionName: x?.position?.positionName
            };
          });
          this.displayRoles = _.clone(this.listOfData);
          this.paging.totalPages = res.data.totalPages;
        }
      })
    );
  }

  getItemSelected(items: any[]) {
    this.selectedList = _.uniqBy([...this.selectedList, ...items], 'id');
  }

  getUnItemSelected(items: any[]) {
    this.selectedList = this.selectedList.filter((el: any) => {
      return items.findIndex((x: any) => x?.id == el?.id) < 0;
    });
  }

  submit() {
    if (!this.selectedList.length) {
      this.message.warning(
        `Bạn cần tích chọn nhóm quyền để đưa vào tài khoản người dùng!`
      );
      return;
    }
    this.modalRef.close(
      this.selectedList?.map((x: any) => {
        return { ...x, disabled: false };
      })
    );
  }

  closeModal() {
    this.modalRef.close();
  }
}
