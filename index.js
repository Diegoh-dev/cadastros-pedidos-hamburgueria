const { response } = require("express");
const { request } = require("express");
const express = require("express");

const server = express();

const port = 3000;

server.use(express.json());

const uuid = require("uuid");

//  PEDIDOS DO CLIENTE
let listOrderClient = [];

//  A ROTA RECEBE O PEDIDO DO CLIENTE.
server.post("/order", (request, response) => {
  const { clientName, order, price } = request.body;

  const orderClient = {
    id: uuid.v4(),
    clientName,
    order,
    price,
    status: "Em preparação",
  };

  // O PEDIDO DO CLIENTE ESTÁ SENDO ADICIONADO NA LISTA DE PEDIDOS.
  listOrderClient.push(orderClient);

  return response.status(201).json(orderClient);
});

// ROTA QUE LISTA TODOS OS PEDIDOS JÁ FEITOS.
server.get("/order", (request, response) => {
  return response.json(listOrderClient);
});

// ROTA QUE ALTERA UM PEDIDO JÁ FEITO.
server.put("/order/:id", (request, response) => {
  const { id } = request.params;

  const { clientName, order, price } = request.body;

  const updateOrderClient = {
    id,
    clientName,
    order,
    price,
    status: "Em preparação",
  };

  const index = listOrderClient.findIndex((client) => client.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Not found" });
  }

  listOrderClient[index] = updateOrderClient;

  return response.json(updateOrderClient);
});

server.delete("/order/:id", (request, response) => {
  const { id } = request.params;

  const index = listOrderClient.findIndex((client) => client.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Not found" });
  }

  listOrderClient.splice(index, 1);

  return response.status(204).json();
});

// ROTA QUE RETORNA UM PEDIDO ESPECÍFICO.
server.get("/order/:id", (request, response) => {
  const { id } = request.params;

  const orderClient = listOrderClient.find((client) => client.id === id);

  if (orderClient === undefined) {
    return response.status(404).json({ error: "Not found" });
  }

  return response.json(orderClient);
});

// ALTERA O STATUS DO PEDIDO
server.patch("/order/:id", (request, response) => {
  const { id } = request.params;

  const orderClient = listOrderClient.find((client) => client.id === id);

  orderClient.status = "Pronto";

  return response.send(orderClient);
});

server.listen(port, () => {
  console.log(`🚩 Servidor rodando na porta ${port}`);
});
