import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Books from "./pages/Books";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import "./App.css";

// Componente para proteger rutas de admin
function ProtectedRoute({ children }) {
  const { esAdmin, loading } = useAuth();
  
  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando...</div>;
  }
  
  return esAdmin() ? children : <Navigate to="/auth" replace />;
}

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? "dark-mode" : "light-mode"}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;