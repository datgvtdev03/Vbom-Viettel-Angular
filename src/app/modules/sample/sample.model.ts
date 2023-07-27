import {FilterFieldType} from '@vbomApp/modules/sample/sample.enum';
import {AddressSelectorTypes, OptionModel} from '@viettel-vss-base/vss-ui';
import {Observable} from 'rxjs';

export interface ItemSampleModel {
  fullName: string
  extraNames: string
  telNumber: string
  extraTelNumbers: string
  email: string
  extraEmails: string
  cusBusinessType: string
  gender: string
  birthDay: string
  cusTypeDefine: string
  language: string
  identificationNumber: string
}

export interface SampleModel {
  fullName: string
  extraNames: string
  telNumber: string
  extraTelNumbers: string
  email: string
  extraEmails: string
  cusBusinessType: string
  gender: string
  birthDay: string
  cusTypeDefine: string
  language: string
  identificationNumber: string
  passportCode: string
  organization: string
  taxCode: string
  items?: ItemSampleModel[]
    // .... Toàn bộ field mà response API trả ra
}
export interface SampleSearchDTOModel {
  page?: number
  size?: number
  fullName?: string
  extraNames?: string
  telNumber?: string
  extraTelNumbers?: string
  email?: string
  extraEmails?: string
  cusBusinessType?: string
  gender?: string
  birthDay?: string
  cusTypeDefine?: string
  language?: string
  identificationNumber?: string
  passportCode?: string
  organization?: string
  taxCode?: string
}
export interface SampleCreateDTOModel {
  fullName: string
  extraNames: string
  telNumber: string
  extraTelNumbers: string
  email: string
  extraEmails: string
  cusBusinessType: string
  gender: string
  birthDay: string
  cusTypeDefine: string
  language: string
  identificationNumber: string
  passportCode: string
  organization: string
  taxCode: string
}
export interface FilterHeader {
  field: string
  label: string
  placeholder?: string
  keySearch?: string
  type: FilterFieldType
  value?: any | any[]
  options?: OptionModel[]
  apiSearch?: ((params: OptionModel) => Promise<any[]>);
  suffix?: string
  required?: boolean
  disable?: boolean
  disableAutocomplete?: boolean
  maxLength?: number
  selectOptionsType?: string;
  referenceColName?: string;
  multiple?: boolean;
  minValue?: number;
  maxValue?: number;
  csMaxTagCount?: number;
  params?: any;
  addressSelectorType?: AddressSelectorTypes;
  csAllowClear?: boolean;
}
