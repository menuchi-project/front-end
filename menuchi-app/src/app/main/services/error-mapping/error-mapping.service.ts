import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorMappingService {
  private errorCodeMap = new Map<string, string>([
    ['AUTH.USER_ALREADY_EXISTS', 'این شماره تلفن یا ایمیل قبلاً ثبت شده است!'],
    ['AUTH.INVALID_CREDENTIALS', 'نام کاربری یا رمز عبور اشتباه است.'],

    ['ITEM.NOT_FOUND', 'آیتم مورد نظر یافت نشد.'],
    ['ITEM.INVALID_DATA', 'اطلاعات ارسال شده برای آیتم نامعتبر است.'],
  ]);

  getFriendlyMessage(backendError: {
    errorCode?: string;
    message?: string;
  }): string {
    if (
      backendError?.errorCode &&
      this.errorCodeMap.has(backendError.errorCode)
    ) {
      return this.errorCodeMap.get(backendError.errorCode)!;
    }
    if (backendError?.message) {
      return backendError.message;
    }
    return 'یک خطای پیش‌بینی نشده رخ داد. لطفاً دوباره تلاش کنید.';
  }
}
