export interface RoleGroupskModel {
  description: string;
  id: number;
  numberUser: number;
  roleGroupCode: string;
  roleGroupName: string;
}

export interface UserByRoleModel {
  address: string;
  areaId: number;
  birthday: string;
  createdAt: string;
  createdBy: string;
  deletedAt: string;
  departmentName: string;
  description: string;
  email: string;
  firstName: string;
  gender: number;
  id: number;
  isActive: number;
  lastName: string;
  phoneNumber: string;
  positionName: string;
  updatedAt: string;
  updatedBy: string;
  userName: string
}

export interface SearchStaffDTOModel {
  departmentId: number[];
  fullName: string | null;
  isRole: boolean | null;
  positionId: number[];
  usernameList?: string[];
  username: string | null;
  storeId: number[]
}

export interface UserResponseDTOModel {
  address: string;
  birthday: string;
  createdDate: string;
  createdUser: string;
  departmentId: number;
  departmentName: string;
  description: string;
  email: string;
  firstName: string;
  fullName: string;
  gender: boolean;
  id: number;
  isActive: number;
  isDeleted: number;
  lastName: string;
  phoneNumber: string;
  positionId: number;
  positionName: string;
  totalCount: number;
  updatedDate: string;
  updatedUser: string;
  userName: string
}

export interface CustomerImportDtoModel {
  birthDay: string;
  complaint: string;
  customerAddressDetail: string;
  deliveryAddressDetail: string;
  email: string;
  error: string;
  facebookId: string;
  favoriteBranch: string;
  favoriteProduct: string;
  favoritePromotion: string;
  fullName: string;
  fullName1: string;
  fullName2: string;
  fullName3: string;
  fullName4: string;
  fullName5: string;
  gender: boolean;
  habit: string;
  idCard: string;
  instagramId: string;
  interests: string;
  job: string;
  language: {
    id: number;
    languageCode: string;
    languageName: string
  };
  notes: string;
  organization: string;
  telNumber: string;
  telNumber1: string;
  telNumber2: string;
  telNumber3: string;
  telNumber4: string;
  telNumber5: string;
  tiktokId: string;
  zaloId: string

}
export interface TransHistoryResponseDto {
  bankCode: string;
  fullNameDest: string;
  fullNameSource: string;
  performDate: string;
  phoneDest: string;
  phoneSource: string;
  releaseDate: string;
  shopName: string;
  transAmount: number;
  transCode: string;
  transDate: string;
  transEmployee: string;
  transFee: number;
  transName: string;
  transStatusCode: string;
  transTypeCode: string
}
export interface CallHistoryModel {
  agent: string;
  callId: string;
  duration: string;
  endTime: string;
  impactType: string;
  recordFile: string;
  responseTime: string;
  startTime: string;
  state: string;
  switchboardNumber: string;
}

export interface ComplaintHistoryResponseDtoModel {
  appointmentDate: string;
  attachFile: string;
  chanelReceive: string;
  closeDate: string;
  complaintId: string;
  content: string;
  departmentProcessing: string;
  departmentReceive: string;
  happyLevel: string;
  note: string;
  reason: string;
  receiveDate: string;
  responseMethod: string;
  result: string;
  staffCodeProcessing: string;
  staffCodeReceive: string;
  staffNameProcessing: string;
  staffNameReceive: string;
  state: string;
}
