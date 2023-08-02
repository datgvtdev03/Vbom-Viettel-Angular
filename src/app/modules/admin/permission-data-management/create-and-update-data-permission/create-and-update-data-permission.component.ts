import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import * as _ from 'lodash';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {finalize, switchMap, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {
  BaseListComponent,
  ColumnType,
  SettingTableDynamic,
  TableColum,
  VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {EnumSelectOptionType} from '@vbomApp/modules/shares/enum/constants';
import {AdminService} from '@vbomApp/service/admin.service';
import {VbomPermissionServiceService} from '@vbomApp/service/vbom-permission-service.service';
import {ResponseCode} from '@vbomApp/modules/shares/enum/common.enum';
@Component({
  selector: 'vbom-create-and-update-data-permission',
  templateUrl: './create-and-update-data-permission.component.html',
  styleUrls: ['./create-and-update-data-permission.component.scss'],
})
export class CreateAndUpdateDataPermissionComponent
  extends BaseListComponent
  implements OnInit
{
  pageSizeOptions: number[] = [5, 10, 30, 50, 100, 500];
  user: any;
  lstPosition: any[] = [];
  lstDepartment: any[] = [];
  lstArea: any[] = [];
  areaList: any[] = [];
  listOfData: any[] = [];
  selectedUserList: any[] = [];
  listOfStore: any[] = [];
  displayStores: any[] = [];
  displayEmployee: any[] = [];
  selectedStoreList: any[] = [];
  listOfEmployee: any[] = [];
  selectedEmployeeList: any[] = [];
  isCheckAll = false;
  col: TableColum[] = [
    {
      id: 1,
      name: 'index',
      fixedColumn: false,
      attr: 'STT',
      type: ColumnType.TEXT,
      width: '7%',
      isFilter: false,
    },
    {
      id: 2,
      name: 'fullName',
      fixedColumn: false,
      attr: 'Tên người dùng',
      type: ColumnType.TEXT,
      width: '20%',
      isFilter: true,
      isSort: true,
      filter:{name:'usernameList', selectOptionsType: EnumSelectOptionType.user, type: ColumnType.SELECT, multiple: true}
    },
    {
      id: 3,
      name: 'defaultStoreName',
      fixedColumn: false,
      attr: 'Kho',
      type: ColumnType.SELECT,
      options: [],
      width: '20%',
      isFilter: true,
      isSort: true,
      filter:{name:'defaultStoreId', selectOptionsType: EnumSelectOptionType.stores, type: ColumnType.SELECT_INT, multiple: true},
    },
    {
      id: 4,
      name: 'positionName',
      fixedColumn: false,
      attr: 'Chức vụ',
      type: ColumnType.SELECT,
      options: [],
      width: '20%',
      isFilter: true,
      isSort: true,
      filter:{name:'positionId', selectOptionsType: EnumSelectOptionType.position, type: ColumnType.SELECT_INT, multiple: true},
    },
    {
      id: 5,
      name: 'workingPositionName',
      fixedColumn: false,
      attr: 'Kiêm nhiệm',
      type: ColumnType.SELECT,
      options: [],
      width: '20%',
      isFilter: true ,
      filter:{name:'workingPositionId', selectOptionsType: EnumSelectOptionType.workingPosition, type: ColumnType.SELECT_INT, multiple: true},
    },
  ];
  col2: TableColum[] = [
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
      name: 'id',
      fixedColumn: false,
      attr: 'Mã kho',
      type: ColumnType.TEXT,
      width: '20%',
      isSort: true,
      isFilter: true,
    },
    {
      id: 4,
      name: 'storeName',
      fixedColumn: false,
      attr: 'Tên kho',
      type: ColumnType.SELECT,
      options: [],
      filter: {type: ColumnType.SELECT_INT, multiple: true, selectOptionsType: EnumSelectOptionType.stores, name: 'id'},
      width: '55%',
      isSort: true,
      isFilter: true,
    },
  ];
  col3: TableColum[] = [
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
      name: 'codeAndName',
      fixedColumn: false,
      attr: 'Họ và tên',
      type: ColumnType.TEXT,
      width: '40%',
      isSort: true,
      isFilter: true,
      filter:{name:'userName', selectOptionsType: EnumSelectOptionType.user, type: ColumnType.SELECT, multiple: true},
    },
    {
      id: 4,
      name: 'positionName',
      fixedColumn: false,
      attr: 'Chức vụ',
      type: ColumnType.SELECT,
      options: [],
      width: '30%',
      isSort: true,
      filter: {type: ColumnType.SELECT_INT, selectOptionsType: EnumSelectOptionType.position, multiple: true, name: 'positionId'},
      isFilter: true,
    },
    {
      id: 4,
      name: 'defaultStoreId',
      fixedColumn: false,
      attr: 'Mã kho',
      type: ColumnType.TEXT,
      options: [],
      width: '20%',
      isSort: true,
      isFilter: true,
    },
  ];
  settingValue1: SettingTableDynamic = {
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
  settingValue2: SettingTableDynamic = {
    bordered: true,
    isFilterJs: true,
    loading: false,
    pagination: true,
    sizeChanger: true,
    title: null,
    footer: null,
    checkbox: true,
    simple: false,
    size: 'small',
    tableLayout: 'auto',
  };
  currentStore: any;
  checkPermissionData: boolean = true;

  constructor(
    private message: NzMessageService,
    private loadingService: VssLoadingService,
    private adminService: AdminService,
    private modalRef: NzModalRef,
    private permissionService: VbomPermissionServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.col = this.col.map(x => ({...x, isFilter: !this.user && x.isFilter}))
    this.paging.pageSize = 5;
    this.initData();
    if (this.user) {
      this.loadingTable = false;
      this.settingValue1.checkbox = false;
      this.col = this.col.filter((x: any) => x.name !== 'action');
      this.selectedUserList.push({ ...this.user, index: 1 });
      this.listOfData.push({ ...this.user, index: 1 });
    } else {
      this.setupStreamSearch();
      this.onPageIndexChange(1);
    }
  }

  initData() {
    if (this.permissionService.canActiveRuleBool(['ROLE_AREA_VIEW'])) {
      this.adminService.getAreaList().subscribe((res: any) => {
        this.lstArea =
          res?.data?.map((x: any) => {
            return { value: x?.id, label: x?.areaName };
          }) || [];
      });
    }
    if (this.user) {
      this.loadingService.showLoading();
      this.adminService
        .getStoreByUser({ userId: this.user?.id })
        .pipe(
          finalize(() => {
            this.loadingService.hideLoading();
            this.viewEmployeeByStore();
          })
        )
        .subscribe((res: any) => {
          if (res.code === ResponseCode.SUCCESS) {
            this.listOfStore =
              res?.data?.map((x: any, index: number) => {
                return {
                  ...x,
                  index: index + 1,
                  checked: !!x?.isSelected,
                };
              }) || [];
            this.selectedStoreList = this.listOfStore?.filter(
              (x) => x?.isSelected
            );
            this.displayStores = this.listOfStore;
          }
        });
    } else {
      this.adminService.getStoreList().subscribe((res: any) => {
        this.listOfStore =
          res?.data?.map((x: any, index: number) => {
            return {
              ...x,
              index: index + 1,
              checked: false,
            };
          }) || [];
        this.displayStores = this.listOfStore;
      });
    }
  }

  apiSearch(payload: any): Observable<any> {
    this.listOfData = [];
    const filterData: any = this.searchBind$.value.filterData;
    const payloadOld = {
      departmentId: filterData?.departmentId || [],
      otherWorkingPositionId: filterData?.otherWorkingPositionId || [],
      fullName: filterData?.fullName,
      positionId: filterData?.positionId || [],
      usernameList: filterData?.usernameList || [],
      // username: null,
      isRole: false,
      sortField: payload.sortField?.map((s: any) => {
        return {
          ...s,
          fieldName: s.fieldName.replace(/[A-Z]/g, (v: string) => `_${v.toLowerCase()}`)
        }
      })
    };
    return this.adminService
      .postSearchStaffCustom(
        this.paging.pageIndex,
        this.paging.pageSize,
        payloadOld
      )
      .pipe(
        tap((res) => {
          if (res.code === ResponseCode.SUCCESS) {
              this.listOfData = res?.data?.content?.map(
                (b: any, index: number) => ({
                  ...b,
                  checked: !!this.selectedUserList?.some((y) => y.id == b?.id),
                  index:
                    (this.paging.pageIndex - 1) * this.paging.pageSize +
                    index +
                    1,
                  fullName: b?.userName + ' - ' + b?.fullName,
                })
              ) || [];
              this.paging.totalElements = res.data.totalElements || 0;
              this.paging.totalPages = res.data.totalPages || 0;
            }
        })
      );
  }

  onRemove(event: any) {
    this.listOfData = this.listOfData.filter((x) => x?.id !== event?.id);
    this.listOfData = this.listOfData?.map((x: any, index: number) => {
      return { ...x, index: index + 1 };
    });
  }

  changeArea(event: any) {
    this.displayStores = this.listOfStore;
    this.displayEmployee = this.listOfEmployee;
    if (event?.length)
      this.displayStores = this.listOfStore
        .filter((x: any) => event.some((y: any) => y === x?.areaId))
        ?.map((x: any, index: number) => {
          return { ...x, index: index + 1 };
        });
      this.displayEmployee = this.showDisplayedEmployee(this.displayStores?.filter(x=>x?.checked)[0]);
  }

  viewEmployeeByStore() {
    if (this.user) {
      this.loadingService.showLoading();
      this.adminService
        .getEmployeeByStore({
          storeId: this.selectedStoreList?.map((x) => x?.id),
          userId: this.user.id,
        })
        .pipe(
          switchMap((res) => {
            this.selectedEmployeeList = _.uniqBy(
              [
                ...this.selectedEmployeeList?.map((x: any) => {
                  return {
                    ...x,
                    checked: true,
                    codeAndName: x?.userName + ' - ' + x?.fullName,
                  };
                }),
                ...res?.data,
              ],
              'id'
            );
            return this.adminService.getEmployeeERP(
              this.selectedStoreList?.map((x) => x?.id)
            );
          })
        )
        .pipe(
          finalize(() => {
            this.loadingService.hideLoading();
          })
        )
        .subscribe((res2: any) => {
          this.listOfEmployee =
            res2?.data?.map((x: any, index: any) => {
              return {
                ...x,
                index: index + 1,
                codeAndName: x?.userName + ' - ' + x?.fullName,
                checked:
                  this.selectedEmployeeList?.some((y) => y.id == x?.id) ||
                  x?.defaultStoreId === this.currentStore?.id ||
                  this.isCheckAll,
                disabled:
                this.currentStore ? (x?.defaultStoreId !== this.currentStore?.id && !this.isCheckAll) : (x?.defaultStoreId !== this.displayStores?.filter(x=>x?.checked)[0]?.id),
              };
            }) || [];
          this.displayEmployee = this.showDisplayedEmployee();
          this.getSelectedEmployee(
            this.listOfEmployee?.filter((x) => x?.checked)
          );
        });
    } else {
      this.loadingService.showLoading();
      this.adminService
        .getEmployeeERP(this.selectedStoreList?.map((x) => x?.id))
        .pipe(
          finalize(() => {
            this.loadingService.hideLoading();
          })
        )
        .subscribe((res: any) => {
          if (res.code === ResponseCode.SUCCESS) {
            this.listOfEmployee =
              res?.data?.map((x: any, index: any) => {
                return {
                  ...x,
                  index: index + 1,
                  codeAndName: x?.userName + " - " + x?.fullName ,
                  checked:
                    this.selectedEmployeeList?.some((y) => y.id == x?.id) ||
                    x?.defaultStoreId === this.currentStore?.id ||
                    this.isCheckAll,
                  disabled:
                  this.currentStore ? (x?.defaultStoreId !== this.currentStore?.id && !this.isCheckAll) : (x?.defaultStoreId !== this.displayStores?.filter(x=>x?.checked)[0]?.id),
                };
              }) || [];
            this.displayEmployee = this.showDisplayedEmployee();
            this.getSelectedEmployee(
              this.listOfEmployee?.filter((x) => x?.checked)
            );
          }
        });
    }
  }

  showDisplayedEmployee(item: any = null){
    return this.listOfEmployee
    .filter((x: any) => this.displayStores.some((y: any) => y?.id === x?.defaultStoreId))
    ?.map((x: any, index: number) => {
      return { ...x, index: index + 1, disabled: item ? !(x?.defaultStoreId == item?.id) : x?.disabled}
    });
  }

  onCheckStore(item: any) {
    this.currentStore = this.selectedStoreList?.some((y) => y.id == item?.id)
      ? null
      : item;
    if (!this.currentStore) {
      this.selectedEmployeeList = this.selectedEmployeeList?.filter(
        (x) => !(x?.defaultStoreId === item?.id)
      );
      return;
    }
  }

  onClickStore(item: any) {
    this.listOfEmployee =
      this.listOfEmployee?.map((x: any, index: any) => {
        return {
          ...x,
          index: index + 1,
          checked: this.selectedEmployeeList?.some((y) => y.id == x?.id),
          disabled: !(x?.defaultStoreId == item?.id),
        };
      }) || [];
    this.displayEmployee = this.showDisplayedEmployee();
    this.getSelectedEmployee(this.listOfEmployee?.filter((x) => x?.checked));
  }

  onCheckAll(value: any) {
    this.isCheckAll = value;
    this.displayStores = this.displayStores?.map((x: any) => {
      return { ...x, checked: value };
    });
    this.listOfStore =
      this.listOfStore?.map((x: any) => {
        return {
          ...x,
          checked: this.displayStores?.some((z: any) => z?.id === x?.id)? value: x?.checked,
        };
      }) || [];
    if (value)
      this.selectedStoreList = _.uniqBy(
        [
          ...this.selectedStoreList?.map((x: any) => {
            return { ...x, checked: true };
          }),
          ...this.displayStores,
        ],
        'id'
      );
    else
      this.selectedStoreList = this.selectedStoreList.filter((el: any) => {
        return this.displayStores.findIndex((x: any) => x?.id == el?.id) < 0;
      });
  }

  getSelectedUser(items: any[]) {
    this.selectedUserList = _.uniqBy(
      [
        ...this.selectedUserList?.map((x: any) => {
          return { ...x, checked: true };
        }),
        ...items,
      ],
      'id'
    );
  }

  getUnSelectedUser(items: any[]) {
    this.selectedUserList = this.selectedUserList.filter((el: any) => {
      return items.findIndex((x: any) => x?.id == el?.id) < 0;
    });
  }

  getSelectedStore(items: any[]) {
    this.selectedStoreList = _.uniqBy(
      [
        ...this.selectedStoreList?.map((x: any) => {
          return { ...x, checked: true };
        }),
        ...items,
      ],
      'id'
    );
    // this.displayStores = this.displayStores?.map((x: any) => {
    //   return {
    //     ...x,
    //     checked: items?.some((y) => y.id == x?.id)? true: x?.checked
    //   };
    // });
    this.listOfStore =
      this.listOfStore?.map((x: any) => {
        return {
          ...x,
          checked: items?.some((y) => y.id == x?.id)? true: x?.checked
        };
      });
    this.viewEmployeeByStore();
  }

  getUnSelectedStore(items: any[]) {
    this.selectedStoreList = this.selectedStoreList.filter((el: any) => {
      return items.findIndex((x: any) => x?.id == el?.id) < 0;
    });
    // this.displayStores =
    // this.displayStores?.map((x: any) => {
    //   return {
    //     ...x,
    //     checked: items?.some((y) => y.id == x?.id)? false : x?.checked
    //   };
    // });
    this.listOfStore =
    this.listOfStore?.map((x: any) => {
      return {
        ...x,
        checked: items?.some((y) => y.id == x?.id)? false : x?.checked
      };
    });
    this.selectedEmployeeList = this.selectedEmployeeList.filter((el: any) => {
      return items.findIndex((x: any) => x?.id == el?.defaultStoreId) < 0;
    });
    this.viewEmployeeByStore();
  }

  getSelectedEmployee(items: any[]) {
    this.selectedEmployeeList = _.uniqBy(
      [
        ...this.listOfEmployee?.filter((x: any) => x?.checked),
        ...items,
      ],
      'id'
    );
    this.listOfEmployee =
      this.listOfEmployee?.map((x: any) => {
        return {
          ...x,
          checked: items?.some((y) => y.id == x?.id)? true: x?.checked
        };
      });
    this.displayEmployee = this.showDisplayedEmployee();
  }

  getUnSelectedEmployee(items: any[]) {
    this.selectedEmployeeList = this.selectedEmployeeList.filter((el: any) => {
      return items.findIndex((x: any) => x?.id == el?.id) < 0;
    });
    this.listOfEmployee =
      this.listOfEmployee?.map((x: any) => {
        return {
          ...x,
          checked: items?.some((y) => y.id == x?.id)? false : x?.checked
        };
      });
      this.displayEmployee = this.showDisplayedEmployee();
  }

  checkAllEmployee(value: any){
    if(value){
      this.getSelectedEmployee(this.listOfEmployee?.filter((x: any)=> !x?.disabled))
    }else{
      this.getUnSelectedEmployee(this.listOfEmployee?.filter((x: any)=> !x?.disabled))
    }
  }

  submit() {
    const dataUserOfWareHouse = this.selectedEmployeeList?.length ? this.selectedEmployeeList?.filter(x =>x.checked === true) : [];
    if(!this.selectedUserList?.length){
      this.message.warning(`Bạn cần chọn người dùng để phân quyền!`);
      return
    }
    if(!this.selectedStoreList?.length){
      this.message.warning(`Bạn cần chọn kho để phân quyền kho cho người dùng!`);
      return
    }
    if(dataUserOfWareHouse?.length === 0 || dataUserOfWareHouse === null || dataUserOfWareHouse === undefined){
      this.message.warning(`Bạn cần chọn người dùng thuộc kho để phân quyền thao tác dữ liệu!`);
      return
    }

  this.loadingService.showLoading();
    if (!this.user) {
      let saveAuthDataDTO = {
        lsUserFollower: this.selectedEmployeeList,
        lsUserIds: this.selectedUserList?.map((x: any) => x.id),
      };
      this.adminService
        .saveAuthData(saveAuthDataDTO)
        .pipe(
          finalize(() => {
            this.loadingService.hideLoading();
          })
        )
        .subscribe((res: any) => {
          if (res.code === ResponseCode.SUCCESS) {
            this.message.success(`Thêm mới phân quyền dữ liệu thành công`);
            this.modalRef.close(true);
          }
        });
    } else {
      let saveAuthDataDTO = {
        lsUserFollower: this.selectedEmployeeList,
        lsUserIds: this.selectedUserList?.map((x: any) => x.id),
      };
      this.adminService
        .updateAuthData(saveAuthDataDTO)
        .pipe(
          finalize(() => {
            this.loadingService.hideLoading();
          })
        )
        .subscribe((res: any) => {
          if (res.code === ResponseCode.SUCCESS) {
            this.message.success(`Cập nhật phân quyền dữ liệu thành công`);
            this.modalRef.close(true);
          }
        });
    }
  }

  closeModal() {
    this.modalRef.close();
  }
}
