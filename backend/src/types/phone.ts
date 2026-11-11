export const phonePattern = /^\+?[1-9]\d{7,14}$/

export const isPhoneNumber = (value: string): boolean => phonePattern.test(value.trim())
