describe('Signup Form', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('should register successfully with valid and unique data', () => {
    const random = Date.now();
    const email = `test${random}@mail.com`;
    const phone = `09${Math.floor(100000000 + Math.random() * 899999999)}`;
    const nickname = `user${random}`;

    cy.get('#nickname').type(nickname);
    cy.get('#phoneNumber').type(phone);
    cy.get('#email').type(email);
    cy.get('input[formControlName="password"]').type('Test@1234');
    cy.get('input[formControlName="repeatPassword"]').type('Test@1234');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/login');
  });

  it('should show an error for a duplicate email', () => {
    const existingEmail = 'test@mail.com';

    cy.get('#nickname').type('someUser');
    cy.get('#phoneNumber').type('09121234567');
    cy.get('#email').type(existingEmail);
    cy.get('input[formControlName="password"]').type('Test@1234');
    cy.get('input[formControlName="repeatPassword"]').type('Test@1234');

    cy.get('button[type="submit"]').click();

    cy.contains('ایمیل قبلاً ثبت شده است').should('be.visible');
  });

  it('should show an error if passwords do not match', () => {
    cy.get('#nickname').type('testuser');
    cy.get('#phoneNumber').type('09123456789');
    cy.get('#email').type(`newuser-${Date.now()}@mail.com`);
    cy.get('input[formControlName="password"]').type('ValidPass123');
    cy.get('input[formControlName="repeatPassword"]').type('WrongPass!@#');

    cy.get('button[type="submit"]').click();
    cy.contains(' لطفاً فرم را به درستی پر کنید!').should('be.visible');
  });

  it('should show validation errors for empty required fields', () => {
    cy.get('button[type="submit"]').click();

    cy.contains('لطفا نام کاربری معتبر وارد کنید!').should('be.visible');
    cy.contains('لطفا ایمیل معتبر وارد کنید!').should('be.visible');
    cy.contains('لطفا شماره تماس معتیر وارد کنید!').should('be.visible');
    cy.contains('لطفاً رمز عبور را تکرار کنید!').should('be.visible');
  });
});
