/// <reference types="cypress" />

describe('Restaurant Signup Page E2E Tests', () => {
  const selectors = {
    nickname: '#nickname',
    phoneNumber: '#phoneNumber',
    email: '#email',
    password: '#password',
    repeatPassword: '#repeatPassword',
    submitButton: 'button[type="submit"]',
    passwordEyeIcon: 'i.eye-icon',
    errorMessage: '.ant-message-error',
    successMessage: '.ant-message-success',
  };

  beforeEach(() => {
    // بر اساس فایل app-routing.module.ts، به صفحه ثبت‌نام مراجعه می‌کنیم
    cy.visit('/signup');
  });

  context('Form Validation and UI Interaction', () => {
    it('should display validation errors when submitting an empty form', () => {
      cy.get(selectors.submitButton).click();

      // بررسی نمایش پیام خطای کلی
      cy.get(selectors.errorMessage).should(
        'contain.text',
        'لطفاً فرم را به درستی پر کنید!',
      );

      // بررسی نمایش خطای مربوط به هر فیلد
      cy.get('nz-form-control[nzerrortip="لطفا نام کاربری معتبر وارد کنید!"]').should('be.visible');
      cy.get('nz-form-control[nzerrortip="لطفا شماره تماس معتیر وارد کنید!"]').should('be.visible');
      cy.get('nz-form-control[nzerrortip="لطفا ایمیل معتبر وارد کنید!"]').should('be.visible');
      // با توجه به اینکه رمز عبور required نیست، خطایی برای آن انتظار نداریم مگر اینکه اصلاح شود
      cy.get('div').contains('لطفاً رمز عبور را تکرار کنید!').should('be.visible');
    });

    it('should show specific validation errors for invalid inputs', () => {
      // نام کاربری کوتاه
      cy.get(selectors.nickname).type('ab');
      cy.get(selectors.nickname).blur(); // برای فعال شدن اعتبارسنجی
      cy.contains('لطفا نام کاربری معتبر وارد کنید!').should('be.visible');

      // شماره تلفن نامعتبر
      cy.get(selectors.phoneNumber).type('12345');
      cy.get(selectors.phoneNumber).blur();
      cy.contains('لطفا شماره تماس معتیر وارد کنید!').should('be.visible');

      // ایمیل نامعتبر
      cy.get(selectors.email).type('invalid-email');
      cy.get(selectors.email).blur();
      cy.contains('لطفا ایمیل معتبر وارد کنید!').should('be.visible');

      // رمز عبور ضعیف
      cy.get(selectors.password).type('weakpass');
      cy.get(selectors.password).blur();
      cy.contains('رمز باید حداقل ۸ کاراکتر شامل یک حرف بزرگ و کوچک، یک عدد و یک علامت خاص باشد.').should('be.visible');
    });

    it('should show an error if passwords do not match', () => {
      cy.get(selectors.password).type('ValidPass123!');
      cy.get(selectors.repeatPassword).type('DifferentPass123?');
      cy.get(selectors.repeatPassword).blur();

      cy.get('div').contains('رمزهای وارد شده با هم مطابقت ندارند!').should('be.visible');
    });

    it('should toggle password visibility when clicking the eye icon', () => {
      cy.get(selectors.password).should('have.attr', 'type', 'password');
      cy.get(selectors.password).siblings(selectors.passwordEyeIcon).click();
      cy.get(selectors.password).should('have.attr', 'type', 'text');

      cy.get(selectors.repeatPassword).should('have.attr', 'type', 'password');
      cy.get(selectors.repeatPassword).siblings(selectors.passwordEyeIcon).click();
      cy.get(selectors.repeatPassword).should('have.attr', 'type', 'text');
    });
  });

  context('API Call Scenarios', () => {
    // یک کاربر تست برای استفاده در سناریوهای مختلف
    const testUser = {
      nickname: 'testuser123',
      phoneNumber: '09123456789',
      email: 'test@example.com',
      password: 'StrongPassword123!',
    };

    it('should successfully sign up a user and redirect to /login', () => {
      // شبیه‌سازی یک پاسخ موفقیت‌آمیز از سرور
      // نکته: مسیر API ('/api/auth/signup') باید با مسیر واقعی شما مطابقت داشته باشد
      cy.intercept('POST', '**/signup', {
        statusCode: 201,
        body: {message: 'Signup successful'},
      }).as('signupRequest');

      cy.get(selectors.nickname).type(testUser.nickname);
      cy.get(selectors.phoneNumber).type(testUser.phoneNumber);
      cy.get(selectors.email).type(testUser.email);
      cy.get(selectors.password).type(testUser.password);
      cy.get(selectors.repeatPassword).type(testUser.password);

      cy.get(selectors.submitButton).click();

      // منتظر می‌مانیم تا درخواست شبکه انجام شود
      cy.wait('@signupRequest');

      // بررسی پیام موفقیت
      cy.get(selectors.successMessage).should('contain.text', 'ثبت نام با موفقیت انجام شد!');

      // بررسی ریدایرکت شدن کاربر به صفحه لاگین
      cy.url().should('include', '/login');
    });

    it('should show a conflict error message if the user already exists (409)', () => {
      // شبیه‌سازی خطای 409 (Conflict) از سرور
      cy.intercept('POST', '**/signup', {
        statusCode: 409,
        body: {message: 'User already exists'},
      }).as('signupConflict');

      cy.get(selectors.nickname).type(testUser.nickname);
      cy.get(selectors.phoneNumber).type(testUser.phoneNumber);
      cy.get(selectors.email).type(testUser.email);
      cy.get(selectors.password).type(testUser.password);
      cy.get(selectors.repeatPassword).type(testUser.password);

      cy.get(selectors.submitButton).click();
      cy.wait('@signupConflict');

      // بررسی نمایش پیام خطای مناسب
      cy.get(selectors.errorMessage).should(
        'contain.text',
        'این شماره تلفن یا ایمیل قبلاً ثبت شده است!',
      );
    });

    it('should show a generic error for other server errors (e.g., 500)', () => {
      // شبیه‌سازی خطای 500 (Internal Server Error)
      cy.intercept('POST', '**/signup', {
        statusCode: 500,
      }).as('serverError');

      cy.get(selectors.nickname).type(testUser.nickname);
      cy.get(selectors.phoneNumber).type(testUser.phoneNumber);
      cy.get(selectors.email).type(testUser.email);
      cy.get(selectors.password).type(testUser.password);
      cy.get(selectors.repeatPassword).type(testUser.password);

      cy.get(selectors.submitButton).click();
      cy.wait('@serverError');

      // بررسی نمایش پیام خطای عمومی
      cy.get(selectors.errorMessage).should(
        'contain.text',
        'مشکلی در ثبت نام پیش آمد! لطفاً دوباره تلاش کنید.',
      );
    });
  });
});
