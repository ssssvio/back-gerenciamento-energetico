const { randomUUID } = require('crypto');
const { getDb, save } = require('../store/jsonStore');

const CATEGORIAS_VALIDAS = ['Suporte técnico', 'Manutenção elétrica', 'Melhoria de rede/monitoramento'];
const PRIORIDADES_VALIDAS = ['baixa', 'media', 'alta'];
const STATUS_VALIDOS = ['aberto', 'em_andamento', 'concluido'];

function listar(req, res) {
  const db = getDb();
  const { status, categoria, setorId } = req.query;
  let resultado = db.chamados;

  if (status) resultado = resultado.filter((c) => c.status === status);
  if (categoria) resultado = resultado.filter((c) => c.categoria === categoria);
  if (setorId) resultado = resultado.filter((c) => c.setorId === setorId);

  resultado = [...resultado].sort((a, b) => b.dataAbertura.localeCompare(a.dataAbertura));
  res.json(resultado);
}

function criar(req, res) {
  const db = getDb();
  const { titulo, descricao, categoria, setorId, prioridade } = req.body;

  if (!titulo || !descricao || !categoria || !prioridade) {
    return res.status(400).json({ erro: 'Campos obrigatórios: titulo, descricao, categoria, prioridade.' });
  }
  if (!CATEGORIAS_VALIDAS.includes(categoria)) {
    return res.status(400).json({ erro: `Categoria inválida. Use uma de: ${CATEGORIAS_VALIDAS.join(', ')}.` });
  }
  if (!PRIORIDADES_VALIDAS.includes(prioridade)) {
    return res.status(400).json({ erro: `Prioridade inválida. Use uma de: ${PRIORIDADES_VALIDAS.join(', ')}.` });
  }
  if (setorId && !db.setores.some((s) => s.id === setorId)) {
    return res.status(400).json({ erro: `Setor "${setorId}" não existe.` });
  }

  const agora = new Date().toISOString();
  const novoChamado = {
    id: randomUUID(),
    titulo,
    descricao,
    categoria,
    setorId: setorId || null,
    prioridade,
    status: 'aberto',
    dataAbertura: agora,
    dataAtualizacao: agora,
  };

  db.chamados.push(novoChamado);
  save();
  res.status(201).json(novoChamado);
}

function atualizar(req, res) {
  const db = getDb();
  const { id } = req.params;
  const chamado = db.chamados.find((c) => c.id === id);

  if (!chamado) {
    return res.status(404).json({ erro: `Chamado "${id}" não encontrado.` });
  }

  const { status, prioridade } = req.body;

  if (status !== undefined) {
    if (!STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ erro: `Status inválido. Use um de: ${STATUS_VALIDOS.join(', ')}.` });
    }
    chamado.status = status;
  }
  if (prioridade !== undefined) {
    if (!PRIORIDADES_VALIDAS.includes(prioridade)) {
      return res.status(400).json({ erro: `Prioridade inválida. Use uma de: ${PRIORIDADES_VALIDAS.join(', ')}.` });
    }
    chamado.prioridade = prioridade;
  }
  chamado.dataAtualizacao = new Date().toISOString();

  save();
  res.json(chamado);
}

module.exports = { listar, criar, atualizar };
