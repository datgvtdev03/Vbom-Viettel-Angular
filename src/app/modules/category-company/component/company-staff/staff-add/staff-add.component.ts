import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BaseListComponent,
  ObjUtil,
  TIENG_VIET,
  TValidators,
  Ultilities,
  VssLoadingService,
} from '@viettel-vss-base/vss-ui';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import {NzMessageService} from "ng-zorro-antd/message";


@Component({
  selector: 'vbom-department-add-staff',
  templateUrl: './staff-add.component.html',
  styleUrls: ['./staff-add.component.scss'],
})
export class StaffAddComponent extends BaseListComponent implements OnInit {
  position = [];
  department = [];
  trangthai = [
    { label: 'Đang hoạt động', value: 'hd' },
    { label: 'Ngừng hoạt động', value: 'khd' },
  ];
  tinhtrang = [
    { label: 'Đang làm việc', value: 'danglam' },
    { label: 'Thai sản', value: 'thaisan' },
    { label: 'Nghỉ không lương', value: 'nghikl' },
    { label: 'Đang chờ nghỉ việc', value: 'chonghi' },
    { label: 'Nghỉ việc', value: 'nghi' },
  ];
  hopdong = [
    { label: 'Thử việc', value: 'thuviec' },
    { label: 'Hợp đồng dài hạn', value: 'daihan' },
    { label: 'Hợp đồng 1 năm', value: 'nam' },
  ];
  sex = [
    { label: 'Nam', value: 'nam' },
    { label: 'Nữ', value: 'nu' },
    { label: 'Khác', value: 'khac' },
  ];
  doituong = [
    { label: 'IS', value: 'is' },
    { label: 'OS', value: 'os' },
    { label: 'Quân nhân', value: 'qn' },
  ];

  item: any;
  constructor(
    private formBuilder: FormBuilder,
    private nzModalService: NzModalService,
    private modal: NzModalRef,
    private message: NzMessageService
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
        this.message.success('Thêm mới thành công!');

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
      permission: null,
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
      doituong: null,
      hopdong: null,
      tinhtrang: null,
      trangthai: null,
    });
  }
}
