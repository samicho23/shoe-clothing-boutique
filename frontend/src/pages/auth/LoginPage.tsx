import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/')
    } catch {
      setError('We could not sign you in. Check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return <AuthPageShell eyebrow="WELCOME BACK" title="Good to see you again." description="Sign in to continue managing your Atelier studio.">
    <form className="auth-form" onSubmit={submit}>
      <label>Email address<input required type="email" placeholder="you@atelier.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><Mail size={17} /></label>
      <label>Password<div className="password-field"><input required minLength={8} type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><LockKeyhole size={17} /></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}<ArrowRight size={17} /></button>
      <p className="auth-switch">New to Atelier? <Link to="/register">Create an account</Link></p>
    </form>
  </AuthPageShell>
}

export function AuthPageShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <main className="auth-page"><section className="auth-showcase"><div className="auth-brand"><span className="brand-mark">A</span><strong>atelier</strong></div><div className="auth-showcase-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div><div className="auth-quote"><span>“</span><p>A beautiful, thoughtful way to run the business behind your craft.</p><small>Atelier studio operations</small></div></section><section className="auth-panel"><div className="auth-panel-inner"><div className="auth-mobile-brand"><span className="brand-mark">A</span><strong>atelier</strong></div>{children}</div></section></main>
}
