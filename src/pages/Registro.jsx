import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { validarFormatoEmail, validarPasswordCompleja, validarConfirmacionClave } from '../utils/validations'
import '../styles/pages/Auth.css'

function Registro() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Validación en tiempo real
    let newErrors = { ...errors }
    if (name === 'email') {
      const validation = validarFormatoEmail(value)
      if (validation.isValid) {
        delete newErrors.email
      } else {
        newErrors.email = validation.errorMessage
      }
    }
    if (name === 'password') {
      const validation = validarPasswordCompleja(value)
      if (validation.isValid) {
        delete newErrors.password
      } else {
        newErrors.password = validation.errorMessage
      }
    }
    if (name === 'confirmPassword') {
      const validation = validarConfirmacionClave(formData.password, value)
      if (validation.isValid) {
        delete newErrors.confirmPassword
      } else {
        newErrors.confirmPassword = validation.errorMessage
      }
    }
    setErrors(newErrors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError(null)

    // Validación final
    let validationErrors = {}
    const emailValidation = validarFormatoEmail(formData.email)
    if (!emailValidation.isValid) validationErrors.email = emailValidation.errorMessage

    const passwordValidation = validarPasswordCompleja(formData.password)
    if (!passwordValidation.isValid) validationErrors.password = passwordValidation.errorMessage

    const confirmValidation = validarConfirmacionClave(formData.password, formData.confirmPassword)
    if (!confirmValidation.isValid) validationErrors.confirmPassword = confirmValidation.errorMessage

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      })

      if (authError) throw authError

      // Crear perfil de usuario
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: authData.user.id,
            nombre: formData.nombre,
            email: formData.email
          }
        ])

      if (profileError) throw profileError

      alert('¡Registro exitoso! Por favor, verifica tu email para confirmar tu cuenta.')
      navigate('/inicio-sesion')
    } catch (err) {
      setGeneralError(err.message || 'Error durante el registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Crear Cuenta</h1>
        
        {generalError && <div className="alert alert-error">{generalError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de usuario:</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre de usuario"
              required
            />
          </div>

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
              placeholder="Mínimo 6 caracteres, mayúscula y número"
              required
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/inicio-sesion">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  )
}

export default Registro
