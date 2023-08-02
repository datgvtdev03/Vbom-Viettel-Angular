import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {VbomResponseModel} from '@vbomApp/service/api-response.model';
import {BaseService} from '@vbomApp/service/base.service';
import {
  RoleGroupskModel,
  SearchStaffDTOModel,
  UserByRoleModel,
  UserResponseDTOModel
} from '@vbomApp/modules/admin/admin.model';
import {ObjUtil} from '@viettel-vss-base/vss-ui';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {
  contextPath = '/api/v1/admin';

  // lấy danh sách vùng
  getAreaList(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/area/get-area`);
  }

  // lấy danh sách phòng ban
  getDepartmentList(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/departments`);
  }

  // lấy danh sách chức vụ
  getPositionList(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/position/get-position`);
  }

  getWorkingPositionList(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-working-position`);
  }

  // lấy danh sách nhóm quyền
  getRoleGroupsList(): Observable<VbomResponseModel<RoleGroupskModel[]>> {
    return this.get(`${this.contextPath}/role-groups`);
  }

  // lấy danh sách kho
  getStoreList(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/store/stores`);
  }

  // lấy danh sách kho
  getStoreListByArea(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/store/stores-by-area`, payload);
  }

  // Tìm kiếm danh sách nhóm quyền
  searchRoleGroupsList(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/search-role-group`, payload);
  }

  // lấy ds tính năng theo chức năng
  getListFunctionByMenuId(id: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-function`, {menuId: id});
  }

  // lấy ds tính năng
  getListFunctions(isDeleted?: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/get-functions?isDeleted=${isDeleted}`, '');
  }

  // lấy ds tính năng theo phân hệ
  getListFunctionByModuleId(id: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-function`, {moduleId: id});
  }

  // lấy ds tính năng theo phân hệ
  getListFunctionByGroupRoles(ids: number[]): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/get-function-by-roles`, ids);
  }

  // Danh sách Phân hệ
  getModules(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-module-menu`);
  }

  // Danh sách Phân hệ, chức năng
  getAllModules(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-all-menu`);
  }

  // Lấy danh sách menu
  getMenusShow(): Observable<VbomResponseModel<any[]>> {
    return of({
      "code": "00",
      "message": "Thành công",
      "data": [
        {
          "id": null,
          "moduleId": 1,
          "moduleName": "ssss",
          "moduleCode": null,
          "description": "",
          "isActive": true,
          "icon": "fa-cogs",
          "parentId": null,
          "menuName": null,
          "url": '/sample',
          "indexOrder": 2,
          "isShow": true,
          "item": []
        },
        {
          "id": null,
          "moduleId": 7,
          "moduleName": "Thiết lập chung",
          "moduleCode": null,
          "description": "",
          "isActive": true,
          "icon": "fa-cogs",
          "parentId": null,
          "menuName": null,
          "url": null,
          "indexOrder": 2,
          "isShow": true,
          "items": [
            {
              "id": 27,
              "moduleId": 7,
              "moduleName": null,
              "moduleCode": null,
              "description": null,
              "isActive": true,
              "icon": null,
              "parentId": null,
              "menuName": "Lịch sử log dữ liệu",
              "url": "/admin/log-history-management",
              "indexOrder": 0,
              "isShow": true,
              "items": null
            },
            {
              "id": 26,
              "moduleId": 7,
              "moduleName": null,
              "moduleCode": null,
              "description": null,
              "isActive": true,
              "icon": null,
              "parentId": null,
              "menuName": "Nhật ký truy cập",
              "url": "/admin/access-log-management",
              "indexOrder": 1,
              "isShow": true,
              "items": null
            },
            {
              "id": 25,
              "moduleId": 7,
              "moduleName": null,
              "moduleCode": null,
              "description": null,
              "isActive": true,
              "icon": null,
              "parentId": null,
              "menuName": "Quản lý nhóm quyền",
              "url": "/admin/user-management",
              "indexOrder": 2,
              "isShow": true,
              "items": null
            },
            {
              "id": 124,
              "moduleId": 7,
              "moduleName": null,
              "moduleCode": null,
              "description": null,
              "isActive": true,
              "icon": null,
              "parentId": null,
              "menuName": "Quản lý người dùng",
              "url": "/admin/user-management/user-list",
              "indexOrder": 3,
              "isShow": true,
              "items": null
            },
            {
              "id": 28,
              "moduleId": 7,
              "moduleName": null,
              "moduleCode": null,
              "description": "",
              "isActive": true,
              "icon": null,
              "parentId": null,
              "menuName": "Thiết lập tham số",
              "url": "/admin/param-config-management",
              "indexOrder": 3,
              "isShow": true,
              "items": null
            },
            {
              "id": 30,
              "moduleId": 7,
              "moduleName": null,
              "moduleCode": null,
              "description": null,
              "isActive": true,
              "icon": null,
              "parentId": null,
              "menuName": "Phân quyền dữ liệu",
              "url": "/admin/permission-data-management",
              "indexOrder": 5,
              "isShow": true,
              "items": null
            },
            {
              "id": 29,
              "moduleId": 7,
              "moduleName": null,
              "moduleCode": null,
              "description": "1231231",
              "isActive": true,
              "icon": null,
              "parentId": null,
              "menuName": "Danh sách chức năng",
              "url": "/admin/function-management",
              "indexOrder": 6,
              "isShow": true,
              "items": null
            },
            {
              "id": 128,
              "moduleId": 7,
              "moduleName": null,
              "moduleCode": null,
              "description": "Danh sách tính năng",
              "isActive": true,
              "icon": null,
              "parentId": null,
              "menuName": "Quản lý tính năng",
              "url": "/admin/function-list",
              "indexOrder": null,
              "isShow": true,
              "items": null
            }
          ]
        }
      ]
    });
    // return this.get(`${this.contextPath}/get-menu-show`);
  }

  // Lấy danh sách menu
  getUserRoles(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-my-roles`);
  }

  // lấy danh sách user của nhóm quyền
  getUsersByRoleGroup(page: number, roleGroupId: number, size: number, params: any = {}): Observable<VbomResponseModel<UserByRoleModel[]>> {
    const payload = {
      page: page,
      roleGroupId: roleGroupId,
      size: size,
      ...ObjUtil.deleteNullProp(params || {})
    };
    return this.get(`${this.contextPath}/user/users-by-role-group`, payload);
  }

  // Tìm kiếm nhanh nhân viên
  postSearchStaffCustom(pageNumber: number, pageSize: number, searchStaffDTO: Partial<SearchStaffDTOModel>): Observable<VbomResponseModel<UserResponseDTOModel[]>> {
    return this.post(`${this.contextPath}/user/search-staff-custom?pageNumber=${pageNumber}&pageSize=${pageSize}`, searchStaffDTO);
  }

  // Lấy thông tin người dùng
  getUserInfo(param: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/user/user-info`, param);
  }

  //  Lấy thông loại yêu cầu
  searchSaleOrderType(params: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/sale-order-type`, params);
  }

  //  lưu dữ liệu nhóm quyền
  postSaveRoleGroup(param: any): Observable<VbomResponseModel<number>> {
    return this.post(`${this.contextPath}/save-role-group`, param);
  }

  //  cập nhật dữ liệu nhóm quyền
  postUpdateRoleGroup(param: any): Observable<VbomResponseModel<number>> {
    return this.post(`${this.contextPath}/update-role-group`, param);
  }

  //  cập nhật dữ liệu nhóm quyền
  deleteUsersRoleGroup(roleId: number, userIds: any[]): Observable<VbomResponseModel<number>> {
    return this.post(`${this.contextPath}/delete-user-role-group`, {roleGroupId: roleId, userDeleteIdList: userIds});
  }

  //  lấy thông tin nhóm quyền
  getRoleGroupInfo(param: any): Observable<VbomResponseModel<any>> {
    return this.get(`${this.contextPath}/role-group-info`, param);
  }

  // xóa nhóm quyền
  postDeleteRoleGroup(id: any): Observable<VbomResponseModel<boolean>> {
    return this.post(`${this.contextPath}/delete-role-group/${id}`, null);
  }

  // Cập nhật thông tin người dùng
  updateUserInfo(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/user/update-info`, payload);
  }

  // Lưu phân quyền dữ liệu
  saveAuthData(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/data-auth/save-auth-data`, payload);
  }

  // cập nhật quyền dữ liệu
  updateAuthData(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/data-auth/update-auth-data`, payload);
  }

  // Xoá phân quyền dữ liệu
  deleteAuthData(param: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/data-auth/delete-auth-data`, {}, param);
  }

  // Lấy danh sách store theo người dùng
  getStoreByUser(userId: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/data-auth/store-by-user`, userId);
  }

  // Access log
  saveAccessLog(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`/log/access-log`, payload);
  }

  // tìm kiếm lịch sử truy cập
  postSearchAccessLog(param: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`/log/search-access-log`, param);
  }

  // excel nhật ký truy cập
  getExportReport(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`/log/log-export/export-report`, payload);
  }

  // tìm kiếm lịch sử log
  postSearchLog(param: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`/log/search-log`, param);
  }

  // excel lịch sử log
  getExportReportHistoryLog(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`/log/log-export/export-report`, payload);
  }

  // Lấy danh sách tham số
  getConfigList(param: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-list-app-config`, param);
  }

  // Seach danh sách tham số
  searchConfigList(param: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/search-app-config`, param);
  }

  // Xoá danh sách tham số
  deleteConfig(dataId: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/delete-app-config`, dataId);
  }

  // Thêm mới danh sách tham số
  createConfig(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/save-app-config`, payload);
  }

  // Cập nhật danh sách tham số
  updateConfig(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/update-app-config`, payload);
  }

  // Lấy danh sách người dùng theo store
  getEmployeeByStore(param: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/data-auth/users-by-store`, param);
  }

  // Lấy danh sách người dùng theo store đồn bộ từ erp
  getEmployeeERP(storeId: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/data-auth/users-by-store-erp`, storeId);
  }

  //  Kiểm tra tồn tại quyền mặc định
  postCheckDefaultGroup(param: any): Observable<VbomResponseModel<any>> {
    return this.post(`${this.contextPath}/check-default-group`, param);
  }

  //  kiểm tra tồn tại admin trong hệ thống
  postExistAdminRoleGroup(param: any): Observable<VbomResponseModel<boolean>> {
    return this.post(`${this.contextPath}/exist-admin-role-group`, param);
  }

  getDeliveryTypeName(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/delivery-types`);
  }

  //  import khách hàng
  postImportCustomer(param: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`/customer/import-customer`, param);
  }

  // excel file mẫu
  getExportReportCustomer(fileType: string, reportName: string): Observable<VbomResponseModel<any[]>> {
    const payload = {
      fileType: fileType,
      reportName: reportName
    };
    return this.get(`/log/log-export/export-report`, payload);
  }

  getOrderList(searchParam: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`/utilities/orders`, searchParam);
  }

  getOrderDetail(params: any): Observable<VbomResponseModel<any>> {
    return this.get(`/utilities/orders/detail`, params);
  }

  getStatusOrder(params: any = {}): Observable<VbomResponseModel<any>> {
    return this.get(`/utilities/orders/order-status`, params);
  }

  getConfigName(configName: string): Observable<VbomResponseModel<any>> {
    return this.get(`${this.contextPath}/get-list-app-config-name/`, {configName});
  }

  getPointCallConfig(callType: any): Observable<VbomResponseModel<any>> {
    return this.get(`${this.contextPath}/point-call-cat/get-point-call`, {callType: callType});
  }

  addFunctionMenu(param: any): Observable<VbomResponseModel<boolean>> {
    return this.post(`${this.contextPath}/add-function-menu`, param);
  }

  deleteFunctionMenu(param: any): Observable<VbomResponseModel<boolean>> {
    return this.post(`${this.contextPath}/remove-function-menu`, param);
  }

  //  dowload import khách hàng
  dowloadImportCustomer(): Observable<VbomResponseModel<any[]>> {
    return this.post(`/customer/download-import-customer`, null, '', {responseType: 'blob' as 'json'});
  }

  // export-log
  exportLog(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`/log/export-log`, payload, '', {responseType: 'blob' as 'json'});
  }

  exportAccessLog(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`/log/export-access-log`, payload, '', {responseType: 'blob' as 'json'});
  }

  // Lấy thông tin người đăng nhập
  getUserLogin(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/user/my-info`);
  }

  // tìm kiếm lịch sử log
  searchLogHistory(param: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`/log/search-log-history`, param);
  }

  // khôi phục tham số
  restoreConfig(dataId: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/restore-app-config`, dataId);
  }

  // lấy ds tính năng theo phân hệ, chức năng
  getListFunction(lstMenuId: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/get-list-function`, lstMenuId);
  }

  downloadFile(attachId: any): Observable<any> {
    return this.post(`/admin/attachFile/download-file-by-id/${attachId}`, {}, '', {responseType: 'blob' as 'json'});
  }

  updateAvatar(userId: number | string, image: string): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/user/update-avatar`, {}, {userId, image});
  }

  // Danh sách menu cha
  getModulesMenuFather(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-list-menu`);
  }

}
