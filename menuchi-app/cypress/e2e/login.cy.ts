describe('Login Page', () => {
  const backendUrl = 'http://localhost:8000';

  beforeEach(() => {
    cy.visit(`/login`);
  });

  it('should display the login form', () => {
    cy.get('.login-form').should('exist');
    cy.get('input[formControlName="username"]').should('exist');
    cy.get('input[formControlName="password"]').should('exist');
    cy.get('.login-form-button').should('contain.text', 'ورود به حساب کاربری');
  });

  it('should show validation errors when submitting empty form', () => {
    cy.get('.login-form-button').click();
    cy.contains('شماره تماس خود را وارد کنید!').should('exist');
    cy.contains('رمز عبور خود را وارد کنید!').should('exist');
  });

  it('should toggle password visibility', () => {
    cy.get('input[formControlName="password"]').type('7uL0t5*cJEG@tZOvEp3s1cUuG7KC2hBSVzud&G12dOTdbK');
    cy.get('.eye-icon').click();
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'text');
    cy.get('.eye-icon').click();
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password');
  });

  it('should show error message on failed login', () => {
    cy.intercept('POST', `${backendUrl}/auth/res-signin`).as('loginRequest');

    cy.get('input[formControlName="username"]').type('9660086615');
    cy.get('input[formControlName="password"]').type('WrongPassword');
    cy.get('.login-form-button').click();

    cy.wait('@loginRequest');
    cy.contains('اطلاعات وارد شده صحیح نمی‌باشند.').should('exist');
  });

  it('should login successfully and redirect to dashboard', () => {
    cy.intercept('POST', `${backendUrl}/auth/res-signin`).as('loginRequest');

    cy.get('input[formControlName="username"]').type('9660086615');
    cy.get('input[formControlName="password"]').type('TDbGsqpIh$9MdU'); // رمز صحیح را وارد کن
    cy.get('.login-form-button').click();

    cy.wait('@loginRequest').then(({ response }) => {
  console.log('Login response status:', response?.statusCode);
  console.log('Login response body:', response?.body);
});

    cy.url().should('include', '/dashboard');
    cy.contains('شما با موفقیت وارد شدید.').should('exist');
  });

  it('should redirect unauthenticated user from dashboard to login', () => {
    cy.visit(`/dashboard`);
    cy.url().should('include', '/login');
  });
});
