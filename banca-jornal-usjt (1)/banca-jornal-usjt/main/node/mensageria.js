const fs = require('fs');
const { get } = require('http');
const { v4: uuidv4 } = require('uuid');
const { getSaldo, adicionarAoCarrinho } = require('./node');


// cria o arquivo de log
fs.writeFileSync('eventosLog.txt', '');

// adiciona um evento ao arquivo de log
function logEvent(eventName, eventData) {
  const event = {
    id: uuidv4(),
    name: eventName,
    timestamp: new Date(),
    data: eventData
  };
  fs.appendFileSync('eventosLog.txt', JSON.stringify(event) + '\n');
  console.log(`Evento ${event.name} registrado com sucesso`);
}

// configuração do barramento de eventos
const events = {};

function subscribe(eventName, callback) {
  if (!events[eventName]) {
    events[eventName] = [];
  }
  events[eventName].push(callback);
}

function publish(eventName, eventData) {
  if (!events[eventName]) {
    return;
  }
  events[eventName].forEach(callback => callback(eventData));
  logEvent(eventName, eventData);
}

// Exemplo de uso
// Microserviço A
subscribe(getSaldo, eventData => {
  console.log('Saldo cpnsultado com sucesso:', eventData);
});

// Microserviço B
subscribe(adicionarAoCarrinho, eventData => {
  console.log('Item adicionado ao carrinho com sucesso:', eventData);
});

// Publicar eventos a partir dos microserviços
publish(getSaldo, { message: 'Saldo consultado com sucesso' });
publish(adicionarAoCarrinho, { message: 'Item adicionado ao carrinho com sucesso' });




