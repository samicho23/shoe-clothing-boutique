import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Chrome, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { AuthPageShell } from './LoginPage'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
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
      await register({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email, phoneNumber: form.phoneNumber.trim(), password: form.password })
      navigate('/')
    } catch {
      setError('This email or phone number may already be registered. Try signing in instead.')
    } finally {
      setLoading(false)
    }
  }

  return <AuthPageShell variant="register" eyebrow="START YOUR JOURNEY" title="Build something beautiful." description="Create your workspace and bring every part of your boutique together.">
    <div className="register-heading"><h2>Create your account</h2><p>Set up your boutique workspace in less than two minutes.</p></div>
    <form className="auth-form" onSubmit={submit}>
      <button className="register-google" type="button"><Chrome size={17} />Continue with Google</button>
      <div className="register-divider"><span>OR USE YOUR EMAIL</span></div>
      <div className="register-form-grid">
        <label>First name<input required minLength={1} maxLength={40} placeholder="Elena" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} /></label>
        <label>Last name<input required minLength={1} maxLength={40} placeholder="Morgan" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} /></label>
        <label className="register-full">Work email<input required type="email" placeholder="elena@yourboutique.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label className="register-full">Phone number<input required type="tel" inputMode="tel" minLength={7} maxLength={30} placeholder="+251 911 234 567" value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} /></label>
        <label>Password<div className="password-field"><input required minLength={8} maxLength={128} type={showPassword ? 'text' : 'password'} placeholder="8+ characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
        <label>Confirm password<div className="password-field"><input required type={showPassword ? 'text' : 'password'} placeholder="Repeat password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /></div></label>
      </div>
      <label className="register-terms"><input type="checkbox" required checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /><span><Check size={11} /></span>I agree to Luma’s <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={loading}>{loading ? 'Creating workspace…' : 'Create my account'}<ArrowRight size={17} /></button>
      <p className="register-footnote">No credit card required · 14-day free trial</p>
    </form>
  </AuthPageShell>
}
