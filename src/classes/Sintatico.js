var Arquivo = require("./Arquivos");
Arquivo = new Arquivo();

module.exports = class Sintatico {
  cosntructor(){
    this.ultimo = "";
  }

  analisar(tokens){
    while (tokens.length > 0){
      var current_token = tokens.shift()
  
      switch (current_token.type) {
        case 'Palavra Reservada' :
          if(tokens.length != 0){
            if(this.first(tokens).type != 'Identificador'){
              return {erro: false, msg: "Esperado um identificador"};
            }
          }
          Arquivo.concatRetornoArquivo(current_token.token, "Palavra Reservada");
          this.ultimo = "Palavra Reservada";
          break;
        case 'Identificador':
          if(tokens.length != 0){
            switch(this.ultimo){
              case "Palavra Reservada":
                if(this.first(tokens).type != "Operador" || this.first(tokens).token != "="){
                  return {erro: false, msg: "Esperado o operador '='"};
                }
                break;
              case "Identificador":
                if(this.first(tokens).type != "Operador" || this.first(tokens).token != "="){
                  return {erro: false, msg: "Esperado o operador '='"};
                }
                break;
              case "Numero":
                if(this.first(tokens).type != "Operador" || this.first(tokens).token != "="){
                  return {erro: false, msg: "Esperado o operador '='"};
                }
                break;
              case "Operador":
                if(this.first(tokens).type != "Operador" && 
                  this.first(tokens).type != "Palavra Reservada" 
                  && this.first(tokens).type != "Identificador"){
                    return {erro: false, msg: "Esperado um operador, palavra reservada ou identificador"};
                }
                break;
            }
          }
          Arquivo.concatRetornoArquivo(current_token.token, "Identificador");
          this.ultimo = "Identificador";
          break;
        case 'Operador':
          switch(this.ultimo){
            case "Palavra Reservada":
              return {erro: false, msg: "Esperado um identificador ou número"};
              break;
            case "Identificador":
              if(this.first(tokens).type != "Identificador" && this.first(tokens).type != "Numero"){
                return {erro: false, msg: "Esperado um identificador ou número"};
              }
              break;
            case "Operador":
              return {erro: false, msg: "Esperado um identificador ou número"};
              break;
            case "Numero":
              if(current_token.token == "="){
                return {erro: false, msg: "Esperado o operador '+'"};
              }
              if(this.first(tokens).type != "Numero" && this.first(tokens).type != "Identificador"){
                return {erro: false, msg: "Esperado um identificador ou número"};
              }
              break;
          }
          Arquivo.concatRetornoArquivo(current_token.token, "Operador");
          this.ultimo = "Operador";
          break;
        case 'Numero':
          switch(this.ultimo){
            case "Palavra Reservada":
              return {erro: false, msg: "Esperado um identificador"};
              break;
            case "Identificador":
              return {erro: false, msg: "Esperado o operador '='"};
              break;
            case "Operador":
              if(this.first(tokens).type != "Operador" || this.first(tokens).type != "identificador"){
                if(this.first(tokens).type == "Operador" && this.first(tokens).token != "+"){
                  return {erro: false, msg: "Esperado o operador '+'"};
                }
              }
              break;
            case "Numero":
              return {erro: false, msg: "Esperado um identificador"};
              break;
          }
          Arquivo.concatRetornoArquivo(current_token.token, "Numero");
          this.ultimo = "Numero";
          break;
      }
    }
    return {erro: true, msg: ""};
  }

  first(array) {
    for (let i in array) return array[i];
  }
}