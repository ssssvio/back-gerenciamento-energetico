require('dotenv').config();

const criarApp = require('./app');
const { init } = require('./store/jsonStore');

const PORT = process.env.PORT || 3000;

init();

const app = criarApp();

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
