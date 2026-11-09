import type { Request, Response } from 'express'
import { login, register, getCurrentUser } from './auth.service.js'

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
    res.status(409).json({ error: 'An account with this email already exists' })
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
