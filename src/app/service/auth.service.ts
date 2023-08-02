import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {VbomResponseModel} from '@vbomApp/service/api-response.model';
import {BaseService} from '@vbomApp/service/base.service';
import {environment} from '@vbomEnv/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService{
  baseUrl = environment.apiUrl
  contextPath = '/api/v1/admin'
  getCountry() {
    return this.get(`${this.contextPath}/get-list-country`)
  }
  postSearchStaffCustom(pageNumber: number, pageSize: number, searchStaffDTO: Partial<any>): Observable<VbomResponseModel<any[]>> {
    return this.post(`${this.contextPath}/user/search-staff-custom?pageNumber=${pageNumber}&pageSize=${pageSize}`, searchStaffDTO)
  }
  getAllModules(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.contextPath}/get-all-menu`)
  }
  getUserRoles(): Observable<string[]> {
    return this.get(`${this.contextPath}/get-my-roles`)
  }
}
