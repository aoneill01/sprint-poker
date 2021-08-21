const express = require("express");
const next = require("next");
const enableWs = require("express-ws");
const WebSocket = require("ws");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const wsInstance = enableWs(server);

  server.ws("/test", (ws) => {
    console.log("connected");
    ws.on("close", () => console.log("disconnected"));
    ws.on("message", (message) => console.log("message", message));
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
