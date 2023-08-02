import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs/operators';
import { UpdateItemFunctionComponent } from '../update-item-function/update-item-function.component';
import {
	BaseListComponent,
	ColumnType,
	SettingTableDynamic,
	TableColum,
	VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {Status} from '@vbomApp/modules/shares/enum/options.constants';
import {EnumSelectOptionType} from '@vbomApp/modules/shares/enum/constants';
import {AdminService} from '@vbomApp/service/admin.service';
import {ModuleManagementApiService} from '@vbomApp/service/module-management-api.service';
import {ResponseCode} from '@vbomApp/modules/shares/enum/common.enum';

@Component({
	selector: 'vbom-function-list',
	templateUrl: './function-list.component.html',
	styleUrls: ['./function-list.component.scss']
})
export class FunctionListComponent extends BaseListComponent implements OnInit {
	functionList: any[] = [];
	settingValue!: SettingTableDynamic;

	col: TableColum[] = [
		{ id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '70px' },
		{ id: 2, name: 'functionCode', fixedColumn: false, attr: 'Mã code', type: ColumnType.TEXT, width: '40%', isFilter: true, isSort: true },
		{ id: 3, name: 'description', fixedColumn: false, attr: 'Mô tả', type: ColumnType.TEXT, width: '40%', isFilter: true, isSort: true },
    { id: 4, name: 'isActive', fixedColumn: false, attr: 'Trạng thái', isSort: true,
      type: ColumnType.TAG,
      options: Status,
      width: '150px', isFilter: true, hiddenResize: false, filter: {type: ColumnType.SELECT, options: Status} },
		{
			id: 4, name: 'createdUser', fixedColumn: false,
			filter: { name: 'createdUser', selectOptionsType: EnumSelectOptionType.user, multiple: true, type: ColumnType.SELECT },
			attr: 'Người tạo', type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false, isSort: true
		},

		{ id: 5, name: 'createdDate', fixedColumn: false, attr: 'Ngày tạo', type: ColumnType.TEXT_CENTER, width: '150px', isFilter: true, filter: { type: ColumnType.DATE_PICKER }, defaultSort: 'desc', isSort: true },
		// { id: 6, name: 'updatedUser', fixedColumn: false, attr: 'Người cập nhật', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
		{
			id: 6, name: 'updatedUser', fixedColumn: false,
			filter: { name: 'updatedUser', selectOptionsType: EnumSelectOptionType.user, multiple: true, type: ColumnType.SELECT },
			attr: 'Người cập nhật', type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false, isSort: true
		},
		{ id: 7, name: 'updatedDate', fixedColumn: false, attr: 'Ngày cập nhật', type: ColumnType.TEXT_CENTER, isSort: true, isFilter: true, width: '200px', filter: { type: ColumnType.DATE_RANGE_PICKER }, },
		{ id: 8, name: 'action', fixedColumn: false, attr: 'Thao tác', type: ColumnType.ACTION, action: { isEdit: true, isRemove: true }, rulesAction: { isEdit: ['ROLE_FUNCTION_UPDATE'], isRemove: ['ROLE_FUNCTION_DELETE'] }, width: '85px' },
	];

	colRestore: TableColum[] = [
		{ id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '70px' },
		{ id: 2, name: 'functionCode', fixedColumn: false, attr: 'Mã code', type: ColumnType.TEXT, width: '40%', isFilter: true, isSort: true },
		{ id: 3, name: 'description', fixedColumn: false, attr: 'Mô tả', type: ColumnType.TEXT, width: '40%', isFilter: true, isSort: true },
    { id: 4, name: 'isActive', fixedColumn: false, attr: 'Trạng thái', isSort: true,
      type: ColumnType.TAG,
      options: Status,
      width: '150px', isFilter: true, hiddenResize: false, filter: {type: ColumnType.SELECT, options: Status} },
		{
			id: 4, name: 'createdUser', fixedColumn: false,
			filter: { name: 'createdUser', selectOptionsType: EnumSelectOptionType.user, multiple: true, type: ColumnType.SELECT },
			attr: 'Người tạo', type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false, isSort: true
		},

		{ id: 5, name: 'createdDate', fixedColumn: false, attr: 'Ngày tạo', type: ColumnType.TEXT_CENTER, width: '150px', isFilter: true, filter: { type: ColumnType.DATE_PICKER }, defaultSort: 'desc', isSort: true },
		// { id: 6, name: 'updatedUser', fixedColumn: false, attr: 'Người cập nhật', type: ColumnType.TEXT, width: '150px', isFilter: true, filter: { type: ColumnType.TEXT }, isSort: true },
		{
			id: 6, name: 'updatedUser', fixedColumn: false,
			filter: { name: 'updatedUser', selectOptionsType: EnumSelectOptionType.user, multiple: true, type: ColumnType.SELECT },
			attr: 'Người cập nhật', type: ColumnType.TEXT, width: '150px', isFilter: true, hiddenResize: false, isSort: true
		},
		{ id: 7, name: 'updatedDate', fixedColumn: false, attr: 'Ngày cập nhật', type: ColumnType.TEXT_CENTER, isSort: true, isFilter: true, width: '200px', filter: { type: ColumnType.DATE_RANGE_PICKER }, },
    // { id: 8, name: 'action', fixedColumn: false, attr: 'Thao tác', type: ColumnType.ACTION, action: { isEdit: true, isRemove: true }, rulesAction: { isEdit: ['ROLE_FUNCTION_UPDATE'] }, width: '85px' },

  ];

	dataDeleteChecked: any[] = []; // data xoá 1 or nh
	dataRestoreChecked: any[] = []; // data khôi phục 1 or nh`
  tabDelData: number = 0

	constructor(
		private modalService: NzModalService,
		private loadingService: VssLoadingService,
		private adminService: AdminService,
		private moduleManagementApiService: ModuleManagementApiService,
		private message: NzNotificationService,
	) {
		super()
	}

	ngOnInit() {
		this.initSettingTable();
		this.getAllFunction();
	}

	getAllFunction() {
		this.functionList = [];
		this.loadingService.showLoading();
    this.adminService.getListFunctions(this.tabDelData).pipe(finalize(() => { this.loadingService.hideLoading() }))
      .subscribe(
        x => {
          const dataChecked = this.tabDelData ? this.dataRestoreChecked : this.dataDeleteChecked
          this.functionList = x?.data?.map((x: any, index: number) => {
            return {
              ...x, index: index + 1,
              updatedDate: x.updatedDate ?
                (moment.unix(x.updatedDate / 1000).format('DD/MM/YYYY') != 'Invalid Date' ? moment.unix(x.updatedDate / 1000).format('DD/MM/YYYY') : x.updatedDate) : '',
              checked: dataChecked?.length ? dataChecked?.some(b => x?.id === b?.id) : false,
              createdDate: x.createdDate ?
                (moment.unix(x.createdDate / 1000).format('DD/MM/YYYY') != 'Invalid Date' ? moment.unix(x.createdDate / 1000).format('DD/MM/YYYY') : x.createdDate) : ''
            }
          }) || [];
        }
      );
	}

	openModelAdd() {
		this.modalService.create({
			nzTitle: "Thêm mới tính năng",
			nzContent: UpdateItemFunctionComponent,
			nzWidth: '40%',
			nzMaskClosable: false,
			nzFooter: null,
			nzComponentParams: {
				item: null,
			}
		}).afterClose.subscribe((res) => {
			if (res) {
				this.getAllFunction();
			}
		})
	}
	initSettingTable() {
		this.settingValue = {
			isFilterJs: true,
			bordered: true,
			loading: false,
			pagination: true, // phân trang trên FE
			sizeChanger: true,
			title: null,
			footer: null,
			checkbox: true,
			simple: false,
			size: 'small',
			tableLayout: 'auto',
		};
	}

	deleteFunction(event: any) {
		if (event) {
			this.moduleManagementApiService.deleteFunction([event?.id]).pipe(finalize(() => { this.loadingService.hideLoading() }))
				.subscribe(
					x => {
						if (x?.code === "00") {
							if (x?.data?.isSuccess === true) {
								this.message.success('',"Xoá tính năng thành công");
								this.getAllFunction();
							} else if (x?.data?.isSuccess === false) {
								this.message.error('',`Tính năng ${x?.data?.error} đang được sử dụng, bạn không thể xoá được!`);
							}
						}
					})
		}
	}

	editRowData(item: any) {
		this.modalService.create({
			nzTitle: this.tabDelData == 0 ? "Cập nhật tính năng" : "Chi tiết tính năng",
			nzContent: UpdateItemFunctionComponent,
			nzWidth: '40%',
			nzMaskClosable: false,
			nzFooter: null,
			nzComponentParams: {
				item: item,
        canEdit: this.tabDelData == 0
      }
		}).afterClose.subscribe((res) => {
			if (res) {
				this.getAllFunction();
			}
		})
	}

	onChangeType() {
    this.dataRestoreChecked = [];
    this.dataDeleteChecked = [];
    this.getAllFunction();
    this.checkDis();
	}

	// thực hiện xoá data xoá 1 or nhiều
	isDisableRestoreData: boolean = true;
	isDisableDeleteData: boolean = true;
	getItemSelected(event: any[]) {
		if (this.tabDelData == 0) {
			this.dataDeleteChecked = this.dataDeleteChecked.concat(event.filter(e => !this.dataDeleteChecked.find(c => e.id == c.id)));
			this.checkDis();
		} else if (this.tabDelData == 1) {
			this.dataRestoreChecked = this.dataRestoreChecked.concat(event.filter(e => !this.dataRestoreChecked.find(c => e.id == c.id)));
			this.checkDis();
		}
	}

	getItemUnSelected(items: any[]) {
		if (this.tabDelData == 0) {
			this.dataDeleteChecked = this.dataDeleteChecked.filter(c => !items.find(i => i.id == c.id));
			this.checkDis();
		} else if (this.tabDelData == 1) {
			this.dataRestoreChecked = this.dataRestoreChecked.filter(c => !items.find(i => i.id == c.id));
			this.checkDis();
		}
	}

	deleteChose() {
		let payload = [];
		if (this.dataDeleteChecked?.length > 0) {
			payload = this.dataDeleteChecked?.map(x => x?.id);
			//action
			this.moduleManagementApiService.deleteFunction(payload).pipe(finalize(() => { this.loadingService.hideLoading() }))
				.subscribe(
					x => {
						if (x?.code === "00") {
							if (x?.data?.isSuccess === true) {
								this.message.success('',"Xoá tính năng thành công");
								// this.dataDeleteChecked = [];
								// this.getAllFunction();
								// this.checkDis();
							} else if (x?.data?.isSuccess === false) {
								this.message.error('',`Tính năng ${x?.data?.error} đang được sử dụng, bạn không thể xoá được!`);
								// this.checkDis();
							}
							this.dataDeleteChecked = [];
							this.getAllFunction();
							this.checkDis();
						}
					})
		} else {
			this.message.error('',"Bạn cần chọn các tính năng cần xóa!")
		}
	}

	// khôi phục 1 or nh bản ghi
	restoreDataChose() {
		// console.log(this.dataRestoreChecked, " data khôi phục");
		let payload = [];
		if (this.dataRestoreChecked?.length > 0) {
			payload = this.dataRestoreChecked?.map(x => x?.id);
      this.loadingService.showLoading()
			this.moduleManagementApiService.restoreFunction(payload).pipe(finalize(() => { this.loadingService.hideLoading() }))
				.subscribe(
					res => {
						if (res.code === ResponseCode.SUCCESS) {
							if (res?.data?.isSuccess === true) {
								this.message.success('',"Khôi phục tính năng thành công");
								this.dataRestoreChecked = [];
								this.getAllFunction();
								this.checkDis();
							} else {
								// for (let i = 0; i < res?.data?.error?.length; i++) {
									this.message.error('',`Không thể khôi phục các tính năng đã tồn tại sau: ${res?.data?.error}`);
								// }
								this.dataRestoreChecked = [];
								this.getAllFunction();
								this.checkDis();
							}
						}
					})
		} else {
			this.message.error('',"Vui lòng chọn một hay nhiều bản ghi cần khôi phục!")
		}
	}

	checkDis() {
		if (this.tabDelData == 0) {
			this.isDisableDeleteData = this.dataDeleteChecked?.length <= 0;
		} else if (this.tabDelData == 1) {
			this.isDisableRestoreData = this.dataRestoreChecked?.length <= 0;
		}
	}
}
