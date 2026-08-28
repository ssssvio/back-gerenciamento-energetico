const { getDb } = require('../store/jsonStore');

function listar(req, res) {
  const db = getDb();
  res.json(db.setores);
}

module.exports = { listar };
