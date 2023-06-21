var contadorCarrinho = 0; // Variável para armazenar a contagem do carrinho

function atualizarContagemCarrinho() {
  var spanContadorCarrinho = document.getElementById("cartCount");
  spanContadorCarrinho.textContent = contadorCarrinho.toString();
}

function adicionarAoCarrinho() {
  contadorCarrinho++;
  atualizarContagemCarrinho();
}

function limparCarrinho() {
  contadorCarrinho = 0;
  atualizarContagemCarrinho();
}

document.addEventListener("DOMContentLoaded", function() {
  atualizarContagemCarrinho();
});

function alternarTextoBotao(event) {
  event.preventDefault(); // Evita que o link seja seguido

  var botao = event.target; // Obtém o elemento do botão clicado

  if (botao.textContent === "Comprar") {
    botao.textContent = "No carrinho"; // Altera o texto para "No carrinho"
    adicionarAoCarrinho(); // Incrementa a contagem do carrinho
  } else {
    botao.textContent = "Comprar"; // Altera o texto para "Comprar"
  }
}

function mudarTextoBotao(event) {
  var botao = event.target; // Obtém o elemento do botão

  if (botao.textContent === "No carrinho") {
    botao.textContent = "Remover do carrinho"; // Altera o texto para "Remover do carrinho"
  }
}

function reverterTextoBotao(event) {
  var botao = event.target; // Obtém o elemento do botão

  if (botao.textContent === "Remover do carrinho") {
    botao.textContent = "No carrinho"; // Altera o texto de volta para "No carrinho"
    contadorCarrinho--; // Decrementa a contagem do carrinho
    atualizarContagemCarrinho();
  }
}

window.addEventListener("scroll", function() {
  var header = document.querySelector("header"); // Seleciona o elemento do header

  if (window.scrollY > 0) {
    header.classList.add("fixed-header"); // Adiciona a classe CSS ao header
  } else {
    header.classList.remove("fixed-header"); // Remove a classe CSS do header
  }
});

function toggleCartButton(button) {
  const productName = button.parentNode.querySelector('h3').innerText;

  if (productName === 'Chocolate') {
    toggleChocolateCartButton(button);
  } else {
    toggleDefaultCartButton(button);
  }

  atualizarContagemCarrinho();
}

const carrinho = {};

function toggleDefaultCartButton(button) {
  const productName = button.parentNode.querySelector('h3').innerText;

  if (button.innerText === 'Comprar') {
    if (verificarDisponibilidade(productName)) {
      adicionarAoCarrinho(productName);
      button.innerText = 'Remover do Carrinho';
      button.style.backgroundColor = 'red';
    } else {
      alert('Produto indisponível no estoque!');
    }
  } else {
    removerDoCarrinho(productName);
    button.innerText = 'Comprar';
    button.style.backgroundColor = '';
  }
}

let chocolateQuantity = 0;

function toggleChocolateCartButton(button) {
  const productName = button.parentNode.querySelector('h3').innerText;

  if (button.innerText === 'Comprar') {
    if (verificarDisponibilidade(productName, chocolateQuantity)) {
      adicionarAoCarrinho(productName, chocolateQuantity);
      button.innerText = 'Remover do Carrinho';
      button.style.backgroundColor = 'red';
    } else {
      alert('Produto indisponível no estoque!');
    }
  } else {
    removerDoCarrinho(productName, chocolateQuantity);
    button.innerText = 'Comprar';
    button.style.backgroundColor = '';
  }
}

function incrementarQuantidade() {
  chocolateQuantity++;
  atualizarQuantidade();
}

function decrementarQuantidade() {
  if (chocolateQuantity > 0) {
    chocolateQuantity--;
    atualizarQuantidade();
  }
}

function atualizarQuantidade() {
  const quantidadeElemento = document.getElementById('quantidadeChocolate');
  quantidadeElemento.innerText = chocolateQuantity;
}

function adicionarAoCarrinho(productName, quantity = 1) {
  if (carrinho[productName]) {
    carrinho[productName] += quantity;
  } else {
    carrinho[productName] = quantity;
  }
}

function removerDoCarrinho(productName, quantity = 1) {
  if (carrinho[productName]) {
    carrinho[productName] -= quantity;
    if (carrinho[productName] <= 0) {
      delete carrinho[productName];
    }
  }
}

function verificarDisponibilidade(productName, quantity = 1) {
  // Aqui você pode verificar a disponibilidade do produto no estoque
  // e retornar true ou false com base na quantidade disponível.
  // Você pode acessar o estoque por meio do objeto chocolate do estoque.js.
  // Exemplo:
  // return estoque.chocolate.disponivel >= quantity;
  // Lembre-se de adicionar a referência ao arquivo estoque.js no carrinho.html.

  // Por enquanto, vamos retornar true para fins de exemplo:
  return true;
}

function incrementQuantity(id) {
  console.log(id);
  const quantityElement = document.getElementById(id);
  let quantity = parseInt(quantityElement.innerText);
  quantity++;
  quantityElement.innerText = quantity.toString();
}

function decrementQuantity(id) {
  console.log(id);
  const quantityElement = document.getElementById(id);
  let quantity = parseInt(quantityElement.innerText);
  if (quantity > 1) {
    quantity--;
    quantityElement.innerText = quantity.toString();
  }
}
