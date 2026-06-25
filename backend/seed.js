const pool = require('./config/database');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('🔄 Creando tablas...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) UNIQUE NOT NULL,
        descripcion TEXT,
        permisos JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role_id INTEGER REFERENCES roles(id),
        activo BOOLEAN DEFAULT true,
        reset_token VARCHAR(255),
        reset_token_expira TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Por si la tabla ya existía, agregamos las columnas
    await pool.query(`
      ALTER TABLE usuarios 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_token_expira TIMESTAMP
    `);

    console.log('✅ Tablas creadas');

    await pool.query(`
      INSERT INTO roles (nombre, descripcion, permisos) VALUES
      ('admin', 'Administrador del sistema', '["crear","leer","actualizar","eliminar","gestionar_roles"]'),
      ('editor', 'Editor de contenido', '["crear","leer","actualizar"]'),
      ('usuario', 'Usuario basico', '["leer"]')
      ON CONFLICT (nombre) DO NOTHING
    `);

    console.log('✅ Roles insertados');

    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO usuarios (nombre, email, password, role_id)
      VALUES ('Administrador', 'admin@admin.com', $1, 1)
      ON CONFLICT (email) DO UPDATE SET password = $1
    `, [hash]);

    console.log('✅ Usuario admin listo');
    console.log('========================================');
    console.log('📧 Email: admin@admin.com');
    console.log('🔑 Password: admin123');
    console.log('========================================');
    console.log('🎉 ¡Base de datos lista!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seed();