import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {BaseListComponent, TValidators} from "@viettel-vss-base/vss-ui";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'vbom-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.scss']
})
export class DepartmentAddComponent extends BaseListComponent implements OnInit {
  donvicha = [
    // { label: 'Đang hoạt động', value: 'hd' },
    // { label: 'Ngừng hoạt động', value: 'khd' },
  ];
  loaidonvi = [
    { label: 'Cấp 1', value: 'cap1' },
    { label: 'Cấp 2', value: 'cap2' },
    { label: 'Cấp 3', value: 'cap3' },
    { label: 'Cấp 4', value: 'cap4' },
    { label: 'Cấp 5', value: 'cap5' },
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
      donvicha : null,
      loaidonvi : null,
    });
  }
}
