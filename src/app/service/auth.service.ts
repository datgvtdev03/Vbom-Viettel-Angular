import { Injectable } from '@angular/core';
import {VssApiService} from '@viettel-vss-base/vss-ui';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends VssApiService{
  baseUrl = environment.apiUrl
  url = '/api/v1/admin'
  getCountry() {
    return this.get(`${this.url}/get-list-country`)
  }
  // getUserRoles() {
  //   return this.api.get(`${this.url}/get-list-country`)
  // }
  postSearchStaffCustom(pageNumber: number, pageSize: number, searchStaffDTO: Partial<any>): Observable<AppResponseModel<any>> {
    return this.post(`${this.url}/user/search-staff-custom?pageNumber=${pageNumber}&pageSize=${pageSize}`, searchStaffDTO)
  }
  getAllModules(): Observable<AppResponseModel<any[]>> {
    return this.get(`${this.url}/get-all-menu`)
  }
  getUserRoles(): Observable<AppResponseModel<any[]>> {
    return this.get(`${this.url}/get-my-roles`)
  }
}

export interface AppResponseModel<T> {
  code: string;
  data: any;
  message?: string;
  status?:string;
}
