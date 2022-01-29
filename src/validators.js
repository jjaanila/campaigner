export function isInteger(candidate) {
  if (!Number.isInteger(candidate)) {
    throw new Error(`${candidate} (of type ${typeof candidate}) wasn't an integer!`)
  }
}
