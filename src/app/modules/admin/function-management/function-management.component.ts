import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import { AddFunctionsComponent } from './add-functions/add-functions.component';
import { CreateOrEditFunctionComponent } from './create-or-edit-function/create-or-edit-function.component';
import { UpdateItemFunctionComponent } from './update-item-function/update-item-function.component';
import {
  ActionType,
  BaseListComponent,
  ColumnType, NotificationOpenServiceComponent,
  SettingTableDynamic,
  TableColum,
  TreeNodeOptionsModel, Ultilities, VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {AdminService} from '@vbomApp/service/admin.service';
import {ModuleManagementApiService} from '@vbomApp/service/module-management-api.service';
import {ResponseCode} from '@vbomApp/modules/shares/enum/common.enum';
import {TreeHelper} from '@vbomApp/modules/shares/helper/tree-helper';

@Component({
	selector: 'vbom-function-management',
	templateUrl: './function-management.component.html',
	styleUrls: ['./function-management.component.scss']
})
export class FunctionManagementComponent extends BaseListComponent implements OnInit {
	settingValue!: SettingTableDynamic;
	isCheckedAll: boolean = false;
	loadingTable: boolean = false;
	functionList: any[] = [];
	selectedList: any[] = [];
	displayFunctions: any[] = [];
	pageSize: number = 10;
	currentPage: number = 1;
	total: number = 0;
	listOfData: any[] = [];
	col: TableColum[] = [
		{ id: 1, name: 'index', fixedColumn: false, attr: 'STT', type: ColumnType.TEXT, width: '70px' },
		{ id: 2, name: 'functionCode', fixedColumn: false, attr: 'Mã code', type: ColumnType.TEXT, width: '150px', isFilter: true, isSort: true, defaultSort: 'asc' },
		{ id: 3, name: 'description', fixedColumn: false, attr: 'Mô tả', type: ColumnType.TEXT, width: '150px', isFilter: true, isSort: false },
		{ id: 4, name: 'menuName', fixedColumn: false, attr: 'Thông tin chức năng', type: ColumnType.TEXT, width: '150px', isFilter: true, isSort: false },
		{ id: 5, name: 'action', fixedColumn: false, attr: 'Thao tác', type: ColumnType.ACTION, action: { isRemove: true }, rulesAction: {}, width: '80px' }
	];
	nodes: TreeNodeOptionsModel[] = [
		{
			title: 'Danh sách phân hệ/Chức năng',
			key: '',
			children: [],
		},
	];
	checkedNodes: any = { ids: [], keys: [] }
	openModalDeleteMenus = false;
	menus: any[] = [];
	modules: any[] = [];
	checkedModules: any[] = [];
	checkFunctionManagement: boolean = false;

	constructor(
		private modalService: NzModalService,
		private message: NzMessageService,
		private loadingService: VssLoadingService,
		private adminService: AdminService,
		private moduleManagementApiService: ModuleManagementApiService,
	) {
    super()
	}

	ngOnInit(): void {
		this.initSettingTable();
		this.getFunctionModules();
	}

	getFunctionModules() {
		this.adminService.getAllModules().subscribe((res) => {
			if (res.code === ResponseCode.SUCCESS) {
        const getChild = (c: any) => {
          c?.children?.forEach((ic: any) => getChild(ic))
          if(c.isMenu) {
            this.menus.push(c)
          } else {
            this.modules.push(c)
          }
          return c
        }
				this.menus = []
				this.modules = []
				this.nodes = [
					{
						title: 'Danh sách phân hệ/ chức năng',
						key: '',
						isLeaf: false,
						expanded: true,
						id: 0,
						children: TreeHelper.parseDataModules(res?.data, true).map((x: any) => {
              getChild(x)
							return x;
						}),
					},
				];
        const findInChild = (c: any, key:string) => {
          return c.key == key || (c?.children?.length && c?.children?.some((cd: any) => findInChild(cd, key)))
        }
				this.checkedNodes.keys = this.checkedNodes?.keys?.filter((k: any) => this.nodes[0].children?.some(n => findInChild(n, k))) || []
        this.loadCheckedNodes()
			}
		});
	}

	openModelAdd() {
		if(this.choseFunction?.id){
			let data: any[] = [];
		this.loadingService.showLoading();
		this.adminService.getListFunction([this.choseFunction?.id]).pipe(finalize(() => { this.loadingService.hideLoading() })).subscribe((res: any) => {
			if (res.code === ResponseCode.SUCCESS) {
				data = res?.data?.map((x: any, index: number) => {
					return {
						...x,
						index: index + 1,
						checked: this.selectedList
							?.map((y: any) => {
								return y.id;
							})
							?.some((z: any) => z === x?.id),
					};
				});
				if(data){
					this.modalService.create({
						nzTitle: 'Tìm kiếm tính năng',
						nzContent: AddFunctionsComponent,
						nzWidth: '70%',
						nzMaskClosable: false,
						nzCentered: true,
						nzFooter: null,
						nzComponentParams: {
							id: this.choseFunction?.id,
							// selectedFunctions: this.functionList
							selectedFunctions: data
						}
					}).afterClose.subscribe(res => {
						if (res) {
							// this.getDataNodesTree(this.choseFunction?.id)
							// this.getLstFunction(this.checkedNodes?.ids);
							// cần fix lại vụ này để hiển thị
							if (this.checkedNodes?.ids?.length > 0) {
								this.getLstFunction(this.checkedNodes?.ids);
							}else if(this.choseFunction && this.checkedNodes?.ids?.length === 0){
								this.getLstFunction([this.choseFunction?.id])
							}else{
								this.getLstFunction([this.choseFunction?.id])
							}
						}
					})
				}
			}
		})
		}
	}

	onPageIndexChange(event: any) {
		this.currentPage = event;
		this.search();
	}


	search() {

	}

	openModal(data: any = null, type: ActionType = ActionType.CREATE) {
		this.modalService.create({
			nzTitle: Ultilities.getTitlePopup(type),
			nzContent: CreateOrEditFunctionComponent,
			nzWidth: '65%',
			nzMaskClosable: false,
			nzFooter: null,
		}).afterClose.subscribe(({ reload }) => {
			if (reload) {
				this.isCheckedAll = false;
				this.getFunctionModules();
			}
		})
	}

	editRowData(item: any, type: ActionType = ActionType.UPDATE) {
		this.modalService.create({
			nzTitle: Ultilities.getTitlePopup(type),
			nzContent: UpdateItemFunctionComponent,
			nzWidth: '40%',
			nzMaskClosable: false,
			nzFooter: null,
			nzComponentParams: {
				item: item
			}
		}).afterClose.subscribe(() => {
			this.isCheckedAll = false;
			if (this.checkedNodes?.ids?.length > 0) {
				this.getLstFunction(this.checkedNodes?.ids);
			}else if(this.choseFunction && this.checkedNodes?.ids?.length === 0){
				this.getLstFunction([this.choseFunction?.id])
			}else{
				this.getLstFunction([this.choseFunction?.id])
			}
		})
	}

	choseFunction: any = null;
	choseLevel: any = null;
	loadFunction(event: any) {
    // console.log(event);
	}

	getLstFunction(data: any) {
		// this.loadingService.showLoading();
    this.loadingTable = true
		this.adminService.getListFunction(data)
      .pipe(finalize(() => { this.loadingTable = false })).subscribe((res: any) => {
			if (res.code === ResponseCode.SUCCESS) {
				this.initSettingTable();
				this.functionList = res?.data?.map((x: any, index: number) => {
					return {
						...x,
						index: index + 1,
						checked: this.selectedList
							?.map((y: any) => {
								return y.id;
							})
							?.some((z: any) => z === x?.id),
					};
				});
				this.displayFunctions = _.clone(this.functionList);
				if (this.functionList?.length > 0) {
					this.total = 1;
				} else {
					this.total = 0;
				}
				this.checkFunctionManagement = true;
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

	getItemSelected(event: any) {
		this.selectedList = _.uniqBy(
			[
				...this.selectedList,
				...event,
			],
			'id'
		);
	}

	getItemUnSelected(items: any) {
		this.selectedList = this.selectedList.filter((el: any) => {
			return items.findIndex((x: any) => x?.id == el?.id) < 0;
		});
	}

	showFunctions(event: boolean) {
		this.isCheckedAll = event;
		this.nodes = this.nodes?.map((x: any) => {
			return {
				...x,
				expanded: event,
				children: x?.children?.map((y: any) => {
					return {
						...y,
						expanded: event,
						children: y?.children?.map((z: any) => {
							return { ...z, expanded: event };
						}),
					};
				}),
			};
		});
	}

	onUpdateNode(event: any, type: ActionType = ActionType.UPDATE) {
		if (this.choseFunction && event?.origin?.id === this.choseFunction?.id) {
			if (event.level !== 0) {
				this.modalService.create({
					nzTitle: Ultilities.getTitlePopup(type),
					nzContent: CreateOrEditFunctionComponent,
					nzWidth: '65%',
					nzMaskClosable: false,
					nzFooter: null,
					nzComponentParams: {
						item: event,
						actionType: type
					}
				}).afterClose.subscribe(({ reload }) => {
					if (reload) {
						this.isCheckedAll = false;
						this.getFunctionModules();
					}
				})
			}
		} else {
			this.message.error('Bạn chưa chọn phân hệ/chức năng cần cập nhật');
		}
	}

	onDeleteNode(event: any) {
		if (this.choseFunction && event?.origin?.title === this.choseFunction?.title) {
			this.modalService.create({
				nzContent: NotificationOpenServiceComponent,
				nzWidth: '30%',
				nzMaskClosable: false,
				nzFooter: null,
				nzCentered: true,
				nzComponentParams: {
					messageNotification: `Bạn có muốn xóa ${event.origin?.name} này không?`,
					isWarning: true
				},
			  }).afterClose.subscribe(res=>{
				if(res === true){
					if (!event?.origin?.isMenu) {
						if (event?.origin?.children?.length > 0) {
							this.message.error(`Bạn cần xóa chức năng bên trong trước khi xóa ${event.origin?.name}!`)
							return;
						} else {
							let id = event.origin.id;
							this.moduleManagementApiService.deleteModuleByIds([id]).pipe(finalize(() => { this.loadingService.hideLoading() }))
								.subscribe(
									x => {
										if (x?.data?.error?.length) {
											this.message.error(x?.data?.error[0])
										} else {
											this.isCheckedAll = false;
											this.message.success("Xóa phân hệ thành công");
											this.getFunctionModules();
										}
									}
								);
						}
					} else {
						let id = event.origin.id;
						this.moduleManagementApiService.deleteMenuByIds([id]).pipe(finalize(() => { this.loadingService.hideLoading() }))
							.subscribe(
								x => {
									if (x?.data?.error?.length) {
										this.message.error(x?.data?.error[0])
									} else {
										this.isCheckedAll = false;
										this.message.success("Xóa chức năng thành công");
										this.getFunctionModules();
									}
								}
							);
					}
				}
			  })
		} else {
			this.message.error('Bạn chưa chọn phân hệ/chức năng cần xoá');
		}
	}

	openModalDelete: boolean = false;
	openPopupDelete() {
		let functions = this.selectedList;
		if (functions?.length === 0 || this.choseFunction?.length === 0) {
			this.message.error("Bạn cần chọn các tính năng cần xóa!");
			return;
		}
		this.openModalDelete = true
	}

	deleteOk(event:any) {
		if(event){
			if(this.openModalDelete){
				this.openModalDelete = false;
				this.deleteFunction()
			}else if(this.openModalDeleteMenus){
				this.onDeleteMultipleMenus(event)
			}
		}

	}


	deleteFunction(event: any = null) {
		this.loadingService.showLoading();
		this.adminService.deleteFunctionMenu(
			event ? [event] : this.selectedList
		).pipe(finalize(() => { this.loadingService.hideLoading() }))
			.subscribe(
				x => {
					if(x?.code === "00"){
						if(x?.data?.isSuccess === true){
							this.message.success("Xoá tính năng thành công");
							this.selectedList = [];
              this.getLstFunction(this.checkedNodes?.ids);
            }else if(x?.data?.isSuccess === false){
							this.message.error(`${x?.data?.error}`);
						}
					}
				}
			);
	}

  loadCheckedNodes() {
    this.checkedNodes.ids = this.checkedNodes?.keys?.filter((i: any) => this.menus.some((mn: any) => mn.key == i))?.map((i: any) => this.menus.find((mn: any) => mn.key == i)?.id)
    const isModuleChildChecked = (module: any) => {
      return this.checkedNodes?.keys?.includes(module.key) || (module?.children?.length && module?.children?.every((mn: any) => isModuleChildChecked(mn)))
    }
    this.checkedModules = this.modules.filter((m: any) => this.checkedNodes?.keys?.some((i: any) => m.key == i) || (m?.children?.length && m?.children?.every((mn: any) => isModuleChildChecked(mn))))
  }

	onCheckNode(event: any) {
		this.selectedList = [];
		this.checkedNodes = {
			keys: event?.keys
		}
    this.loadCheckedNodes()
		//code CR gọi nhiều tích năng cho phân hệ, chức năng
		this.choseFunction = event?.idFocus;
		this.choseLevel = event?.level?.level;
    console.log(this.checkedNodes)
		this.getLstFunction(this.checkedNodes?.ids);
	}

	deleteMultipleMenus() {
		if (!this.checkedNodes?.ids?.length && !this.checkedModules?.length) {
			this.message.error('Bạn chưa chọn chức năng cần xoá');
		} else {
			this.openModalDeleteMenus = true
		}
	}

	removeModule(type: 'all' | 'hasMenu' | 'single') {
    const ids = this.checkedModules?.filter(
      x => (!!x.children?.length && type == 'hasMenu') || (!x.children?.length && type == 'single') || type == 'all'
    ).map(x => x.id)
    if(ids?.length) {
      this.loadingService.showLoading()
      this.moduleManagementApiService.deleteModuleByIds(ids).pipe(finalize(() => { this.loadingService.hideLoading() }))
        .subscribe(
          x => {
            if (x?.data?.error?.length) {
              // x?.data?.error?.forEach((e: string) => this.message.error(e))
              this.message.error(x?.data?.error[0])
            } else {
              this.isCheckedAll = false;
              this.message.success("Xóa phân hệ/chức năng thành công");
              this.getFunctionModules();
            }
          }
        );
    }
	}

	onDeleteMultipleMenus(event:any) {
		if(event){
			this.openModalDeleteMenus = false
			if (this.checkedNodes?.ids?.length || this.checkedModules?.length) {
				if (this.checkedNodes?.ids?.length) {
			this.removeModule('single')
					this.moduleManagementApiService.deleteMenuByIds(this.checkedNodes.ids).pipe(finalize(() => { this.loadingService.hideLoading() }))
						.subscribe(
							x => {
								if (x?.data?.error?.length) {
									// x?.data?.error?.forEach((e: string) => this.message.error(e))
									this.message.error(x?.data?.error[0])
									this.getFunctionModules();
								} else {
									if (this.checkedModules?.length) {
										this.removeModule('hasMenu')
									} else {
										this.isCheckedAll = false;
										this.message.success("Xóa chức năng thành công");
										this.getFunctionModules();
									}
								}
							}
						);
				} else {
					this.removeModule('all')
				}
			} else {
				this.message.error('Bạn chưa chọn chức năng cần xoá');
			}
		}
	}
}
