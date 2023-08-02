import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize, tap } from 'rxjs/operators';

import { CreateAndUpdateConfigComponent } from './create-and-update-config/create-and-update-config.component';
import { filter } from "rxjs/operators";
import { Observable } from "rxjs";
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  BaseListComponent,
  ColumnType,
  SettingTableDynamic,
  TableColum,
  VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {checkData, ResponseCode} from '@vbomApp/modules/shares/enum/common.enum';
import {AdminService} from '@vbomApp/service/admin.service';
import {VbomPermissionServiceService} from '@vbomApp/service/vbom-permission-service.service';

@Component({
  selector: 'vbom-param-config-management',
  templateUrl: './param-config-management.component.html',
  styleUrls: ['./param-config-management.component.scss']
})
export class ParamConfigManagementComponent extends BaseListComponent implements OnInit {
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
  };
  col: TableColum[] = [
    { id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '70px', isFilter: false },
    { id: 2, name: 'configName', fixedColumn: false, attr: 'Nhóm tham số', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 3, name: 'description', fixedColumn: false, attr: 'Mô tả', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 4, name: 'configCode', fixedColumn: false, attr: 'Mã code', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 5, name: 'value', fixedColumn: false, attr: 'Giá trị', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 6, name: 'indexOrder', fixedColumn: false, attr: 'Thứ tự', type: ColumnType.NUMBER, width: '100px', isFilter: true, filter: { type: ColumnType.NUMBER }, isSort: true },
    { id: 7, name: 'createdUser', fixedColumn: false, attr: 'Người tạo', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 8, name: 'createdDate', fixedColumn: false, attr: 'Ngày tạo', type: ColumnType.TEXT_CENTER, width: '150px', isFilter: true, filter: { type: ColumnType.DATE_RANGE_PICKER }, defaultSort: 'desc', isSort: true },
    { id: 9, name: 'updatedUser', fixedColumn: false, attr: 'Người cập nhật', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 10, name: 'updatedDate', fixedColumn: false, attr: 'Ngày cập nhật', type: ColumnType.TEXT_CENTER, isSort: true, isFilter: true, width: '200px', filter: { type: ColumnType.DATE_RANGE_PICKER }, },
    {
      id: 11, name: 'action', fixedColumn: false, attr: 'Thao tác', type: ColumnType.ACTION, rulesAction: { isRemove: ['ROLE_APP_CONFIG_DELETE'], isEdit: ['ROLE_APP_CONFIG_UPDATE'] },
      action: { isRemove: true, isEdit: true }, width: '85px'
    }
  ];
  colRestore: TableColum[] = [
    { id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '70px', isFilter: false },
    { id: 2, name: 'configName', fixedColumn: false, attr: 'Nhóm tham số', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 3, name: 'description', fixedColumn: false, attr: 'Mô tả', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 4, name: 'configCode', fixedColumn: false, attr: 'Mã code', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 5, name: 'value', fixedColumn: false, attr: 'Giá trị', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 6, name: 'indexOrder', fixedColumn: false, attr: 'Thứ tự', type: ColumnType.NUMBER, width: '100px', isFilter: true, filter: { type: ColumnType.NUMBER }, isSort: true },
    { id: 7, name: 'createdUser', fixedColumn: false, attr: 'Người tạo', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 8, name: 'createdDate', fixedColumn: false, attr: 'Ngày tạo', type: ColumnType.TEXT_CENTER, width: '150px', isFilter: true, filter: { type: ColumnType.DATE_RANGE_PICKER }, defaultSort: 'desc', isSort: true },
    { id: 9, name: 'updatedUser', fixedColumn: false, attr: 'Người cập nhật', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
    { id: 10, name: 'updatedDate', fixedColumn: false, attr: 'Ngày cập nhật', type: ColumnType.TEXT_CENTER, isSort: true, isFilter: true, width: '200px', filter: { type: ColumnType.DATE_RANGE_PICKER }, },
  ];
  listOfData: any[] = [];
  listOfDataRestore: any[] = [];
  displayList: any[] = [];
  displayListRestore: any[] = [];
  filter: any;
  dataDeleteChecked: any[] = []; // data xoá 1 or nh
  dataRestoreChecked: any[] = []; // data khôi phục 1 or nh`
  titleList: any = checkData.DU_LIEU_MAC_DINH;
  du_lieu_da_xoa: string = checkData.DU_LIEU_DA_XOA;
  du_lieu_mac_dinh: string = checkData.DU_LIEU_MAC_DINH;


  constructor(
    private message: NzNotificationService,
    private modalService: NzModalService,
    private loadingService: VssLoadingService,
    private adminService: AdminService,
    private permissionService: VbomPermissionServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.permissionService.canActiveRule(['ROLE_APP_CONFIG_VIEW']).pipe(
      filter(c => c)
    ).subscribe(
      () => {
        this.setupStreamSearch()
      }
    )
  }

  apiSearch(payload: any): Observable<any> {
    if (this.titleList === checkData?.DU_LIEU_MAC_DINH) {
      payload = {
        ...payload,
        lsCondition: payload?.lsCondition?.length > 0
          ? payload?.lsCondition?.map((x: any) => ({ ...x }))?.concat({ operator: "EQUAL", property: "isDeleted", propertyType: "boolean", value: false })
          : [{ operator: "EQUAL", property: "isDeleted", propertyType: "boolean", value: false }]
      }
    } else {
      payload = {
        ...payload,
        lsCondition: payload?.lsCondition?.length > 0
          ? payload?.lsCondition?.map((x: any) => ({ ...x }))?.concat({ operator: "EQUAL", property: "isDeleted", propertyType: "boolean", value: true })
          : [{ operator: "EQUAL", property: "isDeleted", propertyType: "boolean", value: true }]
      }
    }

    return this.adminService.searchConfigList(payload).pipe(
      tap((res: any) => {
        if (res.code === ResponseCode.SUCCESS) {
          if (this.titleList === checkData.DU_LIEU_MAC_DINH) {
            this.listOfData = res?.data?.content?.map((x: any, index: number) => {
              return {
                ...x, index: (this.paging.pageIndex - 1) * this.paging.pageSize + index + 1,
                updatedDate: x.updatedDate ?
                  (moment.unix(x.updatedDate / 1000).format('DD/MM/YYYY') != 'Invalid Date' ? moment.unix(x.updatedDate / 1000).format('DD/MM/YYYY') : x.updatedDate) : '',
                checked: this.dataDeleteChecked?.some(b => x?.id === b?.id),
                createdDate: x.createdDate ?
                  (moment.unix(x.createdDate / 1000).format('DD/MM/YYYY') != 'Invalid Date' ? moment.unix(x.createdDate / 1000).format('DD/MM/YYYY') : x.createdDate) : '',
                value: x.isPassword === true ? '.'.repeat(x?.value.length) : x.value,
                newValueAfterPasswordTrue: x.value,
              }
            });
            this.displayList = _.clone(this.listOfData);

          } else if (this.titleList === checkData.DU_LIEU_DA_XOA) {
            this.listOfDataRestore = res?.data?.content?.map((x: any, index: number) => {
              return {
                ...x, index: (this.paging.pageIndex - 1) * this.paging.pageSize + index + 1,
                updatedDate: x.updatedDate ?
                  (moment.unix(x.updatedDate / 1000).format('DD/MM/YYYY') != 'Invalid Date' ? moment.unix(x.updatedDate / 1000).format('DD/MM/YYYY') : x.updatedDate) : '',
                checked: this.dataRestoreChecked?.some(b => x?.id === b?.id),
                createdDate: x.createdDate ?
                  (moment.unix(x.createdDate / 1000).format('DD/MM/YYYY') != 'Invalid Date' ? moment.unix(x.createdDate / 1000).format('DD/MM/YYYY') : x.createdDate) : '',
                value: x.isPassword === true ? '.'.repeat(x?.value.length) : x.value,
                newValueAfterPasswordTrue: x.value,
              }
            });
            this.displayListRestore = _.clone(this.listOfDataRestore);
          }
          this.paging.totalElements = res?.data?.totalElements;
          this.paging.totalPages = res.data.totalPages;
        }
      })
    )
  }

  onFilterData(filter: any) {
    this.filter = filter;
  }

  deleteConfig(item: any) {
    this.loadingService.showLoading();
    this.adminService.deleteConfig([item?.id]).pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe((res: any) => {
      if (res.code === ResponseCode.SUCCESS) {
        this.message.success('',`Xoá tham số thành công`);
        this.onPageIndexChange(1)
      }
    })
  }


  addConfig() {
    this.modalService.create({
      nzTitle: 'Thêm mới tham số',
      nzContent: CreateAndUpdateConfigComponent,
      nzWidth: '80%',
      nzMaskClosable: false,
      nzFooter: null,
      nzCentered: true,
      nzComponentParams: {
        item: null
      },
    }).afterClose.subscribe(res => {
      if (res) {
        this.onPageIndexChange(1)
      }
    })
  }

  updateConfig(item: any) {
    this.modalService.create({
      nzTitle: 'Cập nhật tham số',
      nzContent: CreateAndUpdateConfigComponent,
      nzWidth: '80%',
      nzMaskClosable: false,
      nzCentered: true,
      nzFooter: null,
      nzComponentParams: {
        item: item
      }
    }).afterClose.subscribe(res => {
      if (res) {
        this.onPageIndexChange(1)
      }
    })
  }

  onChangeType(event: any) {
    if (event === checkData.DU_LIEU_MAC_DINH) {
      this.dataRestoreChecked = [];
    } else if (event === checkData.DU_LIEU_DA_XOA) {
      this.dataDeleteChecked = [];
    }
    this.onPageIndexChange(1);
    this.checkDis();
  }

  // thực hiện xoá data xoá 1 or nhiều
  isDisableRestoreData: boolean = true;
  isDisableDeleteData: boolean = true;
  getItemSelected(event: any[]) {
    if (this.titleList === checkData.DU_LIEU_MAC_DINH) {
      this.dataDeleteChecked = this.dataDeleteChecked.concat(event.filter(e => !this.dataDeleteChecked.find(c => e.id == c.id)));
      this.checkDis();
    } else if (this.titleList === checkData.DU_LIEU_DA_XOA) {
      this.dataRestoreChecked = this.dataRestoreChecked.concat(event.filter(e => !this.dataRestoreChecked.find(c => e.id == c.id)));
      this.checkDis();
    }
  }

  getItemUnSelected(items: any[]) {
    if (this.titleList === checkData.DU_LIEU_MAC_DINH) {
      this.dataDeleteChecked = this.dataDeleteChecked.filter(c => !items.find(i => i.id == c.id));
      this.checkDis();
    } else if (this.titleList === checkData.DU_LIEU_DA_XOA) {
      this.dataRestoreChecked = this.dataRestoreChecked.filter(c => !items.find(i => i.id == c.id));
      this.checkDis();
    }
  }

  checkDis(){
    if (this.titleList === checkData.DU_LIEU_MAC_DINH) {
      this.isDisableDeleteData = this.dataDeleteChecked?.length <= 0;
    } else if (this.titleList === checkData.DU_LIEU_DA_XOA) {
      this.isDisableRestoreData = this.dataRestoreChecked?.length <= 0;
    }
  }

  deleteChose() {
    // console.log(this.dataDeleteChecked, " data xoá");
    let payload = [];
    if (this.dataDeleteChecked?.length > 0) {
      payload = this.dataDeleteChecked?.map(x=>x?.id);
      //action
      this.adminService.deleteConfig(payload).pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe((res: any) => {
        if (res.code === ResponseCode.SUCCESS) {
          this.message.success('',`Xoá tham số thành công`);
          this.dataDeleteChecked = [];
          this.onPageIndexChange(1);
          this.checkDis();
        }
      })
    } else {
      this.message.error('',"Bạn cần chọn các tính năng cần xóa!")
    }
  }

  // khôi phục 1 or nh bản ghi
  restoreDataChose() {
    // console.log(this.dataRestoreChecked, " data khôi phục");
    let payload = [];
    if (this.dataRestoreChecked?.length > 0) {
      //action
      payload = this.dataRestoreChecked?.map(x=>x?.id);
      this.adminService.restoreConfig(payload).pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe((res: any) => {
        if (res.code === ResponseCode.SUCCESS) {
          if(res?.data?.isSuccess === true){
            this.message.success('',`Khôi phục tham số thành công`);
            this.dataRestoreChecked = [];
            this.onPageIndexChange(1);
            this.checkDis();
          }else{
            // for(let i = 0; i < res?.data?.error?.length; i++){
              this.message.error('',` Không thể khôi phục các tham số đã tồn tại sau: ${res?.data?.error}`);
            // }
            this.dataRestoreChecked = [];
            this.onPageIndexChange(1);
            this.checkDis();
          }
        }
      })
    } else {
      this.message.error('',"Vui lòng chọn một hay nhiều bản ghi cần khôi phục!")
    }
  }
}
