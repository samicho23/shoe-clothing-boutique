export const pagination = (pageValue: unknown, limitValue: unknown) => {
  const page = Math.max(Number(pageValue) || 1, 1)
  const limit = Math.min(Math.max(Number(limitValue) || 20, 1), 100)
  return { page, limit, skip: (page - 1) * limit }
}
