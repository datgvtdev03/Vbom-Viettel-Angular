import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SampleRoutingModule } from './sample-routing.module';
import { SampleComponent } from './components/sample/sample.component';
import {
  PermissionModule,
  TableModule,
  UploadModule,
  VssUiControlsModule,
  VssUiDirectivesModule
} from '@viettel-vss-base/vss-ui';
import { SampHeaderFilterComponent } from './components/samp-header-filter/samp-header-filter.component';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzIconModule} from 'ng-zorro-antd/icon';
import { SampleImportComponent } from './components/sample-import/sample-import.component';


@NgModule({
  declarations: [
    SampleComponent,
    SampHeaderFilterComponent,
    SampleImportComponent
  ],
  imports: [
    CommonModule,
    SampleRoutingModule,
    TableModule,
    VssUiControlsModule,
    NzCardModule,
    NzFormModule,
    NzCheckboxModule,
    VssUiDirectivesModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzIconModule,
    PermissionModule,
    UploadModule
  ]
})
export class SampleModule { }
