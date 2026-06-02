import '../styles/pages/Acerca.css'

function Acerca() {
  return (
    <div className="acerca">
      <h1>Acerca de GamesGauges</h1>
      
      <section className="mision">
        <h2>Nuestra Misión</h2>
        <p>
          GamesGauges es una plataforma dedicada a las reseñas emocionales de videojuegos.
          Creemos que la mejor forma de describir una experiencia de juego no es mediante números,
          sino mediante sentimientos y emociones genuinas de los jugadores.
        </p>
      </section>

      <section className="caracteristicas">
        <h2>Características</h2>
        <ul>
          <li>Reseñas basadas en emociones, no en números</li>
          <li>Comunidad de jugadores apasionados</li>
          <li>Descubre géneros y juegos nuevos</li>
          <li>Comparte tus experiencias de juego</li>
          <li>Conecta con otros jugadores</li>
        </ul>
      </section>

      <section className="contacto">
        <h2>Contacto</h2>
        <p>¿Preguntas o sugerencias? Contáctanos en:</p>
        <p><strong>Email:</strong> info@gamesgauges.com</p>
      </section>
    </div>
  )
}

export default Acerca
