module.exports = class Arquivo {
  constructor() {
    this.saidaArquivo = "token; tipoToken\n\n";
  }

  concatRetornoArquivo(items, tipoToken) {
    for (var id of items) {
      this.saidaArquivo += `${id}; ${tipoToken}\n`;
    }
  }

  WriteFile(path, fs) {
    fs.writeFile(path, this.saidaArquivo, function (err) {});
  }
};
