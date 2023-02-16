// let canvas = document.getElementById('canvas');
// canvas.width 
// let ctx = canvas.getContext("2d");

// var cubo = {
//   x: 0,
//   y: 0,
//   largura: 100,
//   altura: 100,
// }

// ctx.fillStyle = "red";
// ctx.fillRect( cubo.x, cubo.y, cubo.largura, cubo.altura);

class ValidaFormulario {
  constructor(){
    this.formulario = document.querySelector('.formulario');
    this.eventos();
  }

  eventos(){
    this.formulario.addEventListener('submit', e => {
      e.preventDefault();
      this.handleSubmit();
    })
  }

  handleSubmit(){
    console.log('a')
    const validFields = this.isValid();
  }

  isValid(){
    let valid = true;

    for(let errorText of this.formulario.querySelectorAll('.error-text')){
      errorText.remove();
    }

    for(let campo of this.formulario.querySelectorAll('.valid')){
      if(!campo.value){
        this.createError(campo, 'Campo "' + campo.previousElementSibling.innerText + '" não pode estar em branco.');
        valid = false;
      }

      if(campo.classList.contains('cpf')){
        if(!this.cpfValid(campo)) valid = false;
      }

      if(campo.classList.contains('usuario')){
        if(!this.userValid(campo)) valid = false;
      }
    }
    return valid;
  }

  userValid(campo){
    const usuario = campo.value;
    let valid = true;
    if(usuario.length < 3 || usuario.length > 12){
      this.createError(campo, 'Usuário precisa ter entre 3 e 12 caracteres.');
      valid = false;
    }
    if(!usuario.match(/^[a-zA-Z0-9]+$/g)){
      this.createError(campo, 'Nome de usuário pode conter apenas letras e/ou números.');
      valid = false;
    }
    return valid;
  }

  cpfValid(campo){
    const cpf = new ValidaCPF(campo.value); 
    if(!cpf.valida()){
      this.createError(campo, 'CPF inválido!');
      return false;
    }
    return true;
  }

  createError(campo, msg){
    const div = document.createElement('div');
    div.innerHTML = msg;
    div.classList.add('error-text');
    campo.insertAdjacentElement('afterend', div)
  }
}

class ValidaCPF {
  constructor(cpfEnviado){
    Object.defineProperty(this, 'cpfLimpo', {
      writable: false,
      enumerable: true,
      configurable: false,
      value: cpfEnviado.replace(/\D+/g, '')
    })
  }

  isSequence(){
    return this.cpfLimpo.charAt(0).repeat(11) === this.cpfLimpo;
  }

  newCPF(){
    const cpfSemDigitos = this.cpfLimpo.slice(0, -2);
    const digito1 = ValidaCPF.newDigito(cpfSemDigitos); 
    const digito2 = ValidaCPF.newDigito(cpfSemDigitos + digito1);
    this.novoCPF = cpfSemDigitos + digito1 + digito2; 
  }

  static newDigito(cpfSemDigitos){
    let total = 0;
    let reverso = cpfSemDigitos.length + 1;

    for(let stringNumerica of cpfSemDigitos){
      total += reverso * Number(stringNumerica);
      reverso--;
    }

    const digito = 11 - (total % 11);
    return digito <= 9 ? String(digito) : '0';
  }

  valida(){
    if(!this.cpfLimpo) return false;
    if(typeof this.cpfLimpo !== 'string') return false;
    if(this.cpfLimpo.length !== 11) return false;
    if(this.isSequence()) return false;
    this.newCPF();
    return this.novoCPF === this.cpfLimpo;
  }
}
