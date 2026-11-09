import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { AuthPageShell } from './LoginPage'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const passwordReady = form.password.length >= 8
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
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/')
    } catch {
      setError('This email may already be registered. Try signing in instead.')
    } finally {
      setLoading(false)
    }
  }

  return <AuthPageShell eyebrow="START YOUR JOURNEY" title="Build something beautiful." description="Create your workspace and bring every part of your boutique together.">
    <div className="auth-heading"><p className="eyebrow">CREATE ACCOUNT</p><h2>Join Atelier</h2><p>Set up your studio workspace in a few seconds.</p></div>
    <form className="auth-form" onSubmit={submit}>
      <label>Full name<div className="auth-input"><input required minLength={2} maxLength={80} placeholder="Jordan Smith" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><UserRound size={17} /></div></label>
      <label>Email address<div className="auth-input"><input required type="email" placeholder="you@atelier.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><Mail size={17} /></div></label>
      <label>Password<div className="password-field"><input required minLength={8} maxLength={128} type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><LockKeyhole size={17} /></label>
      <label>Confirm password<div className="auth-input"><input required type={showPassword ? 'text' : 'password'} placeholder="Repeat your password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /><LockKeyhole size={17} /></div></label>
      <div className="password-hints"><span className={passwordReady ? 'hint valid' : 'hint'}><Check size={13} />At least 8 characters</span><span className={passwordsMatch ? 'hint valid' : 'hint'}><Check size={13} />Passwords match</span></div>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={loading}>{loading ? 'Creating workspace…' : 'Create account'}<ArrowRight size={17} /></button>
      <p className="auth-terms">By continuing, you agree to Atelier’s terms and privacy policy.</p>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </form>
  </AuthPageShell>
}
