const pool = require("./pool");
const bcrypt = require("bcrypt");

const addUser = async (email, password,fullName, role ) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password, full_name, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, hashedPassword, fullName, role]
    );

    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = addUser;