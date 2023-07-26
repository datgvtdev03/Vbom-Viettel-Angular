import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseFormComponent} from '@viettel-vss-base/vss-ui';
import {FormBuilder, Validators} from '@angular/forms';
import {FilterHeader} from '@vbomApp/modules/sample/sample.model';
import {FilterFieldType} from '@vbomApp/modules/sample/sample.enum';
import {NzMessageService} from 'ng-zorro-antd/message';
@Component({
  selector: 'vbom-samp-header-filter',
  templateUrl: './samp-header-filter.component.html',
  styleUrls: ['./samp-header-filter.component.scss']
})
export class SampHeaderFilterComponent extends BaseFormComponent implements OnInit {
  @Input() filterFields: FilterHeader[] = []
  @Input() filterOnPress: boolean = false
  @Output() onSearch: EventEmitter<any> = new EventEmitter<any>()
  colDateTypes: FilterFieldType[] = [
    FilterFieldType.DATE_PICKER,
    FilterFieldType.DATE_PICKER,
    FilterFieldType.DATE_TIME_PICKER,
    FilterFieldType.DATE_TIME_RANGE_PICKER,
    FilterFieldType.DATE_RANGE_PICKER
  ];

  MAX_LENGTH_TEXT = 256
  filterFieldType = FilterFieldType

  constructor(
    fb: FormBuilder,
    private message: NzMessageService
  ) {
    super(fb)
  }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.myForm = this.fb.group({})
    this.filterFields.forEach(field => {
      this.myForm.addControl(field.field, this.fb.control(field.value, field.required ? [Validators.required] : []))
    })
  }

  refreshForm(){
    this.filterFields.forEach(field => {
      this.myForm?.get(field.field)?.setValue(field.value)
    })
  }

  search() {
    if(this.myForm.invalid) {
      this.message.warning('Vui lòng nhập các field bắt buộc.')
      return
    }
    this.onSearch.emit(this.myForm.getRawValue())
  }

}
