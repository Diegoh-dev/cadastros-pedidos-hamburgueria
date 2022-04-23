const { response } = require("express");
const { request } = require("express");
const express = require("express");

const server = express();

const port = 3000;

server.use(express.json());

const uuid = require("uuid");

//  PEDIDOS DO CLIENTE
let listOrderClient = [];

const checkIdExist = (request, response, next) => {
  const { id } = request.params;

  const index = listOrderClient.findIndex((client) => client.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Not found" });
  }

  // RETORNA O ITEM COMPLETO DO ARRAY

  const orderClient = listOrderClient.find((client) => client.id === id);

  if (orderClient === undefined) {
    return response.status(404).json({ error: "Not found" });
  }

  request.id = id;
  request.index = index;
  request.orderClient = orderClient;

  next();
};

server.use((request, response, next) => {
  console.log(request.method);
  console.log(request.url);
  next();
});

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
server.put("/order/:id", checkIdExist, (request, response) => {
  const id = request.id;

  const index = request.index;

  const { clientName, order, price } = request.body;

  const updateOrderClient = {
    id,
    clientName,
    order,
    price,
    status: "Em preparação",
  };

  listOrderClient[index] = updateOrderClient;

  return response.json(updateOrderClient);
});

server.delete("/order/:id", checkIdExist, (request, response) => {
  const index = request.index;

  listOrderClient.splice(index, 1);

  return response.status(204).json();
});

// ROTA QUE RETORNA UM PEDIDO ESPECÍFICO.
server.get("/order/:id", checkIdExist, (request, response) => {
  const orderClient = request.orderClient;

  return response.json(orderClient);
});

// ALTERA O STATUS DO PEDIDO
server.patch("/order/:id", checkIdExist, (request, response) => {
  const orderClient = request.orderClient;

  orderClient.status = "Pronto";

  return response.send(orderClient);
});

server.listen(port, () => {
  console.log(`🚩 Servidor rodando na porta ${port}`);
});

/*
EXEMPLOS PARA FACILITAR.

{
	"clientName":"rennan",
	"order": " 1 coca-cola", 
	"price": 10.00
}

{
	"clientName":"maria",
	"order": " 1 pizza, x-tudo", 
	"price": 40.00
}

{
	"clientName":"anna",
	"order": " 1 coca-cola, 2 batatas grandes", 
	"price": 30.00
}

{
	"clientName":"mascos",
	"order": " 1 coca-cola, 2 pizzas", 
	"price": 74.50
}
 */
