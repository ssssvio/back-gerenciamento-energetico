const express = require('express');
const cors = require('cors');

const setoresRoutes = require('./routes/setores.routes');
const consumosRoutes = require('./routes/consumos.routes');
const chamadosRoutes = require('./routes/chamados.routes');
const configRoutes = require('./routes/config.routes');
const { naoEncontrado, tratarErro } = require('./middlewares/errorHandler');

function criarApp() {
  const app = express();

  app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/setores', setoresRoutes);
  app.use('/api/consumos', consumosRoutes);
  app.use('/api/chamados', chamadosRoutes);
  app.use('/api/config', configRoutes);

  app.use(naoEncontrado);
  app.use(tratarErro);

  return app;
}

module.exports = criarApp;
