describe('Signup Form - Dynamic', () => {
  it('should register with unique email and phone', () => {
    const random = Date.now();
    const email = `test${random}@mail.com`;
    const phone = `09${Math.floor(100000000 + Math.random() * 899999999)}`;
    const nickname = `user${random}`;

    cy.visit('http://localhost:3000/signup');

    cy.get('#nickname').type(nickname);
    cy.get('#phoneNumber').type(phone);
    cy.get('#email').type(email);
    cy.get('input[formControlName="password"]').type('Test@1234');
    cy.get('input[formControlName="repeatPassword"]').type('Test@1234');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/login');
  });
});

it('should show error on duplicate email', () => {
  cy.visit('http://localhost:3000/signup');

  cy.get('#nickname').type('someUser');
  cy.get('#phoneNumber').type('09121234567');
  cy.get('#email').type('test@mail.com');
  cy.get('input[formControlName="password"]').type('Test@1234');
  cy.get('input[formControlName="repeatPassword"]').type('Test@1234');

  cy.get('button[type="submit"]').click();

  cy.contains('ایمیل قبلاً ثبت شده است').should('be.visible');
});
