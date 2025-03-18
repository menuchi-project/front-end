import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root',
})
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'تعداد در صفحه:';
  override nextPageLabel = 'صفحه بعد';
  override previousPageLabel = 'صفحه قبل';
  override firstPageLabel = 'اولین صفحه';
  override lastPageLabel = 'آخرین صفحه';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0) {
      return `0 از ${length}`;
    }
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return `${start} - ${end} از ${length}`;
  };
}
