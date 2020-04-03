const palavraseservadas = ["begin", "end"];
const operadores = ["+", "="];

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
          tokenAtual += caractere;
          rastro = "letra";
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

var saidaArquivo = "token; tipoToken; posicao (linha); posicao(coluna)\n\n";
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
        if (palavraseservadas.includes(tokenAtual)) {
          prEncontrados.push(tokenAtual);
        } else if (tokenAtual != "\n") {
          identificadoresEncontrados.push(tokenAtual);
        }
        break;
      case "operador":
        operadoresEncontrados.push(tokenAtual);
        break;
      case "numero":
        numerosEncontrados.push(tokenAtual);
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
    if (auxTokenRepetido[id]) {
      ultimaCol = auxTokenRepetido[id].ultimaCol + 1;
      ultimaLinha = auxTokenRepetido[id].ultimaLinha;

      linhaEColuna = getLinhaEColunaToken(id, ultimaCol, ultimaLinha);

      saidaArquivo += `${id}; ${tipoToken}; ${linhaEColuna.linha};${linhaEColuna.coluna}\n`;

      auxTokenRepetido[id] = {
        token: id,
        qtd: auxTokenRepetido[id].qtd + 1,
        ultimaCol: linhaEColuna.coluna,
        ultimaLinha: linhaEColuna.linha
      };
    } else {
      linhaEColuna = getLinhaEColunaToken(id);
      saidaArquivo += `${id}; ${tipoToken}; ${linhaEColuna.linha};${linhaEColuna.coluna}\n`;

      auxTokenRepetido[id] = {
        token: id,
        qtd: 1,
        ultimaCol: linhaEColuna.coluna,
        ultimaLinha: linhaEColuna.linha
      };
    }
  }
  auxTokenRepetido = [];
}

// Pegando posição do caractere
function getLinhaEColunaToken(token, ultimaCol = false, ultimaLinha = false) {
  for (const linha of linhasTxtEntrada) {
    var colToken = linha.indexOf(token);
    if (colToken >= 0) {
      var linhaToken = linhasTxtEntrada.indexOf(linha);
      if (!(ultimaCol && ultimaLinha)) {
        return { linha: linhaToken, coluna: colToken };
      } else {
        if (linhaToken == ultimaLinha && colToken > ultimaCol) {
          return { linha: linhaToken, coluna: colToken };
        } else if (
          (linhaToken != ultimaLinha || colToken != ultimaCol) &&
          (linhaToken > ultimaLinha || colToken > ultimaCol)
        ) {
          return { linha: linhaToken, coluna: colToken };
        }
      }
    }
  }
  return false;
}