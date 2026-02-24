const pool = require("./pool");

const getMessages = async () => {
  const result = await pool.query(`
    SELECT 
    messages.id,
    messages.content,
    messages.created_at,
    messages.is_member_only::boolean AS is_member_only,
    users.full_name,
    users.role
    FROM messages
    JOIN users ON messages.user_id = users.id
    ORDER BY messages.created_at DESC;
  `);

  return result.rows;
};

module.exports = getMessages;