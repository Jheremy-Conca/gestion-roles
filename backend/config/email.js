const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar el transportador de emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verificar conexión al iniciar
transporter.verify((error) => {
  if (error) {
    console.error('❌ Error en configuración de email:', error.message);
  } else {
    console.log('✅ Servidor de email listo');
  }
});

// Función para enviar el email de recuperación
exports.enviarEmailRecuperacion = async (email, enlace) => {
  const mailOptions = {
    from: `"Gestión de Roles" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Recuperación de Contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2c3e50; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">🔐 Gestión de Roles</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #2c3e50;">Recuperación de Contraseña</h2>
          <p style="color: #555; font-size: 16px;">
            Hemos recibido una solicitud para restablecer tu contraseña.
            Haz clic en el siguiente botón para crear una nueva:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${enlace}" 
               style="background: #3498db; color: white; padding: 14px 30px; 
                      text-decoration: none; border-radius: 8px; font-size: 16px;
                      display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            Este enlace expira en <strong>1 hora</strong>.
          </p>
          <p style="color: #999; font-size: 14px;">
            Si no solicitaste esto, ignora este correo.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #bbb; font-size: 12px; text-align: center;">
            Si el botón no funciona, copia este enlace:<br>
            <a href="${enlace}" style="color: #3498db;">${enlace}</a>
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};