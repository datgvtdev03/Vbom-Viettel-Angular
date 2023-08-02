import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BaseService} from '@vbomApp/service/base.service';
import {VbomResponseModel} from '@vbomApp/service/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class LocationApiService extends BaseService{

  url = '/api/v1/admin';

  //lấy danh sách vùng
  getAreaList(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.url}/area/get-area`)
  }
  //lấy danh sách quocs gia
  getCountryList(): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.url}/get-list-country`)
  }
  //lấy danh Huyện
  getDistrictList(provinceId : any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.url}/get-list-district`, {provinceId: provinceId})
  }

  //lấy danh Tỉnh
  getProvinceList(countryId : any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.url}/get-list-province`, {countryId: countryId})
  }

  //lấy danh Xã
  getWardList(districtId: any): Observable<VbomResponseModel<any[]>> {
    return this.get(`${this.url}/get-list-ward`, {districtId: districtId})
  }

  getIpAddress(): Observable<{ip: string}> {
    // https://api.ipify.org?format=json
    // const payload = {format: 'json'}
    return this.getBase('https://api.ipify.org')
  }

}
