const express = require('express');


const app = express();
const port = 8080; 
const path = require('path');

const sql = require('mssql');

// Configuração da conexão com o SQL Server
const config = {
  server: 'PCCHRIS\\SQLEXPRESS', // Endereço do servidor SQL Server
  database: 'estoque', // Nome do banco de dados
  user: 'sa', // Usuário
  password: 'teste123', // Senha
  options: {
    //trustedConnection: false, // Autenticação do Windows
    encrypt: false, // Criptografia SSL
    trustServerCertificate: true, // Confia no certificado do servidor
  },
};

app.use('/css', express.static(path.join(__dirname + '../../webapp/css')));
app.use('/img', express.static(path.join(__dirname + '../../webapp/resources/img')));
app.use('/js', express.static(path.join(__dirname + '../../webapp/js')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '../../webapp/html/index.html'));
});

app.get('/contato', function(req, res) {
  res.sendFile(path.join(__dirname + '../../webapp/html/contato.html'));
});

app.get('/produtos', function(req, res) {
  res.sendFile(path.join(__dirname + '../../webapp/html/produtos.html'));
});

app.get('/carrinho', function(req, res) {
  res.sendFile(path.join(__dirname + '../../webapp/html/carrinho.html'));
});

app.get('/getSaldo', async function(req, res) {
  var item = req.query.produto;
  try {
    var saldo = await getSaldo(item);
    res.send(String(saldo));
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao obter o saldo');
  }
});
//ms1
async function getSaldo(item) {
  try {
    // Conecta ao banco de dados
    await sql.connect(config).then(() => {
      console.log("Conexão bem-sucedida");
    }).catch(err => {
      console.log("Erro na conexão:", err);
    });

    // Busca Saldo
    var query = "select coalesce(sum(quantidade), 0) as quantidade from itens where lower(item) = lower('"+ item + "')";
    console.log(query);
    const resultado = await sql.query(query);

    // Exibe o resultado da consulta
    console.log(resultado.recordset);
    console.log(resultado.recordset[0].quantidade);

    // Fecha a conexão com o banco de dados
    await sql.close();

    // Retorna o saldo
    return resultado.recordset[0].quantidade;

  } catch (error) {
    // Trata erros
    console.error(error);
  }
}

app.get('/adicionar-ao-carrinho', async (req, res) => {
  console.log('Adicionando ao carrinho');
  var item = req.query.produto;
  var quantidade = req.query.quantidade;

  var saldo = await adicionarAoCarrinho(item, quantidade);

  res.send(String(saldo));
});
//ms2
async function adicionarAoCarrinho(item, quantidade) {
  try {
    // Conecta ao banco de dados
    await sql.connect(config).then(() => {
      console.log("Conexão bem-sucedida");
    }).catch(err => {
      console.log("Erro na conexão:", err);
    });

    // Insere reserva do item
    var query = "INSERT INTO itens (item, quantidade) VALUES ('" + item + "', " + quantidade + ")";
    console.log(query);
    const resultado = await sql.query(query);

    // Exibe o resultado da consulta
    console.log(resultado.recordset);

    // Fecha a conexão com o banco de dados
    await sql.close();

    // Retorna o saldo
    return await getSaldo(item);

  } catch (error) {
    // Trata erros
    console.error(error);
  }
}

app.get('/getCarrinho', async function(req, res) {
  try {
    var carrinho = await getCarrinho();
    res.send(carrinho);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao obter o carrinho');
  }
});


// Lista os itens do carrinho
async function getCarrinho() {
  try {
    // Conecta ao banco de dados
    await sql.connect(config).then(() => {
      console.log("Conexão bem-sucedida");
    }).catch(err => {
      console.log("Erro na conexão:", err);
    });

    // Insere reserva do item
    var query = "select item, coalesce(sum(quantidade), 0) * -1 as quantidade from itens where quantidade < 0 group by item";
    console.log(query);
    const resultado = await sql.query(query);

    // Exibe o resultado da consulta
    console.log(resultado.recordset);

    // Fecha a conexão com o banco de dados
    await sql.close();

    // Retorna o saldo
    return resultado.recordset;

  } catch (error) {
    // Trata erros
    console.error(error);
  }
}

function limparCarrinho() {
  contadorCarrinho = 0;
  atualizarContagemCarrinho();
}



app.get('/limpar-carrinho', (req, res) => {
  limparCarrinho();
  res.send('Carrinho limpo');
});



app.listen(port, () => {
  console.log(`Servidor Express rodando na porta ${port}`);
});

// Função para realizar a consulta ao banco de dados
async function consultarDados() {
  try {
    // Conecta ao SQL Server
    await sql.connect(config);

    // Realiza a consulta
    const result = await sql.query('SELECT * FROM itens');

    // Processa o resultado
    console.log(result.recordset);
  } catch (error) {
    console.error('Erro ao consultar dados:', error);
  } finally {
    // Fecha a conexão com o SQL Server
    sql.close();
  }
}

// Chama a função para realizar a consulta
//consultarDados();


// Função para testar a conexão e executar uma consulta de exemplo
async function testarConexao() {
  try {
    // Conecta ao banco de dados
    await sql.connect(config).then(() => {
      console.log("Conexão bem-sucedida");
    }).catch(err => {
      console.log("Erro na conexão:", err);
    });

    // Consulta de exemplo
    const resultado = await sql.query('SELECT * FROM itens');

    // Exibe o resultado da consulta
    console.log(resultado.recordset);

    // Fecha a conexão com o banco de dados
    await sql.close();
  } catch (error) {
    // Trata erros
    console.error(error);
  }
}

// Chama a função para testar a conexão
//testarConexao(); 

// exemplo.js

module.exports = { getSaldo, adicionarAoCarrinho};


