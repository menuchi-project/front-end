describe('Login Page', () => {
  const backendUrl = 'http://localhost:8000';

  let testUser = {
    username: '',
    phoneNumber: '',
    email: '',
    password: 'StrongPassword123!',
  };

  before(() => {
    const uniqueId = Date.now();
    testUser.username = `testuser_${uniqueId}`;
    testUser.phoneNumber = `09${(uniqueId % 1000000000).toString().padStart(9, '0')}`;
    testUser.email = `testuser_${uniqueId}@example.com`;

    cy.intercept('POST', `${backendUrl}/auth/res-signup`, {
      statusCode: 201,
      body: { message: 'Signup successful' },
    }).as('signupRequest');

    cy.visit('/signup');

    cy.get('#username').type(testUser.username);
    cy.get('#phoneNumber').type(testUser.phoneNumber);
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('#repeatPassword').type(testUser.password);

    cy.get('button[type="submit"]').click();

    cy.wait('@signupRequest');
    cy.get('.ant-message-success').should(
      'contain.text',
      'ثبت نام با موفقیت انجام شد!',
    );
    cy.url().should('include', '/login');
  });

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
    cy.get('input[formControlName="password"]').type(
      '7uL0t5*cJEG@tZOvEp3s1cUuG7KC2hBSVzud&G12dOTdbK',
    );
    cy.get('.eye-icon').click();
    cy.get('input[formControlName="password"]').should(
      'have.attr',
      'type',
      'text',
    );
    cy.get('.eye-icon').click();
    cy.get('input[formControlName="password"]').should(
      'have.attr',
      'type',
      'password',
    );
  });

  it('should show error message on failed login', () => {
    cy.intercept('POST', `${backendUrl}/auth/res-signin`, {
      statusCode: 401,
    }).as('loginRequestFailed');

    cy.get('input[formControlName="username"]').type(testUser.phoneNumber);
    cy.get('input[formControlName="password"]').type('WrongPassword');
    cy.get('.login-form-button').click();

    cy.wait('@loginRequestFailed');
    cy.contains('اطلاعات وارد شده صحیح نمی‌باشند.').should('exist');
  });

  it('should login successfully and redirect to dashboard', () => {
    cy.intercept('GET', '**/users/profile', {
      statusCode: 200,
      body: {
        username: testUser.username,
        restaurants: [
          { branches: [{ id: 'branch-test', backlogId: 'backlog-test' }] },
        ],
      },
    }).as('fetchUserProfile');

    cy.intercept('POST', `${backendUrl}/auth/res-signin`, {
      statusCode: 200,
      body: true,
    }).as('loginRequestSuccess');

    cy.get('input[formControlName="username"]').type(testUser.phoneNumber);
    cy.get('input[formControlName="password"]').type(testUser.password);
    cy.get('.login-form-button').click();

    cy.wait('@loginRequestSuccess');
    cy.wait('@fetchUserProfile');

    cy.url().should('include', '/dashboard');
    cy.contains('شما با موفقیت وارد شدید.').should('exist');
  });

  it('should redirect unauthenticated user from dashboard to login', () => {
    cy.visit(`/dashboard`);
    cy.url().should('include', '/login');
  });
});
