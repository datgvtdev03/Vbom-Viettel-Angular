import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {
  BaseListComponent,
  SettingTableDynamic,
  TableColum, Ultilities,
  UpdateItemModalComponent,
  VssLoadingService
} from '@viettel-vss-base/vss-ui';
import {sampleColumn} from '../../sample.column';
import {SampleService} from '@vbomApp/modules/sample/sample.service';
import {FilterHeader} from '@vbomApp/modules/sample/sample.model';
import {FilterFieldType} from '@vbomApp/modules/sample/sample.enum';
import {SampleImportComponent} from '@vbomApp/modules/sample/components/sample-import/sample-import.component';

@Component({
  selector: 'vss-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent extends BaseListComponent implements OnInit {
  nameTable = "cửa hàng"
  settingValue: SettingTableDynamic = {
    bordered: true,
    isFilterJs: false,
    loading: false,
    pagination: false,
    sizeChanger: false,
    title: `Danh sách ${this.nameTable}`,
    footer: null,
    checkbox: true,
    simple: false,
    size: 'small',
    tableLayout: 'auto',
  };
  nameRole = "store";
  roleAdd = []; // [`ROLE_${this.nameRole.toLocaleUpperCase()}_CREATE`];
  roleUpdate = []; //[`ROLE_${this.nameRole.toLocaleUpperCase()}_UPDATE`];
  roleDelete = []; //[`ROLE_${this.nameRole.toLocaleUpperCase()}_DALETE`];
  roleImport = []; //[`ROLE_${this.nameRole.toLocaleUpperCase()}_IMPORT`];
  roleExport = []; //[`ROLE_${this.nameRole.toLocaleUpperCase()}_EXPORT`];
  col: TableColum[] = sampleColumn
  colFilter: TableColum[] = this.col;
  listOfData: any = [];
  dataDeleteChecked: any[] = []; // data xoá 1 or nh
  isShowUpdate!: boolean;
  fieldFilterHead: FilterHeader[] = [
    {
      field: 'name',
      type: FilterFieldType.INPUT_TEXT,
      label: 'Tên',
      required: true
    },
    {
      field: 'phone',
      type: FilterFieldType.INPUT_NUMBER,
      label: 'Số điện thoại',
      required: true
    },
    {
      field: 'value',
      type: FilterFieldType.RANGE_NUMBER,
      label: 'Giá trị đơn',
      minValue: 1,
      maxValue: 1000,
      suffix: ' Triệu đ'
    },
    {
      field: 'createdAt',
      type: FilterFieldType.DATE_TIME_RANGE_PICKER,
      label: 'Ngày tạo'
    },
    {
      field: 'status',
      type: FilterFieldType.SELECT_MULTI,
      label: 'Trạng thái',
      options: [
        {value: 1, label: 'Kích hoạt'},
        {value: 0, label: 'Chưa kích hoạt'},
        {value: 2, label: 'Blocked'},
      ]
    },
  ]
  exporting = false;
  constructor(
    private loadingService: VssLoadingService,
    private sampleApi: SampleService,
    private modalService: NzModalService,
    public message: NzMessageService,
    ) {
    super(sampleApi, message);
    this.searchType = 'filterData';
  }

  ngOnInit(): void {
    this.loadingService.showLoading();
    this.setupStreamSearch();
  }

  getSelectedData(item: any[]) {
    this.dataDeleteChecked = item; // data xoá 1 or nh
  }

  getUnSelectedData(item: any[]) {

  }

  onFilterInTable(event: any) {
    super.onFilterInTable(event);
  }
  viewDetail(row: any,isEdit: boolean) {
    this.modalService?.create({
      nzTitle: isEdit ? "Chỉnh sửa bản ghi" : "Xem bản ghi",
      nzContent: UpdateItemModalComponent,
      nzWidth: '40%',
      nzMaskClosable: false,
      nzFooter: !isEdit ? null : undefined,
      nzOkText:'Lưu',
      nzCancelText: 'Hủy',
      nzComponentParams: {
        item: row.item,
        tableHeads: row.tableHeads,
        canEdit: isEdit
      },
      nzOnOk: (processData) => {
        const data = {
          ...processData.submit(),
          id: processData.item.id
        };
        let isClose = false;
        if (!data) {
          return false;
        }
        return this.sampleApi.updateApi(data).pipe(
          finalize(() => this.loadingService.hideLoading()),
          map(res => {
            this.message?.success('Sửa dữ liệu thành công.');
            this.onPageIndexChange(1);
            return true
          }),
          catchError(e => {
            this.message?.success('Sửa dữ liệu thất bại.');
            return of(false)
          })
        ).toPromise()
      }
    })
  }
  /**
   * Sử dụng để setup api search.
   * override hàm này để thay đổi api search cho stream search
   * dùng tap from 'rxjs/operators' để thực hiện các công việc lưu gán listOfData, paging.totalElements, paging.page
   * sử dụng
   *   @param payload: {
   *             page: number,
   *             size: number,
   *             lsCondition?: conditions || [],
   *             sortField: sortField || [],
   *           }
   *
   *   @return Observable<any>
   */
  apiSearch(payload: any): Observable<any> {
    return this.sampleApi.searchApi(payload)
    .pipe(
      tap((response: any) => {
        //processing data
        this.listOfData = response?.data.content.map((item: any, index: number) => {
          item.index = ((this.paging.pageIndex - 1) * this.paging.pageSize) + index + 1;
          item.checked = false;
          return item;
        });
        this.paging.totalElements = response?.data.totalElements;
        this.paging.totalPages = response?.data.totalPages;
      })
    )
  }
  deleteItems() {
    this.sampleApi.deleteMultiApi(this.dataDeleteChecked)
  }
  deleteItem(data: any) {
    this.sampleApi.deleteApi(data.id)
  }

  addItem() {
    this.modalService.create({
      nzTitle: 'Tạo mới sample',
      nzContent: UpdateItemModalComponent,
      nzWidth: '40%',
      nzMaskClosable: false,
      // nzFooter: null,
      nzOkText:'Lưu',
      nzCancelText: 'Hủy',
      nzComponentParams: {
        // item: this.item,
        // tableHeads: cloneDeep(this.tableHeads),
        // isPreview: this.isPreview,
      },
      nzOnOk: (processData) => {
        const data = processData.submit();
        let isClose = false;
        if (!data) {
          return false;
        }
        return true;
      }
    })
      .afterClose.subscribe((res) => {
      if (res) {
      }
    })
  }

  createItem(data: any) {
    // this.loadingService.showLoading();
    this.sampleApi.createApi(data)
      // .pipe(finalize(() => this.loadingService.hideLoading()))
      .subscribe((res: any) => {
        if(res?.code == 200 || !res){
          this.message?.success('Thêm dữ liệu thành công.');
          this.onPageIndexChange(1);
        } else {
          this.message?.error('Thêm dữ liệu thất bại.');
        }
      });
  }

  onSearchManual(params: any) {
    this.paging.pageIndex = 1
    this.searchBind$.next({...this.searchBind$.value, filterData: params})
  }

  dowloadFile() {
    this.exporting = true
    this.sampleApi.exportApi(this.searchBind$.value.filterData)
      .pipe(finalize(() => this.exporting = false))
      .subscribe(
        res => {
          this.downloadFilePublic(
            res, `reportSample.xlsx`
          )
        })
  }

  importFile() {
    this.modalService.create({
      nzTitle: 'Import data',
      nzContent: SampleImportComponent,
      nzWidth: '40%',
      nzMaskClosable: false,
      nzFooter: null,
      nzComponentParams: {
      }
    })
      .afterClose.subscribe((res) => {
      if (res) {
      }
    })
  }
}
