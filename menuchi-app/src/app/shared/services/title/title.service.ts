import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  onPageChanged$ = new Subject<string>();

  constructor() {}
}
