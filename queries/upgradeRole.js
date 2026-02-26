const pool = require("./pool");

const upgradeRole = async (userId, newRole) => {
  const result = await pool.query(
    `
    UPDATE users
    SET role = $1
    WHERE id = $2
    RETURNING id, email, full_name, role
    `,
    [newRole, userId]
  );

  return result.rows[0];
};

module.exports = upgradeRole;