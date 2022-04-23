function terminalLog(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} ${
      violations.length === 1 ? 'was' : 'were'
    } detected`
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(({ impact, description, nodes }) => ({
    impact,
    description,
    nodes,
  }))

  cy.task('table', violationData)
}

describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    cy.injectAxe()
  })

  it('should not be violated', () => {
    // Test the page at initial load
    cy.checkA11y(null, null, terminalLog)
  })
})
