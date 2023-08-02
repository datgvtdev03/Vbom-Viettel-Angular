import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {catchError, finalize, tap} from 'rxjs/operators';
import {colTable} from "./access-log-management.enum";
import {EMPTY} from "rxjs";
import {
  BaseListComponent,
  SettingTableDynamic,
  TableColum,
  VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {SearchStaffDTOModel} from '@vbomApp/modules/admin/admin.model';
import {PagingModel} from '@vbomApp/app.model';
import {AdminService} from '@vbomApp/service/admin.service';

@Component({
  selector: 'vbom-access-log-management',
  templateUrl: './access-log-management.component.html',
  styleUrls: ['./access-log-management.component.scss']
})
export class AccessLogManagementComponent extends BaseListComponent implements OnInit, OnDestroy {

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
  listOfData: any[] = [];
  lstDepartment: any[] = [];
  col: TableColum[] = colTable;
  data: SearchStaffDTOModel = {
    departmentId: [],
    fullName: '',
    isRole: null,
    positionId: [],
    username: '',
    storeId: []
  };
  paging: PagingModel = {
    pageIndex: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 1
  }

  constructor(
    _fb: FormBuilder,
    private message: NzMessageService,
    private loadingService: VssLoadingService,
    private adminService: AdminService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setupStreamSearch()
    this.getAPI();
  }

  getAPI() {
    //phòng ban
    this.loadingService.showLoading();
    this.adminService.getStoreList().pipe(finalize(() => {
      this.loadingService.hideLoading()
    })).subscribe(x => {
      if (x.code === '00') {
        if (x.data && x.data?.length > 0) {
          this.lstDepartment = x?.data?.map((x: any) => ({value: x.id, label: `${x.id} - ${x.storeName}`}));
          let colDep = this.col.find(c => c.name === 'storeName')
          if (colDep) {
            colDep.filter!.options = this.lstDepartment
          }
        }
      }
    }, (err) => this.message.error(err.error.error));
  }

  payloadEx: any = null;

  apiSearch(payload: any) {
    this.payloadEx = payload;
    return this.adminService.postSearchAccessLog(payload).pipe(
      tap(x => {
        if (x.code === '00') {
          if (x.data && x.data?.content?.length) {
            this.listOfData = x.data?.content?.map((b: any, i: number) => ({
              ...b,
              checked: false,
              index: ((this.paging.pageIndex - 1) * this.paging.pageSize) + i + 1
            }));
            this.paging.totalElements = x?.data.totalElements;
            this.paging.totalPages = x?.data.totalPages;
          } else {
            this.listOfData = [];
            this.paging.totalElements = 0;
            this.paging.totalPages = 0;
          }

        }
      }),
      catchError((err) => {
        this.message.error(err.error.error)
        return EMPTY
      })
    )
  }

  clickSearch(page = 1) {
    this.paging.pageIndex = page;
    this.searchBind$.next(this.searchBind$.value)
  }

  getChangePagination(page = 1) {
    this.clickSearch(page);
  }

  clickExcel() {
    this.loadingService.showLoading();
    this.adminService.exportAccessLog(this.payloadEx).pipe(finalize(() => {
      this.loadingService.hideLoading()
    })).subscribe(x => {
      this.saveToFileSystem(x);
    });
  }

  saveToFileSystem(response: any) {
    this.downloadFile(response, 'Danh sách nhật ký truy cập.xlsx');
  }

  private downloadFile(file: Blob, filename: string): void {
    const blob = new Blob([file], {type: 'application/octet-stream'});
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', filename);
    link.click();
    document.body.removeChild(link);
  }

  onPageSizeChange(event: any) {
    this.paging.pageSize = event;
    this.clickSearch();
  }
}
