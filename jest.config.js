module.exports = {
  verbose: true,
  testMatch: ['**/*.test.js'],
  moduleNameMapper: {
    '^project-root/campaign$': '<rootDir>/campaign', // Maps a Webpack alias to correct path. We should probably get rid of the alias
  },
}
