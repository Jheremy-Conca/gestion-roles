const pool = require('../config/database');

// LISTAR ROLES
exports.getRoles = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// CREAR ROL
exports.createRole = async (req, res, next) => {
  const { nombre, descripcion, permisos } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO roles (nombre, descripcion, permisos)
       VALUES ($1, $2, $3) RETURNING *`,
      [nombre, descripcion, JSON.stringify(permisos)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'El rol ya existe' });
    }
    next(error);
  }
};

// ACTUALIZAR ROL
exports.updateRole = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, descripcion, permisos } = req.body;
  try {
    const result = await pool.query(
      `UPDATE roles SET nombre = $1, descripcion = $2, permisos = $3
       WHERE id = $4 RETURNING *`,
      [nombre, descripcion, JSON.stringify(permisos), id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// ELIMINAR ROL
exports.deleteRole = async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM roles WHERE id = $1', [id]);
    res.json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};