import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Brain, Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@pricesmart.ai')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (res.success) {
      navigate('/')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-aiGreen to-aiPurple flex items-center justify-center mb-4 shadow-glow">
            <Brain size={28} className="text-navy-950" />
          </div>
          <h1 className="text-2xl font-bold text-white">PriceSmart AI</h1>
          <p className="text-slate-400 text-sm">Dynamic Pricing Control Center</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="admin@pricesmart.ai"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-xs text-slate-500 text-center pt-2">
            Demo credentials: <span className="text-slate-300">admin@pricesmart.ai / admin123</span>
          </p>
        </form>
      </div>
    </div>
  )
}
