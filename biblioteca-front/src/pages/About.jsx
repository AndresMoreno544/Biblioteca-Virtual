import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/About.css';

function About() {
  const { isDark } = useTheme();

  return (
    <div className={`about-container ${isDark ? 'dark' : 'light'}`}>
      <div className="about-content">
        <h1>Quiénes Somos</h1>
        
        <section className="about-section">
          <h2>Nuestra Misión</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </section>

        <section className="about-section">
          <h2>Nuestra Historia</h2>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>
        </section>

        <section className="about-section">
          <h2>Nuestro Compromiso</h2>
          <p>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
          </p>
          <p>
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut quid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
          </p>
        </section>

        <section className="about-section">
          <h2>Contacto</h2>
          <p>
            Si tienes alguna pregunta o sugerencia, no dudes en comunicarte con nosotros. Estamos aquí para ayudarte a encontrar el libro perfecto para ti.
          </p>
        </section>
      </div>

      <div className="about-highlight">
        <div className="highlight-card">
          <h3>📚 Libros</h3>
          <p>Amplia colección de títulos clásicos y modernos</p>
        </div>
        <div className="highlight-card">
          <h3>🎯 Accesibilidad</h3>
          <p>Acceso fácil a información sobre disponibilidad</p>
        </div>
        <div className="highlight-card">
          <h3>💡 Comunidad</h3>
          <p>Únete a nuestra comunidad de lectores apasionados</p>
        </div>
      </div>
    </div>
  );
}

export default About;
