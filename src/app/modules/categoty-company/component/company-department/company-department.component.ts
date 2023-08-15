import { Component, OnInit } from '@angular/core';
import {
  BaseListComponent,
  ColumnType,
  SettingTableDynamic,
  TableColum,
  TableComponent, TreeNodeOptionsModel,
  VssLoadingService,
} from '@viettel-vss-base/vss-ui';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  StaffAddComponent
} from "@vbomApp/modules/categoty-company/component/company-staff/staff-add/staff-add.component";
import {
  DepartmentAddStaffComponent
} from "@vbomApp/modules/categoty-company/component/company-department/department-add-staff/department-add-staff";
import {
  DepartmentAddComponent
} from "@vbomApp/modules/categoty-company/component/company-department/department-add/department-add.component";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'vbom-company-department',
  templateUrl: './company-department.component.html',
  styleUrls: ['./company-department.component.scss'],
})
export class CompanyDepartmentComponent
  extends BaseListComponent
  implements OnInit {
  checkedNodes = [];
  nodes: TreeNodeOptionsModel[] = [
    {
      title: 'Cây đơn vị cấp 1',
      key: '1',
      children: [
        {
          title: 'Cây đơn vị cấp 2',
          key: '2',
          children: [],
        },
        {
          title: 'Cây đơn vị cấp 2.2',
          key: '3',
          children: [
            {
              title: 'Cây đơn vị cấp 3',
              key: '4',
              children: [],
            },
            {
              title: 'Cây đơn vị cấp 3.2',
              key: '5',
              children: [],
            },
          ],
        },
        {
          title: 'Cây đơn vị cấp 2.3',
          key: '6',
          children: [],
        },
      ],
    },
  ];
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
      name: 'project',
      fixedColumn: false,
      attr: 'Dự án',
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
  ];
  settingValue: any = {
    bordered: true,
    loading: false,
    pagination: false,
    sizeChanger: true,
    title: null,
    footer: null,
    checkbox: true,
    simple: false,
    size: 'small',
    tableLayout: 'auto',
  };
  listOfData: any[] = [];

  constructor(private nzModalService: NzModalService,
              private message: NzMessageService) {
    super();
  }

  ngOnInit(): void {}
  onClickTreeRole(event: any) {}
  openModelUpdate(event: any) {
      console.log(event)
  }
  deleteRoleGroup(event: any) {
      console.log(event)
  }
  openModelCopy(event: any) {
      console.log(event)
  }
  editUser(event: Event) {}
  deleteTree() {
    this.nzModalService.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Thêm mới nhân viên?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        console.log(this.checkedNodes);
        this.message.success('Xóa thành công!');
      },
    });
  }
  checkedTree(event:any){
    this.checkedNodes = event.keys;
  }
  addStaff() {
    this.nzModalService
      .create({
        nzTitle: 'Thêm mới nhân viên',
        nzContent: DepartmentAddStaffComponent,
        nzWidth: '80%',
        nzMaskClosable: true,
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
  addDepartment() {
    this.nzModalService
      .create({
        nzTitle: 'Thêm mới nhân viên',
        nzContent: DepartmentAddComponent,
        nzWidth: '80%',
        nzMaskClosable: true,
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
