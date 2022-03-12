describe('Notebook', () => {
  it('edit records', function () {
    cy.visit('http://localhost:8080/')
    cy.get('.notebook-button > img').click()
    cy.get('.notebook-add-record-button').click()
    cy.get('textarea').click()
    cy.get('textarea').clear()
    cy.get('textarea').type("Maukka found his mother's necklace")
    cy.get('.notebook-record > input').clear()
    cy.get('.notebook-record > input').type('First session')
    cy.get('.record-control-button-container > :nth-child(1)').click()
    cy.get('.notebook-add-record-button').click()
    cy.get('.notebook-record > input').clear()
    cy.get('.notebook-record > input').type('Second session')
    cy.get('textarea').click()
    cy.get('textarea').clear()
    cy.get('textarea').type("Maukka died protecting his mother's necklace from robbers")
    cy.get('.record-control-button-container > :nth-child(1)').click()
    cy.get('.notebook-record-button').should('have.length', 2)
    cy.get('.notebook-search').clear()
    cy.get('.notebook-search').type('first')
    cy.get('.notebook-record-button').should('have.length', 1)
    cy.get('.notebook-record-button').click()
    cy.get('.record-control-button-container > :nth-child(2)').click()
    cy.get('.notebook-search').clear()
    cy.get(':nth-child(2) > .notebook-record-button').click()
    cy.get('.record-delete-button').click()
    cy.get('.notebook-record-button').should('have.length', 1)
    cy.get('.notebook-button > img').click()
    cy.get('.notebook-container').should('be.hidden')
  })

  it('search by content', function () {
    cy.visit('http://localhost:8080/')
    cy.get('.notebook-button > img').click()
    cy.get('.notebook-add-record-button').click()
    cy.get('textarea').clear()
    cy.get('textarea').type('first')
    cy.get('.record-control-button-container > :nth-child(1)').click()
    cy.get('.notebook-add-record-button').click()
    cy.get('textarea').clear()
    cy.get('textarea').type('second')
    cy.get('.notebook-record > input').clear()
    cy.get('.notebook-record > input').type('Title')
    cy.get('.record-control-button-container > :nth-child(1)').click()
    cy.get('.notebook-search').clear()
    cy.get('.notebook-search').type('second')
    cy.get('.notebook-record-button').should('have.length', 1)
    cy.get('.notebook-record-button').shouldHaveTrimmedText('Title')
  })
})