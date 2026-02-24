const pool = require("./pool");

const getMessages = async () => {
  const result = await pool.query(`
    SELECT messages.*, users.email
    FROM messages
    JOIN users ON messages.user_id = users.id
    ORDER BY messages.created_at DESC
  `);

  return result.rows;
};

module.exports = getMessages;