const palavrasReservadas = ["begin", "end"];
const operadores = ["+", "="];
const alfabeto = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const especiais = ["_"];

var fs = require("file-system");
var txtEntrada = fs.readFileSync("./src/input/commands.txt", "utf8");

linhasTxtEntrada = txtEntrada.split('\n');

txtEntrada = txtEntrada.replace(/[\n]/g, " ") + " ";

var tokenAtual = "";
var prEncontrados = [];
var identificadoresEncontrados = [];
var operadoresEncontrados = [];
var numerosEncontrados = [];
var rastro = "nada";
var contLinha = 0;
var contColuna = 0;
var ultimo = "";

// Percorre todos os caracteres do input
for (caractere of txtEntrada) {
  if (caractere == "\n") {
    contLinha++;
    contColuna = 0;
  } else {
    if (!isEspaco(caractere)) {
      if (!isOperador(caractere)) {
        if (!isNumero(caractere)) {
          if (Number.isInteger(parseInt(tokenAtual[0]))) {
            console.log("Erro: Identificador inválido!");
            process.exit(1);
          }
          if(!especiais.includes(tokenAtual[0])){
            if(alfabeto.includes(caractere) || especiais.includes(caractere)){
              tokenAtual += caractere;
              rastro = "letra";
            }else{
              console.log("Erro: Caractere inválido!");
              process.exit(1);
            }
          }else{
            console.log("Erro: Identificador inválido!");
              process.exit(1);
          }
        } else if (Number.isInteger(parseInt(caractere))) {
          tokenAtual += caractere;
          if(Number.isInteger(parseInt(tokenAtual))){
            if (tokenAtual >= 0 && tokenAtual <= 32767) {
              rastro = "numero";
            } else {
              console.log("Erro: Número inválido!");
              process.exit(1);
            }
          }else{
            // tokenAtual += caractere;
            rastro = "letra";
          }
        }
      } else if (operadores.includes(tokenAtual[0])) {
        tokenAtual += caractere;
        rastro = "operador";
      } else {
        tokenAtual = checarToken(tokenAtual);
        tokenAtual += caractere;
        rastro = "operador";
      }
    } else {
      tokenAtual = checarToken(tokenAtual);
      rastro = "nada";
    }
  }
  contColuna++;
}

var saidaArquivo = "token; tipoToken; posicao (linha); posicao(coluna)\n";
var auxTokenRepetido = [];

concatRetornoArquivo(prEncontrados, "Palavra Reservada");
concatRetornoArquivo(identificadoresEncontrados, "Identificador");
concatRetornoArquivo(operadoresEncontrados, "Operador");
concatRetornoArquivo(numerosEncontrados, "Numero");

fs.writeFile("./src/output/result.pdf", saidaArquivo, function(err) {});

// Verifica tipo do token
function checarToken(tokenAtual) {
  if (tokenAtual != "") {
    switch (rastro) {
      case "nada":
        break;
      case "letra":
        if (palavrasReservadas.includes(tokenAtual)) {
          prEncontrados.push(tokenAtual);
        } else if (tokenAtual != "\n") {
          identificadoresEncontrados.push(tokenAtual);
        }
        ultimo = "letra";
        break;
      case "operador":
        if(tokenAtual == "=" && ultimo == "numero"){
          console.log("Identificador inválido");
          process.exit(1);
        }
        operadoresEncontrados.push(tokenAtual);
        ultimo = "operador";
        break;
      case "numero":
        numerosEncontrados.push(tokenAtual);
        ultimo = "numero";
        break;
    }
  }
  return "";
}

function isEspaco(caractere) {
  return caractere === " " || caractere === "\n";
}

function isOperador(caractere) {
  return operadores.includes(caractere);
}

function isNumero(caractere) {
  var n = parseInt(caractere);
  return Number.isInteger(n);
}

// Gera adiciona valores no arquivo
function concatRetornoArquivo(items, tipoToken) {
  for (id of items) {
      saidaArquivo += `${id}; ${tipoToken}\n`;
      auxTokenRepetido[id] = {
        token: id,
        qtd: 1
      };
  }
  auxTokenRepetido = [];
}
