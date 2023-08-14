import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {BaseListComponent, TValidators} from "@viettel-vss-base/vss-ui";

@Component({
  selector: 'vbom-targets-add',
  templateUrl: './targets-add.component.html',
  styleUrls: ['./targets-add.component.scss']
})
export class TargetsAddComponent extends BaseListComponent implements OnInit {
  targetapply = [];
  mapid = [];
  maptype = [];
  status =[];
  doituong = [];

  item: any;
  constructor(
    private formBuilder: FormBuilder,
    private nzModalService: NzModalService,
    private modal: NzModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    this.nzModalService.confirm({
      nzTitle: 'Xác nhận',
      nzContent: 'Thêm mới nhân viên?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        console.log(this.myForm);
        this.destroyModal();
      },
    });
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      order: null,
      targetname: [
        null,
        [
          TValidators.required(),
          TValidators.pattern(
            /^([A-ZỲỌÁẦẢẤỜỄÀẠẰỆẾÝỘẬỐŨỨĨÕÚỮỊỖÌỀỂẨỚẶÒÙỒỢÃỤỦÍỸẮẪỰỈỎỪỶỞÓÉỬỴẲẸÈẼỔẴẺỠƠÔƯĂÊÂĐ|a-zỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ| |_|0-9])+$/,
            'Chỉ được phép nhập chữ, số, _'
          ),
        ],
      ],
      targetid: null,
      donvitinh: null,
      targetapply : null,
      mapid : null,
      maptype : null,
      status: null,
      doituong : null,
    });
  }

}
