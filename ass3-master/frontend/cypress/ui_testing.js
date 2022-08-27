context('happy path', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  const email = 'Name@example.com';
  const username = 'Name';
  const password = '123456';

  it('Register successfully and login', () => {
    cy.get('#join-now-btn')
      .click()

    cy.get('input[name=email]')
      .focus()
      .type(email)

    cy.get('input[name=username]')
      .focus()
      .type(username)

    cy.get('input[name=Password]')
      .focus()
      .type(password)

    cy.get('input[name=confirmpassword]')
      .focus()
      .type(password)

    cy.get('#sign-up-btn')
      .click()
  });

  it('Create a new game successfully', () => {
    cy.get('#create-btn')
      .click()

    cy.get('#create-confirm-btn')
      .click()

    cy.get('#popup-close-btn')
      .click()
  });

  it('Starts a game successfully', () => {
    cy.get('#start-game-btn')
      .click()

    cy.get('#popup-close-btn')
      .click()

    cy.get('#stop-game-btn')
      .click()

    cy.get('#view-result-no-btn')
      .click()
  });

  it('Ends a game successfully', () => {
    cy.get('#stop-game-btn')
      .click()

    cy.get('#view-result-no-btn')
      .click()
  });

  it('Loads the results page successfully', () => {
    cy.get('#history-sessions-btn')
      .click()

    cy.get('.view-session')
      .click()
  });

  it('Logs out of the application successfully', () => {
    cy.get('#logout-btn')
      .click()

    cy.get('#confirm-logout-btn')
      .click()
  });

  it('Logs back into the application successfully', () => {
    cy.get('input[name=email]')
      .focus()
      .type(email)

    cy.get('input[name=password]')
      .focus()
      .type(password)

    cy.get('#login-btn')
      .click()
  });
});

context('Second path to add a question in the game', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  const email = 'Name2@example.com';
  const username = 'Name2';
  const password = '123456';

  it('Register successfully and login', () => {
    cy.get('#join-now-btn')
      .click()

    cy.get('input[name=email]')
      .focus()
      .type(email)

    cy.get('input[name=username]')
      .focus()
      .type(username)

    cy.get('input[name=Password]')
      .focus()
      .type(password)

    cy.get('input[name=confirmpassword]')
      .focus()
      .type(password)

    cy.get('#sign-up-btn')
      .click()
  });

  it('Create a new game successfully', () => {
    cy.get('#create-btn')
      .click()

    cy.get('#create-confirm-btn')
      .click()

    cy.get('#popup-close-btn')
      .click()
  });

  const title = 'question title';
  const timelimit = '10';
  const answer1 = '111';
  const answer2 = '222';

  it('Adding a question to the game successfully', () => {
    cy.get('#edit-game-btn')
      .click()

    cy.get('#add-question-btn')
      .click()

    cy.get('#question-title-input')
      .focus()
      .type(title)

    cy.get('#time-limit-input')
      .focus()
      .type(timelimit)

    cy.get('#answer1-input')
      .focus()
      .type(answer1)

    cy.get('#answer2-input')
      .focus()
      .type(answer2)

    cy.get('#answer-select')
      .focus()
      .select('Answer 1')
      .select('Answer 2')
      .blur()

    cy.get('#add-btn')
      .click()

    cy.get('#popup-close-btn')
      .click()

    cy.get('#home-btn')
      .click()
  });
});
