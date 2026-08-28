const { randomUUID } = require('crypto');
const { getDb, save } = require('../store/jsonStore');
const { calcularComparativo } = require('../services/comparativo.service');

const MES_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

function listar(req, res) {
  const db = getDb();
  const { setorId, de, ate } = req.query;
  let resultado = db.consumos;

  if (setorId) {
    resultado = resultado.filter((c) => c.setorId === setorId);
  }
  if (de) {
    resultado = resultado.filter((c) => c.mes >= de);
  }
  if (ate) {
    resultado = resultado.filter((c) => c.mes <= ate);
  }

  resultado = [...resultado].sort((a, b) => a.mes.localeCompare(b.mes));
  res.json(resultado);
}

function criar(req, res) {
  const db = getDb();
  const { setorId, mes, kwh, custo } = req.body;

  if (!setorId || !mes || kwh === undefined || custo === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios: setorId, mes, kwh, custo.' });
  }
  if (!MES_REGEX.test(mes)) {
    return res.status(400).json({ erro: 'Campo "mes" deve estar no formato AAAA-MM.' });
  }
  if (!db.setores.some((s) => s.id === setorId)) {
    return res.status(400).json({ erro: `Setor "${setorId}" não existe.` });
  }
  if (typeof kwh !== 'number' || kwh < 0 || typeof custo !== 'number' || custo < 0) {
    return res.status(400).json({ erro: 'Campos "kwh" e "custo" devem ser números não negativos.' });
  }

  const novoRegistro = {
    id: randomUUID(),
    setorId,
    mes,
    kwh,
    custo,
    criadoEm: new Date().toISOString(),
  };

  db.consumos.push(novoRegistro);
  save();
  res.status(201).json(novoRegistro);
}

function comparativo(req, res) {
  const db = getDb();
  const resultado = calcularComparativo(db.consumos, db.setores, db.config.dataImplementacaoSolar);
  res.json(resultado);
}

module.exports = { listar, criar, comparativo };
