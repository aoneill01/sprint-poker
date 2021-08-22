const express = require("express");
const next = require("next");
const enableWs = require("express-ws");
const WebSocket = require("ws");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const hands = [];

app.prepare().then(() => {
  const server = express();
  const wsInstance = enableWs(server);

  server.ws("/test", (ws) => {
    console.log("connected");

    const publish = () => {
      wsInstance.getWss().clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return;
        client.send(JSON.stringify(hands));
      });
    };
    ws.on("close", () => console.log("disconnected"));
    ws.on("message", (message) => {
      console.log("message", message);
      const payload = JSON.parse(message);
      const existingHand = hands.find(({ name }) => name === payload.name);
      if (existingHand) {
        existingHand.card =
          payload.card === undefined ? existingHand.card : payload.card;
      } else {
        hands.push({ name: payload.name, card: payload.card ?? null });
      }
      publish();
    });

    publish();
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
