import {ColumnType, TableColum} from '@viettel-vss-base/vss-ui';
import {EnumSelectOptionType} from '@vbomApp/modules/shares/enum/constants';

export const colTable: TableColum[] = [
  {id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '5%', isFilter: false},
  {
    id: 2,
    name: 'username',
    fixedColumn: false,
    attr: 'Tài khoản truy cập',
    type: ColumnType.TEXT,
    width: '20%',
    isSort: true,
    isFilter: true, hiddenResize: false
  },
  {
    id: 3,
    name: 'fullName',
    fixedColumn: false,
    attr: 'Họ và tên',
    type: ColumnType.TEXT,
    width: '25%',
    isSort: true,
    isFilter: true,
    filter: {
      type: ColumnType.SELECT, selectOptionsType: EnumSelectOptionType.user, multiple: true,
      placeholder: 'Tất cả người dùng', name:'username'
    },hiddenResize: false
  },
  {
    id: 4,
    name: 'storeName',
    fixedColumn: false,
    attr: 'Kho',
    type: ColumnType.TEXT,
    width: '25%',
    isFilter: true,
    isSort: true,
    filter: {type: ColumnType.SELECT_INT, multiple: true, placeholder: 'Tất cả kho', name: 'storeId'}, hiddenResize: false
  },
  {
    id: 5,
    name: 'loginDate',
    fixedColumn: false,
    attr: 'Thời gian đăng nhập',
    type: ColumnType.TEXT_CENTER,
    width: '25%',
    isFilter: true,
    isSort: true,
    defaultSort: 'desc',
    filter: {type: ColumnType.DATE_TIME_RANGE_PICKER}, hiddenResize: false
  },
  // {
  //   id: 6,
  //   name: 'ip',
  //   fixedColumn: false,
  //   attr: 'Thông tin IP máy',
  //   type: ColumnType.TEXT,
  //   width: '20%',
  //   isSort: true,
  //   isFilter: true, hiddenResize: false
  // },
]
