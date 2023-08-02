import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import * as _ from 'lodash';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {finalize} from 'rxjs/operators';
import {RoleGroupListComponent} from '../role-group-list/role-group-list.component';
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
import {TreeHelper} from '@vbomApp/modules/shares/helper/tree-helper';

@Component({
  selector: 'vbom-edit-user-permission',
  templateUrl: './edit-user-permission.component.html',
  styleUrls: ['./edit-user-permission.component.scss'],
})
export class EditUserPermissionComponent
  extends BaseListComponent
  implements OnInit {
  id: any;
  choosenFunctionList: any[] = [];
  functionList: any[] = [];
  lstPosition: any[] = [];
  lstArea: any[] = [];
  lstGroup: any[] = [];
  lstDepartment: any[] = [];
  lstStore: any[] = [];
  lstStatus: any[] = [
    {value: 0, label: 'Không hoạt động'},
    {value: 1, label: 'Hoạt động'},
  ];
  tabs: any[] = ['Danh sách nhóm quyền', 'Phân quyền cá nhân'];
  index = 0;
  settingValue!: SettingTableDynamic;
  col: TableColum[] = [
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
      name: 'roleGroupName',
      fixedColumn: false,
      attr: 'Tên nhóm quyền',
      type: ColumnType.TEXT,
      width: '25%',
      isFilter: true,
      isSort: true,
    },
    {
      id: 3,
      name: 'defaultStoreName',
      fixedColumn: false,
      attr: 'Kho',
      type: ColumnType.TEXT,
      width: '30%',
      isFilter: true,
      isSort: true,
      filter: {
        name: 'defaultStoreId',
        selectOptionsType: EnumSelectOptionType.stores,
        type: ColumnType.SELECT_INT,
        multiple: true
      }
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
      filter: {
        name: 'positionId',
        selectOptionsType: EnumSelectOptionType.position,
        type: ColumnType.SELECT_INT,
        multiple: true
      }
    },
    {
      id: 5,
      name: 'action',
      fixedColumn: false,
      attr: 'Thao tác',
      type: ColumnType.ACTION,
      action: {isRemove: true},
      rulesAction: {isRemove: ['ROLE_ROLEGROUP_DELETE']},
      width: '10%',
      isFilter: false,
    },
  ];
  col2: TableColum[] = [
    {
      id: 1,
      name: 'index',
      fixedColumn: false,
      attr: 'STT',
      type: ColumnType.TEXT,
      width: '50px',
      isFilter: false,
    },
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
      isSort: true,
    },
  ];
  roleGroupList: any[] = [];
  nodes: any = [
    {
      title: 'Danh sách phân hệ/Chức năng',
      key: '',
      children: [],
    },
  ];
  functionsInGroupRoles: any = [];
  selectedRoles: any = [];
  userInfo: any;
  displayFunctions: any[] = [];

  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private modalRef: NzModalRef,
    private loadingService: VssLoadingService,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.initSettingTable();
    this.initForm();
    this.initData();
    this.getFunctionModules();
    this.getUserInfo();
  }

  initSettingTable() {
    this.settingValue = {
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
  }

  initForm() {
    this.myForm = this.fb.group({
      userName: {value: null, disabled: true},
      areaId: {value: null, disabled: true},
      fullName: {value: null, disabled: true},
      positionId: {value: null, disabled: true},
      phoneNumber: {value: null, disabled: true},
      departmentId: {value: null, disabled: true},
      defaultStoreId: {value: null, disabled: true},
      email: {value: null, disabled: true},
      isActive: {value: 1, disabled: true},
      checkFunction: {value: true, disabled: false}
    });
  }

  initData() {
    this.adminService.getAreaList().subscribe((res: any) => {
      this.lstArea =
        res?.data?.map((x: any) => {
          return {value: x?.id, label: x?.areaName};
        }) || [];
    });

    this.adminService.getDepartmentList()
      // .pipe(finalize(() => {this.loadingService.hideLoading()}))
      .subscribe(x => {
        if (x.code === '00') {
          if (x.data && x.data?.length > 0) {
            this.lstDepartment = x?.data?.map((x: any) => ({value: x.id, label: `${x.id} - ${x.departmentName}`}));
          }
        }
      }, (err) => this.message.error(err.error.error))
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
      // .pipe(finalize(() => { this.loadingService.hideLoading() }))
      .subscribe(x => {
        if (x.code === '00') {
          if (x.data && x.data?.length > 0) {
            this.lstPosition = x?.data?.map((x: any) => ({value: x.id, label: `${x.id} - ${x.positionName}`}));
          }
        }
      }, (err) => this.message.error(err.error.error))
  }


  selectTab(event: any) {
    if (event === 1) {
      if (this.myForm?.getRawValue()?.checkFunction === true) {
        this.showFunctions(true);
        this.displayFunctions = [];
      } else {
        this.displayFunctions = [];
      }
    }
  }

  removeItem(event: any) {
    this.roleGroupList = this.roleGroupList?.filter((el: any) => {
      return el?.id !== event?.id;
    })?.map((x: any, index) => {
      return {...x, index: index + 1, checked: x?.checked || false};
    });
  }

  removeRoles() {
    if (!this.selectedRoles?.length) {
      this.message.error(`Bạn cần chọn nhóm quyền cần loại ra khỏi tài khoản người dùng!`);
      return
    }
    this.openModalDelete = true
  }

  getSelectedRoles(items: any[]) {
    this.selectedRoles = items;
  }

  getUnSelectedRoles(items: any[]) {
    this.selectedRoles = this.selectedRoles.filter((el: any) => {
      return items.findIndex((x: any) => x?.id == el?.id) < 0;
    });
  }

  onChange(event: any) {
    this.displayFunctions = this.functionList?.filter((x: any) => x?.functionName?.toLowerCase()?.includes(event?.trim()?.toLowerCase()))
  }

  getUserInfo() {
    this.loadingService.showLoading();
    this.adminService
      .getUserInfo({userId: this.id}).pipe(finalize(() => {
      this.loadingService.hideLoading()
    }))
      .subscribe((res: any) => {
        if (res.code === ResponseCode.SUCCESS) {
          this.userInfo = res?.data;
          this.myForm.patchValue(this.userInfo?.userDTO);
          this.choosenFunctionList = this.userInfo?.lsFunctions;
          this.roleGroupList = this.userInfo?.lsRoles?.map(
            (x: any, index: number) => {
              return {...x, index: index + 1, checked: false};
            }
          );
          this.getListFunctionsByGroupRoles()
        }
      });
  }

  getListFunctionsByGroupRoles() {
    if (!this.roleGroupList?.length) return
    this.loadingService.showLoading();
    this.adminService.getListFunctionByGroupRoles(this.roleGroupList.map(x => x.id))
      .pipe(finalize(() => {
        this.loadingService.hideLoading()
      }))
      .subscribe(
        res => {
          this.functionsInGroupRoles = res.data;
        }
      )
  }

  getFunctionModules() {
    this.adminService.getAllModules().subscribe((res) => {
      if (res.code === ResponseCode.SUCCESS) {
        this.nodes = [
          {
            title: 'Danh sách phân hệ/ chức năng',
            key: '',
            isLeaf: false,
            children: TreeHelper.parseDataModules(res.data)
          },
        ];
      }
    });
  }

  loadFunction(event: any) {
    if (event?.node?.origin?.id) {
      this.loadingService.showLoading();
      this.adminService
        .getListFunctionByMenuId(event?.node?.origin?.id).pipe(finalize(() => {
        this.loadingService.hideLoading()
      }))
        .subscribe((res: any) => {
          if (res.code === ResponseCode.SUCCESS) {
            this.initSettingTable();
            this.functionList = res?.data?.map((x: any, index: number) => {
              return {
                ...x,
                index: index + 1,
                checked: this.choosenFunctionList.concat(this.functionsInGroupRoles || [])
                  ?.map((y: any) => {
                    return y?.id;
                  })
                  ?.some((z: any) => z === x?.id),
                disabled: this.functionsInGroupRoles
                  ?.map((y: any) => {
                    return y?.id;
                  })
                  ?.some((z: any) => z === x?.id),
              };
            });
            this.displayFunctions = _.clone(this.functionList);
          }
        });
    }
  }

  showFunctions(event: boolean) {
    this.myForm?.patchValue({
      checkFunction: event
    })

    this.nodes = this.nodes?.map((x: any) => {
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

  getItemSelected(items: any[]) {
    this.choosenFunctionList = _.uniqBy(
      [
        ...this.choosenFunctionList?.map((x: any) => {
          return {...x, checked: true};
        }),
        ...items,
      ],
      JSON.stringify
    );
  }

  getUnItemSelected(items: any[]) {
    this.choosenFunctionList = this.choosenFunctionList.filter((el: any) => {
      return items.findIndex((x: any) => x?.id == el?.id) < 0;
    });
  }

  addRoleGroup() {
    this.modalService.create({
      nzTitle: 'Tìm kiếm nhóm quyền',
      nzContent: RoleGroupListComponent,
      nzWidth: '80%',
      nzMaskClosable: false,
      nzCentered: true,
      nzFooter: null,
      nzComponentParams: {
        selectedList: this.roleGroupList?.map((x: any) => {
          return {...x, checked: true, disabled: true}
        }),
        id: this.id,
        roleGroupList: this.roleGroupList?.map((x: any) => {
          return {...x, checked: true, disabled: true}
        }),
      }
    }).afterClose.subscribe(res => {
      if (res) {
        this.roleGroupList = res?.map((x: any, index: number) => {
          return {...x, index: index + 1, checked: false};
        });
      }
    });
  }

  save() {
    let payload = {
      lsFunctions: this.choosenFunctionList?.map((x: any) => {
        return {id: x?.id}
      }),
      lsRoles: this.roleGroupList,
      userDTO: {
        ...this.userInfo?.userDTO,
        ...this.myForm.getRawValue(),
      },
    };
    this.adminService
      .updateUserInfo(payload)
      .subscribe((res: any) => {
        if (res.code === ResponseCode.SUCCESS) {
          this.message.success(`Cập nhật thành công!`);
          this.modalRef.close(true);
        }
      });
  }

  closeModal() {
    this.modalRef.close();
  }

  openModalDelete: boolean = false;

  deleteUOk(event: any) {
    if (event) {
      this.roleGroupList = this.roleGroupList
        .filter((el: any) => {
          return (
            this.selectedRoles.findIndex((x: any) => x?.id == el?.id) < 0
          );
        })
        ?.map((x: any, index: number) => {
          return {...x, checked: x?.checked || false, index: index + 1};
        });
      this.openModalDelete = false;
    }
  }

  deleteUCancel() {
    this.openModalDelete = false;
  }
}
