import { Injectable } from '@angular/core';
import {VssApiService} from '@viettel-vss-base/vss-ui';
import {environment} from '@vbomEnv/environment';
import {Observable} from 'rxjs';
import {SampleCreateDTOModel, SampleModel, SampleSearchDTOModel} from '@vbomApp/modules/sample/sample.model';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SampleService extends VssApiService{
  baseUrl = environment.apiUrl
  contextPath = '/api/v1/admin/sample'
  searchApi(params: SampleSearchDTOModel): Observable<SampleModel[]> {
    return this.get(this.contextPath + '/path/to/api/search', params)
  }
  updateApi(data: SampleCreateDTOModel): Observable<SampleModel[]> {
    return this.put(this.contextPath + '/path/to/api/update', data)
  }
  createApi(data: Partial<SampleCreateDTOModel>): Observable<SampleModel[]> {
    return this.post(this.contextPath + '/path/to/api/create', data)
  }
  deleteApi(id: number): Observable<SampleModel[]> {
    return this.delete(this.contextPath + '/path/to/api/delete/' + id)
  }
  deleteMultiApi(data: any): Observable<SampleModel[]> {
    return this.delete(this.contextPath + '/path/to/api/delete', {body: data})
  }
  import(file: Blob | File, data?: any): Observable<SampleModel[]> {
    const form = new FormData()
    form.append('file', file)
    return this.post(this.contextPath + '/path/to/api/create', form)
  }
  exportApi(data: any): Observable<Blob> {
      const httpHeaders = new HttpHeaders({});
    return this.get(this.contextPath + '/path/to/api/export', data, httpHeaders, { responseType: 'blob' as 'json' })
  }
}
