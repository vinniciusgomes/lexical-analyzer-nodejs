var fs = require("file-system");

var Caracteres = require("./Caracteres");
Caracteres = new Caracteres();
var Errors = require("./Errors");
Errors = new Errors();
var Arquivo = require("./Arquivos");
Arquivo = new Arquivo();

module.exports = class Analisador {
  constructor() {
    this.palavrasReservadas = ["begin", "end"];
    this.operadores = ["+", "="];
    this.alfabeto = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    this.especiais = ["_"];
    this.txtEntrada = fs.readFileSync("./src/input/commands.txt", "utf8");
    this.tokenAtual = "";
    this.prEncontrados = [];
    this.identificadoresEncontrados = [];
    this.operadoresEncontrados = [];
    this.numerosEncontrados = [];
    this.rastro = "nada";
    this.ultimo = "";
  }

  executar() {
    this.txtEntrada = this.txtEntrada.replace(/[\n]/g, " ") + " ";

    // Percorre todos os caracteres do input
    for (var caractere of this.txtEntrada) {
      if (!Caracteres.isEspaco(caractere)) {
        if (!Caracteres.isOperador(caractere)) {
          if (!Caracteres.isNumero(caractere)) {
            if (Number.isInteger(parseInt(this.tokenAtual[0]))) {
              Errors.error("Identificador inválido!");
            }
            if (!this.especiais.includes(this.tokenAtual[0])) {
              if (
                this.alfabeto.includes(caractere) ||
                this.especiais.includes(caractere)
              ) {
                this.tokenAtual += caractere;
                this.rastro = "letra";
              } else {
                Errors.error("Caractere inválido");
              }
            } else {
              Errors.error("Identificador inválido!");
            }
          } else if (Number.isInteger(parseInt(caractere))) {
            this.tokenAtual += caractere;
            if (Number.isInteger(parseInt(this.tokenAtual))) {
              if (this.tokenAtual >= 0 && this.tokenAtual <= 32767) {
                this.rastro = "numero";
              } else {
                Errors.error("Número inválido!");
              }
            } else {
              this.rastro = "letra";
            }
          }
        } else if (this.operadores.includes(this.tokenAtual[0])) {
          this.tokenAtual += caractere;
          this.rastro = "operador";
        } else {
          this.tokenAtual = this.checarToken(this.tokenAtual);
          this.tokenAtual += caractere;
          this.rastro = "operador";
        }
      } else {
        this.tokenAtual = this.checarToken(this.tokenAtual);
        this.rastro = "nada";
      }
    }

    Arquivo.concatRetornoArquivo(this.prEncontrados, "Palavra Reservada");
    Arquivo.concatRetornoArquivo(
      this.identificadoresEncontrados,
      "Identificador"
    );
    Arquivo.concatRetornoArquivo(this.operadoresEncontrados, "Operador");
    Arquivo.concatRetornoArquivo(this.numerosEncontrados, "Numero");
    Arquivo.WriteFile("./src/output/result.pdf", fs);
  }

  // Verifica tipo do token
  checarToken() {
    if (this.tokenAtual != "") {
      switch (this.rastro) {
        case "nada":
          break;
        case "letra":
          if (this.palavrasReservadas.includes(this.tokenAtual)) {
            this.prEncontrados.push(this.tokenAtual);
          } else if (this.tokenAtual != "\n") {
            this.identificadoresEncontrados.push(this.tokenAtual);
          }
          this.ultimo = "letra";
          break;
        case "operador":
          if (this.tokenAtual == "=" && this.ultimo == "numero") {
            Errors.error("Identificador inválido");
          }
          this.operadoresEncontrados.push(this.tokenAtual);
          this.ultimo = "operador";
          break;
        case "numero":
          this.numerosEncontrados.push(this.tokenAtual);
          this.ultimo = "numero";
          break;
      }
    }
    return "";
  }
};
