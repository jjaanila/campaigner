export const generateId = (input, prefix) => {
  return `${prefix ? `${prefix}-` : ''}${input
    .toLowerCase()
    .replaceAll(/[^\w\s]/g, '')
    .replaceAll(/\W/g, '-')}`
}
