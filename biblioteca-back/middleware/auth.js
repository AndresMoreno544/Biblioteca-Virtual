// Middleware para verificar que el usuario está autenticado
export const autenticado = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Debe estar autenticado' });
  }
  next();
};

// Middleware para verificar que es administrador
export const esAdmin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Debe estar autenticado' });
  }

  if (req.session.rol !== 'admin') {
    return res.status(403).json({ message: 'No tiene permisos de administrador' });
  }

  next();
};

// Middleware para verificar que es usuario autenticado
export const esUsuario = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Debe estar autenticado' });
  }

  if (req.session.rol !== 'user') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }

  next();
};
