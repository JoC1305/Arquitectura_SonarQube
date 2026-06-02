import { Link } from 'react-router-dom'
import '../styles/pages/Home.css'

function Home() {
  const featuredGames = [
    {
      id: 1,
      title: 'Elden Ring',
      description: 'Obra maestra. Una experiencia épica para amantes de mundos abiertos y retos de combate.'
    },
    {
      id: 2,
      title: 'Hades',
      description: 'Muy recomendable. Acción trepidante con narrativa atrapante.'
    },
    {
      id: 3,
      title: 'No Man\'s Sky',
      description: 'Actualmente el mejor juego de Exploración Espacial. Gran evolución con el tiempo.'
    }
  ]

  return (
    <div className="home">
      
      <section className="hero">
        <h2>La reseña que sientes, no que puntúas 🎮</h2>
        <p>Descubre experiencias reales de jugadores como tú, sin números, sin engaños, solo emociones.</p>
        <Link to="/reseñas-recientes" className="btn-primary">Ver Reseñas</Link>
      </section>

      <section className="destacados">
        <h3>Juegos Destacados</h3>
        <div className="featured-games">
          {featuredGames.map(game => (
            <article key={game.id} className="game-card">
              <h4>{game.title}</h4>
              <p>{game.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
