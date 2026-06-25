const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// LISTAR USUARIOS CON PAGINACIÓN Y BÚSQUEDA
exports.getUsers = async (req, res, next) => {
  try {
    // Parámetros de la URL: ?page=1&limit=5&search=juan
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    // Consulta para contar el total (para saber cuántas páginas hay)
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM usuarios u
       JOIN roles r ON u.role_id = r.id
       WHERE u.nombre ILIKE $1 OR u.email ILIKE $1`,
      [`%${search}%`]
    );
    const total = parseInt(countResult.rows[0].count);

    // Consulta para obtener los usuarios de la página actual
    const result = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.activo, u.created_at,
              r.id AS role_id, r.nombre AS rol_nombre
       FROM usuarios u
       JOIN roles r ON u.role_id = r.id
       WHERE u.nombre ILIKE $1 OR u.email ILIKE $1
       ORDER BY u.id
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    // Devolver datos + información de paginación
    res.json({
      usuarios: result.rows,
      paginacion: {
        total,                              // Total de registros
        page,                               // Página actual
        limit,                              // Registros por página
        totalPaginas: Math.ceil(total / limit) // Número total de páginas
      }
    });
  } catch (error) {
    next(error);
  }
};

// CREAR USUARIO
exports.createUser = async (req, res, next) => {
  const { nombre, email, password, role_id } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password, role_id)
       VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, role_id`,
      [nombre, email, hashedPassword, role_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'El email ya existe' });
    }
    next(error);
  }
};

// ACTUALIZAR USUARIO
exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, email, role_id, activo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, email = $2, role_id = $3, activo = $4
       WHERE id = $5 RETURNING id, nombre, email, role_id, activo`,
      [nombre, email, role_id, activo, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// ELIMINAR USUARIO
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};