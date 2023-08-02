import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import {ActionType, BaseFormComponent, TValidators, Ultilities, VssLoadingService} from '@viettel-vss-base/vss-ui';
import {AdminService} from '@vbomApp/service/admin.service';
import {ModuleManagementApiService} from '@vbomApp/service/module-management-api.service';
import {ResponseCode} from '@vbomApp/modules/shares/enum/common.enum';

@Component({
	selector: 'vbom-create-or-edit-function',
	templateUrl: './create-or-edit-function.component.html',
	styleUrls: ['./create-or-edit-function.component.scss']
})
export class CreateOrEditFunctionComponent extends BaseFormComponent implements OnInit {

	constructor(
    _fb: FormBuilder,
		private message: NzMessageService,
		private adminService: AdminService,
		private loadingService: VssLoadingService,
		private modalRef: NzModalRef,
		private moduleManagementApiService: ModuleManagementApiService,
	) {
    super(_fb);
  }
	displayMenuOption = [
		{
			value: true,
			label: 'Có'
		},
		{
			value: false,
			label: 'Không'
		},
	];
	type = [
		{
			value: 1,
			label: 'Phân hệ'
		},
		{
			value: 2,
			label: 'Chức năng'
		},
	];
	selectedType: any = 1;
	module: any = [];
	item: any;
	lstGroup: any[] = [];
	actionType!: ActionType;
	isDisableType: boolean = false;
	isDisableModuleId: boolean = false;
  moduleMenuSelected: any = null

	ngOnInit(): void {
		this.initData();
		this.initForm();
		if (this.actionType === ActionType.UPDATE) {
			this.getRowData();
		}
		this.getFunctionModules();
	}

	initData() {
		this.adminService.getRoleGroupsList().subscribe((res: any) => {
			this.lstGroup = res?.data?.map((x: any) => { return { value: x?.id, label: x?.roleGroupName } }) || []
		})
	}

	initForm() {
		this.myForm = this.fb.group({
			name: [null, [Validators.required,TValidators.pattern(/^([/^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZa-zA-Z0-9 ])+$/, "Chỉ được phép nhập chữ,số")]],
			description: [null,[TValidators.pattern(/^([/^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZa-zA-Z0-9 ])+$/, "Chỉ được phép nhập chữ,số")]],
			type: [this.type[0]?.value],
			moduleId: [null, ],
			formName: [null],
			url: [null],
			isShow: [true],
			indexOrder: [null],
      icon: null
		});
		this.myForm?.get('formName')?.disable();
		this.isDisableModuleId = true;
	}

	getFunctionModules() {
    const __getModules = (item: any, disable = false) => {
      const d =  {
        value: item.id || item.moduleId,
        id: item.id || item.moduleId,
        label: item.moduleName,
        disable: disable || (item.id || item.moduleId) == this.item?.origin?.id,
        children: item?.items?.map((m: any) => __getModules(m, disable || (item.id || item.moduleId) == this.item?.origin?.id)) || [],
        moduleId: item.id || item.moduleId
      }
      if(d.value == this.moduleMenuSelected) {
        this.moduleMenuSelected = d
      }
      return d
    }
		this.adminService.getModules().subscribe((res) => {
			if (res.code === ResponseCode.SUCCESS) {
				this.module = res.data?.map((item: any) => __getModules(item));
			}
		});
	}

	onChangeType(obj: any) {
		this.selectedType = obj?.value;
		if(obj?.value === 1){
			this.myForm?.get('formName')?.disable();
			this.myForm?.get('url')?.setValue('');
			this.myForm?.get('url')?.disable();
			this.isDisableModuleId = true;
			this.myForm.get('formName')?.setValidators(null);
			this.myForm.get('formName')?.updateValueAndValidity();
		}else if(obj?.value === 2){
			this.myForm?.get('formName')?.enable();
			this.myForm?.get('url')?.enable();
			this.isDisableModuleId = false;
			this.myForm.get('formName')?.setValidators(TValidators.pattern(/^([/^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZa-zA-Z0-9 _])+$/, "Chỉ được phép nhập chữ,số và kí tự '_'"));
			this.myForm.get('formName')?.updateValueAndValidity();
		}
	}

	getRowData() {
		if (!this.item.origin.isMenu) {
			this.loadingService.showLoading();
			this.moduleManagementApiService.getModuleById(this.item.origin.id).pipe(finalize(() => {})).subscribe((res) => {
				if (res.code === ResponseCode.SUCCESS) {
					this.selectedType = 1;
					this.myForm?.patchValue({
						type: 1
					});
					this.onChangeType(this.selectedType);
					res.data.name = res.data.moduleName;
					this.initDataUpdate(res.data)
				}
				this.loadingService.hideLoading();
			})
		} else {
			this.loadingService.showLoading();
			this.moduleManagementApiService.getMenuById(this.item.origin.id).pipe(finalize(() => {})).subscribe((res) => {
				if (res.code === ResponseCode.SUCCESS) {
					this.selectedType = 2;
					this.myForm?.patchValue({
						type: 2
					});
					this.onChangeType(this.selectedType);
					res.data.name = res.data.menuName;
					res.data.moduleId = res.data?.parentId ? `${res.data?.moduleId}_${res.data?.parentId}` :  res.data?.moduleId
					this.initDataUpdate(res.data)
				}
				this.loadingService.hideLoading();
			})
		}
	}

	initDataUpdate(item: any) {
		this.myForm.patchValue(item);
		// this.myForm.get('moduleId')?.disable();
    // this.isDisableModuleId = true
		// this.myForm.get('type')?.disable();
		this.isDisableType = true;

	}

	closeModal(reload = false) {
		this.modalRef.close({reload});
	}

	submit() {

		if(this.myForm?.getRawValue()?.name?.trim() === null || this.myForm?.getRawValue()?.name?.trim() === undefined || !this.myForm?.getRawValue()?.name?.trim()){
			this.myForm?.patchValue({
				name : null
			})
		}

		Ultilities.validateForm(this.myForm);
		if (this.myForm.invalid) {
			return;
		}

		if(this.myForm?.getRawValue()?.name?.trim() === null || this.myForm?.getRawValue()?.name?.trim() === undefined || !this.myForm?.getRawValue()?.name?.trim()){
			return
		}

		this.loadingService.showLoading();
		this.actionType === ActionType.UPDATE ? this.updateDataForm() : this.createDataForm();
	}

	updateDataForm() {
    let data = this.myForm.value;
    const dataOri = this.item?.origin
		let objReq: any = {
      id: this.item.origin.id,
      description: data?.description?.trim(),
      type: data?.type,
      formName: null,
      url: data?.url?.trim(),
      isShow: data?.isShow,
      indexOrder: data?.indexOrder,
      icon: data?.icon?.trim(),
    };
		if (data?.type === 1) {
			objReq = {
				...objReq,
				moduleName: data?.name?.trim(),
        formName: null,
				type: data?.type,
        parentId: this.moduleMenuSelected?.id || dataOri?.parentId || null,
			}
			this.moduleManagementApiService.updateModule(objReq).pipe(finalize(() => { this.loadingService.hideLoading() }))
				.subscribe(
          () => {
            this.message.success("Cập nhật module thành công");
            this.getFunctionModules();
            this.closeModal(true);
          }
				);
		} else {
			objReq = {
        ...objReq,
				menuName: data?.name?.trim(),
				type: data?.type,
				formName: data?.formName?.trim(),
        moduleId: this.moduleMenuSelected?.moduleId || this.moduleMenuSelected?.id || dataOri?.moduleId,
			}
			this.moduleManagementApiService.updateMenu(objReq).pipe(finalize(() => { this.loadingService.hideLoading() }))
				.subscribe(
          () => {
						this.message.success("Cập nhật chức năng thành công");
						this.getFunctionModules();
						this.closeModal(true);
					},
				);
		}
	}

	createDataForm() {
		let objReq;
		let data = this.myForm.value;
    objReq = {
      name: data?.name?.trim(),
      description: data?.description?.trim(),
      type: data?.type,
      formName: data.type === 1 ? null : data.formName,
      url: data?.url?.trim(),
      isShow: data?.isShow,
      indexOrder: data?.indexOrder,
      moduleId: data.type === 1 ? null : this.moduleMenuSelected?.moduleId || this.moduleMenuSelected?.id,
      parentId: this.moduleMenuSelected?.id,
      icon: data?.icon?.trim()
    }
    this.moduleManagementApiService.createModuleMenu(objReq).pipe(finalize(() => { this.loadingService.hideLoading() }))
      .subscribe(
        () => {
          this.message.success(data.type === 1 ? "Tạo mới phân hệ thành công" : "Tạo mới chức năng thành công");
          this.getFunctionModules();
          this.closeModal(true);
        }
      );
	}

  changeModuleMenu(e: any) {
    this.moduleMenuSelected = e
  }
  checkDisableModuleMenu = (item: any) => {
    return item?.disable
  }
}

