export const generateId = (input, prefix) => {
  return `${prefix ? `${prefix}-` : ''}${input
    .toLowerCase()
    .replaceAll(/[^\w\s]/g, '')
    .replaceAll(/\W/g, '-')}`
}

export const capitalize = string => {
  return string[0].toUpperCase() + string.substring(1)
}
