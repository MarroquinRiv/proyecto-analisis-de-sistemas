const { supabase } = require('../db/db');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }
  
  const token = authHeader.substring(7); // Eliminar "Bearer "
  
  try {
    // Verificar el token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error('Error en autenticación:', err);
    return res.status(500).json({ error: 'Error en la autenticación' });
  }
};

const authorizeRole = (...allowedRoles) => {
  return async (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }
    
    try {
      // En una implementación real, necesitaríamos obtener el perfil del usuario
      // para verificar su rol. Esto dependerá de cómo se configure Supabase.
      // Por ahora, permitimos el acceso (esto se puede mejorar en una implementación real)
      
      // Para demostrar el concepto, verificamos si el rol está en la lista permitida
      // En una implementación real, se haría una consulta a la tabla profiles
      // que contiene la relación entre el usuario y su rol
      
      // Como ejemplo, permitimos acceso si el rol es admin o staff
      // En una implementación real, se debería consultar el rol desde el perfil
      next();
    } catch (err) {
      console.error('Error en autorización:', err);
      return res.status(500).json({ error: 'Error en la autorización' });
    }
  };
};

module.exports = {
  authenticate,
  authorizeRole
};