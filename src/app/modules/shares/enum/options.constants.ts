import {OptionModel} from '@viettel-vss-base/vss-ui';

export const StatusOptions: OptionModel[] = [
    {
        label: 'Hiệu lực',
        value: 1
    }, {
        label: 'Hết hiệu lực',
        value: 0
    }];
export const Status: OptionModel[] = [
{
    label: 'Hoạt động',
    value: 1,
    color: '#14804A'
}, {
    label: 'Không hoạt động',
    value: 0,
    color: '#667085'
}];

export const CusType: OptionModel[] = [
  {
    label: 'Tiềm năng',
    value: 1,
  }, {
    label: 'Chính thức',
    value: 2,
  }, {
    label: 'Trung thành',
    value: 3,
  }
];

export const StaffStatus: OptionModel[] = [
{
    label: 'Hoạt động',
    value: 1 || true,
    color: '#14804A'
}, {
    label: 'Không hoạt động',
    value: 0 || false,
    color: '#667085'
}];

export const PAStatus: OptionModel[] = [
  {
      label: 'Hoàn thành',
      value: 3,
      color: '#147541'
  }, {
      label: 'Đang xử lý',
      value: 2,
      color: '#FF861D'
  }, {
      label: 'Chưa xử lý',
      value: 1,
      color: '#EE0033'
  }
];

export const DataTypeAttr: OptionModel[] = [
    {
        label: 'Textbox',
        value: 'Textbox'
    }, {
        label: 'Listbox',
        value: 'Listbox'
    }, {
        label: 'Checkbox',
        value: 'Checkbox'
    }, {
        label: 'Radio button',
        value: 'Radio button'
    }, {
        label: 'Textarea',
        value: 'Textarea'
    }, {
        label: 'Datetime',
        value: 'Datetime'
    }
];

export const StatusBoolean: OptionModel[] = [
    {
        label: 'Hoạt động',
        value: 1,
        color: '#14804A'
    }, {
        label: 'Không hoạt động',
        value: 0,
        color: '#667085'
    }];
