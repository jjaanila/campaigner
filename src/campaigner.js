#!/usr/bin/env node

'use strict'

const cp = require('child_process')
const path = require('path')

const rootDir = path.join(__dirname, '..')

if (process.argv[2] === 'start') {
  cp.execSync(`npm start`, {
    cwd: rootDir,
    stdio: 'inherit',
  })
}

if (process.argv[2] === 'build') {
  cp.execSync(`npm run build`, {
    cwd: rootDir,
    stdio: 'inherit',
  })
}
