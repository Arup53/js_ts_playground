import Websocket from "ws";

const wss = new Websocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  ws.send("Connected to websocket server");

  ws.on("message", (message) => {
    console.log("Recived", message);
    ws.send(`Server received:,${message}`);
  });

  ws.on("close", () => {
    console.log("client disconnected");
  });
});
