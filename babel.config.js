module.exports = api => {
  const isTest = api.env('test')
  api.cache(false)
  return { presets: [['@babel/preset-env', { targets: isTest ? { node: 'current' } : '> 0.25%, not dead' }]] }
}
