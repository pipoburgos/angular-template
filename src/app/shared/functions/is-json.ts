export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false
  }
  return true
}
