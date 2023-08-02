import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import {ColumnType, SettingTableDynamic, TableColum, VssLoadingService} from '@viettel-vss-base/vss-ui';
import {AdminService} from '@vbomApp/service/admin.service';

@Component({
  selector: 'vbom-add-functions',
  templateUrl: './add-functions.component.html',
  styleUrls: ['./add-functions.component.scss']
})
export class AddFunctionsComponent implements OnInit {
  id: any;
  chosenFunctions: any[] = [];
  selectedFunctions: any[] = [];
  functionList: any[] = [];
	settingValue!: SettingTableDynamic;
  col: TableColum[] = [
		{ id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '10%' },
		{ id: 2, name: 'functionCode', fixedColumn: false, attr: 'Mã code', type: ColumnType.TEXT, width: '40%', isFilter: true, isSort: true },
		{ id: 3, name: 'description', fixedColumn: false, attr: 'Mô tả', type: ColumnType.TEXT, width: '40%', isFilter: true, isSort: true },
	];
  constructor(
    private modalRef: NzModalRef,
		private message: NzMessageService,
		private loadingService: VssLoadingService,
		private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.initSettingTable();
    this.getAllFunction();
  }

  getAllFunction(){
    this.functionList = [];
    this.loadingService.showLoading();
    this.adminService.getListFunctions(false).pipe(finalize(() => { this.loadingService.hideLoading() }))
    .subscribe(
      x => {
        this.functionList = x?.data?.filter((el: any) => {
          return this.selectedFunctions.findIndex((x: any) => x?.id == el?.id) < 0 && el?.isActive;
        })?.map((y: any, index: number)=>{ return {...y,checked: false, index: index + 1}}) || [];
      }
    );
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

  getItemSelected(event: any){
    this.selectedFunctions = _.uniqBy(
      [ ...this.selectedFunctions?.map((x: any) => {
          return { ...x, checked: true }}),
        ...event,
      ],'id' );
    this.chosenFunctions = _.uniqBy(
      [ ...this.chosenFunctions?.map((x: any) => {
          return { ...x, checked: true }}),
          ...event,
      ],'id' );
  }

  getItemUnSelected(items: any){
    this.selectedFunctions = this.selectedFunctions.filter((el: any) => {
      return items.findIndex((x: any) => x?.id == el?.id) < 0;
    });

    this.chosenFunctions = this.chosenFunctions.filter((el: any) => {
      return items.findIndex((x: any) => x?.id == el?.id) < 0;
    });
  }

  closeModal() {
    this.modalRef.close();
  }

  submit() {
    if(!this.chosenFunctions?.length){
      this.message.error("Bạn cần chọn các tính năng để gán vào chức năng");
      return;
    }
    this.loadingService.showLoading();
    this.adminService.addFunctionMenu({
      functionIds: this.chosenFunctions?.map((x: any)=>x?.id),
      menuId: this.id
    }).pipe(finalize(() => { this.loadingService.hideLoading() }))
    .subscribe(
      () => {
        this.message.success("Gán tính năng cho chức năng thành công");
        this.modalRef.close(true);
      }
    );

}

}
