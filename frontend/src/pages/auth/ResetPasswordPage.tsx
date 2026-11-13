import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { resetPassword } from '../../features/auth/authApi'
import { AuthPageShell } from './LoginPage'

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword.length > 0

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!passwordsMatch) {
      setError('Your passwords do not match.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await resetPassword(token, form.password)
      setDone(true)
    } catch {
      setError('This reset link is invalid or has expired. Request a new one to continue.')
    } finally {
      setLoading(false)
    }
  }

  return <AuthPageShell variant="default" eyebrow="NEW PASSWORD" title="Choose a new password." description="Pick a strong password you have not used before. You will use it the next time you sign in.">
    <div className="auth-heading">
      <p className="eyebrow">RESET PASSWORD</p>
      <h2>Choose a new password</h2>
      <p>Your new password must be at least 8 characters.</p>
    </div>
    {!token ? <div className="auth-notice auth-notice-warning" role="alert">
      <strong>This link is incomplete</strong>
      <p>Open the reset link from your email again, or request a fresh one.</p>
      <Link to="/forgot-password">Request a new link</Link>
    </div> : done ? <div className="auth-notice" role="status">
      <strong>Password updated</strong>
      <p>Your password has been reset. You can now sign in with your new password.</p>
      <Link to="/login">Sign in</Link>
    </div> : <form className="auth-form" onSubmit={submit}>
      <label>New password<div className="password-field"><input required minLength={8} maxLength={128} type={showPassword ? 'text' : 'password'} placeholder="8+ characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><LockKeyhole size={17} /></label>
      <label>Confirm new password<div className="password-field"><input required minLength={8} maxLength={128} type={showPassword ? 'text' : 'password'} placeholder="Repeat password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><LockKeyhole size={17} /></label>
      {form.confirmPassword.length > 0 && <div className="password-hints"><span className={`hint ${passwordsMatch ? 'valid' : ''}`}><Check size={11} /> Passwords match</span></div>}
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={loading}>{loading ? 'Updating password…' : 'Reset password'}<ArrowRight size={17} /></button>
      <p className="auth-switch">Remembered it? <Link to="/login">Back to sign in</Link></p>
    </form>}
  </AuthPageShell>
}
