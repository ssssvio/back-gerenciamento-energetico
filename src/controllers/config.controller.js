const { getDb, save } = require('../store/jsonStore');

const MES_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

function obter(req, res) {
  const db = getDb();
  res.json(db.config);
}

function atualizar(req, res) {
  const db = getDb();
  const { dataImplementacaoSolar } = req.body;

  if (!dataImplementacaoSolar || !MES_REGEX.test(dataImplementacaoSolar)) {
    return res.status(400).json({ erro: 'Campo "dataImplementacaoSolar" deve estar no formato AAAA-MM.' });
  }

  db.config.dataImplementacaoSolar = dataImplementacaoSolar;
  save();
  res.json(db.config);
}

module.exports = { obter, atualizar };
