import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BaseService} from '@vbomApp/service/base.service';
import {VbomResponseModel} from '@vbomApp/service/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleManagementApiService extends BaseService{

  contextPath = '/api/v1/admin';

  //Thêm mới phân hệ/ chức năng
  createModuleMenu(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/save-module-menu`, payload)
  }

  // Cập nhật mô tả tính năng
  updateDescFunction(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/update-function`, payload)
  }

  // Thêm mới tính năng
  addFunction(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/save-function`, payload)
  }

  // Xoá tính năng
  deleteFunction(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/delete-function`, payload)
  }

  // Cập nhật phân hệ
  updateModule(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/update-module`, payload)
  }

  // Cập nhật chức năng
  updateMenu(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/update-menu`, payload)
  }

  // Xóa phân hệ
  deleteModule(id: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/delete-module/${id}`, {})
  }

  // Xóa nhiều phân hệ
  deleteModuleByIds(ids: any[]): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/delete-module/`, ids)
  }

  // Xóa chức năng
  deleteMenu(id: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/delete-menu/${id}`, {})
  }

  // Xóa nhiều chức năng
  deleteMenuByIds(ids: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/delete-menu`, ids)
  }

  // Lấy thông tin phân hệ
  getModuleById(id: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-module/${id}`, {})
  }

  // Lấy thông tin chức năng
  getMenuById(id: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-menu/${id}`, {})
  }

  // khôi phục tính năng
  restoreFunction(payload: any): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/restore-function`, payload)
  }

}
