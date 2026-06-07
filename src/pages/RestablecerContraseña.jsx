import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import '../styles/pages/Auth.css'

function RestablecerContraseña() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    let mounted = true

    const verifyRecoverySession = async () => {
      try {
        const params = new URLSearchParams(globalThis.location.search)
        const hashParams = new URLSearchParams(globalThis.location.hash.replace(/^#/, ''))
        const tokenHash = params.get('token_hash') || hashParams.get('token_hash')
        const type = params.get('type') || hashParams.get('type')
        const code = params.get('code') || hashParams.get('code')

        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type })
          if (error) throw error
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (mounted) {
          setReady(Boolean(session?.user))
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'No se pudo validar el enlace de recuperación')
        }
      }
    }

    verifyRecoverySession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || session?.user)) {
        setReady(Boolean(session?.user))
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe?.()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      setMessage('Contraseña actualizada correctamente. Ya puedes iniciar sesión.')
      setTimeout(() => navigate('/inicio-sesion'), 1800)
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Restablecer contraseña</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {ready ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">Nueva contraseña:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña:</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Actualizando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        ) : (
          <p className="auth-link">Abre el enlace del correo de recuperación para continuar.</p>
        )}

        <p className="auth-link">
          <Link to="/inicio-sesion">Volver a iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default RestablecerContraseña
