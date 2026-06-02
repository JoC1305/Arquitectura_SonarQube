import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import '../styles/pages/Perfil.css'

function Perfil({ user }) {
  const [perfil, setPerfil] = useState(null)
  const [reseñas, setReseñas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        //datos del perfil
        const { data: profileData, error: profileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setPerfil(profileData)

        // reseñas del usuario
        const { data: resenaData, error: resenaError } = await supabase
          .from('resenas')
          .select('*, juegos(nombre)')
          .eq('usuario_id', user.id)
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
  }, [user.id])

  async function handleDeleteResena(id) {
    if (!confirm('¿Eliminar reseña? Esta acción no puede deshacerse.')) return;

    
    const prev = reseñas;
    setReseñas(prev.filter(r => r.id !== id));

    try {
      const { error } = await supabase.from('resenas').delete().eq('id', id);
      if (error) throw error;
      
    } catch (err) {
      
      setReseñas(prev);
      alert('No se pudo eliminar la reseña: ' + (err.message || err));
    }
  }

  if (loading) return <div className="loading">Cargando perfil...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="perfil">
      <h1>Mi Perfil</h1>
      
      {perfil && (
        <section className="perfil-info">
          <h2>{perfil.nombre}</h2>
          <p className="email">{user.email}</p>
          {perfil.bio && <p className="bio">{perfil.bio}</p>}
        </section>
      )}

      <section className="mis-resenas">
        <h3>Mis Reseñas ({reseñas.length})</h3>
        {reseñas.length > 0 ? (
          <div className="resenas-list">
            {reseñas.map(resena => (
              <article key={resena.id} className="resena-card">
                <h4>{resena.juegos?.nombre || 'Juego desconocido'}</h4>
                <p className="fecha">{new Date(resena.created_at).toLocaleDateString('es-ES')}</p>
                <p className="comentario">{resena.comentario}</p>
                <button className="delete-button" onClick={() => handleDeleteResena(resena.id)}>Eliminar Reseña</button>
              </article>
            ))}
          </div>
        ) : (
          <p>No has publicado reseñas aún.</p>
        )}
      </section>
    </div>
  )
}

export default Perfil
