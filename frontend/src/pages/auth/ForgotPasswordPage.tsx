import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import { forgotPassword } from '../../features/auth/authApi'
import { AuthPageShell } from './LoginPage'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch {
      setError('We could not send the reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <AuthPageShell variant="default" eyebrow="PASSWORD RESET" title="Forgot your password?" description="Enter the email tied to your boutique account and we will send you a secure link to choose a new password.">
    <div className="auth-heading">
      <p className="eyebrow">RESET PASSWORD</p>
      <h2>Forgot password?</h2>
      <p>We will email you a link to reset it.</p>
    </div>
    {sent ? <div className="auth-notice" role="status">
      <strong>Check your inbox</strong>
      <p>If an account exists for {email}, a reset link is on its way. The link expires in one hour.</p>
      <Link to="/login">Back to sign in</Link>
    </div> : <form className="auth-form" onSubmit={submit}>
      <label>Email address<input required type="email" placeholder="you@boutique.com" value={email} onChange={(event) => setEmail(event.target.value)} /><Mail size={17} /></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" disabled={loading}>{loading ? 'Sending link…' : 'Send reset link'}<ArrowRight size={17} /></button>
      <p className="auth-switch"><Link to="/login"><ArrowLeft size={12} /> Back to sign in</Link></p>
    </form>}
  </AuthPageShell>
}
