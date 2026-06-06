"use client"
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await signIn('credentials', { redirect: false, email, password })
    setLoading(false)
    if (res?.error) {
      setError('Invalid email or password')
      return
    }
    router.push('/admin')
  }

  return (
    <main className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-md card p-8">
        <h1 className="text-2xl font-bold mb-6">Sign in</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input className="mt-1 w-full border rounded-md p-2" type="email" placeholder="you@icthubs.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input className="mt-1 w-full border rounded-md p-2" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Signing in…' : 'Continue'}</button>
        </form>
        <p className="text-sm text-slate-500 mt-4">Admin access only</p>
        <div className="text-xs text-slate-400 mt-1">Forgot password? Contact your administrator</div>
        <div className="mt-6 text-sm"><Link className="text-brand-green" href="/">Back</Link></div>
      </div>
    </main>
  )
}
