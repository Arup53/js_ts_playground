import Websocket from "ws";

const wss = new Websocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  ws.send("Connected to websocket server");

  ws.on("message", (message) => {
    const text = message.toString();
    console.log("Recived", text);
    ws.send(`Server received:,${text}`);
  });

  ws.on("close", () => {
    console.log("client disconnected");
  });
});
