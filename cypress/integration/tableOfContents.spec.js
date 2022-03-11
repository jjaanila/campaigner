it('is functional', function () {
  cy.visit('http://localhost:8080/')
  cy.get('main').click({ force: true })
  cy.get('#show-toc-always').uncheck()
  cy.get('main').click({ force: true })
  cy.get('nav.toc').click()
  cy.get('#show-toc-always').check()
  cy.get('.toc .toc-part,.toc-chapter,.toc-section').should('have.attr', 'href')
  cy.get('.toc .toc-part,.toc-chapter,.toc-section').each($a => {
    cy.wrap($a).click()
    cy.get($a.attr('href')).should('be.visible')
  })
})
