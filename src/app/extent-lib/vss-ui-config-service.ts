import {OptionModel} from '@viettel-vss-base/vss-ui';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AdminService} from '@vbomApp/service/admin.service';
import {LocationApiService} from '@vbomApp/service/location-api.service';

export class VssUiConfigService {
    constructor(
        private adminService: AdminService,
        private locationService: LocationApiService
    ) {
    }


    getCountriesForAddressSelector = (params: any) : Observable<any[]> => {
        console.log(params);
        return this.locationService.getCountryList().pipe(
            map(responseApi => responseApi.data.map((country: any) => ({...country, value: country.id, label: country.name})))
        );
    }

    getProvincesForAddressSelector = (params: any) : Observable<any[]> => {
        return this.locationService.getProvinceList(params.referenceId).pipe(
            map(responseApi => responseApi.data.map((province: any) => ({...province, value: province.id, label: province.name})))
        );
    }
    getDistrictsForAddressSelector = (params: any) : Observable<any[]> => {
        return this.locationService.getDistrictList(params.referenceId).pipe(
            map(responseApi => responseApi.data.map((d: any) => ({...d, value: d.id, label: d.name})))
        );
    }
    getCommunesForAddressSelector = (params: any) : Observable<any[]> => {
        return this.locationService.getWardList(params.referenceId).pipe(
            map(responseApi => responseApi.data.map((commune: any) => ({...commune, value: commune.id, label: commune.name})))
        );
    }
    getUserStream = (params: any): Observable<OptionModel[]> => {
        return this.adminService.postSearchStaffCustom(params?.page, params?.size, params)
            .pipe(
                map(res => {
                    return res.data?.content?.map((x: any) => ({
                        value: x.userName,
                        label: `${x.userName} - ${x.fullName}`,
                        totalPages: res.data.totalPages, ...x
                    }))
                })
            )
    }

    getDefaultUsers = (values: any) => {
        return this.adminService.postSearchStaffCustom(1, 50, {usernameList: values})
            .pipe(
                map(res => res.data?.content?.map((x: any) => ({
                    ...x,
                    value: x.userName,
                    label: `${x.userName} - ${x.fullName}`,
                    totalPages: res.data.totalPages,
                })) || [])
            )
    }

    getDepartmentForSelector = (params: any) : Observable<any[]> => {
        return this.adminService.getDepartmentList().pipe(
            map(resp => (resp?.data?.content || resp?.data)?.map((x: any) => ({
                ...x,
                value: x.id,
                label: `${x.id} - ${x.departmentName}`
            })) || [])
        );
    }

    getPositionForSelector = (params: any) : Observable<any[]> => {
        return this.adminService.getPositionList().pipe(
            map(resp => (resp?.data?.content || resp?.data)?.map((x: any) => ({
                ...x,
                value: x.id,
                label: `${x.id} - ${x.positionName}`
            })) || [])
        );
    }

    getWorkingPositionForSelector = (params: any) : Observable<any[]> => {
        return this.adminService.getWorkingPositionList().pipe(
            map(resp => (resp?.data?.content || resp?.data)?.map((x: any) => ({
                ...x,
                value: x.id,
                label: `${x.id} - ${x.workingPostionName}`
            })) || [])
        );
    }

    getAreaForSelector = (params: any) : Observable<any[]> => {
        return this.adminService.getAreaList().pipe(
            map(resp => (resp?.data?.content || resp?.data)?.map((x: any) => ({
                ...x,
                value: x.id,
                label: x.areaName
            })) || [])
        );
    }

    getStoreListForSelector = (params: any) : Observable<any[]> => {
        return this.adminService.getStoreList().pipe(
            map(resp => (resp?.data?.content || resp?.data)?.map((x: any) => ({
                ...x,
                value: x.id,
                label: `${x.id} - ${x.storeName}`
            })) || [])
        );
    }

}
