import { Component } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import moment from 'jalali-moment';
import { addDays, addWeeks, endOfWeek, startOfWeek } from 'date-fns';

@Component({
  selector: 'app-weekly-calender',
  standalone: false,
  templateUrl: './weekly-calender.component.html',
  styleUrl: './weekly-calender.component.scss',
})
export class WeeklyCalenderComponent {
  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  locale: string = 'fa';

  constructor() {
    // Set Jalali (Persian) locale
    moment.locale('fa');
  }

  // Convert Gregorian to Jalali date for display
  getPersianDate(date: Date): string {
    return moment(date).format('jYYYY/jMM/jDD');
  }

  // Get week days names in Persian
  getPersianWeekDays(): { long: string; short: string }[] {
    return [
      { long: 'شنبه', short: 'ش' },
      { long: 'یکشنبه', short: 'ی' },
      { long: 'دوشنبه', short: 'د' },
      { long: 'سه شنبه', short: 'س' },
      { long: 'چهارشنبه', short: 'چ' },
      { long: 'پنجشنبه', short: 'پ' },
      { long: 'جمعه', short: 'ج' },
    ];
  }

  // Navigate to previous week
  previousWeek(): void {
    this.viewDate = addWeeks(this.viewDate, -1);
  }

  // Navigate to next week
  nextWeek(): void {
    this.viewDate = addWeeks(this.viewDate, 1);
  }

  // Navigate to today
  today(): void {
    this.viewDate = new Date();
  }

  // Get current Persian week range
  getWeekRange(): string {
    const start = moment(startOfWeek(this.viewDate)).format('jD jMMMM');
    const end = moment(endOfWeek(this.viewDate)).format('jD jMMMM jYYYY');
    return `${start} تا ${end}`;
  }

  protected readonly startOfWeek = startOfWeek;
  protected readonly addDays = addDays;
}
