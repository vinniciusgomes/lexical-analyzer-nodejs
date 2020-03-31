const palavras_reservadas = ["begin", "end"];
const operadores = ["+", "="];

var fs = require("file-system");
var txt_entrada = fs.readFileSync("./input/commands.js", "utf8");

linhas_txt_entrada = txt_entrada.split("\n");

var token_atual = "";
var pr_encontrados = [];
var identificadores_encontrados = [];
var operadores_encontrados = [];
var numeros_encontrados = [];
var rastro = "nada";
var cont_linha = 0;
var cont_coluna = 0;

for (caractere of txt_entrada) {
  if (caractere == "\n") {
    cont_linha++;
    cont_coluna = 0;
  } else {
    if (!eh_espaco(caractere)) {
      if (!eh_operador(caractere)) {
        if (!eh_numero(caractere)) {
          if (rastro != "letra") {
            token_atual = checar_token(token_atual);
          }
          token_atual += caractere;
          rastro = "letra";
        } else if (Number.isInteger(parseInt(token_atual[0]))) {
          token_atual += caractere;
          if (token_atual >= 0 && token_atual <= 32767) {
            rastro = "numero";
          } else {
            console.log("Erro: Número inválido!");
            process.exit(1);
          }
        } else {
          token_atual = checar_token(token_atual);
          token_atual += caractere;
          rastro = "constante";
        }
      } else if (operadores.includes(token_atual[0])) {
        token_atual += caractere;
        rastro = "operador";
      } else {
        token_atual = checar_token(token_atual);
        token_atual += caractere;
        rastro = "operador";
      }
    } else {
      token_atual = checar_token(token_atual);
      rastro = "nada";
    }
  }
  cont_coluna++;
}

var saida_arquivo = "token;tipo_token;posicao(linha);posicao(coluna);\n";
var aux_token_repetido = [];

concat_retorno_arquivo(pr_encontrados, "Palavra Reservada");
concat_retorno_arquivo(identificadores_encontrados, "Identificador");
concat_retorno_arquivo(operadores_encontrados, "Operador");
concat_retorno_arquivo(numeros_encontrados, "Numero");

fs.writeFile("./output/result.csv", saida_arquivo, function(err) {});

function checar_token(token_atual) {
  if (token_atual != "") {
    switch (rastro) {
      case "nada":
        break;
      case "letra":
        if (palavras_reservadas.includes(token_atual)) {
          pr_encontrados.push(token_atual);
        } else if (token_atual != "\n") {
          identificadores_encontrados.push(token_atual);
        }
        break;
      case "operador":
        operadores_encontrados.push(token_atual);
        break;
      case "constante":
        numeros_encontrados.push(token_atual);
        break;
    }
  }
  return "";
}

function eh_espaco(caractere) {
  return caractere === " ";
}

function eh_operador(caractere) {
  return operadores.includes(caractere);
}

function eh_numero(caractere) {
  var n = parseInt(caractere);
  return Number.isInteger(n);
}

function concat_retorno_arquivo(items, tipo_token) {
  for (id of items) {
    if (aux_token_repetido[id]) {
      ultima_col = aux_token_repetido[id].ultima_col + 1;
      ultima_linha = aux_token_repetido[id].ultima_linha;

      linha_e_coluna = get_linha_e_coluna_token(id, ultima_col, ultima_linha);

      saida_arquivo += `${id}; ${tipo_token}; ${linha_e_coluna.linha};${linha_e_coluna.coluna}\n`;

      aux_token_repetido[id] = {
        token: id,
        qtd: aux_token_repetido[id].qtd + 1,
        ultima_col: linha_e_coluna.coluna,
        ultima_linha: linha_e_coluna.linha
      };
    } else {
      linha_e_coluna = get_linha_e_coluna_token(id);
      saida_arquivo += `${id}; ${tipo_token}; ${linha_e_coluna.linha};${linha_e_coluna.coluna}\n`;

      aux_token_repetido[id] = {
        token: id,
        qtd: 1,
        ultima_col: linha_e_coluna.coluna,
        ultima_linha: linha_e_coluna.linha
      };
    }
  }
  aux_token_repetido = [];
}
function get_linha_e_coluna_token(
  token,
  ultima_col = false,
  ultima_linha = false
) {
  for (const linha of linhas_txt_entrada) {
    var col_token = linha.indexOf(token);
    if (col_token >= 0) {
      var linha_token = linhas_txt_entrada.indexOf(linha);
      if (!(ultima_col && ultima_linha)) {
        return { linha: linha_token, coluna: col_token };
      } else {
        if (linha_token == ultima_linha && col_token > ultima_col) {
          return { linha: linha_token, coluna: col_token };
        } else if (
          (linha_token != ultima_linha || col_token != ultima_col) &&
          (linha_token > ultima_linha || col_token > ultima_col)
        ) {
          return { linha: linha_token, coluna: col_token };
        }
      }
    }
  }
  return false;
}
