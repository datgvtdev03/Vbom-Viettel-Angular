import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {finalize} from 'rxjs/operators';
import {
  BaseListComponent,
  ColumnType,
  SettingTableDynamic,
  TableColum, Ultilities,
  VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {EnumSelectOptionType} from '@vbomApp/modules/shares/enum/constants';
import {AdminService} from '@vbomApp/service/admin.service';
import {CheckCreateOrUpDateOrCopy} from '@vbomApp/modules/shares/enum/common.enum';
import {TreeHelper} from '@vbomApp/modules/shares/helper/tree-helper';

@Component({
  selector: 'vbom-create-or-edit-permission',
  templateUrl: './create-or-edit-permission.component.html',
  styleUrls: ['./create-or-edit-permission.component.scss']
})
export class CreateOrEditPermissionComponent extends BaseListComponent implements OnInit, OnChanges {

  @Input() isCheckCreateOrUpdateOrCopy: string = '';
  @Input() lsFunctionUpdate: any[] = [];
  @Input() lsUserUpdate: any[] = [];
  @Input() roleGroupDtoUpdate: any = {};
  @Output() checkSuccess = new EventEmitter<any>();

  lstPosition: any[] = [];
  lstDepartment: any[] = [];
  lstStore: any[] = [];
  lstStatus: any[] = [
    {value: 1, label: "Áp dụng"},
    {value: 0, label: "Không áp dụng"},
  ];
  tabs: any[] = [];
  index = 0;
  settingValue: SettingTableDynamic = {
    isFilterJs: true,
    bordered: true,
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
  col: TableColum[] = [
    {id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '50px', isFilter: false},
    {
      id: 2,
      name: 'userName',
      fixedColumn: false,
      attr: 'Tên đăng nhập',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      isSort: true,
      hiddenResize: false
    },
    {
      id: 3, name: 'fullName', fixedColumn: false, attr: 'Họ và tên',
      filter: {name: 'userName', selectOptionsType: EnumSelectOptionType.user, type: ColumnType.SELECT, multiple: true},
      type: ColumnType.TEXT, width: '150px', isFilter: true, isSort: true, hiddenResize: false
    },
    {
      id: 4,
      name: 'defaultStoreName',
      fixedColumn: false,
      attr: 'Kho',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      filter: {
        name: 'defaultStoreId',
        selectOptionsType: EnumSelectOptionType.stores,
        type: ColumnType.SELECT_INT,
        multiple: true
      },
      isSort: true,
      hiddenResize: false
    },
    {
      id: 5,
      name: 'positionName',
      fixedColumn: false,
      attr: 'Chức vụ',
      type: ColumnType.TEXT,
      width: '150px',
      isFilter: true,
      filter: {
        name: 'positionId',
        selectOptionsType: EnumSelectOptionType.position,
        type: ColumnType.SELECT_INT,
        multiple: true
      },
      isSort: true,
      hiddenResize: false
    },
    {
      id: 6,
      name: 'action',
      fixedColumn: false,
      attr: 'Thao tác',
      type: ColumnType.ACTION,
      action: {isRemove: true},
      rulesAction: {isRemove: ['ROLE_USER_DATA_DELETE']},
      width: '80px',
      isFilter: false
    }
  ];
  listOfData: any[] = [];

  moduleMenu: any[] = [];
  choseRole: any = null;
  listOfDataFunction: any[] = [];
  colFunction: TableColum[] = [
    {id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '50px', isFilter: false},
    {
      id: 2,
      name: 'functionCode',
      fixedColumn: false,
      attr: 'Mã tính năng',
      type: ColumnType.TEXT,
      width: '200px',
      isFilter: true,
      isSort: true
    },
    {
      id: 3,
      name: 'description',
      fixedColumn: false,
      attr: 'Tên tính năng',
      type: ColumnType.TEXT,
      width: '200px',
      isFilter: true,
      isSort: true
    },
  ];
  id: any = null;
  openModalSearchUser: boolean = false;
  dataChoseAddUser: any[] = [];
  userChoseCheck: any[] = [];
  isCheckDisable: boolean = false;
  isDisableAdmin: boolean = false;
  isDisableDefault: boolean = false;
  dataChoseFunction: any[] = [];
  dataSearchRole: any[] = [];
  isDisDepartment: boolean = false;
  isDisPosition: boolean = false;
  isDisStatus: boolean = false;
  checkDefaultAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private loadingService: VssLoadingService,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getData();
    this.initForm();
    setTimeout(() => this.tabs = ["Danh sách người dùng", "Danh sách chức năng"], 10)
  }

  initForm() {
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE) {
      this.myForm = this.fb.group({
        roleGroups: [null],
        describe: [null],
        // department: [null, this.checkNullDepartment],
        storeId: [null, this.checkNullStore],
        position: [null, this.checkNullPosition],
        status: [this.lstStatus[0].value],
        default: [false],
        adminRole: [false],
        checkFunction: [true]
      });
      this.lsUserUpdate = [];
      this.lsFunctionUpdate = [];
      this.roleGroupDtoUpdate = [];
    } else if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
      if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE) {
        this.myForm = this.fb.group({
          roleGroups: [this.roleGroupDtoUpdate?.roleGroupName?.trim() || null],
          describe: [this.roleGroupDtoUpdate?.description?.trim() || null],
          // department: [this.roleGroupDtoUpdate?.departmentId || null, this.checkNullDepartment],
          storeId: [this.roleGroupDtoUpdate?.storeId || null, this.checkNullStore],
          position: [this.roleGroupDtoUpdate?.positionId || null, this.checkNullPosition],
          status: [this.roleGroupDtoUpdate?.isActive ? this.lstStatus[0].value : this.lstStatus[1].value],
          default: [this.roleGroupDtoUpdate?.defaultGroup || false],
          adminRole: [this.roleGroupDtoUpdate?.isAdmin || false],
          checkFunction: [true]
        });
        if (this.lsUserUpdate?.length > 0) {
          this.isDisDepartment = true;
          this.isDisPosition = true;
        } else {
          if (this.roleGroupDtoUpdate?.isAdmin === true) {
            this.isDisDepartment = true;
            this.isDisPosition = true;
          } else {
            this.isDisDepartment = false;
            this.isDisPosition = false;
          }
        }
        if (this.roleGroupDtoUpdate?.isAdmin === true) {
          this.isDisableDefault = true;
          this.isDisStatus = true;
        } else {
          this.isDisableDefault = false;
          this.isDisStatus = false;
        }
        this.dataChoseFunction = this.lsFunctionUpdate?.map((b: any, i: number) => ({
          ...b,
          checked: true,
          index: i + 1
        }));
        // this.dataSearchRole = this.lsFunctionUpdate?.map((b: any, i: number) => ({ ...b, checked: true, index: i + 1 }));
      } else if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
        this.myForm = this.fb.group({
          roleGroups: [`${this.roleGroupDtoUpdate?.roleGroupName?.trim()} - Copy` || null],
          describe: [this.roleGroupDtoUpdate?.description?.trim() || null],
          // department: [this.roleGroupDtoUpdate?.departmentId || null, this.checkNullDepartment],
          storeId: [this.roleGroupDtoUpdate?.storeId || null, this.checkNullStore],
          position: [this.roleGroupDtoUpdate?.positionId || null, this.checkNullPosition],
          status: [this.roleGroupDtoUpdate?.isActive ? this.lstStatus[0].value : this.lstStatus[1].value],
          default: [this.roleGroupDtoUpdate?.defaultGroup || false],
          adminRole: [this.roleGroupDtoUpdate?.isAdmin || false],
          checkFunction: [true]
        });
        if (this.roleGroupDtoUpdate?.isAdmin === false && this.roleGroupDtoUpdate?.defaultGroup === true) {
          this.loadingService.showLoading();
          let payload = {
            storeId: this.myForm?.getRawValue()?.storeId,
            // departmentId: this.myForm?.getRawValue()?.department,
            positionId: this.myForm?.getRawValue()?.position,
            roleGroupId: null,
          }
          this.adminService.postCheckDefaultGroup(payload)
            // .pipe(finalize(() => { this.loadingService.hideLoading() }))
            .subscribe(x => {
              if (x?.code === "00") {
                if (x?.data?.exist === false) {
                  this.loadingService.hideLoading()
                  if (this.roleGroupDtoUpdate?.defaultGroup === false) {
                    this.myForm.patchValue({
                      default: false,
                    });
                    this.isDisableAdmin = this.checkDefaultAdmin;
                  } else {
                    this.myForm.patchValue({
                      default: true,
                    });
                    // if (this.checkDefaultAdmin) {
                    //     this.isDisableAdmin = true;
                    // } else {
                    this.isDisableAdmin = true;
                    // }
                  }
                  this.isExitsAfterClickDefault = false;
                } else {
                  setTimeout(() => {
                    // this.DeName = this.lstDepartment.filter(x => x?.value === this.roleGroupDtoUpdate?.departmentId)[0]?.label;
                    this.PoiName = this.lstPosition.filter(x => x?.value === this.roleGroupDtoUpdate?.positionId)[0]?.label;
                    this.messageDeNamePoiName = `Đã có nhóm quyền mặc định thuộc phòng/ban ${this.lstStore.filter(x => x?.value === this.roleGroupDtoUpdate?.storeId)[0]?.label} và chức vụ ${this.PoiName}. Bạn có muốn thay đổi nhóm quyền mặc định này không?`;
                    this.dataExit = x?.data;
                    this.openModalClickDefault = true;
                    this.loadingService.hideLoading()
                  }, 1500);

                }
              }
            })
        }

        if (this.lsUserUpdate?.length > 0) {
          this.isDisDepartment = !!this.roleGroupDtoUpdate?.storeId;

          this.isDisPosition = !!this.roleGroupDtoUpdate?.positionId;
        } else {
          this.isDisDepartment = false;
          this.isDisPosition = false;
        }

        if (this.roleGroupDtoUpdate?.isAdmin === true) {
          this.isDisableAdmin = true;
          this.myForm.patchValue({
            adminRole: false
          });
          this.dataChoseFunction = [];
          this.dataSearchRole = [];
        } else {
          this.dataChoseFunction = this.lsFunctionUpdate?.map((b: any, i: number) => ({
            ...b,
            checked: true,
            index: i + 1
          }));
        }
      }

      this.isDisableAdmin = this.roleGroupDtoUpdate?.defaultGroup === true;

      this.listOfData = this.lsUserUpdate?.map((b: any, i: number) => ({...b, checked: false, index: i + 1})) || [];
      this.userChoseCheck = []
    }
  }

  checkNullStore = (control: FormControl): { [s: string]: boolean | string } => {
    if (!control.value) {
      return {errors: 'Kho không được bỏ trống'};
    }
    return {};
  };

  checkNullPosition = (control: FormControl): { [s: string]: boolean | string } => {
    if (!control.value) {
      return {errors: 'Chức vụ không được bỏ trống'};
    }
    return {};
  };

  ngOnChanges(changes: SimpleChanges): void {

  }

  selectTab(event: any) {
    if (event === 1) {
      if (this.myForm?.getRawValue()?.checkFunction === true) {
        this.showFunctions(true);
        this.listOfDataFunction = [];
      } else {
        this.listOfDataFunction = [];
      }
      // this.myForm.patchValue({
      //     checkFunction:true
      // })
    }
  }

  getData(page = 1) {
    this.paging.pageIndex = page;

    //Phòng ban
    this.adminService.getDepartmentList()
      // .pipe(finalize(() => {this.loadingService.hideLoading()}))
      .subscribe(x => {
        if (x.code === '00') {
          if (x.data && x.data?.length > 0) {
            this.lstDepartment = x?.data?.map((x: any) => ({value: x.id, label: `${x.id} - ${x.departmentName}`}));
          }
        }
      }, (err) => this.message.error(err.error.error))
    //kho
    this.adminService.getStoreList()
      .subscribe(x => {
        if (x.code === '00') {
          if (x.data && x.data?.length > 0) {
            this.lstStore = x?.data?.map((x: any) => ({value: x.id, label: `${x.id} - ${x.storeName}`}));
          }
        }
      }, (err) => this.message.error(err.error.error))
    //Chức vụ
    this.adminService.getPositionList()
      .subscribe(x => {
        if (x.code === '00') {
          if (x.data && x.data?.length > 0) {
            this.lstPosition = x?.data?.map((x: any) => ({value: x.id, label: `${x.id} - ${x.positionName}`}));
          }
        }
      }, (err) => this.message.error(err.error.error))
    //Danh sách phân hệ, chức năng
    this.adminService.getAllModules()
      .subscribe(x => {
        if (x.code === "00") {
          if (x.data && x.data?.length > 0) {
            this.moduleMenu = [{
              title: 'Danh sách phân hệ/Chức năng',
              key: 0,
              isLeaf: false,
              children: TreeHelper.parseDataModules(x.data)
            }]
          }
        }
      }, (err) => this.message.error(err.error.error))
    //Kiểm tra tồn tại admin trong hệ thống
    this.adminService.postExistAdminRoleGroup(null)
      // .pipe(finalize(() => { this.loadingService.hideLoading() }))
      .subscribe(x => {
        if (x?.code === "00") {
          if (x?.data === true) {
            this.isDisableAdmin = true;
            this.checkDefaultAdmin = true;
          }
        }
      })
  }

  onClickTreeRole(event: any) {
    if (event) {
      if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
        || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
        if (event?.node?.origin?.key === 0) {
          if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE) {
            this.listOfDataFunction = [];
          }
          this.choseRole = null;
        } else {
          if (!event?.node?.origin?.children?.length) {
            this.loadingService.showLoading();
            this.choseRole = event?.node?.origin;
            this.adminService.getListFunctionByMenuId(event?.node?.origin?.id).pipe(finalize(() => {
              this.loadingService.hideLoading()
            })).subscribe(x => {
              if (x.code === "00") {
                if (x.data) {
                  if (this.myForm.getRawValue().adminRole === true) {
                    this.listOfDataFunction = x?.data?.map((b: any, i: number) => ({
                      ...b,
                      checked: true,
                      index: i + 1
                    }));
                    this.isCheckDisable = true;
                    // this.dataSearchRole = [...x?.data?.map((b: any, i: number) => ({ ...b, checked: true, index: i + 1 }))];
                    if (this.dataChoseFunction) {
                      this.dataChoseFunction = [...this.dataChoseFunction, ...this.listOfDataFunction];
                      this.dataChoseFunction = _.uniqBy(this.dataChoseFunction, 'id');
                    } else {
                      this.dataChoseFunction = [...this.listOfDataFunction];
                      this.dataChoseFunction = _.uniqBy(this.dataChoseFunction, 'id');
                    }

                  } else if (this.myForm.getRawValue().adminRole === false && this.dataChoseFunction?.length === 0) {
                    this.listOfDataFunction = x?.data?.map((b: any, i: number) => ({
                      ...b,
                      checked: false,
                      index: i + 1
                    }));
                    this.isCheckDisable = false;
                    // this.dataSearchRole = [...x?.data?.map((b: any, i: number) => ({ ...b, checked: false, index: i + 1 }))];
                    this.dataChoseFunction = [];

                  } else if (this.dataChoseFunction?.length > 0) {
                    this.listOfDataFunction = x?.data?.map((b: any, i: number) => ({
                      ...b, index: i + 1, checked: this.dataChoseFunction
                        ?.map((y: any) => {
                          return y.id;
                        })
                        ?.some((z: any) => z === b?.id),
                    }));
                    this.isCheckDisable = false;
                    // this.dataSearchRole = [...x?.data?.map((b: any, i: number) => ({
                    //     ...b, index: i + 1, checked: this.dataChoseFunction
                    //         ?.map((y: any) => {
                    //             return y.id;
                    //         })
                    //         ?.some((z: any) => z === b?.id),
                    // }))];
                  }
                } else {
                  this.listOfDataFunction = [];
                  this.isCheckDisable = false;
                  this.dataSearchRole = [];
                }
              }
            }, (err) => this.message.error(err.error.error))
          }
        }
      }
    }
  }

  // tab danh sách người dùng
  addUser() {
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
      || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
      this.openModalSearchUser = true;
    }
  }

  dataChose(event: any) {
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
      || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
      this.dataChoseAddUser = event?.map((b: any) => ({...b, checked: true}));
    }
  }

  clickAddRoleCancel() {
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
      || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
      this.openModalSearchUser = false;
    }
  }

  clickAddRoleOk() {
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
      || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {

      if (this.dataChoseAddUser?.length === 0) {
        this.message.error('Bạn cần tích chọn người dùng để đưa vào nhóm quyền!');
        return;
      }

      this.openModalSearchUser = false;
      if (this.listOfData?.length === 0 || this.listOfData?.length === null || this.listOfData?.length === undefined) {
        const a = this.dataChoseAddUser;
        const b = _.uniqBy(a, function (e) {
          return e.id;
        })
        this.listOfData = b.map((x: any, i: number) => ({...x, index: i + 1, checked: false})) || [];
        this.userChoseCheck = [...this.listOfData.filter(x => x.checked === true)];
        // this.dataSearch = [...b.map((x: any, i: number) => ({ ...x, index: i + 1 }))];
        if (this.isCheckCreateOrUpdateOrCopy === "UPDATE" && this.listOfData?.length > 0) {
          this.isDisDepartment = true;
          this.isDisPosition = true;
        }
      } else {
        const a = [...this.listOfData, ...this.dataChoseAddUser];
        const b = _.uniqBy(a, function (e) {
          return e.id;
        })
        this.listOfData = b.map((x: any, i: number) => ({...x, index: i + 1, checked: false})) || [];
        this.userChoseCheck = [...this.listOfData.filter(x => x.checked === true)];
        // this.dataSearch = [...b.map((x: any, i: number) => ({ ...x, index: i + 1 }))];
        if (this.isCheckCreateOrUpdateOrCopy === "UPDATE" && this.listOfData?.length > 0) {
          this.isDisDepartment = true;
          this.isDisPosition = true;
        }
      }
    }
  }

  // bảng danh sahcs ng dùng
  itemSelected(event: any) {
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
      || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
      if (event) {
        this.userChoseCheck = event;
        for (let i = 0; i < this.listOfData?.length; i++) {
          for (let j = 0; j < event.length; j++) {
            if (this.listOfData[i]?.id === event[j]?.id) {
              this.listOfData[i].checked = true;
            }
          }
        }
      }
    }
  }

  itemUnSelected(event: any) {
    if (event) {
      if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
        || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
        for (let index = 0; index < event.length; index++) {
          let dataChecked = _.remove(this.userChoseCheck, function (n) {
            return n.id !== event[index].id;
          });
          this.userChoseCheck = dataChecked;
        }
        for (let i = 0; i < this.listOfData?.length; i++) {
          for (let j = 0; j < event.length; j++) {
            if (this.listOfData[i]?.id === event[j]?.id) {
              this.listOfData[i].checked = false;
            }
          }
        }
      }
    }
  }

  openModalDeleteUser: boolean = false;

  deleteListUser() {
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
      || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
      if (this.userChoseCheck?.length <= 0) {
        this.message.error('Bạn cần chọn tài khoản người dùng cần loại ra khỏi nhóm quyền!');
        return;
      }
      this.openModalDeleteUser = true;
      this.messageDeNamePoiName = "Bạn có muốn loại các bản ghi đã chọn ra khỏi danh sách?";
    }
  }


  deleteUOk(event: any) {
    if (event) {
      if (this.openModalDeleteUser) {
        const data = this.listOfData;
        _.remove(data, (n) => {
          for (let index = 0; index < this.userChoseCheck.length; index++) {
            if (n.id === this.userChoseCheck[index].id) {
              return true
            }
          }
          return false
        });
        this.listOfData = data?.map((b: any, i: number) => ({...b, checked: false, index: i + 1})) || [];
        this.dataChoseAddUser = data?.map((b: any, i: number) => ({...b, checked: false, index: i + 1}));
        this.userChoseCheck = [];
        if (this.listOfData?.length === 0 && this.isCheckCreateOrUpdateOrCopy === "UPDATE") {
          if (this.roleGroupDtoUpdate?.isAdmin === true) {
            this.isDisDepartment = true;
            this.isDisPosition = true;
          } else {
            this.isDisDepartment = false;
            this.isDisPosition = false;
          }
        }
        this.openModalDeleteUser = false;
      } else if (this.openModalClickDefault) {
        this.popBtnDefaultOk(event);
      }
    }
  }

  deleteItem(event: any) {
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
      || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
      const dataDelete = _.remove(this.listOfData, function (n) {
        return n.id !== event?.id;
      });
      this.listOfData = dataDelete.map((x: any, i: number) => ({...x, index: i + 1})) || [];
      // this.dataSearch = [...dataDelete];
      this.dataChoseAddUser = dataDelete.map((x: any, i: number) => ({...x, index: i + 1}));
      this.userChoseCheck = [...dataDelete.filter(x => x.checked === true)];
      if (this.isCheckCreateOrUpdateOrCopy === "UPDATE" && this.listOfData?.length === 0) {
        if (this.roleGroupDtoUpdate?.isAdmin === true) {
          this.isDisDepartment = true;
          this.isDisPosition = true;
        } else {
          this.isDisDepartment = false;
          this.isDisPosition = false;
        }
      }
    }
  }

  // khi click checkbox admin
  clickAdmin(event: any) {
    this.myForm.patchValue({
      adminRole: event
    })
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
      || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
      if (this.myForm.getRawValue().adminRole === true) {
        this.listOfDataFunction = this.listOfDataFunction?.map((b: any) => ({...b, checked: true}));
        // this.dataSearchRole = this.dataSearchRole?.map((b: any) => ({ ...b, checked: true }));
        this.dataChoseFunction = [...this.dataChoseFunction, ...this.listOfDataFunction];
        this.dataChoseFunction = _.uniqBy(this.dataChoseFunction, 'id');
        this.isCheckDisable = true;
        this.isDisableDefault = true;
        this.myForm.patchValue({
          status: this.lstStatus[0].value
        })
        this.isDisStatus = true;
        this.isDisableAdmin = true;
        this.isDisDepartment = true;
        this.isDisPosition = true;
        this.myForm.get('storeId')?.setValidators(null);
        this.myForm.get('storeId')?.updateValueAndValidity();
        this.myForm.get('position')?.setValidators(null);
        this.myForm.get('position')?.updateValueAndValidity();
        this.myForm.patchValue({
          storeId: 0,
          position: 0
        });
      } else if (this.myForm.getRawValue().adminRole === false) {
        this.listOfDataFunction = this.listOfDataFunction?.map((b: any) => ({...b, checked: false}));
        // this.dataSearchRole = this.dataSearchRole?.map((b: any) => ({ ...b, checked: false }));
        this.isCheckDisable = false;
        this.dataChoseFunction = [];
        this.isDisableDefault = false;
        this.isDisStatus = false;
        this.myForm?.get('status')?.reset();
        this.isDisableAdmin = false;
      }
    }

  }

  roleGroupIdAfterClickDefault: any = null;
  isExitsAfterClickDefault: boolean = false;
  openModalClickDefault: boolean = false;
  dataExit: any = null;
  DeName: string = '';
  PoiName: string = '';
  messageDeNamePoiName: string = '';

  //khi click checkbox default
  clickDefault(event: any) {
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
      || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
      this.myForm.patchValue({
        default: event
      })
      if (this.myForm?.getRawValue().default === true) {
        Ultilities.validateForm(this.myForm);
        if (this.myForm.invalid) {
          setTimeout(() => {
            this.myForm?.get('default')?.reset();
          }, 0);
          return
        }
        setTimeout(() => {
          this.myForm?.get('default')?.reset();
        }, 0);
        if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE) {
          this.loadingService.showLoading();
          let payload = {
            storeId: this.myForm?.getRawValue()?.storeId,
            positionId: this.myForm?.getRawValue()?.position,
            roleGroupId: this.roleGroupDtoUpdate?.id ? this.roleGroupDtoUpdate?.id : null,
          }
          this.adminService.postCheckDefaultGroup(payload).pipe(finalize(() => {
            this.loadingService.hideLoading()
          })).subscribe(x => {
            if (x?.code === "00") {
              if (x?.data?.exist === false) {
                this.myForm.patchValue({
                  default: true,
                });
                // if (this.checkDefaultAdmin) {
                //     this.isDisableAdmin = true;
                // } else {
                this.isDisableAdmin = true;
                // }
                this.isExitsAfterClickDefault = false;
              } else {
                // this.DeName = this.lstDepartment.filter(x => x?.value === this.myForm?.getRawValue()?.department)[0]?.label;
                this.PoiName = this.lstPosition.filter(x => x?.value === this.myForm?.getRawValue()?.position)[0]?.label;
                this.messageDeNamePoiName = `Đã có nhóm quyền mặc định thuộc kho ${this.lstStore.filter(x => x?.value === this.myForm?.getRawValue()?.storeName)[0]?.label} và chức vụ ${this.PoiName}. Bạn có muốn thay đổi nhóm quyền mặc định này không?`;
                this.dataExit = x?.data;
                this.openModalClickDefault = true;
              }
            }
          })
        } else if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
          this.loadingService.showLoading();
          let payload = {
            storeId: this.myForm?.getRawValue()?.storeId,
            positionId: this.myForm?.getRawValue()?.position,
            roleGroupId: null,
          }
          this.adminService.postCheckDefaultGroup(payload).pipe(finalize(() => {
            this.loadingService.hideLoading()
          })).subscribe(x => {
            if (x?.code === "00") {
              if (x?.data?.exist === false) {
                this.myForm.patchValue({
                  default: true,
                });
                // if (this.checkDefaultAdmin) {
                //     this.isDisableAdmin = true;
                // } else {
                this.isDisableAdmin = true;
                // }
                this.isExitsAfterClickDefault = false;
              } else {
                // this.DeName = this.lstDepartment.filter(x => x?.value === this.myForm?.getRawValue()?.department)[0]?.label;
                this.PoiName = this.lstPosition.filter(x => x?.value === this.myForm?.getRawValue()?.position)[0]?.label;
                this.messageDeNamePoiName = `Đã có nhóm quyền mặc định thuộc kho ${this.lstStore.filter(x => x?.value === this.myForm?.getRawValue()?.storeName)[0]?.label} và chức vụ ${this.PoiName}. Bạn có muốn thay đổi nhóm quyền mặc định này không?`;
                this.dataExit = x?.data;
                this.openModalClickDefault = true;
              }
            }
          })
        }

      } else {
        this.isDisableAdmin = this.checkDefaultAdmin;
        this.isExitsAfterClickDefault = false;
        this.dataExit = [];
      }
    }
  }

  //popup khi check có mặc định ở phòng ban chức vụ
  popBtnDefaultClose() {
    this.myForm.patchValue({
      default: false,
    });
    this.isDisableAdmin = this.checkDefaultAdmin;
    ;
    this.isExitsAfterClickDefault = false;
    this.openModalClickDefault = false;
  }

  popBtnDefaultOk(event: any) {
    if (event) {
      this.myForm.patchValue({
        default: true,
      });
      this.isDisableAdmin = true;
      this.isExitsAfterClickDefault = true;
      this.roleGroupIdAfterClickDefault = this.dataExit?.roleGroupId;
      this.openModalClickDefault = false;
    }
  }

  // change phòng ban
  changeDepartment(event: any) {
    if (event) {
      if (this.myForm?.getRawValue()?.default === true) {
        this.loadingService.showLoading();
        let payload = {
          storeId: this.myForm?.getRawValue()?.storeId,
          positionId: this.myForm?.getRawValue()?.position,
          roleGroupId: this.roleGroupDtoUpdate?.id ? this.roleGroupDtoUpdate?.id : null,
        }
        this.adminService.postCheckDefaultGroup(payload).pipe(finalize(() => {
          this.loadingService.hideLoading()
        })).subscribe(x => {
          if (x?.code === "00") {
            if (x?.data?.exist === false) {
              this.myForm.patchValue({
                default: true,
              });
              // if (this.checkDefaultAdmin) {
              //     this.isDisableAdmin = true;
              // } else {
              this.isDisableAdmin = true;
              // }
              this.isExitsAfterClickDefault = false;
            } else {
              this.openModalClickDefault = true;
              // this.DeName = this.myForm?.getRawValue()?.department;
              this.PoiName = this.myForm?.getRawValue()?.position;
              this.messageDeNamePoiName = `Đã có nhóm quyền mặc định thuộc kho ${this.myForm?.getRawValue()?.storeId} và chức vụ ${this.PoiName}. Bạn có muốn thay đổi nhóm quyền mặc định này không?`;
              this.dataExit = x?.data;
            }
          }
        })
      }
    }
  }

  changePoisition(event: any) {
    if (event) {
      if (this.myForm?.getRawValue()?.default === true) {
        this.loadingService.showLoading();
        let payload = {
          storeId: this.myForm?.getRawValue()?.storeId,
          positionId: this.myForm?.getRawValue()?.position,
          roleGroupId: this.roleGroupDtoUpdate?.id ? this.roleGroupDtoUpdate?.id : null,
        }
        this.adminService.postCheckDefaultGroup(payload).pipe(finalize(() => {
          this.loadingService.hideLoading()
        })).subscribe(x => {
          if (x?.code === "00") {
            if (x?.data?.exist === false) {
              this.myForm.patchValue({
                default: true,
              });
              // if (this.checkDefaultAdmin) {
              //     this.isDisableAdmin = true;
              // } else {
              this.isDisableAdmin = true;
              // }
              this.isExitsAfterClickDefault = false;
            } else {
              this.openModalClickDefault = true;
              this.DeName = this.myForm?.getRawValue()?.storeId;
              this.PoiName = this.myForm?.getRawValue()?.position;
              this.messageDeNamePoiName = `Đã có nhóm quyền mặc định thuộc kho ${this.myForm?.getRawValue()?.storeId} và chức vụ ${this.PoiName}. Bạn có muốn thay đổi nhóm quyền mặc định này không?`;
              this.dataExit = x?.data;
            }
          }
        })
      }
    }
  }

  //bảng danh sách chức năng
  itemSelectedFunction(event: any) {
    if (event) {
      if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
        || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
        this.dataChoseFunction = [...this.dataChoseFunction, ...event];
        this.dataChoseFunction = _.uniqBy(this.dataChoseFunction, 'id');
      }
    }
  }

  itemUnSelectedFunction(event: any) {
    if (event) {
      if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.CREATE || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE
        || this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.COPY) {
        for (let index = 0; index < event.length; index++) {
          _.remove(this.dataChoseFunction, function (n) {
            return n.id === event[index].id;
          });
        }
      }
    }
  }

  _buildPayloadUpdate() {
    return {
      isActive: this.myForm.getRawValue().status === 1 ? true : false,
      isAdmin: this.myForm.getRawValue().adminRole,
      defaultGroup: this.myForm.getRawValue().default,
      storeId: this.myForm.getRawValue()?.storeId || 0,
      description: this.myForm.getRawValue()?.describe?.trim(),
      functionIds: this.dataChoseFunction?.map(x => x?.id),
      positionId: this.myForm.getRawValue()?.position || 0,
      roleGroupName: this.myForm.getRawValue()?.roleGroups?.trim(),
      userIds: this.listOfData?.map(x => x?.id)
    }
  }

  // lưu dữ liệu
  saveCreate() {
    // if (!this.myForm.get("roleGroups")?.value?.trim() || !this.myForm.get("storeId")?.value || !this.myForm.get("position")?.value) {
    //     this.message.error('Bạn chưa nhập đủ thông tin!');
    //     return;
    // };
    this.myForm.get('roleGroups')?.setValidators(Validators.required);
    this.myForm.get('roleGroups')?.updateValueAndValidity();

    if (this.myForm.getRawValue().adminRole === true) {
      this.myForm.get('storeId')?.setValidators(null);
      this.myForm.get('storeId')?.updateValueAndValidity();
      this.myForm.get('position')?.setValidators(null);
      this.myForm.get('position')?.updateValueAndValidity();
    } else {
      this.myForm.get('storeId')?.setValidators(Validators.required);
      this.myForm.get('storeId')?.updateValueAndValidity();
      this.myForm.get('position')?.setValidators(Validators.required);
      this.myForm.get('position')?.updateValueAndValidity();
    }

    Ultilities.validateForm(this.myForm);
    if (this.myForm.invalid) {
      return
    }

    if ((this.dataChoseFunction?.length === 0 || this.dataChoseFunction?.length === null || this.dataChoseFunction?.length === undefined) && this.myForm?.getRawValue()?.adminRole === false) {
      this.message.error(`Bạn cần chọn các chức năng được quyền thao tác cho ${this.myForm?.getRawValue()?.roleGroups}!`);
      return;
    }
    ;
    // if (this.listOfData?.length === 0 || this.listOfData === undefined || this.listOfData === null) {
    //     this.message.error('Bạn cần thêm người dùng vào nhóm quyền!');
    //     return;
    // };
    // if (this.myForm.getRawValue().adminRole === true) {
    // } else {
    // }
    this.submit();
  }

  private submit(): void {
    let payload: any = {
      ...this._buildPayloadUpdate()
    }

    if (this.isExitsAfterClickDefault) {
      payload.changeDefaultRoleGroupDto = {
        isChange: true,
        oldRoleGroupId: this.roleGroupIdAfterClickDefault
      };
    }
    this.loadingService.showLoading();
    if (this.isCheckCreateOrUpdateOrCopy === CheckCreateOrUpDateOrCopy.UPDATE) {
      payload.id = this.roleGroupDtoUpdate?.id;
      this.adminService.postUpdateRoleGroup(payload).pipe(finalize(() => {
        this.loadingService.hideLoading()
      })).subscribe(res => {
        if (res.code === '00') {
          this.message.success('Lưu dữ liệu thành công!');
          this.checkSuccess.emit(true);
        }
      })
    } else {
      this.adminService.postSaveRoleGroup(payload).pipe(finalize(() => {
        this.loadingService.hideLoading()
      })).subscribe(res => {
        if (res.code === '00') {
          this.message.success('Lưu dữ liệu thành công!');
          this.checkSuccess.emit(true);
        }
      })
    }
  }

  showFunctions(event: boolean) {
    this.myForm?.patchValue({
      checkFunction: event
    })
    this.moduleMenu = this.moduleMenu?.map((x: any) => {
      return {
        ...x,
        expanded: event,
        children: x?.children?.map((y: any) => {
          return {
            ...y,
            expanded: event,
            children: y?.children?.map((z: any) => {
              return {...z, expanded: event};
            }),
          };
        }),
      };
    });
  }

  outModal() {
    this.checkSuccess.emit(false);
    this.lsUserUpdate = [];
    this.lsFunctionUpdate = [];
    this.roleGroupDtoUpdate = [];
  }
}
