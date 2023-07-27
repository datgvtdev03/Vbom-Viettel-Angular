import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SampleComponent} from '@vbomApp/modules/sample/components/sample/sample.component';

const routes: Routes = [
  {
    path: '',
    component: SampleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleRoutingModule { }
