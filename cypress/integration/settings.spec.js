describe('Settings', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
  })

  it('should hide ToC, Party and Dice and show them again', () => {
    cy.get('.menu [title="Settings"]').click()
    cy.get('#hide-table-of-contents').click()
    cy.get('nav.toc').should('not.exist')
    cy.get('#hide-party').click()
    cy.get('.party').should('not.exist')
    cy.get('#hide-dice').click()
    cy.get('.dice-overlay').should('not.exist')

    cy.get('#hide-table-of-contents').click()
    cy.get('nav.toc').should('be.visible')
    cy.get('#hide-party').click()
    cy.get('.party').should('be.visible')
    cy.get('#hide-dice').click()
    cy.get('.dice-overlay').should('be.visible')

    cy.get('.page').click({ force: true })
    cy.get('#hide-table-of-contents').should('not.exist')
  })
})
