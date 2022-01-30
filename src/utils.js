export const generateId = (input, prefix) => {
  return `${prefix ? `${prefix}-` : ''}${input
    .toLowerCase()
    .replaceAll(/[^\w\s]/g, '')
    .replaceAll(/\W/g, '-')}`
}

export const capitalize = string => {
  return string[0].toUpperCase() + string.substring(1)
}

export const sortByKey = (array, key) => {
  return array.sort((a, b) => {
    return a[key].toLowerCase() < b[key].toLowerCase() ? -1 : a[key].toLowerCase() > b[key].toLowerCase() ? 1 : 0
  })
}
