import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianPrice',
  standalone: false,
})
export class PersianPricePipe implements PipeTransform {
  transform(value: string | number): string {
    let result: string;
    if (typeof value != 'string') result = value.toLocaleString('fa-IR');
    else result = parseInt(value, 10).toLocaleString('fa-IR');
    return result.replaceAll('٬', '٫');
  }
}
