import React, { useState } from 'react'
import { registerUser, loginUser } from '../lib/api.js'
import { setToken, setUser } from '../lib/auth.js'

export default function Home({ onAuthed }){
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'register'){
        const res = await registerUser({ email, password, name })
        setToken(res.token)
        setUser(res.user)
        onAuthed(res.user)
      } else {
        const res = await loginUser({ email, password })
        setToken(res.token)
        setUser(res.user)
        onAuthed(res.user)
      }
    } catch (e) {
      try {
        const msg = JSON.parse(e.message);
        setError(msg.error || 'Authentication failed');
      } catch {
        setError('Authentication failed');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>🔐 CipherStudio</h1>
        <p>Browser-based React IDE. Create files, edit code, and preview live.</p>
      </div>
      <div className="auth-card">
        <div className="tabs">
          <button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Login</button>
          <button className={mode==='register'?'active':''} onClick={()=>setMode('register')}>Register</button>
        </div>
        <form onSubmit={submit} className="auth-form">
          {mode==='register' && (
            <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <div className="error">{error}</div>}
          <button disabled={loading} type="submit">{loading ? 'Please wait…' : (mode==='register'?'Create account':'Login')}</button>
        </form>
      </div>
    </div>
  )
}
