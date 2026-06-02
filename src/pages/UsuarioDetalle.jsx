import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import '../styles/pages/Perfil.css'

function UsuarioDetalle() {
  const { id } = useParams()
  const [perfil, setPerfil] = useState(null)
  const [reseñas, setReseñas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        // Obtener datos del perfil
        const { data: profileData, error: profileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', id)
          .single()

        if (profileError) throw profileError
        setPerfil(profileData)

        // Obtener reseñas del usuario
        const { data: resenaData, error: resenaError } = await supabase
          .from('resenas')
          .select('*, juegos(nombre)')
          .eq('usuario_id', id)
          .order('created_at', { ascending: false })

        if (resenaError) throw resenaError
        setReseñas(resenaData || [])
      } catch (err) {
        setError('Error cargando perfil: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPerfil()
  }, [id])

  if (loading) return <div className="loading">Cargando perfil...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="perfil">
      <h1>Perfil de usuario</h1>
      
      {perfil && (
        <section className="perfil-info">
          <h2>{perfil.nombre}</h2>
          <p className="email">{perfil.email}</p>
          {perfil.bio && <p className="bio">{perfil.bio}</p>}
        </section>
      )}

      <section className="mis-resenas">
        <h3>Reseñas ({reseñas.length})</h3>
        {reseñas.length > 0 ? (
          <div className="resenas-list">
            {reseñas.map(resena => (
              <article key={resena.id} className="resena-card">
                <h4>{resena.juegos?.nombre || 'Juego desconocido'}</h4>
                <p className="fecha">{new Date(resena.created_at).toLocaleDateString('es-ES')}</p>
                <p className="comentario">{resena.comentario}</p>
              </article>
            ))}
          </div>
        ) : (
          <p>No ha publicado reseñas aún.</p>
        )}
      </section>
    </div>
  )
}

export default UsuarioDetalle