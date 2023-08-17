import { Component, OnInit } from '@angular/core';
import {BaseListComponent, ColumnType, TableColum, TreeNodeOptionsModel} from "@viettel-vss-base/vss-ui";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  DepartmentAddStaffComponent
} from "@vbomApp/modules/category-company/component/company-department/department-add-staff/department-add-staff";
import {
  TargetsAddComponent
} from "@vbomApp/modules/category-company/component/company-targets-tree/targets-add/targets-add.component";

@Component({
  selector: 'vbom-company-targets-tree',
  templateUrl: './company-targets-tree.html',
  styleUrls: ['./company-targets-tree.scss']
})
export class CompanyTargetsTreeComponent extends BaseListComponent implements OnInit
{
  nodes: TreeNodeOptionsModel[] = [
    {
      title: 'Cây đơn vị cấp 1',
      key: '1',
      children: [
        {
          title: 'Cây đơn vị cấp 2',
          key: '1',
          children: [],
        },
        {
          title: 'Cây đơn vị cấp 2.2',
          key: '1',
          children: [
            {
              title: 'Cây đơn vị cấp 3',
              key: '1',
              children: [],
            },
          ],
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
      name: 'targetid',
      fixedColumn: false,
      attr: 'Mã chỉ tiêu',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      hiddenResize: false,
      isSort: true,
    },
    {
      id: 3,
      name: 'targetname',
      fixedColumn: false,
      attr: 'Tên chỉ tiêu',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      hiddenResize: false,
      isSort: true,
    },
    {
      id: 4,
      name: 'congthuc',
      fixedColumn: false,
      attr: 'Công thức',
      type: ColumnType.INT,
      width: '150px',
      isFilter: true,
      hiddenResize: false,
      isSort: true,
    },
    {
      id: 5,
      name: 'from',
      fixedColumn: false,
      attr: 'Từ ngày',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      hiddenResize: false,
      isSort: true,
    },
    {
      id: 6,
      name: 'to',
      fixedColumn: false,
      attr: 'Đến ngày',
      type: ColumnType.TEXT,
      width: '200px',
      isFilter: true,
      isSort: true,
      hiddenResize: false,
    }
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


  constructor(private nzModalService: NzModalService) {
    super();
  }

  ngOnInit(): void {}

  onClickTreeRole(event: any) {}
  openModelUpdate() {}
  deleteRoleGroup() {}
  openModelCopy() {}
  editUser(event: Event) {}
  addStaff() {
    this.nzModalService
      .create({
        nzTitle: 'Thêm mới nhân viên',
        nzContent: TargetsAddComponent,
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
