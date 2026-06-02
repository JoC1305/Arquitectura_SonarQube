import { Link } from 'react-router-dom'
import ValidacionesDemo from '../components/ValidacionesDemo'
import '../styles/pages/Home.css'

function TestValidaciones() {
  return (
    <div className="home">
      <section className="hero">
        <h2>🧪 Test de Validaciones</h2>
        <p>Prueba aquí cómo funcionan las validaciones de reseña en tiempo real.</p>
        <Link to="/" className="btn-primary">← Volver a Home</Link>
      </section>

      <ValidacionesDemo />
    </div>
  )
}

export default TestValidaciones
