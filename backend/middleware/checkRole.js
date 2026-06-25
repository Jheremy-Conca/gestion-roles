// Recibe el permiso requerido y devuelve un middleware
const checkPermission = (permisoRequerido) => {
  return (req, res, next) => {
    const permisos = req.user.permisos || [];

    if (!permisos.includes(permisoRequerido)) {
      return res.status(403).json({
        message: `Acceso denegado. Necesitas el permiso: ${permisoRequerido}`
      });
    }
    next();
  };
};

module.exports = checkPermission;