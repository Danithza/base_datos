require('dotenv').config(); 
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, 
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  port: parseInt(process.env.DB_PORT)
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect().then(() => {
  console.log('✅ Conectado a SQL Server');
}).catch(err => {
  console.error('❌ Error al conectar con SQL Server:', err.message);
});

module.exports = { sql, pool, poolConnect };
