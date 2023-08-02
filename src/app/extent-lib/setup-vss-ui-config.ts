import {VssUiConfig} from '@viettel-vss-base/vss-ui';
import {EnumSelectOptionType} from '@vbomApp/modules/shares/enum/constants';
import {VssUiConfigService} from '@vbomApp/extent-lib/vss-ui-config-service';


export class SetupVssUiConfig extends VssUiConfig{
    constructor(
        private vssUiConfigService: VssUiConfigService
    ) {
        super();
        this.__initConfig()
    }

    __initConfig() {
        this.configAddressSelectBox = {
            country: {
                apiGetOptions: this.vssUiConfigService.getCountriesForAddressSelector
            },
            province: {
                apiGetOptions: this.vssUiConfigService.getProvincesForAddressSelector
            },
            district: {
                apiGetOptions: this.vssUiConfigService.getDistrictsForAddressSelector
            },
            commune: {
                apiGetOptions: this.vssUiConfigService.getCommunesForAddressSelector
            }
        }
        this.configSelectBox = {
            [EnumSelectOptionType.user]: {
                optionList: [],
                apiStreamSearch: this.vssUiConfigService.getUserStream,
                getOptionsDefaultApi: this.vssUiConfigService.getDefaultUsers,
            },
            [EnumSelectOptionType.department]: {
                optionList: [],
                apiGetOptions: this.vssUiConfigService.getDepartmentForSelector,
            },
            [EnumSelectOptionType.position]: {
                optionList: [],
                apiGetOptions: this.vssUiConfigService.getPositionForSelector,
            },
            [EnumSelectOptionType.workingPosition]: {
                optionList: [],
                apiGetOptions: this.vssUiConfigService.getWorkingPositionForSelector,
            },
            [EnumSelectOptionType.area]: {
                optionList: [],
                apiGetOptions: this.vssUiConfigService.getAreaForSelector,
            },
            [EnumSelectOptionType.stores]: {
                optionList: [],
                apiGetOptions: this.vssUiConfigService.getStoreListForSelector,
            },
        }
    }
}
