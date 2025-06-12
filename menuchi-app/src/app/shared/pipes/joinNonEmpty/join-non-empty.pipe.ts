import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinNonEmpty',
  standalone: false,
})
export class JoinNonEmptyPipe implements PipeTransform {
  transform(
    values: (string | null | undefined)[],
    separator: string = ', ',
  ): string {
    return values
      .filter((value) => value != null && value.trim() !== '')
      .join(separator);
  }
}
