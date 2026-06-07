import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { actualizarErrorEmail, validarFormatoEmail } from '../utils/validations'
import '../styles/pages/Auth.css'

function InicioSesion() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [generalError, setGeneralError] = useState(null)
  const [resetMessage, setResetMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'email') {
      setErrors(prev => actualizarErrorEmail(prev, value))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError(null)
    setResetMessage(null)

    const emailValidation = validarFormatoEmail(formData.email)
    if (!emailValidation.isValid) {
      setErrors({ email: emailValidation.errorMessage })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) throw error

      navigate('/')
    } catch (err) {
      setGeneralError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setGeneralError(null)
    setResetMessage(null)

    const emailValidation = validarFormatoEmail(formData.email)
    if (!emailValidation.isValid) {
      setErrors({ email: emailValidation.errorMessage })
      return
    }

    setResetLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${globalThis.location.origin}/restablecer-contraseña`
      })

      if (error) throw error

      setResetMessage('Se envió un correo con instrucciones para restablecer tu contraseña.')
    } catch (err) {
      setGeneralError(err.message || 'No se pudo enviar el correo de recuperación')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Iniciar Sesión</h1>
        
        {generalError && <div className="alert alert-error">{generalError}</div>}
        {resetMessage && <div className="alert alert-success">{resetMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
            />
          </div>

          <button
            type="button"
            className="text-link-button"
            onClick={handleForgotPassword}
            disabled={resetLoading}
          >
            {resetLoading ? 'Enviando...' : '¿Olvidaste tu contraseña?'}
          </button>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}

export default InicioSesion
