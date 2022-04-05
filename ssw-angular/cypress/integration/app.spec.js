/// <reference types="cypress" />;

describe('Index', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('has a launch session button', () => {
    cy.get('button').should('contain', 'Launch session');
  });

  it('can launch session button', () => {
    cy.get('button').click();
    cy.url().should('equal', 'http://localhost:4200/room');
    cy.get('.log').children().first().should('contain', 'Created room');
  });
});
describe('Room', () => {
  const privateKey = 'private_key';

  beforeEach(() => {
    cy.visit(`http://localhost:4200/room/${privateKey}`);
  });

  it('can be joined', () => {
    cy.get('.log').children().first().should('contain', 'Joined room');
  });

  it('displays new contents', () => {
    cy.get('textarea').should('have.value', '');
    let angular;
    cy.window()
      .then((win) => (angular = win.ng))
      .then(() => cy.document())
      .then((doc) => {
        const componentInstance = angular.getComponent(
          doc.querySelector('ssw-room-page')
        );
        cy.spy(componentInstance, 'updateContent');
        componentInstance.updateContent('it');
        cy.get('textarea').should('have.value', 'it');
        cy.wait(0).then(() => {
          componentInstance.updateContent('it works');
          cy.get('textarea').should('have.value', 'it works');
        });
      });
  });
});
