import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './services/supabaseClient'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Juegos from './pages/Juegos'
import JuegoDetalle from './pages/JuegoDetalle'
/*import Generos from './pages/Generos'*/
import ReseñasRecientes from './pages/ReseñasRecientes'
import RealizarReseña from './pages/RealizarReseña'
import Perfil from './pages/Perfil'
import UsuarioDetalle from './pages/UsuarioDetalle'
import Acerca from './pages/Acerca'
import InicioSesion from './pages/InicioSesion'
import Registro from './pages/Registro'
import TestValidaciones from './pages/TestValidaciones'
import './styles/App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        console.log('🔐 Verificando sesión de Supabase...')
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Error de sesión:', sessionError)
          throw sessionError
        }
        
        if (mounted) {
          setUser(session?.user || null)
          console.log('✅ Sesión verificada')
        }
      } catch (err) {
        console.error('Error:', err)
        if (mounted) {
          setError(`Error de conexión: ${err.message}`)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    try {
      console.log('👂 Configurando listener...')
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('📍 Auth cambió:', event)
          if (mounted) {
            setUser(session?.user || null)
          }
        }
      )

      initAuth()

      return () => {
        mounted = false
        if (subscription?.unsubscribe) {
          subscription.unsubscribe()
        }
      }
    } catch (err) {
      console.error('Error en auth:', err)
      if (mounted) {
        setError(`Error: ${err.message}`)
        setLoading(false)
      }
    }
  }, [])

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#fee2e2',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>❌ Error</h2>
          <p style={{ color: '#666', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
            {error}
          </p>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>
            Abre la consola (F12) para detalles
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>⏳ Cargando...</h2>
          <p style={{ color: '#666' }}>GamesGauges</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Header user={user} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/juegos" element={<Juegos />} />
            <Route path="/juego/:id" element={<JuegoDetalle />} />
            <Route path="/reseñas-recientes" element={<ReseñasRecientes />} />
            <Route path="/realizar-reseña" element={user ? <RealizarReseña /> : <Navigate to="/inicio-sesion" />} />
            <Route path="/perfil" element={user ? <Perfil user={user} /> : <Navigate to="/inicio-sesion" />} />
            <Route path="/usuario/:id" element={<UsuarioDetalle />} />
            <Route path="/acerca" element={<Acerca />} />
            <Route path="/test-validaciones" element={<TestValidaciones />} />
            <Route path="/inicio-sesion" element={user ? <Navigate to="/" /> : <InicioSesion />} />
            <Route path="/registro" element={user ? <Navigate to="/" /> : <Registro />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
