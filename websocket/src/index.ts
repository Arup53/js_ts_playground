import Websocket from "ws";

const wss = new Websocket.Server({ port: 8080 });

const users = new Map<string, Websocket>();

wss.on("connection", (ws) => {
  ws.send("Connected to websocket server");

  ws.on("message", (data) => {
    const text = data.toString();
    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(`Broadcast: ${message}`);
    //   }
    // });

    const msg = JSON.parse(text);

    // 1to1 chat implemention
    if (msg.type === "join_user") {
      users.set(msg.user_id, ws);
    }

    if (msg.type === "private_message") {
      const user = users.get(msg.to);
      console.log("message body is ", msg.body);
      user?.send(JSON.stringify(msg.body));
    }

    console.log("Recived", msg);
    ws.send(`Server received:,${text}`);
  });

  ws.on("close", () => {
    console.log("client disconnected");
  });
});
