/*import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import '../styles/pages/Generos.css'

function Generos() {
  const [generos, setGeneros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const { data, error } = await supabase
          .from('generos')
          .select('*')
          .order('nombre')

        if (error) throw error
        setGeneros(data || [])
      } catch (err) {
        setError('Error cargando géneros: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGeneros()
  }, [])

  if (loading) return <div className="loading">Cargando géneros...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="generos">
      <h1>Géneros</h1>
      <div className="generos-grid">
        {generos.length > 0 ? (
          generos.map(genero => (
            <div key={genero.id} className="genero-card">
              <h3>{genero.nombre}</h3>
              <p>{genero.descripcion}</p>
            </div>
          ))
        ) : (
          <p>No hay géneros disponibles. Por favor, configura los géneros en Supabase.</p>
        )}
      </div>
    </div>
  )
}

export default Generos
*/