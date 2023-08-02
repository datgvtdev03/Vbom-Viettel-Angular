import { Injectable } from '@angular/core';
import {VssApiService} from '@viettel-vss-base/vss-ui';
import {environment} from '@vbomEnv/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService extends VssApiService{
  baseUrl = environment.apiUrl
  contextPath = ''
}
