it('renders correctly', function () {
  cy.visit('http://localhost:8080/')
  cy.get('nav.toc > ol > li').should('have.length', 2)
  cy.get('nav.toc > ol > li:nth-child(1) > a.toc-part').shouldHaveTrimmedText('Creating a campaign')
  cy.get('nav.toc > ol > li:nth-child(1) > ol > li').should('have.length', 2)
  cy.get('nav.toc > ol > li:nth-child(1) > ol > li:nth-child(1) > a.toc-chapter').shouldHaveTrimmedText(
    'Getting started'
  )
  cy.get('nav.toc > ol > li:nth-child(1) > ol > li:nth-child(1) > ol > li').should('have.length', 3)
  cy.get(
    'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(1) > ol > li:nth-child(1) > a.toc-section'
  ).shouldHaveTrimmedText('Installing Campaigner')
  cy.get(
    'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(1) > ol > li:nth-child(2) > a.toc-section'
  ).shouldHaveTrimmedText('Campaign building blocks')
  cy.get(
    'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(1) > ol > li:nth-child(3) > a.toc-section'
  ).shouldHaveTrimmedText('Running Campaigner')
  cy.get('nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > a.toc-chapter').shouldHaveTrimmedText(
    'Components'
  )
  cy.get('nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > ol > li').should('have.length', 3)
  cy.get(
    'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > ol > li:nth-child(1) > a.toc-section'
  ).shouldHaveTrimmedText('read-aloud')
  cy.get(
    'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > ol > li:nth-child(2) > a.toc-section'
  ).shouldHaveTrimmedText('encounter')
  cy.get(
    'nav.toc > ol > li:nth-child(1) > ol > li:nth-child(2) > ol > li:nth-child(3) > a.toc-section'
  ).shouldHaveTrimmedText('table-of-contents')
  cy.get('nav.toc > ol > li:nth-child(2) > a.toc-part').shouldHaveTrimmedText('Resources')
})

it.only('is functional', function () {
  cy.visit('http://localhost:8080/')
  cy.get('.page').click({ force: true })
  cy.get('#show-toc-always', { timeout: 10000 }).should('be.visible')
  cy.get('#show-toc-always').uncheck()
  cy.get('.page').click({ force: true })
  cy.get('#show-toc-always', { timeout: 10000 }).should('not.exist')
  cy.get('nav.toc').click()
  cy.get('#show-toc-always', { timeout: 10000 }).should('be.visible')
  cy.get('#show-toc-always').check()
  cy.get('.toc .toc-part,.toc-chapter,.toc-section').should('have.attr', 'href')
  cy.get('.toc .toc-part,.toc-chapter,.toc-section').each($a => {
    cy.wrap($a).click()
    cy.get($a.attr('href')).should('be.visible')
  })
})
