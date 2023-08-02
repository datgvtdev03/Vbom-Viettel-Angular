import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import { NzModalService} from 'ng-zorro-antd/modal';
import {finalize, tap} from 'rxjs/operators';
import {EditUserPermissionComponent} from './edit-user-permission/edit-user-permission.component';
import {Observable, of} from "rxjs";
import {
  BaseListComponent,
  ColumnType,
  SettingTableDynamic,
  TableColum,
  TableComponent,
  VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {EnumSelectOptionType} from '@vbomApp/modules/shares/enum/constants';
import {Status} from '@vbomApp/modules/shares/enum/options.constants';
import {UserByRoleModel} from '@vbomApp/modules/admin/admin.model';
import {AdminService} from '@vbomApp/service/admin.service';
import {CheckCreateOrUpDateOrCopy, ResponseCode} from '@vbomApp/modules/shares/enum/common.enum';

@Component({
  selector: 'vbom-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent extends BaseListComponent implements OnInit {
  @ViewChild('tableUserRole') tableUserRole?: TableComponent

  isShow: boolean = true;
  roleGroupsListData: any[] = [];
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
    { id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '50px'},
    { id: 2, name: 'userName', fixedColumn: false, attr: 'Tên đăng nhập', isSort: true,
      type: ColumnType.TEXT, width: '150px', isFilter: true, isLink: true, hiddenResize: false },
    { id: 3, name: 'fullName', fixedColumn: false, attr: 'Họ và tên',isSort: true,
      filter: {type: ColumnType.SELECT, selectOptionsType: EnumSelectOptionType.user, multiple: true},
      type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false },
    // { id: 4, name: 'isActive', fixedColumn: false, attr: 'Trạng thái', type: ColumnType.SELECT, filter: { type: ColumnType.SELECT_INT, options: [{ value: 0, label:'Không hoạt động'},{ value: 1, label:'Hoạt động'}]} , width: '100px', isFilter: true, hiddenResize: false },
    {
      id: 4,
      name: 'isActive',
      fixedColumn: false,
      attr: 'Trạng thái',
      type: ColumnType.TAG,
      options: Status,
      isFilter: true,
      width: '100px',isSort: true,
      filter:{ type: ColumnType.SELECT, options: [{value: 1, label:"Hoạt động"},{value: 0, label:"Không hoạt động"}]}
    },
    { id: 5, name: 'action', fixedColumn: false, attr: 'Thao tác', type: ColumnType.ACTION, action: { isEdit: true },
      rulesAction: {isEdit: ['ROLE_USER_DATA_UPDATE']}, width: '100px', hiddenResize: false }
  ];
  listOfData: UserByRoleModel[] = [];
  openModalAddRole: boolean = false;
  isCheckCreateOrUpdateOrCopy: string = '';
  lsFunctionUpdate: any[] = [];
  lsUserUpdate: any[] = [];
  roleGroupDtoUpdate: any = {};
  choseRole: any = null;
  params: any = {};
  dataTreeRole: any = null;
  nameRoleGroup: string = '';
  openModalDeleteRoleGroup: boolean = false;
  roleGroupId: any = null;
  usersChecked: any[] = []
  showModalDeleteUsers: boolean = false

  constructor(
    private modalService: NzModalService,
    private message: NzMessageService,
    private loadingService: VssLoadingService,
    private adminService: AdminService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getData();
    this.setupStreamSearch();
  }

  onFilterInTable(event: any) {
    super.onFilterInTable(event);
  }


  apiSearch(payload: any): Observable<any> {
    const filterData: any = this.searchBind$.value.filterData
    const params: any = {
      isActive: filterData?.isActive,
      userName: filterData?.userName || null,
      fullName: filterData?.fullName || null,
      users: filterData?.userId || null,
    }

    if(payload.sortField.length) {
      params.sort = `${payload.sortField[0].fieldName},${payload.sortField[0].sort}`
    }

    return !!this.roleGroupId ? this.adminService.getUsersByRoleGroup(
      this.paging.pageIndex, this.roleGroupId , this.paging.pageSize
      ,params
    )
      .pipe(
        tap(
          x => {
            if (x.code === ResponseCode.SUCCESS) {
              if (x.data) {
                this.listOfData = x.data?.content?.map((x: any, index: number)=>{
                  return{
                    ...x,
                    index: (this.paging.pageIndex - 1) * this.paging.pageSize + index + 1 ,
                    isActive: x?.isActive == 1 ? 'Hoạt động' : 'Không hoạt động',
                    checked: this.usersChecked?.some(c => c.id == x.id)
                  }
                }) ||[];
                this.paging.totalElements = x?.data?.totalElements || 0;
                this.paging.totalPages = x.data.totalPages;
              }
            }
          }
        )
      ) : of()
  }

  getData() {
    this.loadingService.showLoading();
    this.adminService.getRoleGroupsList()
      .pipe(finalize(() => { this.loadingService.hideLoading() }))
      .subscribe(x => {
        if (x.code === "00") {
          if (x.data && x.data?.length > 0) {
            this.roleGroupsListData = [{
              title: 'Tất cả nhóm quyền',
              key: 0,
              rulesContextMenu: {
                ruleEdit: ['ROLE_ROLEGROUP_UPDATE'],
                ruleCopy: ['ROLE_ROLEGROUP_SAVE'],
                ruleDelete: ['ROLE_ROLEGROUP_DELETE'],
              },
              children: x?.data?.map((b:any) => ({
                ...b,
                title: `${b.roleGroupName} (${b.numberUser})`,
                key: b.id,
                isLeaf: true,
              }))
            }]
            this.showFunctions(true);
          }else{
            this.roleGroupsListData = [{
              title: 'Tất cả nhóm quyền',
              key: 0,
              children: []
            }]
          }
        }
      })
  }

  onClickTreeRole(event: any, page = 1) {
    if (event) {
      this.dataTreeRole = event;
      if (event?.node?.origin?.key === 0) {
        this.listOfData = [];
        this.choseRole = null;
      } else {
        this.usersChecked = []
        this.paging.pageIndex = page;
        this.params.page = this.paging.pageIndex;
        this.params.size = this.paging.pageSize;

        this.choseRole = event?.node?.origin;
        this.roleGroupId = event?.node?.origin?.key;
        this.tableUserRole?.clearFilter()
        this.onPageIndexChange(1)
      }
    } else {
      this.dataTreeRole = null;
      this.choseRole = null;
      this.listOfData = [];
      this.usersChecked = [];
      this.paging.totalElements = 0;
      this.paging.totalPages = 0;
    }
  }

  editUser(item: any) {
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
      this.checkSuccess(res);
    })
  }


  openModelAdd() {
    this.openModalAddRole = true;
    this.isCheckCreateOrUpdateOrCopy = CheckCreateOrUpDateOrCopy.CREATE;
  }

  clickAddRoleCancel() {
    this.openModalAddRole = false;
    this.lsUserUpdate = [];
    this.lsFunctionUpdate = [];
    this.roleGroupDtoUpdate = [];
  }

  clickAddRoleOk() { }

  // khi ấn cập nhật nhóm quyền
  openModelUpdate() {
    if (this.choseRole) {
      const data = {
        roleGroupId: this.choseRole?.key
      }
      this.isCheckCreateOrUpdateOrCopy = CheckCreateOrUpDateOrCopy.UPDATE;
      this.loadingService.showLoading();
      this.adminService.getRoleGroupInfo(data).pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe(x => {
        if (x.code === "00") {
          if (x.data) {
            this.openModalAddRole = true;
            this.lsFunctionUpdate = x?.data?.lsFunction || [];
            this.lsUserUpdate = x?.data?.lsUser;
            this.roleGroupDtoUpdate = x?.data?.roleGroupDto;
          }
        }
      }, (err) => this.message.error(err.error.error))

    } else {
      this.message.error('Bạn chưa chọn nhóm quyền cần cập nhật');
    }
  }

  // khi ấn copy
  openModelCopy() {
    if (this.choseRole) {
      const data = {
        roleGroupId: this.choseRole?.key
      }
      this.isCheckCreateOrUpdateOrCopy = CheckCreateOrUpDateOrCopy.COPY;
      this.loadingService.showLoading();
      this.adminService.getRoleGroupInfo(data).pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe(x => {
        if (x.code === "00") {
          if (x.data) {
            this.openModalAddRole = true;
            this.lsFunctionUpdate = x?.data?.lsFunction || [];
            this.lsUserUpdate = x?.data?.lsUser;
            this.roleGroupDtoUpdate = x?.data?.roleGroupDto;
          }
        }
      }, (err) => this.message.error(err.error.error))

    } else {
      this.message.error('Bạn chưa chọn nhóm quyền cần sao chép');
    }
  }


  //khi lưu thành công
  checkSuccess(event: any) {
    if (event === true) {
      this.openModalAddRole = false;
      this.getData();
      this.listOfData = [];
      this.choseRole = null;
      this.onClickTreeRole(this.dataTreeRole)
    } else {
      this.openModalAddRole = false;
    }
  }

  //Xóa nhóm quyền
  deleteRoleGroup() {
    if (this.choseRole) {
      const data = {
        roleGroupId: this.choseRole?.key
      }
      this.loadingService.showLoading();
      this.adminService.getRoleGroupInfo(data).pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe(x => {
        if (x.code === "00") {
          if (x.data) {
            this.lsFunctionUpdate = x?.data?.lsFunction || [];
            this.lsUserUpdate = x?.data?.lsUser;
            this.roleGroupDtoUpdate = x?.data?.roleGroupDto;
            if (x?.data?.lsUser) {
              this.message.error(`Bạn cần bỏ người dùng ra khỏi danh sách ${x?.data?.roleGroupDto?.roleGroupName}!`);
              return
            }
            this.nameRoleGroup = `Bạn có muốn xoá ${x?.data?.roleGroupDto?.roleGroupName} không ?`;
            this.openModalDeleteRoleGroup = true;
          }
        }
      }, (err) => this.message.error(err.error.error))

    } else {
      this.message.error('Bạn chưa chọn nhóm quyền cần xoá');
    }
  }


  deleteOk(event:any) {
    if(event){
      if(this.openModalDeleteRoleGroup){
        this.loadingService.showLoading();
        this.adminService.postDeleteRoleGroup(this.roleGroupDtoUpdate?.id).pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe(x => {
          if (x.code == "00") {
            if (x.data) {
              this.message.success(`Bạn đã xóa nhóm quyền ${this.roleGroupDtoUpdate?.roleGroupName} thành công!`);
              this.openModalDeleteRoleGroup = false;
              this.getData();
              this.listOfData = [];
              this.choseRole = null;
            }
          }
        })
      }else if(this.showModalDeleteUsers){
        this.deleteUsersOk(event)
      }
    }
  }

  showFunctions(event: boolean) {
    this.roleGroupsListData = this.roleGroupsListData?.map((x: any) => {
      return {
        ...x,
        expanded: event,
        children: x?.children?.map((y: any) => {
          return {
            ...y,
            expanded: event,
            children: y?.children?.map((z: any) => {
              return { ...z, expanded: event };
            }),
          };
        }),
      };
    });
  }

  getItemSelected(event: any[]){
    this.usersChecked = this.usersChecked.concat(event.filter(e => !this.usersChecked.find(c => e.id == c.id)))
  }

  getItemUnSelected(items: any[]){
    this.usersChecked = this.usersChecked.filter(c => !items.find(i => i.id == c.id))

  }

  openPopupDelete(){
    if (this.usersChecked?.length) {
      this.showModalDeleteUsers = true;
      this.nameRoleGroup = 'Bạn có chắc chắn muốn xóa dữ liệu không?';
    } else {
      this.message.error('Bạn chưa chọn người dùng cần xoá');
    }
  }


  deleteUsersOk(event:any) {
    if(event){
      this.showModalDeleteUsers = false
      this.adminService.deleteUsersRoleGroup(this.choseRole?.key, this.usersChecked?.map(x => x?.id))
        .pipe(finalize(() => { this.loadingService.hideLoading() }))
        .subscribe(
            () => {
            this.usersChecked = []
            this.message.success("Xóa thành công");
            this.onPageIndexChange(1)
            this.getData()
          }
        );
    }

  }
}
