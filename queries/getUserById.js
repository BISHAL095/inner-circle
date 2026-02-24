const pool = require("./pool");

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, email, full_name, role, password
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

module.exports = getUserById;