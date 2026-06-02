import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import '../styles/pages/Juego.css'


function JuegoDetalle() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [juego, setJuego] = useState(null)
  const [reseñas, setReseñas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJuego = async () => {
      try {
        // datos del juego
        const { data: juegoData, error: juegoError } = await supabase
          .from('juegos')
          .select('*')
          .eq('id', id)
          .single()

        if (juegoError) throw juegoError
        setJuego(juegoData)

        // reseñas del usuario
        const { data: resenaData, error: resenaError } = await supabase
          .from('resenas')
          .select('*, juegos(nombre)')
          .eq('juego_id', id)
          .order('created_at', { ascending: false })

        if (resenaError) throw resenaError
        setReseñas(resenaData || [])
      } catch (err) {
        setError('Error cargando juego: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchJuego()
  }, [id])
  function hacerReseña(){
    navigate('/realizar-reseña');
  }
  if (loading) return <div className="loading">Cargando juego...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="perfil">
      <img src={juego.cover_url} alt="Banner del juego" className="juego-banner" />
      <h1>Descripción del juego</h1>
      
      {juego && (
        <section className="juego-info">
          <h2>{juego.nombre}</h2>
          <p className="desarrollador">{juego.desarrollador}</p>
          <p className="lanzamiento">{juego.año_lanzamiento}</p>
          {juego.descripcion && <p className="descripcion">{juego.descripcion}</p>}
        </section>
      )}

      <section className="resenas">
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
          <p>No se ha reseñado aún.</p>
        )}
      </section>
      <section className='Reseñar'>
        <button class='reseña-btn' onClick={hacerReseña}>Realizar Reseña</button>
      </section>
    </div>
  )
}

export default JuegoDetalle