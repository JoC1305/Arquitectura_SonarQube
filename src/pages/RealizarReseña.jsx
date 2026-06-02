import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { validarResena } from '../utils/validations'
import '../styles/pages/RealizarReseña.css'

function RealizarReseña() {
  const navigate = useNavigate()
  const [juegos, setJuegos] = useState([])
  const [formData, setFormData] = useState({
    juego_id: '',
    comentario: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState(null)

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const { data, error } = await supabase
          .from('juegos')
          .select('id, nombre')
          .order('nombre')

        if (error) throw error
        setJuegos(data || [])
      } catch (err) {
        setError('Error cargando juegos: ' + err.message)
      }
    }

    fetchJuegos()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Validación en tiempo real
    if (name === 'comentario') {
      const validation = validarResena(value, 5, 50)
      if (validation.isValid) {
        setValidationError(null)
      } else {
        setValidationError(validation.errorMessage)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validar comentario
    const validation = validarResena(formData.comentario, 5, 50)
    if (!validation.isValid) {
      setValidationError(validation.errorMessage)
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Debes iniciar sesión para crear una reseña')
        return
      }

      const { error } = await supabase
        .from('resenas')
        .insert([
          {
            usuario_id: user.id,
            juego_id: formData.juego_id,
            calificacion: formData.satisfaccion,
            comentario: formData.comentario
          }
        ])

      if (error) throw error

      setSuccess(true)
      setFormData({ juego_id: '', calificacion: '',comentario: '' })
      setTimeout(() => navigate('/reseñas-recientes'), 2000)
    } catch (err) {
      setError('Error al publicar reseña: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="realizar-resena">
      <h1>Realizar Reseña</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">¡Reseña publicada con éxito!</div>}

      <form onSubmit={handleSubmit} className="form-resena">
        <div className="form-group">
          <label htmlFor="juego_id">Selecciona el juego:</label>
          <select
            id="juego_id"
            name="juego_id"
            value={formData.juego_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona un juego --</option>
            {juegos.map(juego => (
              <option key={juego.id} value={juego.id}>
                {juego.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="satisfaccion">Nivel de satisfacción: </label>
          <select
            id="satisfaccion"
            name="satisfaccion"
            value={formData.satisfaccion}
            onChange={handleChange}
            required
          >
            <option value="">-- Califica el juego --</option>
            <option>Obra maestra</option>
            <option>Muy recomendable</option>
            <option>Entretenido pero mejorable</option>
            <option>Solo para fans</option>
            <option>No lo recomiendo</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comentario">Tu Reseña (5-50 palabras):</label>
          <textarea
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
            placeholder="Cuéntanos qué sentiste jugando este juego..."
            required
          />
          {validationError && <div className="error-text">{validationError}</div>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Publicando...' : 'Publicar Reseña'}
        </button>
      </form>
    </div>
  )
}

export default RealizarReseña
