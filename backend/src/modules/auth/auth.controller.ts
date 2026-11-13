import type { Request, Response } from 'express'
import { login, register, getCurrentUser, requestPasswordReset, resetPassword } from './auth.service.js'

export const loginController = async (req: Request, res: Response) => {
  const result = await login(req.body)
  if (!result) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }
  res.json({ data: result })
}

export const registerController = async (req: Request, res: Response) => {
  const result = await register(req.body)
  if (!result) {
    res.status(409).json({ error: 'An account with this email or phone number already exists' })
    return
  }
  res.status(201).json({ data: result })
}

export const meController = (req: Request, res: Response) => {
  res.json({ data: getCurrentUser(req.user) })
}

export const logoutController = (_req: Request, res: Response) => {
  res.status(204).send()
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  await requestPasswordReset(req.body.email)
  res.json({ data: { message: 'If an account exists for that email, a reset link has been sent.' } })
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const updated = await resetPassword(req.body.token, req.body.password)
  if (!updated) {
    res.status(400).json({ error: 'This reset link is invalid or has expired.' })
    return
  }
  res.json({ data: { message: 'Your password has been reset. You can now sign in.' } })
}
