
const handleDbError = (err, res) => {
  console.error('DB Error:', err.message);

  switch (err.code) {
    case '23505':
      return res.status(409).json({
        error: 'A record with that value already exists',
        detail: err.detail, // e.g. "Key (email)=(ada@gmail.com) already exists"
      });
    case '23503':
      return res.status(400).json({
        error: 'Referenced record does not exist',
        detail: err.detail,
      });
    case '23502':
      return res.status(400).json({
        error: 'A required field is missing',
        detail: err.detail,
      });
    case '22P02':
      return res.status(400).json({
        error: 'Invalid data type provided',
      });
    default:
      return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = handleDbError;