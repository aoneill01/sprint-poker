const express = require("express");
const enableWs = require("express-ws");
const next = require("next");
const schedule = require("node-schedule");
const WebSocket = require("ws");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let hands = [];

app.prepare().then(() => {
  const server = express();
  const wsInstance = enableWs(server);

  const publish = () => {
    wsInstance.getWss().clients.forEach((client) => {
      if (client.readyState !== WebSocket.OPEN) return;
      client.send(JSON.stringify(hands));
    });
  };

  schedule.scheduleJob("0 0 * * *", () => {
    hands = [];
    publish();
  });

  server.ws("/poker", (ws) => {
    console.log("connected");

    ws.on("close", () => console.log("disconnected"));

    ws.on("message", (message) => {
      console.log("message", message);
      const payload = JSON.parse(message);

      if (payload.action === "reset") {
        hands.forEach((hand) => (hand.card = null));
      } else if (payload.action === "kick") {
        hands = payload.name
          ? hands.filter(({ name }) => name !== payload.name)
          : [];
      } else {
        const existingHand = hands.find(({ name }) => name === payload.name);
        if (existingHand) {
          existingHand.card =
            payload.card === undefined ? existingHand.card : payload.card;
        } else {
          hands.push({ name: payload.name, card: payload.card ?? null });
        }
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
