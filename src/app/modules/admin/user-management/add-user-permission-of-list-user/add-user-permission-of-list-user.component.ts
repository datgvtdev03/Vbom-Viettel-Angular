import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import * as _ from 'lodash';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {finalize, tap} from 'rxjs/operators';
import {Observable, of} from "rxjs";
import {
    BaseListComponent,
    ColumnType,
    SettingTableDynamic,
    TableColum,
    VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {EnumSelectOptionType} from '@vbomApp/modules/shares/enum/constants';
import {AdminService} from '@vbomApp/service/admin.service';
import {CheckCreateOrUpDateOrCopy} from '@vbomApp/modules/shares/enum/common.enum';

@Component({
    selector: 'vbom-add-user-permission-of-list-user',
    templateUrl: './add-user-permission-of-list-user.component.html',
    styleUrls: ['./add-user-permission-of-list-user.component.scss']
})
export class AddUserPermissionOfListUserComponent extends BaseListComponent implements OnInit {

    @Input() isCheckCreateOrUpdateOrCopy: string = '';
    @Input() userChoseCheck :any[] = [];
    @Output() dataChose = new EventEmitter<any[]>();
    lstDepartment: any[] = [];
    lstPosition: any[] = [];
    settingValue: SettingTableDynamic = {
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
    col: TableColum[] = [
        { id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '50px', isFilter: false, hiddenResize: false },
        { id: 2, name: 'userName', fixedColumn: false, attr: 'Tên đăng nhập', type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false, isSort: true},
        { id: 3, name: 'fullName', fixedColumn: false, isSort: true,
          filter: {name: 'usernameList', selectOptionsType: EnumSelectOptionType.user, multiple: true, type: ColumnType.SELECT},
          attr: 'Họ và tên', type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false },
        { id: 4, name: 'defaultStoreName', fixedColumn: false, attr: 'Kho', isSort: true, type: ColumnType.TEXT, width: '200px', isFilter: true, filter: {name: 'defaultStoreId', options: [], type: ColumnType.SELECT_INT, multiple: true}, hiddenResize: false },
        { id: 5, name: 'positionName', fixedColumn: false, attr: 'Chức vụ', isSort: true, type: ColumnType.TEXT, width: '150px', isFilter: true, filter: {name: 'positionId', options: [], type: ColumnType.SELECT_INT, multiple: true} },
    ];
    listOfData: any[] = [];
    dataChoseCheck: any[] = [];
    params: any = {};

    constructor(
        private message: NzMessageService,
        private loadingService: VssLoadingService,
        private adminService: AdminService,
    ) {
        super();
    }

    ngOnInit(): void {
      this.setupStreamSearch()
        this.getDataInit();
    }

    getDataInit() {
        if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
            || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
            //Phòng ban -> chuyen sang thành kho
            this.loadingService.showLoading();
            this.adminService.getStoreList().pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe(x => {
                if (x.code === '00') {
                    if (x.data && x.data?.length > 0) {
                        this.lstDepartment = x?.data?.map((x: any) => ({ value: x.id, label: `${x.id} - ${x.storeName}`}));
                        let colDep = this.col.find(c => c.name === 'defaultStoreName')
                        if(colDep) {
                          colDep.filter!.options = this.lstDepartment
                        }
                    }
                }
            }, (err) => this.message.error(err.error.error))
            //Chức vụ
            this.loadingService.showLoading();
            this.adminService.getPositionList().pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe(x => {
                if (x.code === '00') {
                    if (x.data && x.data?.length > 0) {
                        this.lstPosition = x?.data?.map((x: any) => ({ value: x.id, label: `${x.id} - ${x.positionName}`}));
                        this.col.filter(c => c.name === 'positionName' && c.isFilter).forEach(
                          c => {
                            c.filter!.options = this.lstPosition
                          }
                        )
                    }
                }
            }, (err) => this.message.error(err.error.error))
        }

    }

    apiSearch(payload: any): Observable<any> {
      const filterData: any = this.searchBind$.value.filterData;
      const payloadOld = {
        departmentId: filterData?.departmentId || [],
        storeIds: filterData?.defaultStoreId || [],
        fullName: filterData?.fullName,
        positionId: filterData?.positionId || [],
        username: filterData?.userName,
        usernameList: filterData?.usernameList,
        isRole: null,
        sortField: payload.sortField?.map((s: any) => {
          return {
            ...s,
            fieldName: s.fieldName.replace(/[A-Z]/g, (v: string) => `_${v.toLowerCase()}`)
          }
        })
      }

      if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
        || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
        return this.adminService.postSearchStaffCustom(this.paging.pageIndex, this.paging.pageSize, payloadOld)
          .pipe(
            tap(
              res => {
                if (res.code === '00') {
                  if (res.data && res.data?.content?.length > 0) {
                    const selected = this.dataChoseCheck.concat(this.userChoseCheck)
                    this.listOfData = res?.data?.content?.map((b: any,i:number) => ({ ...b,
                      checked: selected?.length > 0 ? selected
                        ?.map((y: any) => {
                          return y.id;
                        })
                        ?.some((z: any) => z === b?.id): false,
                        disabled: this.userChoseCheck?.length > 0 ? this.userChoseCheck
                        ?.map((y: any) => {
                          return y.id;
                        })
                        ?.some((z: any) => z === b?.id): false,
                      index: ((this.paging.pageIndex -1) * this.paging.pageSize) + i + 1  }));
                    this.paging.totalElements = res?.data.totalElements;
                    this.paging.totalPages = res?.data.totalPages;
                    if(this.userChoseCheck?.length){
                      this.dataChose.emit(this.userChoseCheck.filter((x:any)=>x.checked===true));
                    }
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
      } else {
        return of()
      }
    }

    itemSelected(event: any) {
        if (event) {
            if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
                || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
                this.dataChoseCheck = [...this.dataChoseCheck, ...event];
                this.dataChose.emit(this.dataChoseCheck);
            }
        }
    }

    itemUnSelected(event: any) {
        if (event) {
            if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
                || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
                for (let index = 0; index < event.length; index++) {
                    _.remove(this.dataChoseCheck, function (n) {
                        return n.id === event[index].id;
                    });
                }
                this.dataChose.emit(this.dataChoseCheck)
            }
        }
    }

    CheckDataChangePage(event : any){
      if(this.dataChoseCheck?.length){
        this.dataChose.emit(this.dataChoseCheck)
      }
    }

}
