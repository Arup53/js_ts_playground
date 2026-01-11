import Websocket from "ws";

const wss = new Websocket.Server({ port: 8080 });

const users = new Map<string, Websocket>();
const rooms = new Map<string, Set<Websocket>>();

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

    if (msg.type === "join_room") {
      if (!rooms.has(msg.room_id)) {
        rooms.set(msg.room_id, new Set());
      }
      rooms.get(msg.room_id)?.add(ws);
      console.log("joined in room");
    }

    if (msg.type === "group_message") {
      const members = rooms.get(msg.room_id) || [];
      for (const client of members) {
        if (client !== ws) {
          client.send(JSON.stringify(msg.text));
        }
      }
    }

    console.log("Recived", msg);
    ws.send(`Server received:,${text}`);
  });

  ws.on("close", () => {
    console.log("client disconnected");
  });
});
