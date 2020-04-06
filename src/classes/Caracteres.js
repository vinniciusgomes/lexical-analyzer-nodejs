module.exports = class Caracteres {
  constructor() {
    this.operadores = ["+", "="];
  }
  isEspaco(caractere) {
    return caractere === " " || caractere === "\n";
  }

  isOperador(caractere) {
    return this.operadores.includes(caractere);
  }

  isNumero(caractere) {
    var n = parseInt(caractere);
    return Number.isInteger(n);
  }
};
