import { Pipe, PipeTransform } from '@angular/core';
import { CATEGORIES } from '../../../main/models/CatNameIcons';

@Pipe({
  name: 'categoryIcon',
  standalone: false,
})
export class CategoryIconPipe implements PipeTransform {
  transform(categoryName: string): string {
    const foundCategory = CATEGORIES.find((c) => c.label === categoryName);
    return foundCategory?.icon || 'assets/icons/categories/سالاد.svg';
  }
}
