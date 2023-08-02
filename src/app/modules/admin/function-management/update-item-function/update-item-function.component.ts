import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import {BaseListComponent, ObjUtil, TValidators, Ultilities, VssLoadingService} from '@viettel-vss-base/vss-ui';
import {ModuleManagementApiService} from '@vbomApp/service/module-management-api.service';

@Component({
  selector: 'vbom-update-item-function',
  templateUrl: './update-item-function.component.html',
  styleUrls: ['./update-item-function.component.scss']
})
export class UpdateItemFunctionComponent extends BaseListComponent implements OnInit {

  item: any;
  canEdit: boolean = true;
  statusList: any[]=[{value: true, label:"Hoạt động"},{value: false, label:"Không hoạt động"}]
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private loadingService: VssLoadingService,
    private message: NzMessageService,
		private moduleManagementApiService: ModuleManagementApiService,
  ) { super() }

  ngOnInit(): void {
    this.initForm();
    if(this.item)
    this.patchValueData(this.item)
  }

  initForm() {
    this.myForm = this.fb.group({
      id: [null],
      code: [null,[TValidators.required(), TValidators.pattern(/^([A-Za-z_])+$/)]],
      description: [null, [TValidators.required(), TValidators.pattern(/^([aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZa-zA-Z0-9 ])+$/)]],
      isActive: true
    });
    if(!this.canEdit && this.item) {
      this.myForm?.disable()
    }
    setTimeout(()=>{
      document.getElementById('code')?.focus();
    }, 500)
  }

  patchValueData(value: any) {
    const objReq = {
      id: value?.id,
      code: value?.functionCode,
      description: value?.description,
      isActive: value?.isActive
    }
    this.myForm.patchValue(objReq);
    this.myForm.get('code')?.disable();
    this.myForm.get('name')?.disable();
  }

  closeModal() {
    this.modalRef.close();
  }

  submit() {
    let descInput = document.getElementById('descInput');
    Ultilities.validateForm(this.myForm);
    if (this.myForm.invalid) {
      return
    }
    this.loadingService.showLoading();
    let data = {
      ...this.myForm?.getRawValue(),
      functionCode: this.myForm?.getRawValue()?.code?.toUpperCase()
    };
    if(this.item){
      this.moduleManagementApiService.updateDescFunction(ObjUtil.trim(data)).pipe(finalize(() => { this.loadingService.hideLoading() }))
			.subscribe(
                () => {
					this.message.success("Cập nhật tính năng thành công");
          this.modalRef.close(true);
				}, () => descInput?.focus());
    }else{
      this.moduleManagementApiService.addFunction(ObjUtil.trim(data)).pipe(finalize(() => { this.loadingService.hideLoading() }))
			.subscribe(
                () => {
					this.message.success("Thêm mới tính năng thành công");
          this.modalRef.close(true);
				})
    }
  }
}
