import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { isArray, isObject } from 'lodash';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EMPTY, Observable } from "rxjs";
import { catchError, finalize, tap } from 'rxjs/operators';
import {
  BaseListComponent,
  SettingTableDynamic,
  TableColum,
  VssLoadingService,
  VssTabDynamicService
} from '@viettel-vss-base/vss-ui';
import {
  columnPermissionDataTable,
  columnTable
} from '@vbomApp/modules/admin/log-history-management/log-history-management.column';
import {SearchStaffDTOModel} from '@vbomApp/modules/admin/admin.model';
import {PagingModel} from '@vbomApp/app.model';
import {AdminService} from '@vbomApp/service/admin.service';

@Component({
  selector: 'vbom-log-history-management',
  templateUrl: './log-history-management.component.html',
  styleUrls: ['./log-history-management.component.scss']
})
export class LogHistoryManagementComponent extends BaseListComponent implements OnInit, OnDestroy, OnChanges {
  logHisManagement: boolean = true;
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
  col: TableColum[] =  [...columnTable, ...columnPermissionDataTable];
  listOfData: any[] = [
  ];
  params: any = {};
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
  defaultFilter: any = {
    createdDate: [
      moment().startOf('day').toDate(),
      moment().endOf('day').toDate(),
    ]
  }
  tableLog: any[]=[];
  screen:any = null;
  customerCompletionRateColumns:TableColum[] =[];

  constructor(
    private message: NzMessageService,
    private loadingService: VssLoadingService,
    private adminService: AdminService,
    private tabDynamicService: VssTabDynamicService,
  ) {
    super()
  }

  ngOnInit(): void {
    this.tabDynamicService.getLogHis().subscribe(res => {
      if (res) {
        this.paging.pageSize = 10;
        this.paging.pageIndex = 1;

        this.setupStreamSearch()
      }
    })
  }

  ngOnChanges() {

  }

  payloadEx: any = null;
  apiSearch(payload: any): Observable<any> {
    this.payloadEx = payload;
    return this.adminService.searchLogHistory({...payload, module: this.screen}).pipe(
      tap(x => {
        if (x.code === '00') {
          if (x.data && x.data?.content?.length) {
            this.listOfData = x.data?.content?.map((b: any, i: number) => ({
               ...b,
               user:`${b.username} - ${b.fullName}`,
               ...this.getJsonValue(JSON.parse(b.data),'data'),
               data: JSON.parse(b.data),
               maingroupList: JSON.parse(b.data).subgroup?.maingroupList?.map((mainGroup:any)=>(mainGroup?.maingroupName))?.toString(),
              checked: false, index: ((this.paging.pageIndex - 1) * this.paging.pageSize) + i + 1,
            id:((this.paging.pageIndex - 1) * this.paging.pageSize) + i + 1  }));
            this.paging.totalElements = x?.data.totalElements;
            this.paging.totalPages = x?.data.totalPages;
          } else {
            this.listOfData = [];
            this.paging.totalElements = 0;
            this.paging.totalPages = 0;
          }
        }
      }),
      catchError(err => {
        this.message.error(err.error.error)
        return EMPTY
      })
    )
  }
  getScreen(){
    if( this.screen === 'customer_completion_rate_history'){
      if(this.customerCompletionRateColumns.length){
        this.col = this.customerCompletionRateColumns;
      }
    }else{
      this.col = this.tableLog.find(x=> x.value === this.screen)?.columns || [];
    }
    const data = {...this.searchBind$.value, module: this.screen};
    this.searchBind$.next(data)
  }

  getJsonValue(data: any, property?: string) {
    let result: any = {};
    Object.keys(data)?.forEach(key => {
      if (isArray(data[key])) {
        data[key].forEach((x: any, i: number) => {
          if (isObject(x)) {
            result = { ...result, ...this.getJsonValue(x, `${key}[${i}]`) }
          } else {
            result[property ? `${property}.${key}` : `${key}`] = data[key];
          }
        })
      } else {
        if (isObject(data[key])) {
          Object.keys(data[key])?.forEach(key1 => {
            result[property ? `${property}.${key}.${key1}` : `${key}.${key1}`] = data[key][key1];
          })
        } else {
          result[property ? `${property}.${key}` : `${key}`] = data[key];
        }
      }
    });
    return result;
  }

  downloadFile(value:any){
    this.loadingService.showLoading();
    this.adminService.downloadFile(value?.data['data.attachFileId'])
    .pipe(finalize(()=> this.loadingService.hideLoading()))
    .subscribe(x=>{
    const blob = new Blob([x], { type: 'application/octet-stream' });
    var link = document.createElement('a');
    document.body.appendChild(link);
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', value?.data['data.fileName']);
    link.click();
    document.body.removeChild(link);
    })

  }
}
