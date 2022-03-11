Cypress.Commands.add(
  'shouldHaveTrimmedText',
  {
    prevSubject: true,
  },
  (subject, equalTo) => {
    if (isNaN(equalTo)) {
      expect(subject.text().trim()).to.eq(equalTo)
    } else {
      expect(parseInt(subject.text().trim())).to.eq(equalTo)
    }
    return subject
  }
)
