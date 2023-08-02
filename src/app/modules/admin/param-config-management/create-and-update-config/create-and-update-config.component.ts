import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import {
  BaseListComponent,
  ObjUtil,
  TIENG_VIET,
  TValidators,
  Ultilities,
  VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {AdminService} from '@vbomApp/service/admin.service';
import {ResponseCode} from '@vbomApp/modules/shares/enum/common.enum';

@Component({
  selector: 'vbom-create-and-update-config',
  templateUrl: './create-and-update-config.component.html',
  styleUrls: ['./create-and-update-config.component.scss']
})
export class CreateAndUpdateConfigComponent  extends BaseListComponent implements OnInit, AfterViewInit {
  @ViewChild('focusInput', {static: true}) focusInput!: ElementRef<HTMLInputElement>;
  item: any;
  // passwordVisible = false;
  isChecked: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private adminService: AdminService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    if(this.item){
      // this.myForm.patchValue(this.item);
      this.myForm.patchValue({
        configCode: this.item?.configCode,
        configName: this.item?.configName,
        description: this.item?.description,
        id: this.item?.id,
        indexOrder: this.item?.indexOrder,
        isPassword: this.item?.isPassword,
        value: this.item?.newValueAfterPasswordTrue
      });
      this.isChecked = this.item?.isPassword;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.focusInput.nativeElement.focus();
   }, 400)
  }

  initForm() {
    this.myForm = this.fb.group({
      id: null,
      configName: [null, [TValidators.required(), TValidators.pattern(/^([A-ZỲỌÁẦẢẤỜỄÀẠẰỆẾÝỘẬỐŨỨĨÕÚỮỊỖÌỀỂẨỚẶÒÙỒỢÃỤỦÍỸẮẪỰỈỎỪỶỞÓÉỬỴẲẸÈẼỔẴẺỠƠÔƯĂÊÂĐ|a-zỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ| |_|0-9])+$/, "Chỉ được phép nhập chữ, số, _")]],
      configCode: [null, [TValidators.required(), TValidators.pattern(/^([A-Z|a-z|_| |0-9])+$/, "Chỉ được phép nhập a-z, A-Z, 0-9, _")]],
      description: [null, [TValidators.required(), TValidators.pattern(TIENG_VIET, "Chỉ được phép nhập chữ và số")]],
      value: [null, [TValidators.required(), ]],
      indexOrder: [null, TValidators.numberRange(1)],
      isPassword: false
    });
  }

  checkPassword(event:any){
    this.myForm.patchValue({
      isPassword: event
    })
    this.isChecked = event;
  }

  submit() {
    Ultilities.validateForm(this.myForm);
    if (this.myForm.invalid) {
      return
    }
    let payload = ObjUtil.trim(this.myForm.value);
    if(!this.item){
      this.adminService
        .createConfig(payload)
        .subscribe((res: any) => {
          if (res.code === ResponseCode.SUCCESS) {
            this.message.success(`Thêm mới tham số thành công`);
            this.modalRef.close(true);
          }
        });
    }else{
      this.adminService
        .updateConfig(payload)
        .subscribe((res: any) => {
          if (res.code === ResponseCode.SUCCESS) {
            this.message.success(`Cập nhật tham số thành công`);
            this.modalRef.close(true);
          }
        });
    }
  }

  closeModal() {
    this.modalRef.close();
  }
}
