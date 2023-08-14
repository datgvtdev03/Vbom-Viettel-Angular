import { Component, OnInit } from '@angular/core';

import {
  BaseListComponent,
  ColumnType,
  SettingTableDynamic,
  TableColum,
  TableComponent,
  VssLoadingService,
} from '@viettel-vss-base/vss-ui';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StaffAddComponent } from './staff-add/staff-add.component';

@Component({
  selector: 'vbom-company-staff',
  templateUrl: './company-staff.component.html',
  styleUrls: ['./company-staff.component.scss'],
})
export class CompanyStaffComponent extends BaseListComponent implements OnInit {
  settingValue: SettingTableDynamic = {
    bordered: true,
    loading: false,
    pagination: false,
    sizeChanger: true,
    title: null,
    footer: null,
    checkbox: false,
    simple: false,
    size: 'small',
    tableLayout: 'auto',
  };
  col: TableColum[] = [
    {
      id: 1,
      name: 'index',
      fixedColumn: false,
      attr: 'STT',
      type: ColumnType.TEXT,
      width: '50px',
      isFilter: false,
      hiddenResize: false,
    },
    {
      id: 2,
      name: 'staffid',
      fixedColumn: false,
      attr: 'Mã nhân viên',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      hiddenResize: false,
      isSort: true,
    },
    {
      id: 3,
      name: 'fullName',
      fixedColumn: false,
      attr: 'Họ và tên',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      hiddenResize: false,
      isSort: true,
    },
    {
      id: 4,
      name: 'department',
      fixedColumn: false,
      attr: 'Phòng ban',
      type: ColumnType.INT,
      width: '150px',
      isFilter: true,
      hiddenResize: false,
      isSort: true,
    },
    {
      id: 5,
      name: 'position',
      fixedColumn: false,
      attr: 'Chức danh',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      hiddenResize: false,
      isSort: true,
    },
    {
      id: 6,
      name: 'permission',
      fixedColumn: false,
      attr: 'Role/Quyền',
      type: ColumnType.TEXT,
      width: '200px',
      isFilter: true,
      isSort: true,
      hiddenResize: false,
    },
    {
      id: 7,
      name: 'email',
      fixedColumn: false,
      attr: 'Email',
      type: ColumnType.TEXT,
      width: '200px',
      isFilter: true,
      isSort: true,
      hiddenResize: false,
    },
    {
      id: 8,
      name: 'sex',
      fixedColumn: false,
      attr: 'Giới tính',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      isSort: true,
    },
    {
      id: 9,
      name: 'phone',
      fixedColumn: false,
      attr: 'SĐT',
      isSort: true,
      type: ColumnType.TEXT,
      // options: Status,
      width: '150px',
      isFilter: true,
      hiddenResize: false,
    },
    {
      id: 10,
      name: 'createdUser',
      fixedColumn: false,
      attr: 'Người tạo',
      type: ColumnType.TEXT_CENTER,
      isSort: true,
      isFilter: true,
      width: '250px',
      filter: { type: ColumnType.DATE_RANGE_PICKER },
      defaultSort: 'desc',
    },
    {
      id: 11,
      name: 'updatedUser',
      fixedColumn: false,
      attr: 'Người cập nhật',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      hiddenResize: false,
      isSort: true,
    },
    {
      id: 12,
      name: 'updatedDate',
      fixedColumn: false,
      attr: 'Ngày cập nhật',
      type: ColumnType.TEXT_CENTER,
      isSort: true,
      isFilter: true,
      width: '250px',
      filter: { type: ColumnType.DATE_RANGE_PICKER },
      // defaultSort: 'desc'
    },
    {
      id: 13,
      name: 'action',
      fixedColumn: false,
      attr: 'Thao tác',
      type: ColumnType.ACTION,
      action: { isEditOfStatus: true },
      rulesAction: { isEdit: ['ROLE_USER_UPDATE'] },
      width: '85px',
      hiddenResize: false,
    },
  ];
  listOfData: any[] = [];

  constructor(private nzModalService: NzModalService) {
    super();
  }

  editUser(item: any) {
    this.nzModalService
      .create({
        nzTitle: 'Sửa thông tin nhân viên',
        nzContent: StaffAddComponent,
        nzWidth: '80%',
        nzMaskClosable: false,
        nzFooter: null,
        nzCentered: true,
        nzComponentParams: {
          item: item,
        },
      })
      .afterClose.subscribe((res) => {
      if (res) {
        this.onPageIndexChange(1);
      }
    });
  }

  addConfig() {
    this.nzModalService
      .create({
        nzTitle: 'Thêm mới nhân viên',
        nzContent: StaffAddComponent,
        nzWidth: '80%',
        nzMaskClosable: false,
        nzFooter: null,
        nzCentered: true,
        nzComponentParams: {
          item: null,
        },
      })
      .afterClose.subscribe((res) => {
      if (res) {
        this.onPageIndexChange(1);
      }
    });
  }
}
