import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import SearchBar from './SearchBar'
import '../styles/Header.css'

function Header({ user }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="../assets/imgs/logo.png" alt="Logo GamesGauges" />
          <span>GamesGauges</span>
        </Link>
        <SearchBar />
        <nav className="navigation">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/juegos">Juegos</Link></li>
            <li><Link to="/reseñas-recientes">Reseñas Recientes</Link></li>
            {user && <li><Link to="/realizar-reseña">Realizar Reseña</Link></li>}
            {user && <li><Link to="/perfil">Perfil</Link></li>}
            <li><Link to="/acerca">Acerca</Link></li>
            {user ? (
              <li>
                <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
              </li>
            ) : (
              <>
                <li><Link to="/inicio-sesion">Iniciar Sesión</Link></li>
                <li><Link to="/registro">Registro</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
