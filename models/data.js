if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const mariadb = require('mariadb');

const pool = mariadb.createPool({
     host: DATABASE_HOST,
     user:DATABASE_USER,
     password: DATABASE_PASSWORD,
     name: DATABASE_NAME,
     connectionLimit: 5
});
async function asyncFunction() {
  let conn;
  try {
	conn = await pool.getConnection();
	const rows = await conn.query("SELECT 1 as val");
	console.log(rows); //[ {val: 1}, meta: ... ]
	const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
	console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } catch (err) {
	throw err;
  } finally {
	if (conn) return conn.end();
  }
}
