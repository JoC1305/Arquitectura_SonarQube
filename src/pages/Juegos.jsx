import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import '../styles/pages/Juegos.css'

function Juegos() {
  const navigate = useNavigate()
  const [juegos, setJuegos] = useState([])
  const [generos, setGeneros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedGenero, setSelectedGenero] = useState(null)
  const [filteredJuegos, setFilteredJuegos] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar géneros
        const { data: generosData, error: generosError } = await supabase
          .from('generos')
          .select('*')
          .order('nombre')

        if (generosError) throw generosError
        setGeneros(generosData || [])

        // Cargar juegos
        const { data: juegosData, error: juegosError } = await supabase
          .from('juegos')
          .select('*')
          .order('nombre')

        if (juegosError) throw juegosError
        setJuegos(juegosData || [])
        setFilteredJuegos(juegosData || [])
      } catch (err) {
        setError('Error cargando datos: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar juegos por género
  useEffect(() => {
    if (!selectedGenero) {
      setFilteredJuegos(juegos)
      return
    }

    const filterByGenero = async () => {
      try {
        
        const { data, error } = await supabase
          .from('juego_genero')
          .select('juego_id')
          .eq('genero_id', selectedGenero)

        if (error) throw error

        const juegoIds = data.map(item => item.juego_id)
        const filtered = juegos.filter(juego => juegoIds.includes(juego.id))
        setFilteredJuegos(filtered)
      } catch (err) {
        console.error('Error filtrando por género:', err)
        setFilteredJuegos([])
      }
    }

    filterByGenero()
  }, [selectedGenero, juegos])

    const handleSelectGame = (gameId) => {
        navigate(`/juego/${gameId}`)
  }


  if (loading) return <div className="loading">Cargando juegos...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="juegos">
      <h1>Juegos</h1>
      
      <div className="filtros">
        <h3>Filtrar por género:</h3>
        <div className="generos-buttons">
          <button
            className={`genero-btn ${selectedGenero ? '' : 'active'}`}
            onClick={() => setSelectedGenero(null)}
          >
            Todos los géneros
          </button>
          {generos.map(genero => (
            <button
              key={genero.id}
              className={`genero-btn ${selectedGenero === genero.id ? 'active' : ''}`}
              onClick={() => setSelectedGenero(genero.id)}
            >
              {genero.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="juegos-grid">
        {filteredJuegos.length > 0 ? (
          filteredJuegos.map(juego => (
            <div key={juego.id} className="juego-card">
              {juego.cover_url && (
                <button className="portada-container" onClick={() => handleSelectGame(juego.id)}>
                  <img 
                    src={juego.cover_url} 
                    alt={juego.nombre}
                    className="portada-img"
                  />
                </button>
              )}
              <button className="juego-info" onClick={() => handleSelectGame(juego.id)}>
                <h3>{juego.nombre}</h3>
                <p>{juego.descripcion || 'Sin descripción disponible'}</p>
                {juego.desarrollador && <p className="desarrollador">Por: {juego.desarrollador}</p>}
                {juego.año_lanzamiento && <p className="year">Año: {juego.año_lanzamiento}</p>}
              </button>
            </div>
          ))
        ) : (
          <p>No hay juegos disponibles para este género.</p>
        )}
      </div>
    </div>
  )
}

export default Juegos
