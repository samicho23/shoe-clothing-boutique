import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight, Check, Chrome, Facebook } from 'lucide-react'
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

  return <AuthPageShell variant="login" eyebrow="WELCOME BACK" title="Welcome back." description="Sign in to continue managing your boutique studio.">
    <form className="auth-form" onSubmit={submit}>
      <label>Email address<input required type="email" placeholder="you@boutique.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><Mail size={17} /></label>
      <label>Password<div className="password-field"><input required minLength={8} type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div><LockKeyhole size={17} /></label>
      <div className="login-options"><label className="remember-me"><input type="checkbox" /><span><Check size={11} /></span>Remember me</label><button type="button" className="forgot-password">Forgot password?</button></div>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}<ArrowRight size={17} /></button>
      <div className="login-divider"><span>Or login with</span></div>
      <div className="social-login"><button type="button"><Chrome size={14} />Google</button><button type="button"><Facebook size={14} />Facebook</button></div>
      <p className="auth-switch">Don’t have an account? <Link to="/register">Create one</Link></p>
    </form>
  </AuthPageShell>
}

export function AuthPageShell({ variant = 'default', eyebrow, title, description, children }: { variant?: 'login' | 'register' | 'default'; eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <main className={`auth-page ${variant === 'login' ? 'auth-login-page' : ''} ${variant === 'register' ? 'auth-register-page' : ''}`}>{variant === 'register' && <p className="register-top-switch">Already have an account? <Link to="/login">Sign in</Link></p>}<section className="auth-showcase"><div className="auth-brand"><span className="brand-mark">A</span><strong>boutique</strong></div>{variant === 'login' ? <div className="login-promo"><div className="promo-copy"><strong>Simplify<br />management with<br />our dashboard.</strong><small>Manage your boutique with ease.</small></div><div className="promo-figures"><span className="figure figure-one" /><span className="figure figure-two" /></div></div> : variant === 'register' ? <div className="register-promo"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p><div className="register-benefits"><span><b>01</b><strong>One calm workspace</strong><small>Products, sales, and stock in one place.</small></span><span><b>02</b><strong>Built for your rhythm</strong><small>Simple tools that grow with your boutique.</small></span></div></div> : <><div className="auth-showcase-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div><div className="auth-quote"><span>“</span><p>A beautiful, thoughtful way to run the business behind your craft.</p><small>boutique studio operations</small></div></>}</section><section className="auth-panel"><div className="auth-panel-inner"><div className="auth-mobile-brand"><span className="brand-mark">A</span><strong>boutique</strong></div>{variant === 'login' && <div className="login-heading"><span className="mini-logo">A</span><h2>Welcome Back</h2><p>Sign in to your account</p></div>}{children}</div></section></main>
}
