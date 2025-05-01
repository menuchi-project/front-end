import { Component } from '@angular/core';
import { isSameDay } from 'date-fns';
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
    // تنظیمات locale برای تقویم فارسی
    moment.locale('fa', {
      week: {
        dow: 6, // شروع هفته از شنبه (6 = شنبه در moment.js)
        doy: 12, // تعریف اولین روز سال
      },
    });
  }

  // تابع شروع هفته با شنبه
  startOfPersianWeek(date: Date): Date {
    const day = moment(date).day(); // روز هفته به صورت عددی
    const diff = day >= 6 ? day - 6 : day + 1; // محاسبه اختلاف تا شنبه
    return moment(date).subtract(diff, 'days').toDate();
  }

  // تابع پایان هفته با جمعه
  endOfPersianWeek(date: Date): Date {
    return moment(this.startOfPersianWeek(date)).add(6, 'days').toDate();
  }

  getPersianDate(date: Date): string {
    return moment(date).format('jD jMMMM');
  }

  getPersianWeekDays(): { long: string; short: string; dayIndex: number }[] {
    return [
      { long: 'شنبه', short: 'ش', dayIndex: 6 },
      { long: 'یکشنبه', short: 'ی', dayIndex: 0 },
      { long: 'دوشنبه', short: 'د', dayIndex: 1 },
      { long: 'سه‌شنبه', short: 'س', dayIndex: 2 },
      { long: 'چهارشنبه', short: 'چ', dayIndex: 3 },
      { long: 'پنجشنبه', short: 'پ', dayIndex: 4 },
      { long: 'جمعه', short: 'ج', dayIndex: 5 },
    ];
  }

  isToday(date: Date): boolean {
    return isSameDay(date, new Date());
  }

  getDayInfo(dayIndex: number): {
    date: Date;
    isToday: boolean;
    isCurrentMonth: boolean;
  } {
    const startDate = this.startOfPersianWeek(this.viewDate);
    const date = moment(startDate).add(dayIndex, 'days').toDate();

    return {
      date,
      isToday: this.isToday(date),
      isCurrentMonth: moment(date).jMonth() === moment(this.viewDate).jMonth(),
    };
  }

  getWeekRange(): string {
    const start = moment(this.startOfPersianWeek(this.viewDate)).format(
      'jD jMMMM',
    );
    const end = moment(this.endOfPersianWeek(this.viewDate)).format(
      'jD jMMMM jYYYY',
    );
    return `${start} تا ${end}`;
  }

  previousWeek(): void {
    this.viewDate = moment(this.viewDate).subtract(7, 'days').toDate();
  }

  nextWeek(): void {
    this.viewDate = moment(this.viewDate).add(7, 'days').toDate();
  }

  today(): void {
    this.viewDate = new Date();
  }
}
