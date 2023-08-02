import {ColumnType, TableColum} from '@viettel-vss-base/vss-ui';
import {EnumSelectOptionType} from '@vbomApp/modules/shares/enum/constants';
import {StaffStatus, StatusBoolean} from '@vbomApp/modules/shares/enum/options.constants';


export const columnTable: TableColum[] = [
  { id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '60px', isFilter: false },
  {
    id: 2,
    name: 'user',
    fixedColumn: false,
    attr: 'Người dùng',
    type: ColumnType.TEXT,
    width: '200px',
    isSort: true,
    isFilter: true,
    hiddenResize: false,
    filter: {
      name: 'username', type: ColumnType.SELECT, selectOptionsType: EnumSelectOptionType.user,
      //  multiple: true
    }
  },
  // {
  //   id: 3,
  //   name: 'fullName',
  //   fixedColumn: false,
  //   attr: 'Người dùng',
  //   type: ColumnType.TEXT,
  //   width: '100px',
  //   isSort: true,
  //   filter: {
  //     type: ColumnType.SELECT, selectOptionsType: EnumSelectOptionType.user, multiple: true,
  //     placeholder: 'Tất cả người dùng', name: 'username'
  //   }, isFilter: true
  // },
  {
    id: 4,
    name: 'storeName',
    fixedColumn: false,
    attr: 'Kho',
    type: ColumnType.TEXT,
    width: '200px',
    isFilter: true,
    isSort: true,
    filter: { name: 'storeId', type: ColumnType.SELECT_INT, multiple: true, placeholder: 'Tất cả kho', selectOptionsType: EnumSelectOptionType.stores }
  },
  {
    id: 5,
    name: 'createdDate',
    fixedColumn: false,
    attr: 'Ngày thao tác',
    type: ColumnType.TEXT_CENTER,
    width: '200px',
    isFilter: true,
    defaultSort: 'desc',
    isSort: true,
    filter: { type: ColumnType.DATE_RANGE_PICKER }
  },
  {
    id: 6, name: 'impact', fixedColumn: false, attr: 'Hành động', type: ColumnType.TEXT, width: '200px',
    isSort: true, isFilter: true
  },
  {
    id: 7, name: 'description', fixedColumn: false, attr: 'Mô tả', type: ColumnType.TEXT, width: '200px',
    isSort: true, isFilter: true
  },
  // {
  //   id: 8, name: 'userIp', fixedColumn: false, attr: 'IP máy', type: ColumnType.TEXT, width: '200px',
  //   isSort: true, isFilter: true
  // },
  { id: 9, name: 'originalId', fixedColumn: false, attr: 'Id', type: ColumnType.TEXT, width: '200px', isSort: true, isFilter: true },
];

export const columnPermissionDataTable: TableColum[] = [
  {
    id: 11, name: 'data.roleGroup.roleGroupName', fixedColumn: false, attr: 'Tên nhóm quyền', type: ColumnType.TEXT, width: '200px'
  },
  { id: 12, name: 'data.roleGroup.description', fixedColumn: false, attr: 'Mô tả nhóm quyền', type: ColumnType.TEXT, width: '200px' },
  {
    id: 13, name: 'data.store', fixedColumn: false, attr: 'Kho', type: ColumnType.TEXT, width: '150px'
  },
  {
    id: 15, name: 'data.position', fixedColumn: false, attr: 'Chức vụ', type: ColumnType.TEXT, width: '100px'
  },
  {
    id: 16, name: 'data.roleGroup.isActive', fixedColumn: false, attr: 'Trạng thái', type: ColumnType.TAG, options: StaffStatus, width: '110px',
  },
  { id: 17, name: 'data.roleGroup.defaultGroup', fixedColumn: false, attr: 'Mặc định', type: ColumnType.CHECKBOX, width: '100px' },
  { id: 18, name: 'data.roleGroup.isAdmin', fixedColumn: false, attr: 'Quyền Admin', type: ColumnType.CHECKBOX, width: '120px' },
  {
    id: 19, name: 'data.functions', fixedColumn: false, attr: 'Danh sách chức năng', type: ColumnType.TEXT, width: '200px',
  },
  { id: 20, name: 'data.users', fixedColumn: false, attr: 'Danh sách người dùng', type: ColumnType.TEXT, width: '200px' },
];

export const columnUserTable: TableColum[] = [
  { id: 11, name: 'data.user.userName', fixedColumn: false, attr: 'Người dùng', type: ColumnType.TEXT, width: '200px' },
  { id: 12, name: 'data.user.fullName', fixedColumn: false, attr: 'Họ và tên', type: ColumnType.TEXT, width: '200px' },
  { id: 13, name: 'data.user.phoneNumber', fixedColumn: false, attr: 'Số điện thoại', type: ColumnType.TEXT, width: '200px' },
  { id: 14, name: 'data.user.email', fixedColumn: false, attr: 'Email', type: ColumnType.TEXT, width: '200px' },
  {
    id: 15, name: 'data.user.areaId', fixedColumn: false, attr: 'Khu vực', type: ColumnType.TEXT, width: '200px'
  },
  {
    id: 16, name: 'data.department', fixedColumn: false, attr: 'Phòng/ban', type: ColumnType.TEXT, width: '150px'
  },
  {
    id: 17, name: 'data.position', fixedColumn: false, attr: 'Chức vụ', type: ColumnType.TEXT, width: '100px',
  },
  {
    id: 18, name: 'data.user.isActive', fixedColumn: false, attr: 'Trạng thái', type: ColumnType.TAG, options: StaffStatus, width: '120px'
  },
  { id: 19, name: 'data.roleGroups', fixedColumn: false, attr: 'Danh sách nhóm quyền', type: ColumnType.TEXT, width: '200px' },
  { id: 20, name: 'data.functions', fixedColumn: false, attr: 'Phân quyền cá nhân', type: ColumnType.TEXT, width: '200px' },
];

export const columnFunctionTable: TableColum[] = [
  { id: 11, name: 'data.menu.menuName', fixedColumn: false, attr: 'Tên phân hệ/ chức năng', type: ColumnType.TEXT, width: '200px' },
  { id: 12, name: 'data.menu.formName', fixedColumn: false, attr: 'Tên form', type: ColumnType.TEXT, width: '200px' },
  // { id: 13, name: 'type', fixedColumn: false, attr: 'Loại', type: ColumnType.TEXT, width: '200px',  hiddenResize: false },
  { id: 14, name: 'data.module_id', fixedColumn: false, attr: 'Thuộc phân hệ', type: ColumnType.TEXT, width: '200px' },
  { id: 15, name: 'data.menu.isShow', fixedColumn: false, attr: 'Hiển thị trên menu', type: ColumnType.CHECKBOX, width: '200px' },
  { id: 16, name: 'data.menu.url', fixedColumn: false, attr: 'Đường dẫn', type: ColumnType.TEXT, width: '150px' },
  { id: 17, name: 'data.menu.indexOrder', fixedColumn: false, attr: 'Thứ tự hiển thị', type: ColumnType.TEXT, width: '100px' },
  { id: 18, name: 'data.menu.description', fixedColumn: false, attr: 'Mô tả', type: ColumnType.TEXT, width: '100px' },
  { id: 19, name: 'data.menu_function', fixedColumn: false, attr: 'Danh sách tính năng', type: ColumnType.TEXT, width: '100px' },
];

export const columnFunctionListTable: TableColum[] = [
  { id: 11, name: 'data.function.functionCode', fixedColumn: false, attr: 'Mã code', type: ColumnType.TEXT, width: '200px' },
  { id: 12, name: 'data.function.description', fixedColumn: false, attr: 'Mô tả', type: ColumnType.TEXT, width: '200px' },
];

export const columnUserStoreTable: TableColum[] = [
  { id: 11, name: 'data.user.userName', fixedColumn: false, attr: 'Tài khoản', type: ColumnType.TEXT, width: '200px' },
  { id: 12, name: 'data.user.fullName', fixedColumn: false, attr: 'Họ và tên', type: ColumnType.TEXT, width: '200px' },
  // { id: 11, name: 'data.user.userName', fixedColumn: false, attr: 'Phòng ban', type: ColumnType.TEXT, width: '200px' },
  // { id: 12, name: 'data.user.fullName', fixedColumn: false, attr: 'Chức vụ', type: ColumnType.TEXT, width: '200px' },
  {
    id: 13, name: 'data.user_store', fixedColumn: false, attr: 'Danh sách người dùng thuộc kho', type: ColumnType.TEXT, options: StaffStatus, width: '300px'
  },
];

export const columnParamsTable: TableColum[] = [
  { id: 11, name: 'data.configName', fixedColumn: false, attr: 'Nhóm tham số', type: ColumnType.TEXT, width: '200px' },
  { id: 12, name: 'data.configCode', fixedColumn: false, attr: 'Mã code', type: ColumnType.TEXT, width: '200px' },
  { id: 13, name: 'data.description', fixedColumn: false, attr: 'Mô tả', type: ColumnType.TEXT, width: '200px' },
  { id: 14, name: 'data.value', fixedColumn: false, attr: 'Giá trị', type: ColumnType.TEXT, width: '200px' },
  { id: 15, name: 'data.indexOrder', fixedColumn: false, attr: 'Thứ tự', type: ColumnType.TEXT, width: '200px' },
  // {
  //   id: 16, name: 'data.isActive', fixedColumn: false, attr: 'Trạng thái', type: ColumnType.TAG, options: StaffStatus, width: '200px'
  // }
];

export const LogScreen = [{
  value: 'role_group_history',
  label: 'Quản lý nhóm quyền',
  columns: [...columnTable, ...columnPermissionDataTable]
},
{
  value: 'user_history',
  label: 'Quản lý người dùng',
  columns: [...columnTable, ...columnUserTable]
}, {
  value: 'menu_history',
  label: 'Danh sách chức năng',
  columns: [...columnTable, ...columnFunctionTable]
}, {
  value: 'function_history',
  label: 'Danh sách tính năng',
  columns: [...columnTable, ...columnFunctionListTable]
}, {
  value: 'user_store',
  label: 'Phân quyền dữ liệu',
  columns: [...columnTable, ...columnUserStoreTable]
}, {
  value: 'app_config_history',
  label: 'Tham số',
  columns: [...columnTable, ...columnParamsTable]
},
{
  value: 'customer_completion_rate_history',
  label: 'Cấu hình % hoàn thiện hồ sơ khách hàng',
  columns: columnTable
}];
