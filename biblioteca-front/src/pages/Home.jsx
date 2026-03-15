import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/Home.css';

function Home() {
    const { isDark } = useTheme();

    return (
        <div className={`home-container ${isDark ? 'dark' : 'light'}`}>
            <div className="content">
                <h1>📚 Bienvenido a la Biblioteca Virtual</h1>
                <p className="subtitle">
                    Explora nuestra extensa colección de libros clásicos y modernos
                </p>
                <p className="description">
                    Descubre títulos fascinantes, lee sinopsis detalladas y solicita los libros que más te interesen.
                </p>
                <Link to="/books">
                    <button className="primary-btn">
                        Explorar Biblioteca →
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
