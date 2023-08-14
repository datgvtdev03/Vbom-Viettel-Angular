import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {BaseListComponent, TValidators} from "@viettel-vss-base/vss-ui";

@Component({
  selector: 'vbom-department-add-staff',
  templateUrl: './department-add-staff.html',
  styleUrls: ['./department-add-staff.scss']
})
export class DepartmentAddStaffComponent extends BaseListComponent implements OnInit {
  project = [];
  position = [];
  department = [];
  sex = [
    { label: 'Nam', value: 'nam' },
    { label: 'Nữ', value: 'nu' },
    { label: 'Khác', value: 'khac' },
  ];

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
      id: null,
      department: null,
      name: [
        null,
        [
          TValidators.required(),
          TValidators.pattern(
            /^([A-ZỲỌÁẦẢẤỜỄÀẠẰỆẾÝỘẬỐŨỨĨÕÚỮỊỖÌỀỂẨỚẶÒÙỒỢÃỤỦÍỸẮẪỰỈỎỪỶỞÓÉỬỴẲẸÈẼỔẴẺỠƠÔƯĂÊÂĐ|a-zỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ| |_|0-9])+$/,
            'Chỉ được phép nhập chữ, số, _'
          ),
        ],
      ],
      position: null,
      sex: null,
      email: null,
      phone: [
        null,
        [
          TValidators.required(),
          TValidators.pattern(
            /^([A-Z|a-z|_| |0-9])+$/,
            'Chỉ được phép nhập a-z, A-Z, 0-9, _'
          ),
        ],
      ],
      project: null,
    });
  }
}
