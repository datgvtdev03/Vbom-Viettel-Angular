import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Observable} from "rxjs";
import {finalize, tap} from 'rxjs/operators';
import {
  CreateAndUpdateDataPermissionComponent
} from './create-and-update-data-permission/create-and-update-data-permission.component';
import {
  BaseListComponent,
  ColumnType,
  SettingTableDynamic,
  TableColum,
  VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {EnumSelectOptionType} from '@vbomApp/modules/shares/enum/constants';
import {AdminService} from '@vbomApp/service/admin.service';
import {ResponseCode} from '@vbomApp/modules/shares/enum/common.enum';

@Component({
  selector: 'vbom-permission-file-management',
  templateUrl: './permission-data-management.component.html',
  styleUrls: ['./permission-data-management.component.scss']
})
export class PermissionDataManagementComponent extends BaseListComponent implements OnInit {
  pageSizeOptions: number[] = [5, 10, 30, 50, 100, 500];
  pageSize: number = 5;
  listOfData: any[] = [];
  col: TableColum[] = [
    { id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width:'7%', isFilter: false },
    { id: 2, name: 'codeAndName', fixedColumn: false, attr: 'Tên người dùng', type: ColumnType.TEXT , width:'20%', isFilter: true, isSort: true,
      filter:{name:'usernameList', type: ColumnType.SELECT, selectOptionsType: EnumSelectOptionType.user, multiple: true } },
    { id: 3, name: 'defaultStoreName', fixedColumn: false, attr: 'Kho', type: ColumnType.SELECT, options: [], filter: {type: ColumnType.SELECT_INT, options: [], multiple: true, name: 'defaultStoreId'}, width:'20%', isFilter: true,isSort: true, },
    { id: 4, name: 'positionName', fixedColumn: false, attr: 'Chức vụ', type: ColumnType.SELECT, options: [], filter: {type: ColumnType.SELECT_INT, options: [], multiple: true, name: 'positionId'}, width:'20%', isFilter: true, isSort: true, },
    { id: 5, name: 'workingPositionName', fixedColumn: false, attr: 'Kiêm nhiệm', type: ColumnType.SELECT, width:'20%', isFilter: true , filter: {type: ColumnType.SELECT_INT, options: [], multiple: true, name: 'workingPositionId'}, isSort: true, },
    { id: 6,
      name: 'action',
      fixedColumn: false, attr: 'Thao tác',
      type: ColumnType.ACTION,
      action: { isRemove: true, isEdit: true },
      rulesAction: { isRemove: ['ROLE_USER_DATA_DELETE'], isEdit: ['ROLE_USER_DATA_UPDATE'] },
      width: '7%' }
  ];

  col2: TableColum[] = [
    { id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width:'10%', isFilter: false },
    { id: 2, name: 'id', fixedColumn: false, attr: 'Mã kho', type: ColumnType.TEXT , width:'20%', isFilter: true, isSort: true },
    { id: 4, name: 'storeName', fixedColumn: false, attr: 'Tên kho', type: ColumnType.SELECT, options: [], width:'70%',
      isFilter: true, filter: {type: ColumnType.SELECT_INT, multiple: true, selectOptionsType: EnumSelectOptionType.stores, name: 'id'}, isSort: true  }
  ];

  col3: TableColum[] = [
    { id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width:'10%', isFilter: false },
    { id: 2, name: 'fullName', fixedColumn: false, attr: 'Họ và tên', type: ColumnType.TEXT , width:'45%', isFilter: true, isSort: true, filter: {name: 'userName', multiple: true, selectOptionsType: EnumSelectOptionType.user, type: ColumnType.SELECT} },
    { id: 4, name: 'positionName', fixedColumn: false, attr: 'Chức vụ', type: ColumnType.SELECT, options: [], width:'45%', isFilter: true, filter: {type: ColumnType.SELECT_INT, name: 'positionId', multiple: true}, isSort: true  }
  ];
  settingValue: SettingTableDynamic = {
    isFilterJs: true,
    bordered: true,
    loading: false,
    pagination: true,
    sizeChanger: true,
    title: null,
    footer: null,
    checkbox:   false,
    simple: false,
    size: 'small',
    tableLayout: 'auto',
  };
  listOfStore: any[]=[];
  listOfEmployee: any[]=[];
  currentUser: any;
  currentStore: any;
  data: any = {};
  checkPermissionData: boolean = true;


  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private loadingService: VssLoadingService,
    private adminService: AdminService,
  ) {
    super();
  }


  ngOnInit(): void {
    this.paging.pageSize = 5;
    this.setupStreamSearch()
    this.getAPI()
  }


  addNew(){
    this.modalService.create({
      nzTitle: 'Thêm mới phân quyền dữ liệu',
      nzContent: CreateAndUpdateDataPermissionComponent,
      nzWidth: '90%',
      nzMaskClosable: false,
      nzCentered: true,
      nzFooter: null,
      nzComponentParams: {
        user: null,
        selectedStoreList: []
      }
    }).afterClose.subscribe(res=>{
      if(res){
        this.onPageIndexChange(1)
      }
    })
  }

  apiSearch(payload: any): Observable<any> {
    this.listOfData = [];
    this.listOfStore = [];
    this.listOfEmployee = [];
    const filterData: any = this.searchBind$.value.filterData
    const payloadOld: any = {
      storeIds: filterData?.defaultStoreId || [],
      otherWorkingPositionId: filterData?.workingPositionId || [],
      fullName: filterData?.fullName,
      positionId: filterData?.positionId || [],
      usernameList: filterData?.usernameList || [],
      username: null,
      isRole: true,
      sortField: payload.sortField?.map((s: any) => {
        return {
          ...s,
          fieldName: s.fieldName.replace(/[A-Z]/g, (v: string) => `_${v.toLowerCase()}`)
        }
      })
    }
    return this.adminService.postSearchStaffCustom(this.paging.pageIndex, this.paging.pageSize,  payloadOld)
      .pipe(
        tap(res => {
          if (res.code === ResponseCode.SUCCESS) {
            this.listOfData = res?.data?.content?.map((b: any, index: number) => ({ ...b, checked: false, index: (this.paging.pageIndex - 1) * this.paging.pageSize + index + 1, codeAndName: b?.userName + " - " + b?.fullName})) || [];
            this.paging.totalElements = res.data.totalElements || 0;
            this.paging.totalPages = res.data.totalPages || 0;
            if(this.listOfData?.length){
              this.viewStoreByUser(this.listOfData[0])
            }
          }
        })
      )
  }

  search(page:number = 1){

  }


  getAPI() {
    //phòng ban
    this.adminService.getStoreList().pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe(x => {
      if (x.code === '00') {
        if (x.data && x.data?.length > 0) {
          let colDep = this.col.find(c => c.name === 'defaultStoreName')
          if(colDep) {
            colDep.filter!.options = x?.data?.map((x: any) => ({ value: x.id, label: `${x.id} - ${x.storeName}`}));
          }
        }
      }
    }, (err) => this.message.error(err.error.error));

    this.adminService.getPositionList().subscribe((res: any) => {
      this.col.filter(c => ['otherWorkingPositionName', 'positionName'].includes(c.name) && c.isFilter).forEach(
        c => {
          c.filter!.options = res?.data?.map((x: any) => {
            return { value: x?.id, label: x?.positionName };
          }) || [];
        }
      )
    });
    this.adminService.getWorkingPositionList().pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe(x => {
      if (x.code === '00') {
        if (x.data && x.data?.length > 0) {
          let colDep = this.col.find(c => c.name === 'workingPositionName')
          if(colDep) {
            colDep.filter!.options = x?.data?.map((x: any) => ({ value: x.id, label: `${x.id} - ${x.workingPositionName}`}));
          }
        }
      }
    }, (err) => this.message.error(err.error.error));
  }

  editUser(item: any) {
    this.modalService.create({
      nzTitle: 'Cập nhật phân quyền dữ liệu',
      nzContent: CreateAndUpdateDataPermissionComponent,
      nzWidth: '90%',
      nzMaskClosable: false,
      nzCentered: true,
      nzFooter: null,
      nzComponentParams: {
        user: item,
      }
    }).afterClose.subscribe(res=>{
      if(res){
        this.onPageIndexChange(1)
      }
    })
  }

  viewStoreByUser(item: any){
      this.currentUser = item !== this.currentUser? item : null ;
      this.listOfStore = [];
      this.listOfEmployee = [];
      if(this.currentUser && item?.id !== undefined){
        this.loadingService.showLoading();
        this.adminService
          .getStoreByUser({userId: item?.id}).pipe(finalize(() => {
            this.loadingService.hideLoading();
            if(this.listOfStore.length){
            this.viewEmployeeByStore(this.listOfStore[0])
          }
        })).subscribe((res: any) => {
            if (res.code === ResponseCode.SUCCESS && this.currentUser) {
              this.listOfStore = res?.data?.filter((x: any)=>x.isSelected)?.map((b: any, index: number) => ({ ...b, index: index + 1 })) || [];
            }
          });

    }
  }

  viewEmployeeByStore(item: any){
    if(!this.currentUser) return
      this.currentStore = item !== this.currentStore? item : null ;
      this.listOfEmployee = [];
      if(this.currentStore && item?.id !== undefined){
        this.loadingService.showLoading();
        this.adminService
          .getEmployeeByStore({storeId: [item?.id], userId: this.currentUser.id}).pipe(finalize(() => { this.loadingService.hideLoading() }))
          .subscribe((res: any) => {
            if (res.code === ResponseCode.SUCCESS && this.currentUser) {
              this.listOfEmployee = res?.data?.map((b: any, index: number) => ({ ...b, index: index + 1, fullName: b?.userName + " - " + b?.fullName})) || [];
            }
          });
      }
  }

  deleteUserPermission(user: any){
    this.loadingService.showLoading();
    this.adminService
      .deleteAuthData({userId: user?.id}).pipe(finalize(() => { this.loadingService.hideLoading() }))
      .subscribe((res: any) => {
        if (res.code === ResponseCode.SUCCESS) {
          this.message.success(`Xoá phân quyền dữ liệu thành công`);
          this.onPageIndexChange(1)
        }
      });
  }



}
