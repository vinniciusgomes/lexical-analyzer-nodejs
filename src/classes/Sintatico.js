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
              return false;
            }
          }
          this.ultimo = "Palavra Reservada";
          break;
        case 'Identificador':
          if(tokens.length != 0){
            switch(this.ultimo){
              case "Palavra Reservada":
                if(this.first(tokens).type != "Operador" || this.first(tokens).token != "="){
                  return false;
                }
                break;
              case "Identificador":
                if(this.first(tokens).type != "Operador" || this.first(tokens).token != "="){
                  return false;
                }
                break;
              case "Numero":
                if(this.first(tokens).type != "Operador" || this.first(tokens).token != "="){
                  return false;
                }
                break;
              case "Operador":
                if(this.first(tokens).type != "Operador" || this.first(tokens).token != "+"){
                  return false;
                }
                break;
            }
          }
          this.ultimo = "Identificador";
          break;
        case 'Operador':
          switch(this.ultimo){
            case "Palavra Reservada":
              return false;
              break;
            case "Identificador":
              if(this.first(tokens).type != "Identificador" && this.first(tokens).type != "Numero"){
                return false;
              }
              break;
            case "Operador":
              return false;
              break;
            case "Numero":
              if(current_token.token == "="){
                return false;
              }
              if(this.first(tokens).type != "Numero" || this.first(tokens).type != "Identificador"){
                return false;
              }
              break;
          }
          this.ultimo = "Operador";
          break;
        case 'Numero':
          switch(this.ultimo){
            case "Palavra Reservada":
              return false;
              break;
            case "Identificador":
              return false;
              break;
            case "Operador":
              if(this.first(tokens).type != "Operador" || this.first(tokens).type != "identificador"){
                if(this.first(tokens).type == "Operador" && this.first(tokens).token != "+"){
                  return false;
                }
              }
              break;
            case "Numero":
              return false;
              break;
          }
          this.ultimo = "Numero";
          break;
      }
    }
    return true;
  }

  first(array) {
    for (let i in array) return array[i];
  }
}