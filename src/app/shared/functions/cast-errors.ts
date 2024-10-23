// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const castErrors = (error: any): string | null => {
  if (!error.errors || error.errors.length > 0) return null

  let message: string | null = null
  Object.values(error.errors).forEach((value: unknown) =>
    (value as string[]).forEach((msg: unknown) => {
      if (msg && typeof msg === 'string') message += msg
    }),
  )

  return message
}
