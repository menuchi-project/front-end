import { Component } from '@angular/core';
import { addDays, addWeeks, endOfWeek, isSameDay, startOfWeek } from 'date-fns';
import moment from 'jalali-moment';

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calender.component.html',
  standalone: false,
  styleUrls: ['./weekly-calender.component.scss'],
})
export class WeeklyCalenderComponent {
  viewDate: Date = new Date();
  locale: string = 'fa';

  constructor() {
    moment.locale('fa');
  }

  // تبدیل تاریخ میلادی به شمسی
  getPersianDate(date: Date): string {
    return moment(date).format('jD jMMMM');
  }

  // نام روزهای هفته به فارسی
  getPersianWeekDays(): { long: string; short: string }[] {
    return [
      { long: 'شنبه', short: 'ش' },
      { long: 'یکشنبه', short: 'ی' },
      { long: 'دوشنبه', short: 'د' },
      { long: 'سه‌شنبه', short: 'س' },
      { long: 'چهارشنبه', short: 'چ' },
      { long: 'پنجشنبه', short: 'پ' },
      { long: 'جمعه', short: 'ج' },
    ];
  }

  // بررسی آیا تاریخ داده شده امروز است یا نه
  isToday(date: Date): boolean {
    return isSameDay(date, new Date());
  }

  // دریافت اطلاعات هر روز
  getDayInfo(dayIndex: number): {
    date: Date;
    isToday: boolean;
    isCurrentMonth: boolean;
  } {
    const date = addDays(startOfWeek(this.viewDate), dayIndex);
    return {
      date,
      isToday: this.isToday(date),
      isCurrentMonth: date.getMonth() === this.viewDate.getMonth(),
    };
  }

  // محدوده هفته جاری
  getWeekRange(): string {
    const start = moment(startOfWeek(this.viewDate)).format('jD jMMMM');
    const end = moment(endOfWeek(this.viewDate)).format('jD jMMMM jYYYY');
    return `${start} تا ${end}`;
  }

  // هفته قبل
  previousWeek(): void {
    this.viewDate = addWeeks(this.viewDate, -1);
  }

  // هفته بعد
  nextWeek(): void {
    this.viewDate = addWeeks(this.viewDate, 1);
  }

  // بازگشت به امروز
  today(): void {
    this.viewDate = new Date();
  }
}
