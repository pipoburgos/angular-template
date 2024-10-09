import * as uuid from 'uuid'

export const generateGuid = (): string => {
  return uuid.v4()
}
