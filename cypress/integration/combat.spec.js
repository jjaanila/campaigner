describe('Combat', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    cy.get('[title="Add party member"]').click()
    cy.get('.character-name').clear()
    cy.get('.character-name').type('Maukka')
    cy.get('button.encounter-start-button').click()
    cy.get('.combat-overlay').should('be.visible')
    cy.get('.initiative:contains(Maukka) input').clear().type('10')
    cy.get('.combat-initialization-start-combat-button').click()
  })
  it('should open and close', () => {
    cy.get('.party').should('be.visible')
    cy.get('.menu').should('be.visible')
    cy.get('.dice-overlay').should('be.visible')
    cy.get('.toc').should('not.be.visible')
    // Opens and closes with menu button
    cy.get('.menu > .combat-overlay-open-button').click()
    cy.get('.combat-overlay').should('not.exist')
    cy.get('.menu > .combat-overlay-open-button').click()
    cy.get('.combat-overlay').should('be.visible')
    // Closes if mask is clicked
    cy.get('.combat-overlay-mask').click({ force: true })
    cy.get('.combat-overlay').should('not.exist')
  })

  it('should render units', () => {
    cy.get('.combat-turn-order .combat-character').should('have.length', 1)
    cy.get('.combat-turn-order .combat-enemy').should('have.length', 8)
    cy.get('.combat-turn-order .combat-ally').should('have.length', 1)
    cy.get('.combat-grid .combat-character').should('have.length', 1)
    cy.get('.combat-grid .combat-enemy').should('have.length', 8)
    cy.get('.combat-grid .combat-ally').should('have.length', 1)
  })

  it('should select unit in turn', () => {
    cy.get('.combat-turn-order .combat-turn-unit-container:nth-child(2) .turn-indicator.on').should(
      'be.visible'
    )
    cy.get('.combat-turn-order .combat-turn-unit-container .turn-indicator.on').should('have.length', 1)
    cy.get('.combat-turn-order .combat-turn-unit-container:nth-child(3) .turn-indicator').click()
    cy.get('.combat-turn-order .combat-turn-unit-container:nth-child(3) .turn-indicator.on').should(
      'be.visible'
    )
    cy.get('.combat-turn-order .combat-turn-unit-container:nth-child(2) .turn-indicator.on').should(
      'not.exist'
    )
    cy.get('.combat-turn-order .combat-turn-unit-container .turn-indicator.on').should('have.length', 1)
  })

  it('should move unit to new position', () => {
    cy.get('.combat-grid .combat-character')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 0, clientY: -30 })
      .trigger('mouseup')
    // TODO: Should verify that the unit was actually moved to another cell
  })

  it('should remove unit', () => {
    cy.get('.combat-grid .combat-ally').contains('Co').click()
    cy.get('.combat-grid .combat-ally.selected').contains('Co').should('be.visible')
    cy.get('.combat-turn-order .combat-ally.selected').contains('Co').should('be.visible')
    cy.get('.combat-unit-details').contains('Commoner (ally)').should('be.visible')
    cy.get('.combat-remove-units-button').click()
    cy.get('.combat-grid .combat-ally').should('not.exist')
    cy.get('.combat-turn-order .combat-ally').should('not.exist')
    cy.get('.combat-unit-details').should('not.exist')
  })
})
