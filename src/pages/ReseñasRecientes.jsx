import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import '../styles/pages/ReseñasRecientes.css'

function ReseñasRecientes() {
  const [reseñas, setReseñas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReseñas = async () => {
      try {
        const { data, error } = await supabase
          .from('resenas')
          .select('*, usuarios(nombre), juegos(nombre)')
          .order('created_at', { ascending: false })

        if (error) throw error
        setReseñas(data || [])
      } catch (err) {
        setError('Error cargando reseñas: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReseñas()
  }, [])

  if (loading) return <div className="loading">Cargando reseñas...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="resenas-recientes">
      <h1>Reseñas Recientes</h1>
      <div className="resenas-list">
        {reseñas.length > 0 ? (
          reseñas.map(resena => (
            <article key={resena.id} className="resena-card">
              <h3>{resena.juegos?.nombre || 'Juego desconocido'}</h3>
              <p className="autor">Por {resena.usuarios?.nombre || 'Usuario desconocido'}</p>
              <p className="fecha">{new Date(resena.created_at).toLocaleDateString('es-ES')}</p>
              <p className="comentario">{resena.comentario}</p>
            </article>
          ))
        ) : (
          <p>No hay reseñas disponibles aún.</p>
        )}
      </div>
    </div>
  )
}

export default ReseñasRecientes
