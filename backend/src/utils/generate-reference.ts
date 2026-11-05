export const generateReference = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase()}`
