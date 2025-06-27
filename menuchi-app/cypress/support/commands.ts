Cypress.Commands.add('login', (username, password) => {
  return cy.request({
    method: 'POST',
    url: 'http://localhost:8000/auth/res-signin',
    body: {
      phoneNumber: username,
      password: password,
    },
    failOnStatusCode: false
  });
});


declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<any>;
    }
  }
}

export {};
