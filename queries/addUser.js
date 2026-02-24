const pool = require("./pool");
const bcrypt = require("bcrypt");

const addUser = async (email, password, fullName, role = "user") => {
  if (!email || !password || !fullName) {
    throw new Error("Missing required fields");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `INSERT INTO users (email, password, full_name, role) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, email, full_name, role, created_at`,
    [email.trim().toLowerCase(), hashedPassword, fullName.trim(), role]
  );

  return result.rows[0];
};

module.exports = addUser;

module.exports = addUser;