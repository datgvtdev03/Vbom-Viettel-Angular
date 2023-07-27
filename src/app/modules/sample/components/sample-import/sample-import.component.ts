import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {BaseFormComponent} from '@viettel-vss-base/vss-ui';
import {FormBuilder} from '@angular/forms';
import {SampleService} from '@vbomApp/modules/sample/sample.service';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'vbom-sample-import',
  templateUrl: './sample-import.component.html',
  styleUrls: ['./sample-import.component.scss']
})
export class SampleImportComponent extends BaseFormComponent implements OnInit {
  fileObj: any;
  msg? = ''
  autoImport = false

  constructor(
    private sanitizer: DomSanitizer,
    fb: FormBuilder,
    private sampleService: SampleService,
    private modalRef: NzModalRef
  ) {
    super(fb)
  }

  ngOnInit(): void {
  }
  onSelectFile(e: any) {
    this.msg = ''
    // Single upload
    const fileListAsArray = (e as File[]);
    if(!fileListAsArray.length) {
      return
    }
    const file = fileListAsArray[0]
    const url = URL.createObjectURL(file);
    this.fileObj = { item: file, url: url };
    if(this.autoImport) {
      this.upload()
    }
  }
  upload() {
    this.sampleService.import(this.fileObj.item).subscribe(
      () => {
        // processed upload
        this.dismiss()
      },
      err => {
        this.msg = err.message || 'Import file lỗi'
      }
    )
  }
  // Clean Url
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  dismiss() {
    this.modalRef.close()
  }

}
