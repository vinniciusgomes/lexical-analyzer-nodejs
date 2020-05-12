module.exports = class Sintatico {
  cosntructor(){
    this.ultimo = "";
  }

  analisar(tokens){
    while (tokens.length > 0){
      var current_token = tokens.shift()
  
      // Since number token does not do anything by it self, we only analyze syntax when we find a word.
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
                break;
              case "Identificador":
                break;
              case "Numero":
                
                break;
              case "Operador":

                break;
            }
          }
          break;
        case 'Operador':
          console.log('Operador: ' + current_token.type);
          break;
        case 'Numero':
          console.log('Numero: ' + current_token.type);
          break;
      }
    }
    return true;
  }

  first(array) {
    for (let i in array) return array[i];
  }
}