module.exports = class Erros {
  error(message) {
    console.log(`Erro: ${message}`);
    process.exit(1);
  }
};
