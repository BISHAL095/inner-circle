const pool = require("./pool");

const addMessage = async (content, userId, isMemberOnly) => {
  const result = await pool.query(
    `INSERT INTO messages (content, user_id, is_member_only)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [content, userId, isMemberOnly]
  );

  return result.rows[0];
};

module.exports = addMessage;