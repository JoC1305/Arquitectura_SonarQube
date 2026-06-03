import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import '../styles/SearchBar.css'

function SearchBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ usuarios: [], juegos: [] })
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)

  // Debounce: espera 300ms sin escribir antes de buscar
  useEffect(() => {
    if (!query.trim()) {
      setResults({ usuarios: [], juegos: [] })
      return
    }

    const timer = setTimeout(() => {
      searchAll()
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const searchAll = async () => {
    setLoading(true)
    try {
      // Buscar usuarios
      const { data: usuarios } = await supabase
        .from('usuarios')
        .select('id, nombre, email')
        .ilike('nombre', `%${query}%`)
        .limit(5)

      // Buscar juegos
      const { data: juegos } = await supabase
        .from('juegos')
        .select('id, nombre')
        .ilike('nombre', `%${query}%`)
        .limit(5)

      setResults({ usuarios: usuarios || [], juegos: juegos || [] })
      setShowResults(true)
    } catch (err) {
      console.error('Error en búsqueda:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (userId) => {
    setQuery('')
    setShowResults(false)
    navigate(`/usuario/${userId}`)
  }

  const handleSelectGame = (gameId) => {
    setQuery('')
    setShowResults(false)
    navigate(`/juego/${gameId}`)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar usuarios, juegos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowResults(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setShowResults(false)
          }
        }}
        className="search-input"
      />
      
      {showResults && query && (
        <div className="search-results">
          {loading && <p className="loading">Buscando...</p>}
          
          {!loading && results.juegos.length === 0 && results.usuarios.length === 0 && (
            <p className="no-results">No hay resultados</p>
          )}

          {results.usuarios.length > 0 && (
            <div className="result-group">
              <h4>👤 Usuarios</h4>
              {results.usuarios.map(usuario => (
                <button
                  key={usuario.id}
                  type="button"
                  className="result-item"
                  onClick={() => handleSelectUser(usuario.id)}
                >
                  <strong>{usuario.nombre}</strong>
                  <small>{usuario.email}</small>
                </button>
              ))}
            </div>
          )}

          {results.juegos.length > 0 && (
            <div className="result-group">
              <h4>🎮 Juegos</h4>
              {results.juegos.map(juego => (
                <button
                  key={juego.id}
                  type="button"
                  className="result-item"
                  onClick={() => handleSelectGame(juego.id)}
                >
                  <strong>{juego.nombre}</strong>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
