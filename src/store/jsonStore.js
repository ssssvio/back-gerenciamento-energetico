const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, '..', '..', 'data', 'seed.json');
const STORE_PATH = process.env.DATA_FILE
  ? path.resolve(process.env.DATA_FILE)
  : path.join(__dirname, '..', '..', 'data', 'store.json');

// db fica em memória durante a execução; o arquivo é só espelho para persistir entre reinícios.
let db = null;

function carregarDoDisco() {
  if (!fs.existsSync(STORE_PATH)) {
    fs.copyFileSync(SEED_PATH, STORE_PATH);
  }
  const conteudo = fs.readFileSync(STORE_PATH, 'utf-8');
  return JSON.parse(conteudo);
}

function persistir() {
  fs.writeFileSync(STORE_PATH, JSON.stringify(db, null, 2));
}

function init() {
  if (!db) {
    db = carregarDoDisco();
  }
  return db;
}

function getDb() {
  if (!db) init();
  return db;
}

function save() {
  persistir();
}

module.exports = { init, getDb, save };
