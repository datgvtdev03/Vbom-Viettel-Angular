import {Component, OnInit} from '@angular/core';

import {EditUserPermissionComponent} from "../edit-user-permission/edit-user-permission.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {Observable} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {tap} from "rxjs/operators";
import * as moment from "moment";
import {BaseListComponent, ColumnType, SettingTableDynamic, TableColum} from '@viettel-vss-base/vss-ui';
import {EnumSelectOptionType} from '@vbomApp/modules/shares/enum/constants';
import {Status} from '@vbomApp/modules/shares/enum/options.constants';
import {AdminService} from '@vbomApp/service/admin.service';

@Component({
  selector: 'vbom-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends BaseListComponent implements OnInit {
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
    { id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '50px', isFilter: false, hiddenResize: false },
    { id: 2, name: 'userName', fixedColumn: false, attr: 'Tên đăng nhập', type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false, isSort: true },
    { id: 3, name: 'fullName', fixedColumn: false,
      filter: {name: 'usernameList', selectOptionsType: EnumSelectOptionType.user, multiple: true, type: ColumnType.SELECT},
      attr: 'Họ và tên', type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false , isSort: true},
    { id: 4, name: 'phoneNumber', fixedColumn: false, attr: 'Số điện thoại', type: ColumnType.INT, width: '150px', isFilter: true, hiddenResize: false, isSort: true },
    { id: 5, name: 'email', fixedColumn: false, attr: 'Email', type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false , isSort: true},
    { id: 6, name: 'areaName', fixedColumn: false, attr: 'Khu vực', type: ColumnType.TEXT, width: '200px', isFilter: true, isSort: true,
      filter: {name: 'areaIdList', selectOptionsType: EnumSelectOptionType.area, type: ColumnType.SELECT_INT, multiple: true}, hiddenResize: false },
    { id: 7, name: 'defaultStoreName', fixedColumn: false, attr: 'Kho', type: ColumnType.TEXT, width: '200px', isFilter: true, isSort: true,
      filter: {name: 'defaultStoreId', selectOptionsType: EnumSelectOptionType.stores, type: ColumnType.SELECT_INT, multiple: true}, hiddenResize: false },
    { id: 8, name: 'positionName', fixedColumn: false, attr: 'Chức vụ', type: ColumnType.TEXT, width: '150px', isFilter: true, isSort: true,
      filter: {name: 'positionId', selectOptionsType: EnumSelectOptionType.position, type: ColumnType.SELECT_INT, multiple: true} },
    { id: 9, name: 'isActive', fixedColumn: false, attr: 'Trạng thái', isSort: true,
      type: ColumnType.TAG,
      options: Status,
      width: '150px', isFilter: true, hiddenResize: false, filter: {type: ColumnType.SELECT, options: Status} },
    {
      id: 10,
      name: 'createdDate',
      fixedColumn: false,
      attr: 'Ngày tạo',
      type: ColumnType.TEXT_CENTER,
      isSort: true,
      isFilter: true,
      width: '250px',
      filter:{ type: ColumnType.DATE_RANGE_PICKER},
      defaultSort: 'desc'
    },
    { id: 11, name: 'updatedUser', fixedColumn: false,
      filter: {name: 'updatedUser', selectOptionsType: EnumSelectOptionType.user, multiple: true, type: ColumnType.SELECT},
      attr: 'Người cập nhật', type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false , isSort: true},
    {
      id: 12,
      name: 'updatedDate',
      fixedColumn: false,
      attr: 'Ngày cập nhật',
      type: ColumnType.TEXT_CENTER,
      isSort: true,
      isFilter: true,
      width: '250px',
      filter:{ type: ColumnType.DATE_RANGE_PICKER},
      // defaultSort: 'desc'
    },
    { id: 13, name: 'action', fixedColumn: false, attr: 'Thao tác', type: ColumnType.ACTION,
      action: { isEditOfStatus: true }, rulesAction: {isEdit: ['ROLE_USER_UPDATE']}, width: '85px', hiddenResize: false }
  ];
  listOfData: any[] = [];
  // updatedDate vs updatedUser
  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private adminService: AdminService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setupStreamSearch()
  }

  apiSearch(payload: any): Observable<any> {
    const filterData: any = this.searchBind$.value.filterData;
    const format1 = "DD/MM/YYYY";
    let payloadOld: any ={}
    Object.keys(filterData).filter(x => !x.includes('_')).forEach(
      x =>  payloadOld[x] = filterData[x]
    )

    payloadOld = {
      // ...payloadOld,
      isActive: filterData?.isActive != undefined ? filterData?.isActive : null,
      // departmentId: filterData?.departmentId || [],
      storeIds: filterData?.defaultStoreId || [],
      fullName: filterData?.fullName,
      phoneNumber: filterData?.phoneNumber || null,
      email: filterData?.email || null,
      areaIdList: filterData?.areaIdList || [],
      positionId: filterData?.positionId || [],
      username: filterData?.userName,
      usernameList: filterData?.usernameList,
      isRole: null,
      updatedUser: filterData?.updatedUser || [],
      fromCreatedDate: filterData?.createdDate?.length ? moment(filterData?.createdDate[0]).format(format1)?.toString() : null,
      toCreatedDate: filterData?.createdDate?.length ? moment(filterData?.createdDate[1]).format(format1)?.toString() : null,
      fromUpdatedDate: filterData?.updatedDate?.length ? moment(filterData?.updatedDate[0]).format(format1)?.toString() : null,
      toUpdatedDate: filterData?.updatedDate?.length ? moment(filterData?.updatedDate[1]).format(format1)?.toString() : null,
      sortField: payload.sortField?.map((s: any) => {
        return {
          ...s,
          fieldName: s.fieldName.replace(/[A-Z]/g, (v: string) => `_${v.toLowerCase()}`)
        }
      })
    }

    return this.adminService.postSearchStaffCustom(this.paging.pageIndex, this.paging.pageSize, payloadOld)
      .pipe(
        tap(
          res => {
            if (res.code === '00') {
              if (res.data && res.data?.content?.length > 0) {
                this.listOfData = res?.data?.content?.map((b: any,i:number) => ({
                  ...b,
                  index: ((this.paging.pageIndex -1) * this.paging.pageSize) + i + 1,
                  createdDate: b.createdDate ?
                    (moment.unix(b.createdDate / 1000).format('DD/MM/YYYY HH:mm') != 'Invalid Date' ? moment.unix(b.createdDate / 1000).format('DD/MM/YYYY HH:mm') : b.createdDate) : '',
                  updatedDate: b.updatedDate ?
                  (moment.unix(b.updatedDate / 1000).format('DD/MM/YYYY HH:mm') != 'Invalid Date' ? moment.unix(b.updatedDate / 1000).format('DD/MM/YYYY HH:mm') : b.updatedDate) : ''
                }));
                this.paging.totalElements = res?.data.totalElements;
                this.paging.totalPages = res?.data.totalPages;
              }else{
                this.listOfData = [];
                this.paging.totalElements = 0;
                this.paging.totalPages = 0;
              }
            } else {
              this.message.error(res.code);
            }
          }
        )
      )
  }

  editUser(item: any) {
    if (item.isActive) {
      this.modalService.create({
        nzTitle: 'Cập nhật quyền người dùng',
        nzContent: EditUserPermissionComponent,
        nzWidth: '90%',
        nzMaskClosable: false,
        nzFooter: null,
        nzCentered: true,
        nzComponentParams: {
          id: item?.id
        },
      }).afterClose.subscribe((res) => {
        // console.log(res,"tôi là res")
        if(res){
          this.onPageIndexChange(1);
        }
      })
    }
  }

}
